from .models import Claim, ContactMessage
from .serializers import ClaimSerializer, ClaimStatusSerializer, ContactMessageSerializer
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.middleware.csrf import get_token


def verify_admin_token(request):
    """Returns (user, error_response) — error_response is None if valid."""
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return None, Response({'error': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)
    token_str = auth_header.split(' ')[1]
    try:
        access_token = AccessToken(token_str)
        user = User.objects.get(id=access_token['user_id'])
        if not user.is_active:
            return None, Response({'error': 'Account disabled.'}, status=status.HTTP_403_FORBIDDEN)
        if not user.is_staff:
            return None, Response({'error': 'Admin access required.'}, status=status.HTTP_403_FORBIDDEN)
        return user, None
    except Exception:
        return None, Response({'error': 'Invalid or expired token.'}, status=status.HTTP_401_UNAUTHORIZED)


# ─── PUBLIC ENDPOINTS ─────────────────────────────────────────────────────────

class ClaimCreateView(generics.CreateAPIView):
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
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({'status': 'ok', 'service': 'HadiFlosCom API'})


# ─── AUTH ENDPOINTS ───────────────────────────────────────────────────────────

class AdminLoginView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        token = get_token(request)
        return Response({'csrfToken': token})

    def post(self, request):
        identifier = request.data.get('username', '').strip()
        password   = request.data.get('password', '').strip()

        if not identifier or not password:
            return Response(
                {'error': 'Username/email and password are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        username = identifier
        if '@' in identifier:
            try:
                user_obj = User.objects.get(email__iexact=identifier)
                username = user_obj.username
            except User.DoesNotExist:
                return Response(
                    {'error': 'No account found with that email address.'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            except User.MultipleObjectsReturned:
                username = identifier

        user = authenticate(request, username=username, password=password)

        if user is None:
            return Response(
                {'error': 'Invalid credentials. Please check your username/email and password.'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        if not user.is_active:
            return Response(
                {'error': 'This account has been disabled.'},
                status=status.HTTP_403_FORBIDDEN
            )
        if not user.is_staff:
            return Response(
                {'error': 'You do not have admin access.'},
                status=status.HTTP_403_FORBIDDEN
            )

        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Logged in successfully.',
            'username': user.username,
            'email': user.email,
            'is_staff': user.is_staff,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        })


class AdminLogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        return Response({'message': 'Logged out.'})


class AdminSessionView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        user, error = verify_admin_token(request)
        if error:
            return Response({'authenticated': False}, status=status.HTTP_401_UNAUTHORIZED)
        return Response({
            'authenticated': True,
            'username': user.username,
            'email': user.email,
        })


# ─── PROTECTED ADMIN ENDPOINTS ────────────────────────────────────────────────

class ClaimListView(generics.ListAPIView):
    serializer_class = ClaimSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Claim.objects.all().order_by('-created_at')

    def list(self, request, *args, **kwargs):
        user, error = verify_admin_token(request)
        if error:
            return error
        return super().list(request, *args, **kwargs)


class ClaimDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = ClaimSerializer
    permission_classes = [AllowAny]
    queryset = Claim.objects.all()

    def update(self, request, *args, **kwargs):
        user, error = verify_admin_token(request)
        if error:
            return error
        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)