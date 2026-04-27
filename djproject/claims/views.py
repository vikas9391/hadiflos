from .models import Claim, ContactMessage
from .serializers import ClaimSerializer, ClaimStatusSerializer, ContactMessageSerializer
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token


# ─── PUBLIC ENDPOINTS ─────────────────────────────────────────────────────────

class ClaimCreateView(generics.CreateAPIView):
    """POST /api/claims/ — submit a new claim (public)."""
    queryset = Claim.objects.all()
    serializer_class = ClaimSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        claim = serializer.save()
        self._send_confirmation_email(claim)
        self._notify_admin(claim)
        return Response(
            {
                'message': 'Claim submitted successfully. Our team will contact you within 24 hours.',
                'reference_number': claim.reference_number,
                'claim': serializer.data,
            },
            status=status.HTTP_201_CREATED
        )

    def _send_confirmation_email(self, claim):
        try:
            send_mail(
                subject=f'Claim Received – {claim.reference_number} | HadiFlosCom',
                message=(
                    f"Dear {claim.full_name},\n\n"
                    f"Thank you for submitting your claim to HadiFlosCom.\n\n"
                    f"Reference Number: {claim.reference_number}\n"
                    f"Amount: {claim.amount_owed} MAD\n"
                    f"Debtor: {claim.debtor_name}\n\n"
                    f"Our team will review your case and contact you within 24 hours.\n\n"
                    f"Best regards,\nHadiFlosCom Team\n"
                    f"contact@hadiflouscom.ma | +212 5XX-XXXXXX"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[claim.email],
                fail_silently=True,
            )
        except Exception:
            pass

    def _notify_admin(self, claim):
        try:
            send_mail(
                subject=f'[NEW CLAIM] {claim.reference_number} – {claim.amount_owed} MAD',
                message=(
                    f"New claim submitted:\n\n"
                    f"Ref: {claim.reference_number}\n"
                    f"Claimant: {claim.full_name} ({claim.email})\n"
                    f"Phone: {claim.phone}\n"
                    f"Company: {claim.company_name or 'N/A'}\n"
                    f"Debtor: {claim.debtor_name} ({claim.debtor_location})\n"
                    f"Amount: {claim.amount_owed} MAD\n"
                    f"Type: {claim.get_debt_type_display()}\n"
                    f"Description:\n{claim.description}\n"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.ADMIN_EMAIL],
                fail_silently=True,
            )
        except Exception:
            pass


class ClaimStatusView(APIView):
    """GET /api/claims/status/<reference_number>/ — public claim tracker."""
    permission_classes = [AllowAny]

    def get(self, request, reference_number):
        try:
            claim = Claim.objects.get(reference_number=reference_number.upper())
        except Claim.DoesNotExist:
            return Response(
                {'error': 'Claim not found. Please check your reference number.'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = ClaimStatusSerializer(claim)
        return Response(serializer.data)


class ContactMessageCreateView(generics.CreateAPIView):
    """POST /api/contact/ — general contact message (public)."""
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {'message': 'Message received. We will respond shortly.'},
            status=status.HTTP_201_CREATED
        )


class HealthCheckView(APIView):
    """GET /api/health/ — uptime probe."""
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({'status': 'ok', 'service': 'HadiFlosCom API'})


# ─── AUTH ENDPOINTS (used by React admin panel) ───────────────────────────────

class AdminLoginView(APIView):
    """
    POST /api/admin/login/
    Body: { "username": "...", "password": "..." }
    Uses Django's session auth — the browser stores the session cookie.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        # Return CSRF token so React can read it before POSTing
        return Response({'csrfToken': get_token(request)})

    def post(self, request):
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '').strip()

        if not username or not password:
            return Response(
                {'error': 'Username and password are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(request, username=username, password=password)
        if user is None:
            return Response(
                {'error': 'Invalid credentials.'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        if not user.is_staff:
            return Response(
                {'error': 'You do not have admin access.'},
                status=status.HTTP_403_FORBIDDEN
            )

        login(request, user)
        return Response({
            'message': 'Logged in successfully.',
            'username': user.username,
            'is_staff': user.is_staff,
        })


class AdminLogoutView(APIView):
    """POST /api/admin/logout/"""
    permission_classes = [AllowAny]

    def post(self, request):
        logout(request)
        return Response({'message': 'Logged out.'})


class AdminSessionView(APIView):
    """
    GET /api/admin/session/
    Returns current auth state — React calls this on page load
    to check if the session cookie is still valid.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        if request.user.is_authenticated and request.user.is_staff:
            return Response({
                'authenticated': True,
                'username': request.user.username,
            })
        return Response({'authenticated': False}, status=status.HTTP_401_UNAUTHORIZED)


# ─── PROTECTED ADMIN ENDPOINTS ────────────────────────────────────────────────

class ClaimListView(generics.ListAPIView):
    """
    GET /api/admin/claims/
    Returns all claims — requires Django session login (is_staff).
    """
    serializer_class = ClaimSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if not self.request.user.is_staff:
            return Claim.objects.none()
        return Claim.objects.all().order_by('-created_at')

    def list(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response(
                {'error': 'Admin access required.'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().list(request, *args, **kwargs)


class ClaimDetailView(generics.RetrieveUpdateAPIView):
    """
    GET  /api/admin/claims/<id>/  — retrieve a single claim
    PATCH /api/admin/claims/<id>/ — update status / notes (staff only)
    """
    serializer_class = ClaimSerializer
    permission_classes = [IsAuthenticated]
    queryset = Claim.objects.all()

    def update(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response(
                {'error': 'Admin access required.'},
                status=status.HTTP_403_FORBIDDEN
            )
        kwargs['partial'] = True  # always partial — only send what changed
        return super().update(request, *args, **kwargs)
