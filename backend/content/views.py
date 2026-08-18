from django.conf import settings
from django.core.mail import send_mail
from rest_framework import generics, viewsets
from rest_framework.response import Response

from .models import Client, Product, Project, Service, SiteSettings
from .serializers import (
    ClientSerializer,
    ContactSubmissionSerializer,
    ProductDetailSerializer,
    ProductListSerializer,
    ProjectDetailSerializer,
    ProjectListSerializer,
    ServiceDetailSerializer,
    ServiceListSerializer,
    SiteSettingsSerializer,
)


class SiteSettingsView(generics.RetrieveAPIView):
    serializer_class = SiteSettingsSerializer

    def get_object(self):
        obj, _ = SiteSettings.objects.get_or_create(pk=1)
        return obj


class ServiceViewSet(viewsets.ReadOnlyModelViewSet):
    lookup_field = "slug"
    queryset = Service.objects.published().prefetch_related("capabilities", "projects")

    def get_serializer_class(self):
        return ServiceDetailSerializer if self.action == "retrieve" else ServiceListSerializer


class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    lookup_field = "slug"

    def get_queryset(self):
        qs = Project.objects.published().select_related("client").prefetch_related(
            "images", "technologies", "services"
        )
        if self.request.query_params.get("featured") == "true":
            qs = qs.filter(featured=True)
        return qs

    def get_serializer_class(self):
        return ProjectDetailSerializer if self.action == "retrieve" else ProjectListSerializer


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    lookup_field = "slug"
    queryset = Product.objects.published().select_related("owner_client").prefetch_related(
        "features", "images", "technologies"
    )

    def get_serializer_class(self):
        return ProductDetailSerializer if self.action == "retrieve" else ProductListSerializer


class ClientViewSet(viewsets.ReadOnlyModelViewSet):
    lookup_field = "slug"
    serializer_class = ClientSerializer
    queryset = Client.objects.filter(approved_for_publication=True)


class ContactCreateView(generics.CreateAPIView):
    serializer_class = ContactSubmissionSerializer
    throttle_scope = "contact"

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        submission = serializer.save()

        if submission.status != submission.LeadStatus.SPAM:
            send_mail(
                subject=f"MaCo enquiry — {submission.name}",
                message=(
                    f"From: {submission.name} <{submission.email}>\n"
                    f"Company: {submission.company or '—'}\n"
                    f"Phone: {submission.phone or '—'}\n"
                    f"Budget: {submission.budget_range or '—'}\n\n"
                    f"{submission.message}"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.LEAD_NOTIFICATION_EMAIL],
                fail_silently=True,
            )

        return Response({"detail": "Enquiry received."}, status=201)
