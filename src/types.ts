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

/**
 * Filter types for inventory filtering
 */
export enum FilterType {
  ALL = 'tutti',
  IN_STOCK = 'in_stock',
  OUT_OF_STOCK = 'esauriti',
  LOW_STOCK = 'scarsi',
}

export interface FilterOption {
  type: FilterType;
  label: string;
  shortcut?: string;
}

export interface FilterState {
  activeFilter: FilterType;
  filteredCount: number;
}
