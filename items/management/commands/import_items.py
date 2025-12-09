import re
from django.core.management.base import BaseCommand
from items.models import InventoryItem, UnitOfMeasure
import pandas as pd
import traceback as tb


class Command(BaseCommand):
    help = "Import TIEMS data from an Excel file"

    def add_arguments(self, parser):
        parser.add_argument(
            "file_path", type=str, help="The path to the Excel file to import"
        )

    def handle(self, *args, **kwargs):
        condition_mapping = {
            "S (ACCOUNTED)": 1,
            "B (ACCOUNTED)": 2,
            "B": 2,
            "S": 1,
        }

        InventoryItem.objects.all().delete()

        file_path = kwargs["file_path"]
        try:
            df = pd.read_excel(file_path, sheet_name="ICF 2024 (2)", skiprows=5)
            df["Remarks"] = df["Remarks"].fillna("")
            df["New Property No. Assigned (To be filled up during validation)"] = df[
                "New Property No. Assigned (To be filled up during validation)"
            ].fillna("")
            df["Old Property No. Assigned"] = df["Old Property No. Assigned"].fillna("")
            df["Unit Value"] = df["Unit Value"].fillna(0)
            df["Quantity Per Property Card"] = df["Quantity Per Property Card"].fillna(
                0
            )
            df["Quantity per Physical Count"] = df[
                "Quantity per Physical Count"
            ].fillna(0)
            df["Unit of Measure"] = df["Unit of Measure"].fillna("")

            for _, row in df.iterrows():
                defaults = {
                    "description": row.get("Description", ""),
                    "old_property_no": row.get("Old Property No. Assigned", "") or "",
                    "new_property_no": row.get(
                        "New Property No. Assigned (To be filled up during validation)",
                        "",
                    )
                    or "",
                    "unit_value": row.get("Unit Value", 0) or 0,
                    "quantity_per_property_card": row.get(
                        "Quantity Per Property Card", 0
                    )
                    or 0,
                    "quantity_per_physical_count": row.get(
                        "Quantity per Physical Count", 0
                    )
                    or 0,
                    "location": row.get("Location/ Whereabouts", ""),
                    "condition": condition_mapping.get(row.get("Condition", "").strip())
                    or 0,
                    "remarks": row.get("Remarks", ""),
                    "accounted": "(ACCOUNTED)" in (row.get("Status", "") or ""),
                }

                item = InventoryItem.objects.create(
                    article_item=row["Article/Item"],
                    **defaults,
                )

                self.stdout.write(self.style.SUCCESS(f"Created InventoryItem: {item}"))

                UnitOfMeasure.objects.filter(item=item).delete()
                if row.get("Unit of Measure") != "":

                    uoms = [
                        i.strip()
                        for i in re.split(r"[\r\n]", row.get("Unit of Measure", ""))
                        if i.strip() and i.strip() != ""
                    ]
                    for uom_name in uoms:
                        uom = UnitOfMeasure.objects.create(
                            name=uom_name,
                            item=item,
                            # defaults={"quantity": row.get("UOM Quantity", 1)},
                        )

                        self.stdout.write(
                            self.style.SUCCESS(f"Created UnitOfMeasure: {uom}")
                        )

        except Exception as e:
            self.stderr.write(self.style.ERROR(f"Error importing data: {e}"))
            self.stderr.write(self.style.ERROR(tb.format_exc()))
