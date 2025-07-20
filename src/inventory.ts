import type { InventoryData } from './types.js';

/**
 * Storage configuration
 */
const STORAGE_KEY = 'mtn-inventory';
const VERSION = '1.0.0';

/**
 * Save inventory data to localStorage
 */
export function saveInventory(data: Record<string, number>): void {
  const inventoryData: InventoryData = {
    items: data,
    version: VERSION,
    lastUpdated: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(inventoryData));
}

/**
 * Load inventory data from localStorage
 */
export function loadInventory(): Record<string, number> {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return {};
  }

  const data: InventoryData = JSON.parse(stored);

  // Version check
  if (data.version !== VERSION) {
    console.warn('Storage version mismatch, resetting data');
    return {};
  }

  return data.items || {};
}

/**
 * Clear all inventory data
 */
export function clearInventory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
