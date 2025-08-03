/**
 * DataImportService
 * Handles inventory data import functionality for cross-device synchronization
 */

import type { InventoryItems } from './inventory.js';
import type { ExportData } from './data-export.js';

export type ImportData = ExportData

export interface ImportPreview {
  newColors: {
    code: string;
    quantity: number;
  }[];
  updatedColors: {
    code: string;
    currentQuantity: number;
    newQuantity: number;
  }[];
  totalChanges: number;
  metadata: {
    importedAt: string;
    totalColors: number;
    importSource: string;
  };
}

export interface ImportResult {
  preview: ImportPreview;
  importData: ImportData;
}

/**
 * Maximum allowed file size for import (10MB)
 */
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Check if File System Access API is supported
 */
export function isFileSystemAccessSupported(): boolean {
  return typeof window !== 'undefined' && 'showOpenFilePicker' in window;
}

/**
 * Open file picker using File System Access API or fallback
 */
export function openFilePicker(): Promise<File | null> {
  if (isFileSystemAccessSupported()) {
    return (window as any)
      .showOpenFilePicker({
        types: [
          {
            accept: {
              'application/json': ['.json', '.txt'],
              'text/plain': ['.json', '.txt'],
            },
          },
        ],
        excludeAcceptAllOption: true,
        multiple: false,
      })
      .then(([fileHandle]: any[]) => fileHandle.getFile())
      .catch((error: Error) => {
        if (error.name === 'AbortError') {
          // User cancelled - not an error
          return null;
        }
        throw error;
      });
  }

  // Fallback to traditional file input
  return new Promise(resolve => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.txt,application/json,text/plain';

    input.onchange = event => {
      const file = (event.target as HTMLInputElement).files?.[0];
      resolve(file || null);
    };

    input.oncancel = () => resolve(null);

    input.click();
  });
}

/**
 * Parse and validate import file content
 */
export async function parseImportFile(file: File): Promise<ImportData> {
  if (!file) {
    throw new Error('Nessun file selezionato');
  }

  // Check file size (max 10MB for safety)
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File troppo grande. Dimensione massima: 10MB');
  }

  const content = await file.text();

  if (!content.trim()) {
    throw new Error('Il file è vuoto');
  }

  const data = JSON.parse(content);

  // Validate the data structure
  if (!validateImportData(data)) {
    throw new Error(
      'Formato file non valido. Seleziona un file di esportazione Montana Inventory.'
    );
  }

  return data as ImportData;
}

/**
 * Validate that import data has the correct structure
 */
export function validateImportData(data: any): data is ImportData {
  if (!data || typeof data !== 'object') {
    return false;
  }

  // Check required fields
  if (
    !data.version ||
    !data.exportedAt ||
    !data.inventory ||
    !data.metadata ||
    typeof data.inventory !== 'object'
  ) {
    return false;
  }

  // Check metadata structure
  if (
    typeof data.metadata.totalColors !== 'number' ||
    typeof data.metadata.colorsWithStock !== 'number' ||
    typeof data.metadata.totalQuantity !== 'number'
  ) {
    return false;
  }

  // Validate inventory structure - should be Record<string, number>
  for (const [code, quantity] of Object.entries(data.inventory)) {
    if (
      typeof code !== 'string' ||
      typeof quantity !== 'number' ||
      quantity < 0
    ) {
      return false;
    }
  }

  return true;
}

/**
 * Generate preview of import changes
 */
export function generateImportPreview(
  importData: ImportData,
  currentInventory: InventoryItems
): ImportPreview {
  const newColors: ImportPreview['newColors'] = [];
  const updatedColors: ImportPreview['updatedColors'] = [];

  for (const [code, importQuantity] of Object.entries(importData.inventory)) {
    const currentQuantity = currentInventory[code] || 0;

    if (currentQuantity === 0 && importQuantity > 0) {
      // New color (or color that was at 0)
      newColors.push({
        code,
        quantity: importQuantity,
      });
    } else if (currentQuantity > 0 && importQuantity !== currentQuantity) {
      // Updated color
      updatedColors.push({
        code,
        currentQuantity,
        newQuantity: importQuantity,
      });
    }
  }

  return {
    newColors,
    updatedColors,
    totalChanges: newColors.length + updatedColors.length,
    metadata: {
      importedAt: new Date().toISOString(),
      totalColors: Object.keys(importData.inventory).length,
      importSource: `Export da ${new Date(importData.exportedAt).toLocaleDateString()}`,
    },
  };
}

/**
 * Apply import to inventory (always replaces existing data)
 */
export function applyImport(
  importData: ImportData,
  currentInventory: InventoryItems
): InventoryItems {
  const newInventory = { ...currentInventory };

  // Replace with imported data
  for (const [code, importQuantity] of Object.entries(importData.inventory)) {
    newInventory[code] = importQuantity;
  }

  return newInventory;
}

/**
 * Main import function that returns both preview and the actual import data
 */
export async function importInventory(
  currentInventory: InventoryItems
): Promise<ImportResult> {
  const file = await openFilePicker();
  if (!file) {
    throw new Error('Importazione annullata');
  }

  const importData = await parseImportFile(file);
  const preview = generateImportPreview(importData, currentInventory);

  return {
    preview,
    importData,
  };
}
