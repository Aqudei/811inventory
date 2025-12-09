// Example Types
export interface UnitOfMeasure {
  name: string;
  quantity: number;
}

export interface InventoryItem {
  id: number;
  article_item: string;
  description: string;
  old_property_no: string;
  new_property_no: string;
  unit_value: number;
  quantity_per_property_card: number;
  quantity_per_physical_count: number;
  location: string;
  condition: number;
  remarks: string;
  accounted: boolean;
  units_of_measure?: UnitOfMeasure[];
}
