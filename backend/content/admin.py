from django.contrib import admin
from django.utils.html import format_html

from .models import (
    Client,
    ContactSubmission,
    MediaAsset,
    Page,
    PageSection,
    Product,
    ProductFeature,
    ProductImage,
    ProductTechnology,
    Project,
    ProjectImage,
    ProjectTechnology,
    Service,
    ServiceCapability,
    SiteSettings,
    TeamMember,
    Technology,
    Testimonial,
    ThemeAssets,
)


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    fieldsets = (
        ("Identity", {"fields": ("site_name", "tagline", "default_theme", "maintenance_mode")}),
        ("SEO defaults", {"fields": ("default_meta_title", "default_meta_description", "default_og_image", "favicon")}),
        ("Contact", {"fields": ("contact_email", "phone", "address")}),
        ("Social", {"fields": ("linkedin_url", "instagram_url", "x_url")}),
    )

    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(ThemeAssets)
class ThemeAssetsAdmin(admin.ModelAdmin):
    list_display = ("theme", "updated_at")


class ServiceCapabilityInline(admin.TabularInline):
    model = ServiceCapability
    extra = 1


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ("title", "status", "featured", "order")
    list_editable = ("status", "featured", "order")
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ("title", "short_description")
    inlines = [ServiceCapabilityInline]
    fieldsets = (
        ("Content", {"fields": ("title", "slug", "short_description", "description", "hero_image", "icon")}),
        ("Publication", {"fields": ("status", "featured", "order")}),
        ("SEO", {"fields": ("seo_title", "seo_description")}),
    )


class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1


class ProjectTechnologyInline(admin.TabularInline):
    model = ProjectTechnology
    extra = 1


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "client", "sector", "status", "featured", "order", "live_link")
    list_filter = ("status", "featured", "services")
    list_editable = ("status", "featured", "order")
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ("title", "short_description", "client__name")
    filter_horizontal = ("services",)
    inlines = [ProjectTechnologyInline, ProjectImageInline]
    fieldsets = (
        ("Overview", {"fields": ("title", "slug", "client", "sector", "short_description", "external_url", "project_date")}),
        ("Case study", {"fields": ("full_description", "challenge", "solution", "results")}),
        ("Media", {"fields": ("cover_image", "thumbnail_image")}),
        ("Relationships", {"fields": ("services",)}),
        ("Publication", {"fields": ("status", "featured", "order")}),
        ("SEO", {"fields": ("seo_title", "seo_description")}),
    )

    @admin.display(description="Live")
    def live_link(self, obj):
        if not obj.external_url:
            return "—"
        return format_html('<a href="{}" target="_blank" rel="noopener">Open ↗</a>', obj.external_url)


class ProductFeatureInline(admin.TabularInline):
    model = ProductFeature
    extra = 1


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


class ProductTechnologyInline(admin.TabularInline):
    model = ProductTechnology
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("title", "kind", "owner_client", "status", "featured", "order")
    list_editable = ("status", "featured", "order")
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ("title", "short_description")
    inlines = [ProductFeatureInline, ProductTechnologyInline, ProductImageInline]
    fieldsets = (
        ("Overview", {"fields": ("title", "slug", "kind", "owner_client", "short_description", "live_url")}),
        ("Story", {"fields": ("description", "positioning", "problem", "solution", "target_users")}),
        ("Media", {"fields": ("cover_image", "thumbnail_image")}),
        ("Publication", {"fields": ("status", "featured", "order")}),
        ("SEO", {"fields": ("seo_title", "seo_description")}),
    )


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ("name", "industry", "approved_for_publication", "featured", "order")
    list_editable = ("approved_for_publication", "featured", "order")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name", "industry")


@admin.register(Technology)
class TechnologyAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "order")
    prepopulated_fields = {"slug": ("name",)}


class PageSectionInline(admin.StackedInline):
    model = PageSection
    extra = 1


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "status")
    prepopulated_fields = {"slug": ("title",)}
    inlines = [PageSectionInline]


@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "company", "service_interest", "status", "created_at")
    list_filter = ("status", "service_interest", "created_at")
    search_fields = ("name", "email", "company", "message")
    readonly_fields = (
        "name", "email", "company", "phone", "service_interest", "budget_range",
        "message", "preferred_contact", "consent", "source", "utm_source",
        "utm_medium", "utm_campaign", "created_at", "updated_at",
    )
    fieldsets = (
        ("Enquiry", {"fields": ("name", "email", "company", "phone", "service_interest", "budget_range", "message")}),
        ("Attribution", {"fields": ("source", "utm_source", "utm_medium", "utm_campaign", "consent", "created_at")}),
        ("Pipeline", {"fields": ("status", "internal_notes")}),
    )

    def has_add_permission(self, request):
        return False


admin.site.register([Testimonial, TeamMember, MediaAsset])
