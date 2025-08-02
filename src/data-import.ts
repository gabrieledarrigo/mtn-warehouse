/**
 * DataImportService
 * Handles inventory data import functionality for cross-device synchronization
 */

import type { InventoryItems } from './inventory.js';
import type { ExportData } from './data-export.js';

export interface ImportData {
  version: string;
  exportedAt: string;
  inventory: InventoryItems;
  metadata: {
    totalColors: number;
    colorsWithStock: number;
    totalQuantity: number;
  };
}

export enum MergeStrategy {
  REPLACE = 'replace',
  MERGE = 'merge',
}

export interface ImportOptions {
  strategy: MergeStrategy;
}

export interface ImportPreview {
  newColors: string[];
  updatedColors: string[];
  unchangedColors: string[];
  removedColors: string[];
  totalChanges: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Check if File System Access API is supported
 */
export function isFileSystemAccessSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'showOpenFilePicker' in window &&
    typeof window.showOpenFilePicker === 'function'
  );
}

/**
 * Open file picker using File System Access API or fallback to input element
 */
export async function pickFile(): Promise<File | null> {
  if (isFileSystemAccessSupported()) {
    try {
      const [fileHandle] = await (window as any).showOpenFilePicker({
        types: [
          {
            description: 'JSON files',
            accept: {
              'application/json': ['.json', '.txt'],
            },
          },
        ],
        multiple: false,
      });
      return await fileHandle.getFile();
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // User cancelled the picker
        return null;
      }
      throw error;
    }
  } else {
    // Fallback to traditional file input
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json,.txt';
      
      input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        resolve(file || null);
      };
      
      input.oncancel = () => {
        resolve(null);
      };
      
      input.click();
    });
  }
}

/**
 * Parse and validate JSON file content
 */
export async function parseImportFile(file: File): Promise<ImportData> {
  const text = await file.text();
  
  try {
    const data = JSON.parse(text);
    const validationResult = validateImportData(data);
    
    if (!validationResult.isValid) {
      throw new Error(`Invalid import file: ${validationResult.errors.join(', ')}`);
    }
    
    return data as ImportData;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Il file selezionato non è un JSON valido');
    }
    throw error;
  }
}

/**
 * Validate import data structure and content
 */
export function validateImportData(data: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check basic structure
  if (!data || typeof data !== 'object') {
    errors.push('I dati devono essere un oggetto JSON');
    return { isValid: false, errors, warnings };
  }
  
  // Check required fields
  if (!data.version || typeof data.version !== 'string') {
    errors.push('Campo "version" mancante o non valido');
  }
  
  if (!data.exportedAt || typeof data.exportedAt !== 'string') {
    errors.push('Campo "exportedAt" mancante o non valido');
  }
  
  if (!data.inventory || typeof data.inventory !== 'object') {
    errors.push('Campo "inventory" mancante o non valido');
  }
  
  if (!data.metadata || typeof data.metadata !== 'object') {
    errors.push('Campo "metadata" mancante o non valido');
  }
  
  // Validate inventory structure
  if (data.inventory) {
    for (const [colorCode, quantity] of Object.entries(data.inventory)) {
      if (typeof colorCode !== 'string' || !colorCode.trim()) {
        errors.push(`Codice colore non valido: "${colorCode}"`);
      }
      
      if (typeof quantity !== 'number' || quantity < 0 || !Number.isInteger(quantity)) {
        errors.push(`Quantità non valida per il colore ${colorCode}: ${quantity}`);
      }
    }
  }
  
  // Version compatibility check
  if (data.version && !isVersionCompatible(data.version)) {
    warnings.push(`Versione ${data.version} potrebbe non essere completamente compatibile`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Check if import version is compatible with current version
 */
export function isVersionCompatible(importVersion: string): boolean {
  // For now, we accept version 1.x.x
  return importVersion.startsWith('1.');
}

/**
 * Generate preview of changes that will be applied
 */
export function generateImportPreview(
  currentInventory: InventoryItems,
  importData: ImportData,
  strategy: MergeStrategy
): ImportPreview {
  const newColors: string[] = [];
  const updatedColors: string[] = [];
  const unchangedColors: string[] = [];
  const removedColors: string[] = [];
  
  // Analyze import data
  for (const [colorCode, importQuantity] of Object.entries(importData.inventory)) {
    const currentQuantity = currentInventory[colorCode] || 0;
    
    if (currentQuantity === 0 && importQuantity > 0) {
      newColors.push(colorCode);
    } else if (currentQuantity !== importQuantity) {
      updatedColors.push(colorCode);
    } else {
      unchangedColors.push(colorCode);
    }
  }
  
  // Check for colors that will be removed (only in REPLACE strategy)
  if (strategy === MergeStrategy.REPLACE) {
    for (const [colorCode, currentQuantity] of Object.entries(currentInventory)) {
      if (currentQuantity > 0 && !(colorCode in importData.inventory)) {
        removedColors.push(colorCode);
      }
    }
  }
  
  return {
    newColors,
    updatedColors,
    unchangedColors,
    removedColors,
    totalChanges: newColors.length + updatedColors.length + removedColors.length,
  };
}

/**
 * Apply import data to current inventory
 */
export function applyImport(
  currentInventory: InventoryItems,
  importData: ImportData,
  strategy: MergeStrategy
): InventoryItems {
  let newInventory: InventoryItems;
  
  if (strategy === MergeStrategy.REPLACE) {
    // Replace: start with empty inventory and apply import data
    newInventory = { ...importData.inventory };
  } else {
    // Merge: start with current inventory and overlay import data
    newInventory = { ...currentInventory };
    
    for (const [colorCode, quantity] of Object.entries(importData.inventory)) {
      newInventory[colorCode] = quantity;
    }
  }
  
  return newInventory;
}

/**
 * Create backup of current inventory before import
 */
export function createBackup(inventory: InventoryItems): string {
  const backup = {
    timestamp: new Date().toISOString(),
    inventory,
  };
  
  const backupKey = `mtn-inventory-backup-${Date.now()}`;
  localStorage.setItem(backupKey, JSON.stringify(backup));
  
  return backupKey;
}

/**
 * Main import function that handles the complete import workflow
 */
export async function importInventory(
  currentInventory: InventoryItems,
  options: ImportOptions
): Promise<{
  success: boolean;
  newInventory?: InventoryItems;
  preview?: ImportPreview;
  backupKey?: string;
  error?: string;
}> {
  try {
    // Step 1: Pick file
    const file = await pickFile();
    if (!file) {
      return { success: false, error: 'Nessun file selezionato' };
    }
    
    // Step 2: Parse and validate
    const importData = await parseImportFile(file);
    
    // Step 3: Generate preview
    const preview = generateImportPreview(currentInventory, importData, options.strategy);
    
    // Step 4: Create backup
    const backupKey = createBackup(currentInventory);
    
    // Step 5: Apply import
    const newInventory = applyImport(currentInventory, importData, options.strategy);
    
    return {
      success: true,
      newInventory,
      preview,
      backupKey,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Errore sconosciuto durante l\'importazione',
    };
  }
}