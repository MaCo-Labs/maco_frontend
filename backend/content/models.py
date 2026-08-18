"""MaCo content models.

Taxonomy rule from the blueprint:
    Service  = a capability MaCo sells
    Project  = client-facing delivered work
    Product  = software MaCo owns or productises
    Client   = organisation associated with work/products
These never collapse into one generic "portfolio" entity.
"""
from django.db import models


class Status(models.TextChoices):
    DRAFT = "draft", "Draft"
    PUBLISHED = "published", "Published"
    ARCHIVED = "archived", "Archived"


class Theme(models.TextChoices):
    OBSIDIAN = "obsidian", "Obsidian"
    COBALT = "cobalt", "Cobalt"


class TimeStamped(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class SeoFields(models.Model):
    seo_title = models.CharField(max_length=70, blank=True)
    seo_description = models.CharField(max_length=170, blank=True)

    class Meta:
        abstract = True


class PublishedQuerySet(models.QuerySet):
    def published(self):
        return self.filter(status=Status.PUBLISHED)


# ---------------------------------------------------------------- settings


class SiteSettings(TimeStamped):
    site_name = models.CharField(max_length=80, default="MaCo")
    tagline = models.CharField(max_length=180, blank=True)
    default_meta_title = models.CharField(max_length=70, blank=True)
    default_meta_description = models.CharField(max_length=170, blank=True)
    favicon = models.ImageField(upload_to="site/", blank=True, null=True)
    default_og_image = models.ImageField(upload_to="site/", blank=True, null=True)
    contact_email = models.EmailField(blank=True)
    phone = models.CharField(max_length=40, blank=True)
    address = models.TextField(blank=True)
    linkedin_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    x_url = models.URLField(blank=True)
    default_theme = models.CharField(max_length=16, choices=Theme.choices, default=Theme.OBSIDIAN)
    maintenance_mode = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Site settings"
        verbose_name_plural = "Site settings"

    def __str__(self) -> str:
        return self.site_name

    def save(self, *args, **kwargs):
        self.pk = 1  # singleton
        super().save(*args, **kwargs)


class ThemeAssets(TimeStamped):
    theme = models.CharField(max_length=16, choices=Theme.choices, unique=True)
    logo_primary = models.ImageField(upload_to="logos/", blank=True, null=True)
    logo_mark = models.ImageField(upload_to="logos/", blank=True, null=True)
    footer_logo = models.ImageField(upload_to="logos/", blank=True, null=True)
    favicon = models.ImageField(upload_to="logos/", blank=True, null=True)
    logo_alternate = models.ImageField(upload_to="logos/", blank=True, null=True)

    class Meta:
        verbose_name_plural = "Theme assets"

    def __str__(self) -> str:
        return f"{self.get_theme_display()} assets"


# ---------------------------------------------------------------- shared


class Technology(models.Model):
    class Category(models.TextChoices):
        LANGUAGE = "language", "Language"
        FRAMEWORK = "framework", "Framework"
        DATABASE = "database", "Database"
        INFRA = "infra", "Infrastructure"
        TOOL = "tool", "Tool"

    name = models.CharField(max_length=60, unique=True)
    slug = models.SlugField(max_length=60, unique=True)
    logo = models.ImageField(upload_to="tech/", blank=True, null=True)
    website = models.URLField(blank=True)
    category = models.CharField(max_length=20, choices=Category.choices, default=Category.TOOL)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "name"]
        verbose_name_plural = "Technologies"

    def __str__(self) -> str:
        return self.name


class MediaAsset(models.Model):
    file = models.FileField(upload_to="media-library/")
    title = models.CharField(max_length=140)
    alt_text = models.CharField(max_length=200, blank=True)
    caption = models.CharField(max_length=240, blank=True)
    focal_x = models.FloatField(default=0.5)
    focal_y = models.FloatField(default=0.5)
    credit = models.CharField(max_length=140, blank=True)
    mime_type = models.CharField(max_length=80, blank=True)
    width = models.PositiveIntegerField(null=True, blank=True)
    height = models.PositiveIntegerField(null=True, blank=True)
    file_size = models.PositiveIntegerField(null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.title


# ---------------------------------------------------------------- clients


class Client(models.Model):
    name = models.CharField(max_length=120)
    slug = models.SlugField(max_length=120, unique=True)
    logo = models.ImageField(upload_to="clients/", blank=True, null=True)
    logo_dark = models.ImageField(upload_to="clients/", blank=True, null=True)
    logo_light = models.ImageField(upload_to="clients/", blank=True, null=True)
    website = models.URLField(blank=True)
    industry = models.CharField(max_length=90, blank=True)
    description = models.TextField(blank=True)
    featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    approved_for_publication = models.BooleanField(
        default=False, help_text="Never show a client logo or name publicly without permission."
    )

    class Meta:
        ordering = ["order", "name"]

    def __str__(self) -> str:
        return self.name


# ---------------------------------------------------------------- services


class Service(TimeStamped, SeoFields):
    title = models.CharField(max_length=120)
    slug = models.SlugField(max_length=120, unique=True)
    short_description = models.CharField(max_length=240)
    description = models.TextField(blank=True)
    hero_image = models.ImageField(upload_to="services/", blank=True, null=True)
    icon = models.CharField(max_length=40, blank=True, help_text="Mark/geometry key from the design system.")
    featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.PUBLISHED)

    objects = PublishedQuerySet.as_manager()

    class Meta:
        ordering = ["order", "title"]

    def __str__(self) -> str:
        return self.title


class ServiceCapability(models.Model):
    service = models.ForeignKey(Service, related_name="capabilities", on_delete=models.CASCADE)
    title = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]
        verbose_name_plural = "Service capabilities"

    def __str__(self) -> str:
        return f"{self.service.title} — {self.title}"


# ---------------------------------------------------------------- projects


class Project(TimeStamped, SeoFields):
    title = models.CharField(max_length=140)
    slug = models.SlugField(max_length=140, unique=True)
    client = models.ForeignKey(Client, related_name="projects", on_delete=models.PROTECT, null=True, blank=True)
    sector = models.CharField(max_length=120, blank=True)
    short_description = models.CharField(max_length=240)
    full_description = models.TextField(blank=True)
    challenge = models.TextField(blank=True)
    solution = models.TextField(blank=True)
    results = models.TextField(blank=True)
    cover_image = models.ImageField(upload_to="projects/", blank=True, null=True)
    thumbnail_image = models.ImageField(upload_to="projects/", blank=True, null=True)
    featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.PUBLISHED)
    project_date = models.DateField(null=True, blank=True)
    external_url = models.URLField(blank=True)
    services = models.ManyToManyField(Service, related_name="projects", blank=True)
    technologies = models.ManyToManyField(Technology, through="ProjectTechnology", related_name="projects", blank=True)

    objects = PublishedQuerySet.as_manager()

    class Meta:
        ordering = ["order", "-project_date", "title"]

    def __str__(self) -> str:
        return self.title


class ProjectImage(models.Model):
    project = models.ForeignKey(Project, related_name="images", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="projects/")
    alt_text = models.CharField(max_length=200)
    caption = models.CharField(max_length=240, blank=True)
    focal_x = models.FloatField(default=0.5)
    focal_y = models.FloatField(default=0.5)
    width_hint = models.CharField(max_length=20, blank=True)
    aspect_ratio = models.CharField(max_length=20, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]


class ProjectTechnology(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    technology = models.ForeignKey(Technology, on_delete=models.CASCADE)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]
        unique_together = ("project", "technology")
        verbose_name_plural = "Project technologies"


# ---------------------------------------------------------------- products


class Product(TimeStamped, SeoFields):
    title = models.CharField(max_length=140)
    slug = models.SlugField(max_length=140, unique=True)
    owner_client = models.ForeignKey(
        Client,
        related_name="products",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text="Leave empty for MaCo-owned products.",
    )
    kind = models.CharField(max_length=80, blank=True)
    short_description = models.CharField(max_length=240)
    description = models.TextField(blank=True)
    positioning = models.TextField(blank=True)
    problem = models.TextField(blank=True)
    solution = models.TextField(blank=True)
    target_users = models.CharField(max_length=240, blank=True)
    cover_image = models.ImageField(upload_to="products/", blank=True, null=True)
    thumbnail_image = models.ImageField(upload_to="products/", blank=True, null=True)
    live_url = models.URLField(blank=True)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.PUBLISHED)
    featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    technologies = models.ManyToManyField(Technology, through="ProductTechnology", related_name="products", blank=True)

    objects = PublishedQuerySet.as_manager()

    class Meta:
        ordering = ["order", "title"]

    def __str__(self) -> str:
        return self.title


class ProductFeature(models.Model):
    product = models.ForeignKey(Product, related_name="features", on_delete=models.CASCADE)
    title = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=40, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]


class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name="images", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="products/")
    alt_text = models.CharField(max_length=200)
    caption = models.CharField(max_length=240, blank=True)
    focal_x = models.FloatField(default=0.5)
    focal_y = models.FloatField(default=0.5)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]


class ProductTechnology(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    technology = models.ForeignKey(Technology, on_delete=models.CASCADE)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]
        unique_together = ("product", "technology")
        verbose_name_plural = "Product technologies"


# ---------------------------------------------------------------- editorial


class Testimonial(models.Model):
    client = models.ForeignKey(Client, related_name="testimonials", on_delete=models.CASCADE)
    person_name = models.CharField(max_length=120)
    role = models.CharField(max_length=120, blank=True)
    quote = models.TextField()
    portrait = models.ImageField(upload_to="testimonials/", blank=True, null=True)
    featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    approved = models.BooleanField(default=False)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self) -> str:
        return f"{self.person_name} — {self.client.name}"


class TeamMember(models.Model):
    name = models.CharField(max_length=120)
    role = models.CharField(max_length=120, blank=True)
    bio = models.TextField(blank=True)
    photo = models.ImageField(upload_to="team/", blank=True, null=True)
    linkedin = models.URLField(blank=True)
    order = models.PositiveIntegerField(default=0)
    active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "name"]

    def __str__(self) -> str:
        return self.name


class Page(TimeStamped, SeoFields):
    title = models.CharField(max_length=140)
    slug = models.SlugField(max_length=140, unique=True)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.DRAFT)
    og_image = models.ImageField(upload_to="pages/", blank=True, null=True)

    def __str__(self) -> str:
        return self.title


class PageSection(models.Model):
    class SectionType(models.TextChoices):
        HERO = "hero", "Hero"
        STATEMENT = "statement", "Statement"
        SERVICES_GRID = "services_grid", "Services grid"
        FEATURED_PROJECTS = "featured_projects", "Featured projects"
        FEATURED_PRODUCTS = "featured_products", "Featured products"
        CLIENT_WALL = "client_wall", "Client wall"
        PROCESS = "process", "Process"
        TESTIMONIAL = "testimonial", "Testimonial"
        CTA = "cta", "Call to action"
        RICH_TEXT = "rich_text", "Rich text"
        MEDIA_SPLIT = "media_split", "Media split"

    page = models.ForeignKey(Page, related_name="sections", on_delete=models.CASCADE)
    section_type = models.CharField(max_length=32, choices=SectionType.choices)
    title = models.CharField(max_length=180, blank=True)
    subtitle = models.CharField(max_length=240, blank=True)
    content = models.TextField(blank=True)
    image = models.ImageField(upload_to="pages/", blank=True, null=True)
    config_json = models.JSONField(
        default=dict, blank=True, help_text="Presentation configuration only. Never executable code."
    )
    order = models.PositiveIntegerField(default=0)
    enabled = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self) -> str:
        return f"{self.page.title} — {self.get_section_type_display()}"


# ---------------------------------------------------------------- leads


class ContactSubmission(TimeStamped):
    class LeadStatus(models.TextChoices):
        NEW = "new", "New"
        REVIEWING = "reviewing", "Reviewing"
        QUALIFIED = "qualified", "Qualified"
        CONTACTED = "contacted", "Contacted"
        WON = "won", "Won"
        CLOSED = "closed", "Closed"
        SPAM = "spam", "Spam"

    name = models.CharField(max_length=120)
    email = models.EmailField()
    company = models.CharField(max_length=140, blank=True)
    phone = models.CharField(max_length=40, blank=True)
    service_interest = models.ForeignKey(
        Service, related_name="enquiries", on_delete=models.SET_NULL, null=True, blank=True
    )
    budget_range = models.CharField(max_length=60, blank=True)
    message = models.TextField()
    preferred_contact = models.CharField(max_length=20, blank=True)
    consent = models.BooleanField(default=False)
    source = models.CharField(max_length=60, blank=True)
    utm_source = models.CharField(max_length=80, blank=True)
    utm_medium = models.CharField(max_length=80, blank=True)
    utm_campaign = models.CharField(max_length=80, blank=True)
    status = models.CharField(max_length=16, choices=LeadStatus.choices, default=LeadStatus.NEW)
    internal_notes = models.TextField(blank=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Contact submission"

    def __str__(self) -> str:
        return f"{self.name} <{self.email}>"
