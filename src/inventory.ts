import type { InventoryData } from './types.js';

/**
 * Storage configuration
 */
const STORAGE_KEY = 'mtn-inventory';
const VERSION = '1.0.0';

/**
 * Check if localStorage is available
 */
function isLocalStorageAvailable(): boolean {
  try {
    return typeof window !== 'undefined' && window.localStorage !== null;
  } catch {
    return false;
  }
}

/**
 * Save inventory data to localStorage
 */
export function saveInventory(data: Record<string, number>): void {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available, cannot save data');
    return;
  }

  try {
    const inventoryData: InventoryData = {
      items: data,
      version: VERSION,
      lastUpdated: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(inventoryData));
  } catch (error) {
    console.error('Failed to save inventory data:', error);
  }
}

/**
 * Load inventory data from localStorage
 */
export function loadInventory(): Record<string, number> {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available, using empty inventory');
    return {};
  }

  try {
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
  } catch (error) {
    console.error('Failed to load inventory data:', error);
    return {};
  }
}

/**
 * Clear all inventory data
 */
export function clearInventory(): void {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available, cannot clear data');
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear inventory data:', error);
  }
}
