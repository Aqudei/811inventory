from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from items.api.serializers import InventoryItemSerializer
from items.models import InventoryItem
from rest_framework.response import Response
import base64
import json

class InventoryItemViewSet(ModelViewSet):
    queryset = InventoryItem.objects.all()
    serializer_class = InventoryItemSerializer
    
    
class RetrieveItemAPIView(APIView):
    serializer_class = InventoryItemSerializer

    def get_queryset(self):
        queryset = InventoryItem.objects.all().prefetch_related("unit_of_measures")
        return queryset

    def base64_decode(self, data):
        missing_padding = len(data) % 4
        if missing_padding:
            data += "=" * (4 - missing_padding)
        return json.loads(base64.urlsafe_b64decode(data).decode("utf-8"))

    def get(self, request, *args, **kwargs):
        qr_data = self.base64_decode(request.query_params.get("qr_data"))
        version = qr_data.get("v")
        qr = qr_data.get("qr", None)
        if qr:
            try:
                item = self.get_queryset().get(qr=qr)
                serializer = self.serializer_class(item)
                return Response(serializer.data, status=200)
            except InventoryItem.DoesNotExist:
                return Response({"error": "InventoryItem not found."}, status=404)
