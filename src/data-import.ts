/**
 * DataImportService
 * Handles inventory data import functionality for cross-device synchronization
 */

import type { InventoryItems } from './inventory.js';
import type { ExportData } from './data-export.js';

export interface ImportData extends ExportData {
  // Import data has the same structure as export data
}

export interface ImportOptions {
  mergeStrategy: MergeStrategy;
  validateSchema: boolean;
  createBackup: boolean;
}

export enum MergeStrategy {
  REPLACE = 'replace', // Replace entire inventory
  MERGE = 'merge', // Merge quantities (add to existing)
  SKIP_EXISTING = 'skip_existing', // Only import new colors
}

export interface ImportPreview {
  newColors: Array<{
    code: string;
    quantity: number;
  }>;
  updatedColors: Array<{
    code: string;
    currentQuantity: number;
    newQuantity: number;
    finalQuantity: number;
  }>;
  unchangedColors: Array<{
    code: string;
    quantity: number;
  }>;
  totalChanges: number;
  metadata: {
    importedAt: string;
    totalColors: number;
    importSource: string;
  };
}

export interface ImportResult {
  success: boolean;
  message: string;
  preview?: ImportPreview;
  error?: string;
}

/**
 * Check if File System Access API is supported
 */
export function isFileSystemAccessSupported(): boolean {
  return typeof window !== 'undefined' && 'showOpenFilePicker' in window;
}

/**
 * Open file picker using File System Access API or fallback
 */
export async function openFilePicker(): Promise<File | null> {
  if (isFileSystemAccessSupported()) {
    try {
      const [fileHandle] = await (window as any).showOpenFilePicker({
        types: [
          {
            description: 'Montana Inventory Files',
            accept: {
              'application/json': ['.json', '.txt'],
              'text/plain': ['.json', '.txt'],
            },
          },
        ],
        excludeAcceptAllOption: true,
        multiple: false,
      });
      
      return await fileHandle.getFile();
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        // User cancelled - not an error
        return null;
      }
      throw error;
    }
  } else {
    // Fallback to traditional file input
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json,.txt,application/json,text/plain';
      
      input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        resolve(file || null);
      };
      
      input.oncancel = () => resolve(null);
      
      input.click();
    });
  }
}

/**
 * Parse and validate import file content
 */
export async function parseImportFile(file: File): Promise<ImportData> {
  if (!file) {
    throw new Error('Nessun file selezionato');
  }

  // Check file size (max 10MB for safety)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File troppo grande. Dimensione massima: 10MB');
  }

  let content: string;
  try {
    content = await file.text();
  } catch (error) {
    throw new Error('Errore nella lettura del file');
  }

  if (!content.trim()) {
    throw new Error('Il file è vuoto');
  }

  let data: any;
  try {
    data = JSON.parse(content);
  } catch (error) {
    throw new Error('Il file non contiene JSON valido');
  }

  // Validate the data structure
  if (!validateImportData(data)) {
    throw new Error('Formato file non valido. Seleziona un file di esportazione Montana Inventory.');
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
    if (typeof code !== 'string' || typeof quantity !== 'number' || quantity < 0) {
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
  currentInventory: InventoryItems,
  mergeStrategy: MergeStrategy
): ImportPreview {
  const newColors: ImportPreview['newColors'] = [];
  const updatedColors: ImportPreview['updatedColors'] = [];
  const unchangedColors: ImportPreview['unchangedColors'] = [];

  for (const [code, importQuantity] of Object.entries(importData.inventory)) {
    const currentQuantity = currentInventory[code] || 0;
    
    if (currentQuantity === 0 && importQuantity > 0) {
      // New color (or color that was at 0)
      newColors.push({
        code,
        quantity: importQuantity,
      });
    } else if (currentQuantity > 0) {
      let finalQuantity: number;
      
      switch (mergeStrategy) {
        case MergeStrategy.REPLACE:
          finalQuantity = importQuantity;
          break;
        case MergeStrategy.MERGE:
          finalQuantity = currentQuantity + importQuantity;
          break;
        case MergeStrategy.SKIP_EXISTING:
          finalQuantity = currentQuantity; // Keep existing
          break;
        default:
          finalQuantity = importQuantity;
      }

      if (finalQuantity !== currentQuantity) {
        updatedColors.push({
          code,
          currentQuantity,
          newQuantity: importQuantity,
          finalQuantity,
        });
      } else {
        unchangedColors.push({
          code,
          quantity: currentQuantity,
        });
      }
    }
  }

  return {
    newColors,
    updatedColors,
    unchangedColors,
    totalChanges: newColors.length + updatedColors.length,
    metadata: {
      importedAt: new Date().toISOString(),
      totalColors: Object.keys(importData.inventory).length,
      importSource: `Export da ${new Date(importData.exportedAt).toLocaleDateString()}`,
    },
  };
}

/**
 * Apply import to inventory with specified merge strategy
 */
export function applyImport(
  importData: ImportData,
  currentInventory: InventoryItems,
  mergeStrategy: MergeStrategy
): InventoryItems {
  const newInventory = { ...currentInventory };

  for (const [code, importQuantity] of Object.entries(importData.inventory)) {
    const currentQuantity = newInventory[code] || 0;

    switch (mergeStrategy) {
      case MergeStrategy.REPLACE:
        newInventory[code] = importQuantity;
        break;
      case MergeStrategy.MERGE:
        newInventory[code] = currentQuantity + importQuantity;
        break;
      case MergeStrategy.SKIP_EXISTING:
        if (currentQuantity === 0) {
          newInventory[code] = importQuantity;
        }
        // Keep existing quantity if color already exists
        break;
      default:
        newInventory[code] = importQuantity;
    }
  }

  return newInventory;
}

/**
 * Main import function that returns both preview and the actual import data
 */
export async function importInventory(
  currentInventory: InventoryItems,
  options: ImportOptions = {
    mergeStrategy: MergeStrategy.REPLACE,
    validateSchema: true,
    createBackup: false,
  }
): Promise<ImportResult & { importData?: ImportData }> {
  try {
    // Open file picker
    const file = await openFilePicker();
    if (!file) {
      return {
        success: false,
        message: 'Importazione annullata',
      };
    }

    // Parse and validate file
    const importData = await parseImportFile(file);

    // Generate preview
    const preview = generateImportPreview(
      importData,
      currentInventory,
      options.mergeStrategy
    );

    return {
      success: true,
      message: 'File caricato con successo',
      preview,
      importData, // Include the actual import data
    };
  } catch (error) {
    return {
      success: false,
      message: 'Errore durante l\'importazione',
      error: error instanceof Error ? error.message : 'Errore sconosciuto',
    };
  }
}