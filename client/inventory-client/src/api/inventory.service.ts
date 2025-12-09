import type { InventoryItem } from "@/types/item";
import api from "../api";
import axios from "axios";

class ItemService {
  async addItem(item: InventoryItem) {
    const { data } = await api.post<InventoryItem>(
      "/items/api/inventory-items/",
      item
    );
    return data;
  }

  async updateItem(item: InventoryItem) {
    const { data } = await api.put<InventoryItem>(
      `/items/api/inventory-items/${item.id}/`,
      item
    );
    return data;
  }
  async getItem(qr: string): Promise<InventoryItem | null> {
    try {
      const response = await api.get<InventoryItem>(
        "/items/api/retrieve-item/",
        {
          params: { qr_data: qr },
        }
      );

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        // ❌ 404 Not Found
        if (status === 404) {
          console.warn("Item not found.");
          return null;
        }
      }

      // Unknown or network error
      throw new Error("Something went wrong. Please try again.");
    }
  }
}

export const itemService = new ItemService();
