import { expect, Page } from '@playwright/test';

const STORAGE_KEY = 'mtn-inventory';

/**
 * Test utilities for Montana Hardcore Inventory testing
 */

/**
 * Wait for the application to be fully loaded
 */
export async function waitForAppToLoad(page: Page): Promise<void> {
  await page.waitForSelector('#app', { state: 'visible' });
  await page.waitForSelector('[data-testid="color-grid"]', { state: 'visible' });
  await page.waitForSelector('[data-testid="color-card"]', { state: 'visible' });
  await page.waitForLoadState('networkidle');
}

/**
 * Clear localStorage to start with a clean state
 */
export async function clearInventoryData(page: Page): Promise<void> {
  await page.evaluate(key => {
    localStorage.removeItem(key);
  }, STORAGE_KEY);
}

/**
 * Set inventory data in localStorage using the app's expected format
 */
export async function setInventoryData(
  page: Page,
  data: Record<string, number>
): Promise<void> {
  await page.evaluate(
    ({ data, key }) => {
      const inventoryData = {
        items: data,
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(key, JSON.stringify(inventoryData));
    },
    { data, key: STORAGE_KEY }
  );
}

/**
 * Get inventory data from localStorage using the app's expected format
 */
export async function getInventoryData(
  page: Page
): Promise<Record<string, number>> {
  return await page.evaluate(key => {
    const stored = localStorage.getItem(key);
    if (!stored) {
      return {};
    }
    try {
      const data = JSON.parse(stored);
      return data.items || {};
    } catch {
      return {};
    }
  }, STORAGE_KEY);
}

/**
 * Wait for modal to be visible and fully animated
 */
export async function waitForModal(
  page: Page,
  isVisible: boolean = true
): Promise<void> {
  const selector = '[data-testid="quantity-modal"]';
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
 * Get color card by RV code
 */
export function getColorCard(page: Page, rvCode: string) {
  return page.locator(`[data-color-code="${rvCode}"]`);
}

/**
 * Assert responsive design at different screen sizes
 */
export async function assertResponsiveDesign(page: Page): Promise<void> {
  // Desktop view
  await page.setViewportSize({ width: 1200, height: 800 });
  await waitForAppToLoad(page);

  await expect(page.getByTestId('color-grid')).toBeVisible();

  // Tablet view
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.waitForTimeout(500); // Wait for responsive layout

  await expect(page.getByTestId('color-grid')).toBeVisible();

  // Mobile view
  await page.setViewportSize({ width: 375, height: 667 });
  await page.waitForTimeout(500);

  await expect(page.getByTestId('color-grid')).toBeVisible();
}