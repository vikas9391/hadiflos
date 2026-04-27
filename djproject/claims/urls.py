from django.urls import path
from . import views

urlpatterns = [
    # ── Public ──────────────────────────────────────────────────────
    path('claims/', views.ClaimCreateView.as_view(), name='claim-create'),
    path('claims/status/<str:reference_number>/', views.ClaimStatusView.as_view(), name='claim-status'),
    path('contact/', views.ContactMessageCreateView.as_view(), name='contact-create'),
    path('health/', views.HealthCheckView.as_view(), name='health-check'),

    # ── Auth (React admin panel) ─────────────────────────────────────
    path('admin/login/', views.AdminLoginView.as_view(), name='admin-login'),
    path('admin/logout/', views.AdminLogoutView.as_view(), name='admin-logout'),
    path('admin/session/', views.AdminSessionView.as_view(), name='admin-session'),

    # ── Protected admin data ─────────────────────────────────────────
    path('admin/claims/', views.ClaimListView.as_view(), name='admin-claim-list'),
    path('admin/claims/<int:pk>/', views.ClaimDetailView.as_view(), name='admin-claim-detail'),
]