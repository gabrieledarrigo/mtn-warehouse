/**
 * Test data fixtures for Montana Hardcore Inventory testing
 */

/**
 * Sample Montana Hardcore color codes for testing
 * These should match actual colors in the database
 */
export const TEST_COLORS = {
  // Common colors that should exist in the Montana Hardcore database
  RV_252: 'RV-252', // Unicorn Yellow (unique)
  RV_1013: 'RV-1013', // Bone White (out of stock test)
  RV_9010: 'RV-9010', // Divinity White
  RV_222: 'RV-222', // Beach Yellow (unique)
  RV_239: 'RV-239', // Luxor Yellow (unique)
  RV_11: 'RV-11', // Ganges Yellow (unique)
  RV_206: 'RV-206', // Atacama Yellow (unique)
  RV_1021: 'RV-1021', // Light Yellow
} as const;

/**
 * Sample inventory data for testing
 */
export const SAMPLE_INVENTORY = {
  [TEST_COLORS.RV_252]: 5, // Unicorn Yellow - 5 cans
  [TEST_COLORS.RV_1013]: 0, // Bone White - out of stock
  [TEST_COLORS.RV_9010]: 1, // Divinity White - low stock
  [TEST_COLORS.RV_222]: 10, // Beach Yellow - well stocked
  [TEST_COLORS.RV_239]: 3, // Luxor Yellow - medium stock
  // RV_11 and RV_206 not set (default to 0)
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
