import { useFieldArray, useForm, Controller } from "react-hook-form";
import type { InventoryItem } from "@/types/item";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router";
import { itemService } from "@/api/inventory.service";

export default function ItemForm() {
  const location = useLocation();
  const { item } = location.state || {}; // item might be undefined

  // Create a safe default if item is missing
  const defaultItem: Partial<InventoryItem> = item || {};

  const form = useForm<InventoryItem>({
    defaultValues: {
      ...defaultItem,
      units_of_measure: defaultItem.units_of_measure || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "units_of_measure",
  });

  const onSubmit = async (data: InventoryItem) => {
    if (item) {
      await itemService.updateItem(data);
    } else {
      await itemService.addItem(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* 2-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/** Article Item */}
          <FormField
            control={form.control}
            name="article_item"
            rules={{ required: "Article item is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Article Item</FormLabel>
                <FormControl>
                  <Input placeholder="Enter article item" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/** Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/** Old Property No */}
          <FormField
            control={form.control}
            name="old_property_no"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Old Property No</FormLabel>
                <FormControl>
                  <Input placeholder="Old Property No" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/** New Property No */}
          <FormField
            control={form.control}
            name="new_property_no"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Property No</FormLabel>
                <FormControl>
                  <Input placeholder="New Property No" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/** Unit Value */}
          <FormField
            control={form.control}
            name="unit_value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit Value</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/** Quantity per Property Card */}
          <FormField
            control={form.control}
            name="quantity_per_property_card"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Qty per Property Card</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/** Quantity per Physical Count */}
          <FormField
            control={form.control}
            name="quantity_per_physical_count"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Qty per Physical Count</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/** Location */}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/** Condition */}
          <FormField
            control={form.control}
            name="condition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Condition</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(val) => field.onChange(parseInt(val))}
                    defaultValue={field.value?.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Unknown</SelectItem>
                      <SelectItem value="1">Serviceable</SelectItem>
                      <SelectItem value="2">
                        Beyond Economical Repair
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/** Full-width fields */}
        <FormField
          control={form.control}
          name="remarks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Remarks</FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder="Remarks" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accounted"
          render={({ field }) => (
            <FormItem className="flex items-start gap-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(!!checked)}
                />
              </FormControl>
              <FormLabel className="font-normal mt-1">Accounted</FormLabel>
            </FormItem>
          )}
        />

        {/** Units of Measure */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Units of Measure</h3>
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-center">
              <FormField
                control={form.control}
                name={`units_of_measure.${index}.name`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Unit name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`units_of_measure.${index}.quantity`}
                render={({ field }) => (
                  <FormItem className="w-32">
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="destructive"
                onClick={() => remove(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() => append({ name: "", quantity: 1 })}
          >
            Add Unit of Measure
          </Button>
        </div>

        <Button type="submit" className="w-full md:w-auto">
          Save
        </Button>
      </form>
    </Form>
  );
}
