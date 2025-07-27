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

/**
 * They key for inventory items is the color code, and the value is the quantity.
 */
export type InventoryItems = Record<string, number>;

/**
 * Storage types
 */
export interface InventoryData {
  items: InventoryItems;
  version: string;
  lastUpdated: string;
}


