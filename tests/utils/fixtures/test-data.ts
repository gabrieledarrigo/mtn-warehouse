/**
 * Test data fixtures for Montana Hardcore Inventory testing
 */

/**
 * Sample Montana Hardcore color codes for testing
 * These should match actual colors in the database
 */
export const TEST_COLORS = {
  // Common colors that should exist in the Montana Hardcore database
  RV_252: 'RV-252', // Yellow
  RV_100: 'RV-100', // Black
  RV_9010: 'RV-9010', // White
  RV_3020: 'RV-3020', // Red
  RV_5015: 'RV-5015', // Blue
  RV_6029: 'RV-6029', // Green
  RV_4006: 'RV-4006', // Purple
  RV_1013: 'RV-1013', // Orange
} as const;

/**
 * Sample inventory data for testing
 */
export const SAMPLE_INVENTORY = {
  [TEST_COLORS.RV_252]: 5, // Yellow - 5 cans
  [TEST_COLORS.RV_100]: 0, // Black - out of stock
  [TEST_COLORS.RV_9010]: 1, // White - low stock
  [TEST_COLORS.RV_3020]: 10, // Red - well stocked
  [TEST_COLORS.RV_5015]: 3, // Blue - medium stock
  // RV_6029 and RV_4006 not set (default to 0)
} as const;

/**
 * Empty inventory for clean state testing
 */
export const EMPTY_INVENTORY = {} as const;

/**
 * Full inventory with various stock levels
 */
export const FULL_INVENTORY = {
  [TEST_COLORS.RV_252]: 15,
  [TEST_COLORS.RV_100]: 8,
  [TEST_COLORS.RV_9010]: 2,
  [TEST_COLORS.RV_3020]: 12,
  [TEST_COLORS.RV_5015]: 6,
  [TEST_COLORS.RV_6029]: 4,
  [TEST_COLORS.RV_4006]: 9,
  [TEST_COLORS.RV_1013]: 1,
} as const;

/**
 * Inventory with only out-of-stock items
 */
export const OUT_OF_STOCK_INVENTORY = {
  [TEST_COLORS.RV_252]: 0,
  [TEST_COLORS.RV_100]: 0,
  [TEST_COLORS.RV_9010]: 0,
  [TEST_COLORS.RV_3020]: 0,
} as const;

/**
 * Inventory with only low-stock items (quantity = 1)
 */
export const LOW_STOCK_INVENTORY = {
  [TEST_COLORS.RV_252]: 1,
  [TEST_COLORS.RV_100]: 1,
  [TEST_COLORS.RV_9010]: 1,
  [TEST_COLORS.RV_3020]: 1,
} as const;

/**
 * Test viewport sizes for responsive testing
 */
export const VIEWPORT_SIZES = {
  MOBILE: { width: 375, height: 667 }, // iPhone SE
  MOBILE_LARGE: { width: 414, height: 896 }, // iPhone XR
  TABLET: { width: 768, height: 1024 }, // iPad
  TABLET_LARGE: { width: 1024, height: 768 }, // iPad Landscape
  DESKTOP: { width: 1200, height: 800 }, // Small Desktop
  DESKTOP_LARGE: { width: 1920, height: 1080 }, // Large Desktop
} as const;

/**
 * Test scenarios for quantity management
 */
export const QUANTITY_SCENARIOS = [
  { initial: 0, change: 1, expected: 1, description: 'Add first can' },
  {
    initial: 5,
    change: 3,
    expected: 8,
    description: 'Increase existing stock',
  },
  { initial: 10, change: -5, expected: 5, description: 'Decrease stock' },
  { initial: 1, change: -1, expected: 0, description: 'Remove last can' },
  { initial: 0, change: -1, expected: 0, description: 'Cannot go below zero' },
  { initial: 999, change: 1, expected: 999, description: 'Maximum limit test' },
] as const;

/**
 * Error simulation scenarios
 */
export const ERROR_SCENARIOS = {
  STORAGE_FULL: 'localStorage quota exceeded',
  INVALID_DATA: 'corrupted inventory data',
  NETWORK_ERROR: 'failed to save data',
  BROWSER_UNSUPPORTED: 'localStorage not supported',
} as const;

/**
 * Animation timing constants
 */
export const ANIMATION_TIMINGS = {
  MODAL_OPEN: 300,
  MODAL_CLOSE: 300,
  HOVER_TRANSITION: 150,
  BUTTON_FEEDBACK: 100,
} as const;

/**
 * Test timeouts for various operations
 */
export const TEST_TIMEOUTS = {
  SHORT: 1000,
  MEDIUM: 5000,
  LONG: 10000,
  NETWORK: 15000,
} as const;

/**
 * Keyboard shortcuts for testing
 */
export const KEYBOARD_SHORTCUTS = {
  CLOSE_MODAL: 'Escape',
  SAVE_MODAL: 'Enter',
  INCREMENT: 'ArrowUp',
  DECREMENT: 'ArrowDown',
  TAB: 'Tab',
  SHIFT_TAB: 'Shift+Tab',
} as const;

/**
 * CSS selectors for common elements
 */
export const SELECTORS = {
  APP_CONTAINER: '#app',
  COLOR_GRID: '.color-grid',
  COLOR_CARD: '.color-card',
  COLOR_PREVIEW: '.color-preview',
  COLOR_CODE: '.color-code',
  COLOR_NAME: '.color-name',
  COLOR_QUANTITY: '.color-quantity',
  QUANTITY_MODAL: '.quantity-modal',
  MODAL_OVERLAY: '.modal-overlay',
  LOADING_SPINNER: '.loading',
  ERROR_MESSAGE: '.error-message',
  SUCCESS_MESSAGE: '.success-message',
} as const;

/**
 * Expected text content for validation
 */
export const EXPECTED_TEXT = {
  APP_TITLE: 'Montana Hardcore Inventory',
  TOTAL_COLORS: '142',
  SAVE_BUTTON: 'Save',
  CANCEL_BUTTON: 'Cancel',
  CLEAR_BUTTON: 'Clear',
  RELOAD_BUTTON: 'Reload',
} as const;

/**
 * Generate test inventory with specific patterns
 */
export function generateTestInventory(
  pattern: 'empty' | 'full' | 'mixed' | 'low-stock' | 'out-of-stock'
): Record<string, number> {
  const colors = [
    TEST_COLORS.RV_252,
    TEST_COLORS.RV_100,
    TEST_COLORS.RV_9010,
    TEST_COLORS.RV_3020,
    TEST_COLORS.RV_5015,
    TEST_COLORS.RV_6029,
    TEST_COLORS.RV_4006,
    TEST_COLORS.RV_1013,
  ];

  switch (pattern) {
    case 'empty':
      return {};

    case 'full':
      return colors.reduce(
        (inventory, color) => {
          inventory[color] = Math.floor(Math.random() * 15) + 5; // 5-19 cans
          return inventory;
        },
        {} as Record<string, number>
      );

    case 'mixed':
      return colors.reduce(
        (inventory, color, index) => {
          inventory[color] =
            index % 3 === 0 ? 0 : Math.floor(Math.random() * 10) + 1;
          return inventory;
        },
        {} as Record<string, number>
      );

    case 'low-stock':
      return colors.reduce(
        (inventory, color) => {
          inventory[color] = 1;
          return inventory;
        },
        {} as Record<string, number>
      );

    case 'out-of-stock':
      return colors.reduce(
        (inventory, color) => {
          inventory[color] = 0;
          return inventory;
        },
        {} as Record<string, number>
      );

    default:
      return {};
  }
}
