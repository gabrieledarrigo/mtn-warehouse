/**
 * DataExportService
 * Handles inventory data export and sharing functionality
 */

import type { InventoryItems } from '../inventory.js';

export interface ExportData {
  version: string;
  timestamp: string;
  exportedAt: string;
  inventory: InventoryItems;
  metadata: {
    totalColors: number;
    colorsWithStock: number;
    totalQuantity: number;
  };
}

export interface ExportOptions {
  includeMetadata?: boolean;
  filename?: string;
}

export interface ShareTarget {
  title: string;
  text: string;
  url?: string;
  files?: File[];
}

/**
 * Generate export data with timestamp and metadata
 */
export function generateExportData(
  inventory: InventoryItems,
  options: ExportOptions = {}
): ExportData {
  const timestamp = new Date().toISOString();
  const colorsWithStock = Object.values(inventory).filter(qty => qty > 0).length;
  const totalQuantity = Object.values(inventory).reduce((sum, qty) => sum + qty, 0);

  return {
    version: '1.0.0',
    timestamp,
    exportedAt: timestamp,
    inventory,
    metadata: {
      totalColors: Object.keys(inventory).length,
      colorsWithStock,
      totalQuantity,
    },
  };
}

/**
 * Generate filename with timestamp
 */
export function generateFilename(options: ExportOptions = {}): string {
  if (options.filename) {
    return options.filename;
  }

  const now = new Date();
  const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
  const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
  
  return `mtn-inventory-${dateStr}-${timeStr}.json`;
}

/**
 * Convert export data to JSON blob
 */
export function createExportBlob(data: ExportData): Blob {
  const jsonString = JSON.stringify(data, null, 2);
  return new Blob([jsonString], { type: 'application/json' });
}

/**
 * Check if Web Share API is supported
 */
export function isWebShareSupported(): boolean {
  return typeof navigator !== 'undefined' && 'share' in navigator;
}

/**
 * Check if we can share files via Web Share API
 */
export function canShareFiles(): boolean {
  return isWebShareSupported() && 'canShare' in navigator && typeof navigator.canShare === 'function';
}

/**
 * Share data using Web Share API
 */
export async function shareData(shareTarget: ShareTarget): Promise<void> {
  if (!isWebShareSupported()) {
    throw new Error('Web Share API not supported');
  }

  try {
    await navigator.share(shareTarget);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      // User cancelled the share - not an error
      return;
    }
    throw error;
  }
}

/**
 * Fallback download for browsers that don't support Web Share API
 */
export function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  URL.revokeObjectURL(url);
}

/**
 * Main export function that handles both Web Share API and fallback
 */
export async function exportInventory(
  inventory: InventoryItems,
  options: ExportOptions = {}
): Promise<void> {
  const exportData = generateExportData(inventory, options);
  const filename = generateFilename(options);
  const blob = createExportBlob(exportData);

  // Try Web Share API first if supported
  if (canShareFiles()) {
    try {
      const file = new File([blob], filename, { type: 'application/json' });
      
      // Check if we can share this file
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await shareData({
          title: 'Montana Hardcore Inventory Export',
          text: `Inventory export from ${new Date().toLocaleDateString()}`,
          files: [file],
        });
        return;
      }
    } catch (error) {
      console.warn('File sharing failed, falling back to download:', error);
    }
  }

  // Try basic Web Share API without files
  if (isWebShareSupported()) {
    try {
      // Create a data URL for sharing
      const dataUrl = URL.createObjectURL(blob);
      await shareData({
        title: 'Montana Hardcore Inventory Export',
        text: `Inventory export from ${new Date().toLocaleDateString()}. Download link:`,
        url: dataUrl,
      });
      
      // Clean up after a delay
      setTimeout(() => URL.revokeObjectURL(dataUrl), 5000);
      return;
    } catch (error) {
      console.warn('Web Share API failed, falling back to download:', error);
    }
  }

  // Fallback to direct download
  downloadFile(blob, filename);
}