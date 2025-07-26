import { test, expect } from '@playwright/test';
import { ColorGridPage } from '../pages/ColorGridPage.js';
import { QuantityModalPage } from '../pages/QuantityModalPage.js';
import {
  clearInventoryData,
  setInventoryData,
  getInventoryData,
  waitForAppToLoad,
} from '../helpers.js';
import {
  TEST_COLORS,
  SAMPLE_INVENTORY,
  VIEWPORT_SIZES,
} from '../fixtures/data.js';

/**
 * Consolidated E2E Tests for Montana Hardcore Inventory
 * Essential functionality tests covering core features
 */
test.describe('Montana Hardcore Inventory - Essential Features', () => {
  let colorGridPage: ColorGridPage;
  let quantityModalPage: QuantityModalPage;

  test.beforeEach(async ({ page }) => {
    colorGridPage = new ColorGridPage(page);
    quantityModalPage = new QuantityModalPage(page);

    // Navigate and ensure clean state
    await colorGridPage.goto();
    await clearInventoryData(page);
  });

  test('should display all 128 Montana colors correctly', async ({ page }) => {
    await test.step('Verify all colors are loaded and displayed', async () => {
      await colorGridPage.assertAllColorsDisplayed();
    });

    await test.step('Verify color cards have proper structure', async () => {
      const firstCard = colorGridPage.colorCards.first();
      await expect(firstCard.locator('.preview')).toBeVisible();
      await expect(firstCard.locator('.code')).toBeVisible();
      await expect(firstCard.locator('.quantity')).toBeVisible();
    });

    await test.step('Verify app header and layout', async () => {
      await expect(colorGridPage.appHeader).toBeVisible();
      await expect(colorGridPage.colorGrid).toBeVisible();
    });
  });

  test('should handle complete quantity modal workflow', async ({ page }) => {
    await test.step('Set initial inventory and reload', async () => {
      await setInventoryData(page, SAMPLE_INVENTORY);
      await page.reload();
    });

    await test.step('Open modal by clicking color card', async () => {
      const testColor = TEST_COLORS.RV_252;
      await colorGridPage.clickColorCard(testColor);
      await quantityModalPage.waitForOpen();
      await quantityModalPage.assertModalOpen(testColor);
    });

    await test.step('Verify initial quantity and increment', async () => {
      const initialQuantity = await quantityModalPage.getCurrentQuantity();
      expect(initialQuantity).toBe(SAMPLE_INVENTORY[TEST_COLORS.RV_252]);

      await quantityModalPage.incrementQuantityBy(3);
      const newQuantity = await quantityModalPage.getCurrentQuantity();
      expect(newQuantity).toBe(initialQuantity + 3);
    });

    await test.step('Save changes and verify persistence', async () => {
      await quantityModalPage.saveQuantity();

      const updatedQuantity = await colorGridPage.getColorQuantity(TEST_COLORS.RV_252);
      expect(updatedQuantity).toBe(SAMPLE_INVENTORY[TEST_COLORS.RV_252] + 3);
    });

    await test.step('Test cancel functionality', async () => {
      await colorGridPage.clickColorCard(TEST_COLORS.RV_1001);
      await quantityModalPage.waitForOpen();

      await quantityModalPage.incrementQuantityBy(5);
      await quantityModalPage.cancelChanges();

      const unchangedQuantity = await colorGridPage.getColorQuantity(TEST_COLORS.RV_1001);
      expect(unchangedQuantity).toBe(SAMPLE_INVENTORY[TEST_COLORS.RV_1001] || 0);
    });
  });

  test('should persist data across page reloads', async ({ page }) => {
    await test.step('Set test inventory data', async () => {
      await setInventoryData(page, SAMPLE_INVENTORY);
      await page.reload();
    });

    await test.step('Verify data persists after reload', async () => {
      for (const [colorCode, expectedQuantity] of Object.entries(SAMPLE_INVENTORY)) {
        const actualQuantity = await colorGridPage.getColorQuantity(colorCode);
        expect(actualQuantity).toBe(expectedQuantity);
      }
    });

    await test.step('Make changes and verify automatic persistence', async () => {
      const testColor = TEST_COLORS.RV_252;
      await colorGridPage.clickColorCard(testColor);
      await quantityModalPage.waitForOpen();
      await quantityModalPage.incrementQuantityBy(2);
      await quantityModalPage.saveQuantity();

      // Reload page and verify changes persisted
      await page.reload();
      const persistedQuantity = await colorGridPage.getColorQuantity(testColor);
      expect(persistedQuantity).toBe(SAMPLE_INVENTORY[testColor] + 2);
    });

    await test.step('Verify localStorage data format', async () => {
      const storedData = await getInventoryData(page);
      expect(typeof storedData).toBe('object');
      expect(storedData[TEST_COLORS.RV_252]).toBe(SAMPLE_INVENTORY[TEST_COLORS.RV_252] + 2);
    });
  });

  test('should work correctly on mobile viewport', async ({ page }) => {
    await test.step('Set mobile viewport', async () => {
      await page.setViewportSize(VIEWPORT_SIZES.MOBILE);
      await setInventoryData(page, SAMPLE_INVENTORY);
      await page.reload();
    });

    await test.step('Verify mobile layout', async () => {
      await expect(colorGridPage.colorGrid).toBeVisible();
      await expect(colorGridPage.colorCards.first()).toBeVisible();
    });

    await test.step('Test mobile modal interaction', async () => {
      const testColor = TEST_COLORS.RV_252;
      await colorGridPage.clickColorCard(testColor);
      await quantityModalPage.waitForOpen();

      // Modal should be visible and functional on mobile
      await expect(quantityModalPage.modal).toBeVisible();
      await expect(quantityModalPage.incrementButton).toBeVisible();
      await expect(quantityModalPage.decrementButton).toBeVisible();

      await quantityModalPage.incrementQuantityBy(1);
      await quantityModalPage.saveQuantity();
    });

    await test.step('Verify touch interactions work', async () => {
      // Test that buttons are touch-friendly and functional
      const updatedQuantity = await colorGridPage.getColorQuantity(TEST_COLORS.RV_252);
      expect(updatedQuantity).toBe(SAMPLE_INVENTORY[TEST_COLORS.RV_252] + 1);
    });
  });

  test('should handle basic error scenarios gracefully', async ({ page }) => {
    await test.step('Handle localStorage unavailable', async () => {
      // Simulate localStorage being unavailable
      await page.evaluate(() => {
        Object.defineProperty(window, 'localStorage', {
          value: null,
          writable: false
        });
      });

      await colorGridPage.goto();

      // App should still load and display colors even without localStorage
      await expect(colorGridPage.colorGrid).toBeVisible();
      await colorGridPage.assertAllColorsDisplayed();
    });

    await test.step('Handle invalid data gracefully', async () => {
      // Reset localStorage to working state
      await page.reload();

      // Set invalid data in localStorage
      await page.evaluate(() => {
        localStorage.setItem('mtn-inventory', 'invalid-json-data');
      });

      await page.reload();

      // App should handle invalid data and still work
      await expect(colorGridPage.colorGrid).toBeVisible();

      // Should default to 0 quantities for all colors
      const testQuantity = await colorGridPage.getColorQuantity(TEST_COLORS.RV_252);
      expect(testQuantity).toBe(0);
    });

    await test.step('Verify modal handles edge cases', async () => {
      await colorGridPage.clickColorCard(TEST_COLORS.RV_252);
      await quantityModalPage.waitForOpen();

      // Try to set negative quantity - should prevent it
      const currentQuantity = await quantityModalPage.getCurrentQuantity();
      if (currentQuantity === 0) {
        // Verify the decrement button is disabled when quantity is 0
        await expect(quantityModalPage.decrementButton).toBeDisabled();
        const finalQuantity = await quantityModalPage.getCurrentQuantity();
        expect(finalQuantity).toBe(0); // Should remain at 0
      }

      await quantityModalPage.cancelChanges();
    });
  });

  test('should maintain consistent performance', async ({ page }) => {
    await test.step('Load app and measure initial load time', async () => {
      const startTime = Date.now();
      await colorGridPage.goto();
      await waitForAppToLoad(page);
      const loadTime = Date.now() - startTime;

      // App should load within reasonable time (less than 5 seconds)
      expect(loadTime).toBeLessThan(5000);
    });

    await test.step('Test rapid modal interactions', async () => {
      await setInventoryData(page, SAMPLE_INVENTORY);
      await page.reload();

      // Rapidly open and close modal multiple times
      for (let i = 0; i < 3; i++) {
        await colorGridPage.clickColorCard(TEST_COLORS.RV_252);
        await quantityModalPage.waitForOpen();
        await quantityModalPage.clickIncrement();
        await quantityModalPage.saveQuantity();
      }

      // Final quantity should be original + 3
      const finalQuantity = await colorGridPage.getColorQuantity(TEST_COLORS.RV_252);
      expect(finalQuantity).toBe(SAMPLE_INVENTORY[TEST_COLORS.RV_252] + 3);
    });

    await test.step('Verify data integrity after stress test', async () => {
      // Reload page and verify all data is still correct
      await page.reload();

      const storedQuantity = await colorGridPage.getColorQuantity(TEST_COLORS.RV_252);
      expect(storedQuantity).toBe(SAMPLE_INVENTORY[TEST_COLORS.RV_252] + 3);

      // Verify localStorage is not corrupted
      const storedData = await getInventoryData(page);
      expect(typeof storedData).toBe('object');
      expect(Object.keys(storedData).length).toBeGreaterThan(0);
    });
  });
});