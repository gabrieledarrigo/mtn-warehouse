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
 * Storage types
 */
export interface InventoryData {
  items: Record<string, number>; // colorCode -> quantity
  version: string;
  lastUpdated: string;
}
