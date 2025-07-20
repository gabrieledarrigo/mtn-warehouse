import { Page, expect } from '@playwright/test';

/**
 * Test utilities for Montana Hardcore Inventory testing
 */

/**
 * Wait for the application to be fully loaded
 */
export async function waitForAppToLoad(page: Page): Promise<void> {
  // Wait for the main app container to be visible
  await page.waitForSelector('#app', { state: 'visible' });
  
  // Wait for the color grid to be populated with colors
  await page.waitForSelector('.color-grid .color-card', { state: 'visible' });
  
  // Wait for any loading states to complete
  await page.waitForLoadState('networkidle');
}

/**
 * Clear localStorage to start with a clean state
 */
export async function clearInventoryData(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.clear();
  });
}

/**
 * Set specific inventory data for testing
 */
export async function setInventoryData(page: Page, inventory: Record<string, number>): Promise<void> {
  await page.evaluate((inventoryData) => {
    const data = {
      items: inventoryData,
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem('montana-inventory', JSON.stringify(data));
  }, inventory);
}

/**
 * Get current inventory data from localStorage
 */
export async function getInventoryData(page: Page): Promise<Record<string, number>> {
  return await page.evaluate(() => {
    const data = localStorage.getItem('montana-inventory');
    if (!data) return {};
    try {
      const parsed = JSON.parse(data);
      return parsed.items || {};
    } catch {
      return {};
    }
  });
}

/**
 * Wait for modal to be visible and fully animated
 */
export async function waitForModal(page: Page, isVisible: boolean = true): Promise<void> {
  const selector = '.quantity-modal';
  if (isVisible) {
    await page.waitForSelector(selector, { state: 'visible' });
    // Wait for any CSS animations to complete
    await page.waitForTimeout(300);
  } else {
    await page.waitForSelector(selector, { state: 'hidden' });
  }
}

/**
 * Take a screenshot with descriptive name
 */
export async function takeScreenshot(page: Page, name: string): Promise<void> {
  await page.screenshot({
    path: `test-results/screenshots/${name}-${Date.now()}.png`,
    fullPage: true,
  });
}

/**
 * Assert that all Montana Hardcore colors are displayed
 */
export async function assertAllColorsDisplayed(page: Page): Promise<void> {
  // Montana Hardcore has 142 colors
  const colorCards = page.locator('.color-card');
  await expect(colorCards).toHaveCount(142);
  
  // Verify that each card has the required elements
  const firstCard = colorCards.first();
  await expect(firstCard.locator('.color-preview')).toBeVisible();
  await expect(firstCard.locator('.color-code')).toBeVisible();
  await expect(firstCard.locator('.color-quantity')).toBeVisible();
}

/**
 * Get color card by RV code
 */
export function getColorCard(page: Page, rvCode: string) {
  return page.locator(`.color-card:has(.color-code:text("${rvCode}"))`);
}

/**
 * Assert responsive design at different screen sizes
 */
export async function assertResponsiveDesign(page: Page): Promise<void> {
  // Desktop view
  await page.setViewportSize({ width: 1200, height: 800 });
  await waitForAppToLoad(page);
  await expect(page.locator('.color-grid')).toBeVisible();
  
  // Tablet view
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.waitForTimeout(500); // Wait for responsive layout
  await expect(page.locator('.color-grid')).toBeVisible();
  
  // Mobile view
  await page.setViewportSize({ width: 375, height: 667 });
  await page.waitForTimeout(500);
  await expect(page.locator('.color-grid')).toBeVisible();
}

/**
 * Test data constants
 */
export const TEST_COLORS = {
  RV_252: 'RV-252', // Example color code
  RV_100: 'RV-100', // Another example
  RV_300: 'RV-300', // Third example
} as const;

/**
 * Test timeout constants
 */
export const TIMEOUTS = {
  SHORT: 1000,
  MEDIUM: 5000,
  LONG: 10000,
  ANIMATION: 300,
} as const;