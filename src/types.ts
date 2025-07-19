/**
 * Core types for Montana Hardcore colors
 */

export interface Color {
  code: string;
  name: string;
  hex: string;
}

export interface InventoryItem {
  color: Color;
  quantity: number;
}

// colorCode -> quantity
export type InventoryItems = Record<string, number>;

/**
 * Storage types
 */
export interface InventoryData {
  items: InventoryItems;
  version: string;
  lastUpdated: string;
}
