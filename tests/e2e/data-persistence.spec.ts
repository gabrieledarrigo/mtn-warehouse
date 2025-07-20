import { test, expect } from '@playwright/test';
import { ColorGridPage } from '../utils/page-objects/ColorGridPage.js';
import { QuantityModalPage } from '../utils/page-objects/QuantityModalPage.js';
import { 
  clearInventoryData, 
  setInventoryData, 
  getInventoryData,
  waitForAppToLoad 
} from '../utils/test-helpers.js';
import { 
  TEST_COLORS, 
  SAMPLE_INVENTORY, 
  FULL_INVENTORY,
  generateTestInventory 
} from '../utils/fixtures/test-data.js';

/**
 * E2E Tests for US-006: Data Persistence
 * Testing LocalStorage persistence across browser sessions and data recovery
 */
test.describe('US-006: Data Persistence - LocalStorage', () => {
  let colorGridPage: ColorGridPage;
  let quantityModalPage: QuantityModalPage;

  test.beforeEach(async ({ page }) => {
    colorGridPage = new ColorGridPage(page);
    quantityModalPage = new QuantityModalPage(page);
    
    // Start with clean state
    await clearInventoryData(page);
  });

  test('should persist inventory data across page reloads', async ({ page }) => {
    await test.step('Set initial inventory data', async () => {
      await setInventoryData(page, SAMPLE_INVENTORY);
      await colorGridPage.goto();
    });

    await test.step('Verify initial data is displayed', async () => {
      for (const [colorCode, expectedQuantity] of Object.entries(SAMPLE_INVENTORY)) {
        const actualQuantity = await colorGridPage.getColorQuantity(colorCode);
        expect(actualQuantity).toBe(expectedQuantity);
      }
    });

    await test.step('Reload page and verify data persists', async () => {
      await page.reload();
      await waitForAppToLoad(page);
      
      // Verify all data is still there
      for (const [colorCode, expectedQuantity] of Object.entries(SAMPLE_INVENTORY)) {
        const actualQuantity = await colorGridPage.getColorQuantity(colorCode);
        expect(actualQuantity).toBe(expectedQuantity);
      }
    });

    await test.step('Verify localStorage contains correct data', async () => {
      const inventoryData = await getInventoryData(page);
      expect(inventoryData).toEqual(SAMPLE_INVENTORY);
    });
  });

  test('should save changes automatically after modal interactions', async ({ page }) => {
    const testColor = TEST_COLORS.RV_252;
    const initialQuantity = 5;
    const newQuantity = 12;

    await test.step('Set initial data and make a change', async () => {
      await setInventoryData(page, { [testColor]: initialQuantity });
      await colorGridPage.goto();
      
      // Make a change through the modal
      await colorGridPage.clickColorCard(testColor);
      await quantityModalPage.waitForOpen();
      await quantityModalPage.setQuantity(newQuantity);
      await quantityModalPage.saveQuantity();
    });

    await test.step('Verify change is immediately saved to localStorage', async () => {
      const inventoryData = await getInventoryData(page);
      expect(inventoryData[testColor]).toBe(newQuantity);
    });

    await test.step('Reload and verify persistence', async () => {
      await page.reload();
      await waitForAppToLoad(page);
      
      const displayedQuantity = await colorGridPage.getColorQuantity(testColor);
      expect(displayedQuantity).toBe(newQuantity);
    });
  });

  test('should handle multiple concurrent changes and persist correctly', async ({ page }) => {
    const testColors = [TEST_COLORS.RV_252, TEST_COLORS.RV_3020, TEST_COLORS.RV_5015];
    const changes = [10, 7, 3];

    await test.step('Start with empty inventory', async () => {
      await colorGridPage.goto();
    });

    await test.step('Make multiple changes in sequence', async () => {
      for (let i = 0; i < testColors.length; i++) {
        const color = testColors[i];
        const quantity = changes[i];
        
        await colorGridPage.clickColorCard(color);
        await quantityModalPage.waitForOpen();
        await quantityModalPage.setQuantity(quantity);
        await quantityModalPage.saveQuantity();
      }
    });

    await test.step('Verify all changes are saved', async () => {
      const inventoryData = await getInventoryData(page);
      
      for (let i = 0; i < testColors.length; i++) {
        expect(inventoryData[testColors[i]]).toBe(changes[i]);
      }
    });

    await test.step('Reload and verify all data persists', async () => {
      await page.reload();
      await waitForAppToLoad(page);
      
      for (let i = 0; i < testColors.length; i++) {
        const displayedQuantity = await colorGridPage.getColorQuantity(testColors[i]);
        expect(displayedQuantity).toBe(changes[i]);
      }
    });
  });

  test('should persist data across browser session simulation', async ({ page, context }) => {
    await test.step('Set up initial inventory', async () => {
      await setInventoryData(page, FULL_INVENTORY);
      await colorGridPage.goto();
    });

    await test.step('Verify initial data is displayed', async () => {
      for (const [colorCode, expectedQuantity] of Object.entries(FULL_INVENTORY)) {
        const actualQuantity = await colorGridPage.getColorQuantity(colorCode);
        expect(actualQuantity).toBe(expectedQuantity);
      }
    });

    await test.step('Simulate browser restart by creating new page', async () => {
      const newPage = await context.newPage();
      const newColorGridPage = new ColorGridPage(newPage);
      
      await newColorGridPage.goto();
      await waitForAppToLoad(newPage);
      
      // Verify data is still there in the new page
      for (const [colorCode, expectedQuantity] of Object.entries(FULL_INVENTORY)) {
        const actualQuantity = await newColorGridPage.getColorQuantity(colorCode);
        expect(actualQuantity).toBe(expectedQuantity);
      }
      
      await newPage.close();
    });
  });

  test('should handle localStorage quota and large datasets', async ({ page }) => {
    const largeInventory = generateTestInventory('full');
    
    await test.step('Store large inventory dataset', async () => {
      await setInventoryData(page, largeInventory);
      await colorGridPage.goto();
    });

    await test.step('Verify large dataset loads correctly', async () => {
      await waitForAppToLoad(page);
      
      // Test a few random entries from the large dataset
      const entries = Object.entries(largeInventory).slice(0, 5);
      for (const [colorCode, expectedQuantity] of entries) {
        const actualQuantity = await colorGridPage.getColorQuantity(colorCode);
        expect(actualQuantity).toBe(expectedQuantity);
      }
    });

    await test.step('Reload and verify large dataset persists', async () => {
      await page.reload();
      await waitForAppToLoad(page);
      
      const savedData = await getInventoryData(page);
      expect(Object.keys(savedData).length).toBeGreaterThan(0);
    });
  });

  test('should recover from corrupted localStorage data', async ({ page }) => {
    await test.step('Inject corrupted data into localStorage', async () => {
      await page.evaluate(() => {
        localStorage.setItem('montana-inventory', 'invalid-json-data');
      });
      
      await colorGridPage.goto();
    });

    await test.step('Verify app handles corrupted data gracefully', async () => {
      await waitForAppToLoad(page);
      
      // App should still load and show empty inventory
      const testColor = TEST_COLORS.RV_252;
      const quantity = await colorGridPage.getColorQuantity(testColor);
      expect(quantity).toBe(0);
    });

    await test.step('Verify app can save new data after corruption', async () => {
      const testColor = TEST_COLORS.RV_252;
      const newQuantity = 5;
      
      await colorGridPage.clickColorCard(testColor);
      await quantityModalPage.waitForOpen();
      await quantityModalPage.setQuantity(newQuantity);
      await quantityModalPage.saveQuantity();
      
      // Verify new data is saved correctly
      const inventoryData = await getInventoryData(page);
      expect(inventoryData[testColor]).toBe(newQuantity);
    });
  });

  test('should handle missing localStorage gracefully', async ({ page }) => {
    await test.step('Start with no localStorage data', async () => {
      await clearInventoryData(page);
      await colorGridPage.goto();
    });

    await test.step('Verify app loads with empty inventory', async () => {
      await waitForAppToLoad(page);
      
      // Check several colors to ensure they all show 0
      for (const colorCode of Object.values(TEST_COLORS).slice(0, 3)) {
        const quantity = await colorGridPage.getColorQuantity(colorCode);
        expect(quantity).toBe(0);
      }
    });

    await test.step('Verify localStorage is created after first save', async () => {
      const testColor = TEST_COLORS.RV_252;
      const quantity = 3;
      
      await colorGridPage.clickColorCard(testColor);
      await quantityModalPage.waitForOpen();
      await quantityModalPage.setQuantity(quantity);
      await quantityModalPage.saveQuantity();
      
      // Verify localStorage now contains data
      const inventoryData = await getInventoryData(page);
      expect(inventoryData[testColor]).toBe(quantity);
    });
  });

  test('should maintain data versioning and format consistency', async ({ page }) => {
    await test.step('Set initial data and verify format', async () => {
      await setInventoryData(page, SAMPLE_INVENTORY);
      await colorGridPage.goto();
      
      // Check the raw localStorage format
      const rawData = await page.evaluate(() => {
        return localStorage.getItem('montana-inventory');
      });
      
      expect(rawData).toBeTruthy();
      
      const parsedData = JSON.parse(rawData || '{}');
      expect(parsedData).toHaveProperty('items');
      expect(parsedData).toHaveProperty('version');
      expect(parsedData).toHaveProperty('lastUpdated');
    });

    await test.step('Make changes and verify format is maintained', async () => {
      const testColor = TEST_COLORS.RV_252;
      
      await colorGridPage.clickColorCard(testColor);
      await quantityModalPage.waitForOpen();
      await quantityModalPage.incrementQuantityBy(2);
      await quantityModalPage.saveQuantity();
      
      // Verify format is still correct after changes
      const rawData = await page.evaluate(() => {
        return localStorage.getItem('montana-inventory');
      });
      
      const parsedData = JSON.parse(rawData || '{}');
      expect(parsedData).toHaveProperty('items');
      expect(parsedData).toHaveProperty('version');
      expect(parsedData).toHaveProperty('lastUpdated');
      expect(parsedData.items[testColor]).toBe(SAMPLE_INVENTORY[testColor] + 2);
    });
  });

  test('should handle clear inventory functionality with persistence', async ({ page }) => {
    await test.step('Set up inventory data', async () => {
      await setInventoryData(page, SAMPLE_INVENTORY);
      await colorGridPage.goto();
    });

    await test.step('Clear inventory using action button', async () => {
      await colorGridPage.clickClearInventory();
      await page.reload();
      await waitForAppToLoad(page);
    });

    await test.step('Verify all data is cleared and persisted', async () => {
      // Check that all colors show 0 quantity
      for (const colorCode of Object.values(TEST_COLORS)) {
        const quantity = await colorGridPage.getColorQuantity(colorCode);
        expect(quantity).toBe(0);
      }
      
      // Verify localStorage is cleared or empty
      const inventoryData = await getInventoryData(page);
      expect(Object.keys(inventoryData).length).toBe(0);
    });

    await test.step('Verify cleared state persists across reload', async () => {
      await page.reload();
      await waitForAppToLoad(page);
      
      const testColor = TEST_COLORS.RV_252;
      const quantity = await colorGridPage.getColorQuantity(testColor);
      expect(quantity).toBe(0);
    });
  });
});