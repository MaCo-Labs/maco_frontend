"""Seed the locked content catalog (08_CONTENT_CATALOG.md) into the database."""
from django.core.management.base import BaseCommand

from content.models import Client, Product, ProductFeature, Project, Service, ServiceCapability, SiteSettings

SERVICES = [
    ("Web Development", "web-development", "Marketing sites and web platforms built to be edited, measured and maintained after launch.",
     [("Site architecture", "Routing, content modelling and SEO structure decided before a pixel is drawn."),
      ("Front-end engineering", "React and modern CSS, built for performance budgets."),
      ("Content administration", "Django admin so copy and media change without a deploy.")]),
    ("App Development", "app-development", "Installable applications and operational platforms for teams that work away from a desk.",
     [("PWA delivery", "Installable, offline-tolerant applications on a single codebase."),
      ("Role and permission design", "Administrators, operators and field users treated as distinct products."),
      ("Reporting layers", "Exports and dashboards derived from live records.")]),
    ("Technical Support", "technical-support", "Hands-on support for infrastructure, hosting, domains, mail and the day-to-day IT surface.",
     [("Infrastructure & hosting", "Environments, domains, certificates and deployment pipelines."),
      ("Monitoring & backups", "Alerting and recovery paths agreed before they are needed."),
      ("Incident response", "A named route to a human when something is down.")]),
    ("Software Support", "software-support", "Maintenance, fixes and continuous improvement for software already in production.",
     [("Codebase adoption", "Audit, document and stabilise inherited software."),
      ("Release cadence", "Small scheduled releases instead of risky rewrites."),
      ("Dependency hygiene", "Runtime, library and security updates tracked deliberately.")]),
    ("Social Media Managing", "social-media-managing", "Channel management for companies whose product story needs to stay consistent in public.",
     [("Content planning", "Calendars tied to launches and campaign moments."),
      ("Asset production", "Templates derived from the brand system."),
      ("Reporting", "Plain reach and engagement reporting.")]),
]

CLIENTS = [
    ("Ananta Nethralaya", "ananta-nethralaya", "Healthcare", "https://www.anantanethralaya.org/"),
    ("Al Afzah Group WLL", "al-afzah-group", "Construction", "https://www.al-afzahgroup.com/"),
    ("Soorath Autos", "soorath-autos", "Automotive retail", "https://www.soorathautos.in/"),
    ("HeadGreen", "headgreen", "EV mobility", "https://www.headgreen.in/"),
]

PROJECTS = [
    ("Ananta Nethralaya", "ananta-nethralaya", "ananta-nethralaya", "Healthcare — Ophthalmology",
     "Website for an eye clinic.", "https://www.anantanethralaya.org/", ["web-development"]),
    ("Al Afzah", "al-afzah", "al-afzah-group", "Construction — Qatar",
     "Website for a Qatar-based construction company.", "https://www.al-afzahgroup.com/", ["web-development"]),
    ("Soorath Autos", "soorath-autos", "soorath-autos", "Automotive retail",
     "Website for a pre-owned car showroom.", "https://www.soorathautos.in/", ["web-development", "social-media-managing"]),
    ("HeadGreen", "headgreen", "headgreen", "Corporate EV mobility — Kochi",
     "Website for a corporate EV fleet cab service based in Kochi, Kerala.", "https://www.headgreen.in/",
     ["web-development", "technical-support"]),
]

PRODUCTS = [
    ("Driver's Diary", "drivers-diary", "headgreen", "Operational PWA",
     "Management, attendance, rides, payroll, documentation and reporting for HeadGreen operations.",
     "https://prod.d25ny7hdw64pgk.amplifyapp.com/",
     ["Attendance", "Rides", "Payroll inputs", "Documentation", "Reporting"]),
    ("Bridge", "bridge", None, "SaaS / PWA + desktop",
     "Task and project implementation, administration, users, project analysis and task assignment.",
     "https://prod.ddklo8cltmn7o.amplifyapp.com/",
     ["Project implementation", "Task assignment", "Administration", "Users", "Project analysis"]),
]


class Command(BaseCommand):
    help = "Seed MaCo's confirmed services, clients, projects and products."

    def handle(self, *args, **options):
        SiteSettings.objects.update_or_create(
            pk=1,
            defaults={
                "site_name": "MaCo",
                "tagline": "Software and IT solutions for products that need to work.",
                "contact_email": "hello@maco.dev",
                "address": "Kochi, Kerala, India",
            },
        )

        for order, (title, slug, short, caps) in enumerate(SERVICES):
            service, _ = Service.objects.update_or_create(
                slug=slug, defaults={"title": title, "short_description": short, "order": order}
            )
            for cap_order, (cap_title, cap_desc) in enumerate(caps):
                ServiceCapability.objects.update_or_create(
                    service=service, title=cap_title, defaults={"description": cap_desc, "order": cap_order}
                )

        for order, (name, slug, industry, website) in enumerate(CLIENTS):
            Client.objects.update_or_create(
                slug=slug,
                defaults={"name": name, "industry": industry, "website": website,
                          "order": order, "approved_for_publication": True},
            )

        for order, (title, slug, client_slug, sector, short, url, service_slugs) in enumerate(PROJECTS):
            project, _ = Project.objects.update_or_create(
                slug=slug,
                defaults={
                    "title": title, "sector": sector, "short_description": short,
                    "external_url": url, "featured": True, "order": order,
                    "client": Client.objects.get(slug=client_slug),
                },
            )
            project.services.set(Service.objects.filter(slug__in=service_slugs))

        for order, (title, slug, client_slug, kind, short, url, features) in enumerate(PRODUCTS):
            product, _ = Product.objects.update_or_create(
                slug=slug,
                defaults={
                    "title": title, "kind": kind, "short_description": short, "live_url": url,
                    "featured": True, "order": order,
                    "owner_client": Client.objects.get(slug=client_slug) if client_slug else None,
                },
            )
            for f_order, feature in enumerate(features):
                ProductFeature.objects.update_or_create(
                    product=product, title=feature, defaults={"order": f_order}
                )

        self.stdout.write(self.style.SUCCESS("MaCo content catalog seeded."))
