from django.db import models
from django.urls import reverse
from django.utils.translation import gettext_lazy as _


class UnitOfMeasure(models.Model):
    name = models.CharField(max_length=100)
    item = models.ForeignKey(
        "InventoryItem", on_delete=models.CASCADE, related_name="units_of_measure"
    )
    quantity = models.IntegerField(default=1)

    class Meta:
        verbose_name = _("Unit of Measure")
        verbose_name_plural = _("Unit of Measures")

    def __str__(self):
        return f"{self.name}"

    def get_absolute_url(self):
        return reverse("unitofmeasure_detail", kwargs={"pk": self.pk})


class InventoryItem(models.Model):
    CONDITIONS = [
        (0, "Unknown"),
        (1, "Serviceable"),
        (2, "Beyond Economical Repair (BER)"),
    ]

    article_item = models.CharField(max_length=150)
    description = models.CharField(max_length=255, blank=True, null=True)

    old_property_no = models.CharField(
        max_length=50, blank=True, null=True, verbose_name="Old Property No. Assigned"
    )
    new_property_no = models.CharField(
        max_length=50, blank=True, null=True, verbose_name="New Property No. Assigned"
    )

    unit_value = models.DecimalField(
        max_digits=12, decimal_places=2, blank=True, null=True
    )

    quantity_per_property_card = models.IntegerField(blank=True, null=True)
    quantity_per_physical_count = models.IntegerField(blank=True, null=True)

    location = models.CharField(
        max_length=150, blank=True, null=True, verbose_name="Location / Whereabouts"
    )

    condition = models.IntegerField(choices=CONDITIONS, default=0)
    remarks = models.CharField(max_length=255, blank=True, null=True)
    accounted = models.BooleanField(default=True)
    qr = models.CharField(max_length=50, null=True, blank=True)

    class Meta:
        verbose_name = _("Inventory Item")
        verbose_name_plural = _("Inventory Items")

    def __str__(self):
        return f"{self.article_item} - {self.description}"
