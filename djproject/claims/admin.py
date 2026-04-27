from django.contrib import admin
from django.utils.html import format_html
from .models import Claim, ContactMessage


@admin.register(Claim)
class ClaimAdmin(admin.ModelAdmin):
    list_display = [
        'reference_number', 'full_name', 'email', 'amount_badge',
        'debt_type', 'status_badge', 'created_at'
    ]
    list_filter = ['status', 'debt_type', 'preferred_language', 'created_at']
    search_fields = ['reference_number', 'full_name', 'email', 'debtor_name', 'company_name']
    readonly_fields = ['reference_number', 'created_at', 'updated_at']
    ordering = ['-created_at']

    fieldsets = (
        ('Claimant', {
            'fields': ('full_name', 'company_name', 'email', 'phone', 'preferred_language')
        }),
        ('Debt Details', {
            'fields': ('debtor_name', 'debtor_location', 'amount_owed', 'debt_type', 'description')
        }),
        ('Case Management', {
            'fields': ('reference_number', 'status', 'assigned_agent', 'internal_notes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'contacted_at', 'resolved_at'),
            'classes': ('collapse',)
        }),
    )

    def amount_badge(self, obj):
        return format_html(
            '<span style="font-weight:bold;color:#D4870A">{} MAD</span>',
            f'{obj.amount_owed:,.0f}'
        )
    amount_badge.short_description = 'Amount'

    def status_badge(self, obj):
        colors = {
            'new': '#e74c3c',
            'review': '#f39c12',
            'in_progress': '#3498db',
            'negotiation': '#9b59b6',
            'legal': '#e67e22',
            'settled': '#27ae60',
            'closed': '#95a5a6',
        }
        color = colors.get(obj.status, '#95a5a6')
        return format_html(
            '<span style="background:{};color:white;padding:2px 8px;border-radius:12px;font-size:11px">{}</span>',
            color, obj.get_status_display()
        )
    status_badge.short_description = 'Status'


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'phone', 'is_read', 'created_at']
    list_filter = ['is_read', 'created_at']
    search_fields = ['name', 'email', 'message']
    readonly_fields = ['created_at']
    ordering = ['-created_at']
