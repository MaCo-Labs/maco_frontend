from rest_framework import serializers

from .models import (
    Client,
    ContactSubmission,
    Product,
    ProductFeature,
    ProductImage,
    Project,
    ProjectImage,
    Service,
    ServiceCapability,
    SiteSettings,
    Technology,
)


class TechnologySerializer(serializers.ModelSerializer):
    class Meta:
        model = Technology
        fields = ["name", "slug", "category", "logo", "website"]


class ServiceCapabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCapability
        fields = ["title", "description", "order"]


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ["name", "slug", "industry", "description", "website", "logo", "featured"]


class ServiceListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ["title", "slug", "short_description", "icon", "featured", "order"]


class ServiceDetailSerializer(serializers.ModelSerializer):
    capabilities = ServiceCapabilitySerializer(many=True, read_only=True)
    projects = serializers.SlugRelatedField(many=True, read_only=True, slug_field="slug")

    class Meta:
        model = Service
        fields = [
            "title", "slug", "short_description", "description", "hero_image",
            "capabilities", "projects", "seo_title", "seo_description",
        ]


class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ["image", "alt_text", "caption", "focal_x", "focal_y", "aspect_ratio", "order"]


class ProjectListSerializer(serializers.ModelSerializer):
    client = serializers.StringRelatedField()

    class Meta:
        model = Project
        fields = ["title", "slug", "client", "sector", "short_description", "thumbnail_image", "featured", "order"]


class ProjectDetailSerializer(serializers.ModelSerializer):
    client = ClientSerializer(read_only=True)
    images = ProjectImageSerializer(many=True, read_only=True)
    technologies = TechnologySerializer(many=True, read_only=True)
    services = serializers.SlugRelatedField(many=True, read_only=True, slug_field="slug")

    class Meta:
        model = Project
        fields = [
            "title", "slug", "client", "sector", "short_description", "full_description",
            "challenge", "solution", "results", "cover_image", "images", "technologies",
            "services", "external_url", "project_date", "seo_title", "seo_description",
        ]


class ProductFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductFeature
        fields = ["title", "description", "icon", "order"]


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["image", "alt_text", "caption", "focal_x", "focal_y", "order"]


class ProductListSerializer(serializers.ModelSerializer):
    owner_client = serializers.StringRelatedField()

    class Meta:
        model = Product
        fields = ["title", "slug", "kind", "owner_client", "short_description", "thumbnail_image", "live_url", "order"]


class ProductDetailSerializer(serializers.ModelSerializer):
    owner_client = ClientSerializer(read_only=True)
    features = ProductFeatureSerializer(many=True, read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    technologies = TechnologySerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            "title", "slug", "kind", "owner_client", "short_description", "description",
            "positioning", "problem", "solution", "target_users", "cover_image", "images",
            "features", "technologies", "live_url", "seo_title", "seo_description",
        ]


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = [
            "site_name", "tagline", "default_meta_title", "default_meta_description",
            "default_og_image", "contact_email", "phone", "address", "linkedin_url",
            "instagram_url", "x_url", "default_theme", "maintenance_mode",
        ]


class ContactSubmissionSerializer(serializers.ModelSerializer):
    service_interest = serializers.SlugRelatedField(
        slug_field="slug", queryset=Service.objects.all(), required=False, allow_null=True
    )
    # Honeypot: real users never fill this in.
    website = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = ContactSubmission
        fields = [
            "name", "email", "company", "phone", "service_interest", "budget_range",
            "message", "preferred_contact", "consent", "source", "utm_source",
            "utm_medium", "utm_campaign", "website",
        ]

    def validate_consent(self, value):
        if not value:
            raise serializers.ValidationError("Consent is required to store and respond to this enquiry.")
        return value

    def create(self, validated_data):
        trap = validated_data.pop("website", "")
        submission = ContactSubmission.objects.create(**validated_data)
        if trap:
            submission.status = ContactSubmission.LeadStatus.SPAM
            submission.save(update_fields=["status"])
        return submission
