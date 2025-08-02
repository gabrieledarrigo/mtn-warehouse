/**
 * DataExportService
 * Handles inventory data export and sharing functionality
 */

import type { InventoryItems } from './inventory.js';

export interface ExportData {
  version: string;
  exportedAt: string;
  inventory: InventoryItems;
  metadata: {
    totalColors: number;
    colorsWithStock: number;
    totalQuantity: number;
  };
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
export function generateExportData(inventory: InventoryItems): ExportData {
  const exportedAt = new Date().toISOString();
  const colorsWithStock = Object.values(inventory).filter(
    quantity => quantity > 0
  ).length;
  const totalQuantity = Object.values(inventory).reduce(
    (sum, quantity) => sum + quantity,
    0
  );

  return {
    version: '1.0.0',
    exportedAt,
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
export function generateFilename(): string {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
  const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS

  return `mtn-inventory-${dateStr}-${timeStr}.txt`;
}

/**
 * Convert export data to JSON blob
 */
export function createExportBlob(data: ExportData): Blob {
  const jsonString = JSON.stringify(data, null, 2);

  return new Blob([jsonString], { type: 'text/plain' });
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
  return (
    isWebShareSupported() &&
    'canShare' in navigator &&
    typeof navigator.canShare === 'function'
  );
}

/**
 * Share data using Web Share API
 */
export async function shareData(shareTarget: ShareTarget): Promise<void> {
  if (!isWebShareSupported()) {
    throw new Error('Web Share API not supported');
  }

  await navigator.share(shareTarget).catch(error => {
    if (error instanceof Error && error.name === 'AbortError') {
      // User cancelled the share - not an error
      return;
    }
    throw error;
  });
}

/**
 * Main export function that uses Web Share API
 */
export async function exportInventory(
  inventory: InventoryItems
): Promise<void> {
  // Check if Web Share API is supported
  if (!isWebShareSupported()) {
    alert(
      'Questa funzionalità richiede un dispositivo che supporta la condivisione nativa. Utilizza Chrome su Android o Safari su iOS.'
    );
    return;
  }

  const exportData = generateExportData(inventory);
  const filename = generateFilename();
  const blob = createExportBlob(exportData);

  // Try to share files if supported
  if (canShareFiles()) {
    const file = new File([blob], filename, { type: 'text/plain' });

    // Check if we can share this file
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await shareData({
        title: 'Montana Hardcore Inventory Export',
        text: `Inventory export from ${new Date().toLocaleDateString()}`,
        files: [file],
      });
      return;
    }
  }

  // Fallback to basic Web Share API without files
  const dataUrl = URL.createObjectURL(blob);
  await shareData({
    title: 'Montana Hardcore Inventory Export',
    text: `Inventory export from ${new Date().toLocaleDateString()}. Download link:`,
    url: dataUrl,
  });

  // Clean up after a delay
  setTimeout(() => URL.revokeObjectURL(dataUrl), 5000);
}
