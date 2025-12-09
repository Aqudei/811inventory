from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField
from items.models import InventoryItem, UnitOfMeasure


class UnitOfMeasureSerializer(ModelSerializer):
    item = PrimaryKeyRelatedField(queryset=InventoryItem.objects.all(), required=False)

    class Meta:
        model = UnitOfMeasure
        fields = "__all__"


class InventoryItemSerializer(ModelSerializer):
    units_of_measure = UnitOfMeasureSerializer(many=True)

    class Meta:
        model = InventoryItem
        fields = "__all__"

    def create(self, validated_data):
        # Extract nested data
        units_data = validated_data.pop("units_of_measure", [])

        # Create InventoryItem
        item = InventoryItem.objects.create(**validated_data)

        # Recreate unit_of_measures
        for unit in units_data:
            UnitOfMeasure.objects.create(item=item, **unit)

        return item

    def update(self, instance, validated_data):
        # Extract nested data
        units_data = validated_data.pop("unit_of_measures", [])

        # Update the InventoryItem fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Delete all old unit_of_measures
        instance.unit_of_measures.all().delete()

        # Recreate them
        for unit in units_data:
            UnitOfMeasure.objects.create(inventory_item=instance, **unit)

        return instance
