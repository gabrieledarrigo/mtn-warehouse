/**
 * DataSync Service
 * Handles inventory data export/import and synchronization
 */

export interface ExportData {
  inventory: Record<string, number>;
  timestamp: string;
  version: string;
  device: string;
}

export interface ImportResult {
  success: boolean;
  conflicts?: string[];
  merged?: Record<string, number>;
  error?: string;
}

class DataSyncService {
  private static readonly VERSION = '1.0.0';
  private static readonly MAX_QR_DATA_SIZE = 2000; // QR code practical limit

  /**
   * Export current inventory data
   */
  static exportInventory(): ExportData {
    const inventoryData = this.getInventoryFromStorage();

    return {
      inventory: inventoryData,
      timestamp: new Date().toISOString(),
      version: this.VERSION,
      device: this.getDeviceInfo(),
    };
  }

  /**
   * Generate compressed data for QR code
   */
  static generateQRData(): string {
    const exportData = this.exportInventory();

    // Compress data for QR code
    const compressed = this.compressInventoryData(exportData);

    if (compressed.length > this.MAX_QR_DATA_SIZE) {
      throw new Error(
        'Inventory data too large for QR code. Use file export instead.'
      );
    }

    return compressed;
  }

  /**
   * Export data as downloadable JSON file
   */
  static exportToFile(): void {
    const exportData = this.exportInventory();
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const filename = `mtn-inventory-${timestamp}.json`;

    this.downloadJSON(exportData, filename);
  }

  /**
   * Import data from various sources
   */
  static importData(data: string | ExportData): ImportResult {
    try {
      let importData: ExportData;

      if (typeof data === 'string') {
        // From QR code or file content
        importData = this.parseImportData(data);
      } else {
        importData = data;
      }

      // Validate data structure
      if (!this.validateImportData(importData)) {
        return { success: false, error: 'Invalid data format' };
      }

      // Get current inventory
      const currentInventory = this.getInventoryFromStorage();

      // Merge with conflict detection
      const mergeResult = this.mergeInventories(currentInventory, importData);

      // Save merged data
      this.saveInventoryToStorage(mergeResult.merged);

      return {
        success: true,
        conflicts: mergeResult.conflicts,
        merged: mergeResult.merged,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Compress inventory data for QR code
   */
  private static compressInventoryData(data: ExportData): string {
    // Only include non-zero quantities to reduce size
    const nonZeroInventory = Object.fromEntries(
      Object.entries(data.inventory).filter(([_, qty]) => qty > 0)
    );

    const compressed = {
      i: nonZeroInventory, // inventory
      t: data.timestamp, // timestamp
      v: data.version, // version
      d: data.device, // device
    };

    return btoa(JSON.stringify(compressed));
  }

  /**
   * Parse import data from string
   */
  private static parseImportData(data: string): ExportData {
    try {
      // Try base64 decode first (QR code data)
      const decoded = atob(data);
      const parsed = JSON.parse(decoded);

      // Convert compressed format back
      if (parsed.i) {
        return {
          inventory: parsed.i,
          timestamp: parsed.t,
          version: parsed.v,
          device: parsed.d,
        };
      }
    } catch {
      // Try direct JSON parse (file import)
      return JSON.parse(data);
    }

    throw new Error('Unable to parse import data');
  }

  /**
   * Validate import data structure
   */
  private static validateImportData(data: ExportData): boolean {
    return !!(
      data &&
      typeof data.inventory === 'object' &&
      typeof data.timestamp === 'string' &&
      typeof data.version === 'string'
    );
  }

  /**
   * Merge two inventories with conflict detection
   */
  private static mergeInventories(
    current: Record<string, number>,
    imported: ExportData
  ): { merged: Record<string, number>; conflicts: string[] } {
    const conflicts: string[] = [];
    const merged = { ...current };

    const importedInventory = imported.inventory;

    // Simple strategy: imported data wins, but track conflicts
    for (const [colorCode, importedQty] of Object.entries(importedInventory)) {
      const currentQty = current[colorCode] || 0;

      if (currentQty !== importedQty && currentQty > 0 && importedQty > 0) {
        conflicts.push(`${colorCode}: ${currentQty} → ${importedQty}`);
      }

      merged[colorCode] = importedQty;
    }

    return { merged, conflicts };
  }

  /**
   * Get current inventory from localStorage
   */
  private static getInventoryFromStorage(): Record<string, number> {
    try {
      const stored = localStorage.getItem('mtn-inventory');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  /**
   * Save inventory to localStorage
   */
  private static saveInventoryToStorage(
    inventory: Record<string, number>
  ): void {
    localStorage.setItem('mtn-inventory', JSON.stringify(inventory));
  }

  /**
   * Download JSON file
   */
  private static downloadJSON(data: any, filename: string): void {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  /**
   * Get device info for tracking
   */
  private static getDeviceInfo(): string {
    const isMobile =
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    return isMobile ? 'mobile' : 'desktop';
  }
}

export default DataSyncService;
