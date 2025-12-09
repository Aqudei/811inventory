from django.contrib import admin
from .models import InventoryItem, UnitOfMeasure
# Register your models here.


class UnitOfMeasureInline(admin.TabularInline):
    model = UnitOfMeasure
    extra = 1

@admin.register(InventoryItem)
class InventoryItemAdmin(admin.ModelAdmin):
    list_display = (
        "article_item",
        "description",
        "old_property_no",
        "new_property_no",
        "unit_value",
        "quantity_per_property_card",
        "quantity_per_physical_count",
        "location",
        "condition",
        "remarks",
        "accounted",
    )
    
    inlines = [UnitOfMeasureInline]
    list_filter = ("condition", "accounted")

@admin.register(UnitOfMeasure)
class UnitOfMeasureAdmin(admin.ModelAdmin):
    list_display = ("name", "item", "quantity")
    

