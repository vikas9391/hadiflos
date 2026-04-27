from rest_framework import serializers
from .models import Claim, ContactMessage


class ClaimSerializer(serializers.ModelSerializer):
    """Serializer for creating and reading claims."""

    class Meta:
        model = Claim
        fields = [
            'id', 'reference_number',
            'full_name', 'company_name', 'email', 'phone',
            'debtor_name', 'debtor_location',
            'amount_owed', 'debt_type', 'description',
            'preferred_language',
            'status', 'created_at',
        ]
        read_only_fields = ['id', 'reference_number', 'status', 'created_at']

    def validate_amount_owed(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than 0.")
        return value

    def validate_phone(self, value):
        digits = ''.join(c for c in value if c.isdigit())
        if len(digits) < 7:
            raise serializers.ValidationError("Please enter a valid phone number.")
        return value


class ClaimStatusSerializer(serializers.ModelSerializer):
    """Read-only serializer for status tracking."""

    class Meta:
        model = Claim
        fields = ['reference_number', 'status', 'created_at', 'updated_at']
        read_only_fields = fields


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'phone', 'message', 'created_at']
        read_only_fields = ['created_at']
