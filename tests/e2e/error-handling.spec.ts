import { test, expect } from '@playwright/test';
import { ColorGridPage } from '../utils/page-objects/ColorGridPage.js';
import { QuantityModalPage } from '../utils/page-objects/QuantityModalPage.js';
import { 
  clearInventoryData, 
  setInventoryData, 
  waitForAppToLoad 
} from '../utils/test-helpers.js';
import { 
  TEST_COLORS, 
  SAMPLE_INVENTORY,
  ERROR_SCENARIOS 
} from '../utils/fixtures/test-data.js';

/**
 * E2E Tests for US-008: Error Handling
 * Testing graceful error handling and recovery scenarios
 */
test.describe('US-008: Error Handling - Application Resilience', () => {
  let colorGridPage: ColorGridPage;
  let quantityModalPage: QuantityModalPage;

  test.beforeEach(async ({ page }) => {
    colorGridPage = new ColorGridPage(page);
    quantityModalPage = new QuantityModalPage(page);
  });

  test('should handle corrupted localStorage data gracefully', async ({ page }) => {
    await test.step('Inject corrupted localStorage data', async () => {
      await page.evaluate(() => {
        // Set corrupted data in localStorage
        localStorage.setItem('montana-inventory', 'invalid-json-data-{broken}');
      });
    });

    await test.step('Verify app loads with graceful fallback', async () => {
      await colorGridPage.goto();
      await waitForAppToLoad(page);
      
      // App should load successfully despite corrupted data
      await expect(colorGridPage.colorGrid).toBeVisible();
      await expect(colorGridPage.colorCards.first()).toBeVisible();
    });

    await test.step('Verify app shows default empty state', async () => {
      // With corrupted data, quantities should default to 0
      const testColor = TEST_COLORS.RV_252;
      const quantity = await colorGridPage.getColorQuantity(testColor);
      
      expect(quantity).toBe(0);
    });

    await test.step('Verify app can recover and save new data', async () => {
      const testColor = TEST_COLORS.RV_252;
      const newQuantity = 5;
      
      // Should be able to make changes despite initial corruption
      await colorGridPage.clickColorCard(testColor);
      await quantityModalPage.waitForOpen();
      await quantityModalPage.setQuantity(newQuantity);
      await quantityModalPage.saveQuantity();
      
      // Verify the change persists
      await page.reload();
      await waitForAppToLoad(page);
      
      const savedQuantity = await colorGridPage.getColorQuantity(testColor);
      
      expect(savedQuantity).toBe(newQuantity);
    });
  });

  test('should handle network connectivity issues', async ({ page }) => {
    await test.step('Set up initial data and go offline', async () => {
      await setInventoryData(page, SAMPLE_INVENTORY);
      await colorGridPage.goto();
      
      // Simulate offline condition
      await page.route('**/*', route => route.abort());
    });

    await test.step('Verify app continues to function offline', async () => {
      // App should continue to work with existing data
      await expect(colorGridPage.colorGrid).toBeVisible();
      
      const testColor = TEST_COLORS.RV_252;
      const initialQuantity = SAMPLE_INVENTORY[testColor];
      const displayedQuantity = await colorGridPage.getColorQuantity(testColor);
      
      expect(displayedQuantity).toBe(initialQuantity);
    });

    await test.step('Verify offline modal functionality', async () => {
      const testColor = TEST_COLORS.RV_252;
      
      await colorGridPage.clickColorCard(testColor);
      await quantityModalPage.waitForOpen();
      await quantityModalPage.incrementQuantityBy(2);
      await quantityModalPage.saveQuantity();
      
      // Changes should still work offline
      const newQuantity = await colorGridPage.getColorQuantity(testColor);
      
      expect(newQuantity).toBe(SAMPLE_INVENTORY[testColor] + 2);
    });
  });

  test('should handle invalid quantity inputs gracefully', async ({ page }) => {
    await test.step('Set up test environment', async () => {
      await clearInventoryData(page);
      await colorGridPage.goto();
    });

    await test.step('Test invalid quantity input handling', async () => {
      const testColor = TEST_COLORS.RV_252;
      
      await colorGridPage.clickColorCard(testColor);
      await quantityModalPage.waitForOpen();
      
      // Test various invalid inputs
      const invalidInputs = ['abc', '-5', '999999', '', 'null', 'undefined'];
      
      for (const invalidInput of invalidInputs) {
        await quantityModalPage.quantityInput.clear();
        await quantityModalPage.quantityInput.fill(invalidInput);
        await quantityModalPage.quantityInput.blur();
        
        // App should handle the invalid input gracefully
        const currentValue = await quantityModalPage.getCurrentQuantity();
        
        expect(currentValue).toBeGreaterThanOrEqual(0);
        
        expect(currentValue).toBeLessThanOrEqual(999);
      }
      
      await quantityModalPage.cancelChanges();
    });
  });

  test('should provide meaningful error feedback to users', async ({ page }) => {
    await test.step('Test error state visibility', async () => {
      await colorGridPage.goto();
      
      // Check if the app loads without showing error states initially
      await expect(colorGridPage.colorGrid).toBeVisible();
      
      // No error messages should be visible in normal operation
      const errorMessages = page.locator('.error-message, .error, [role="alert"]');
      const errorCount = await errorMessages.count();
      
      expect(errorCount).toBe(0);
    });

    await test.step('Test recovery after error simulation', async () => {
      // Simulate an error condition and test recovery
      await page.evaluate(() => {
        // Temporarily break localStorage
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = () => { throw new Error('Storage quota exceeded'); };
        
        // Restore after a short time
        setTimeout(() => {
          localStorage.setItem = originalSetItem;
        }, 1000);
      });
      
      const testColor = TEST_COLORS.RV_252;
      
      // Try to make a change during the error condition
      await colorGridPage.clickColorCard(testColor);
      await quantityModalPage.waitForOpen();
      await quantityModalPage.incrementQuantityBy(1);
      
      // Wait for localStorage to be restored
      await page.waitForTimeout(1100);
      
      // Try to save now
      await quantityModalPage.saveQuantity();
      
      // App should recover gracefully
      await expect(colorGridPage.colorGrid).toBeVisible();
    });
  });

  test('should maintain data integrity during error conditions', async ({ page }) => {
    await test.step('Set up initial data', async () => {
      await setInventoryData(page, SAMPLE_INVENTORY);
      await colorGridPage.goto();
    });

    await test.step('Verify data integrity during simulated errors', async () => {
      // Verify initial state
      for (const [colorCode, expectedQuantity] of Object.entries(SAMPLE_INVENTORY)) {
        const actualQuantity = await colorGridPage.getColorQuantity(colorCode);
        
        expect(actualQuantity).toBe(expectedQuantity);
      }
      
      // Simulate various error conditions and verify data remains intact
      await page.evaluate(() => {
        // Inject some console errors (these shouldn't affect functionality)
        console.error('Simulated error for testing');
      });
      
      // Verify data is still correct after error simulation
      const testColor = TEST_COLORS.RV_252;
      const quantity = await colorGridPage.getColorQuantity(testColor);
      
      expect(quantity).toBe(SAMPLE_INVENTORY[testColor]);
    });
  });

  test('should handle edge cases in modal interactions', async ({ page }) => {
    await test.step('Test modal edge cases', async () => {
      await clearInventoryData(page);
      await colorGridPage.goto();
      
      const testColor = TEST_COLORS.RV_252;
      
      // Test opening modal on color with no quantity
      await colorGridPage.clickColorCard(testColor);
      await quantityModalPage.waitForOpen();
      
      const initialQuantity = await quantityModalPage.getCurrentQuantity();
      
      expect(initialQuantity).toBe(0);
      
      // Test extreme values
      await quantityModalPage.setQuantity(999);
      const maxQuantity = await quantityModalPage.getCurrentQuantity();
      
      expect(maxQuantity).toBeLessThanOrEqual(999);
      
      await quantityModalPage.cancelChanges();
    });

    await test.step('Test modal keyboard navigation edge cases', async () => {
      const testColor = TEST_COLORS.RV_252;
      
      await colorGridPage.clickColorCard(testColor);
      await quantityModalPage.waitForOpen();
      
      // Test multiple escape presses
      await page.keyboard.press('Escape');
      await page.keyboard.press('Escape');
      
      // Modal should be closed and app should be stable
      await expect(quantityModalPage.modal).toBeHidden();
      await expect(colorGridPage.colorGrid).toBeVisible();
    });
  });
});