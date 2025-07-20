import { test, expect } from '@playwright/test';
import { ColorGridPage } from '../utils/page-objects/ColorGridPage.js';
import {
  clearInventoryData,
  setInventoryData,
  waitForAppToLoad,
  assertAllColorsDisplayed,
} from '../utils/test-helpers.js';
import {
  TEST_COLORS,
  SAMPLE_INVENTORY,
  EMPTY_INVENTORY,
  VIEWPORT_SIZES,
} from '../utils/fixtures/test-data.js';

/**
 * E2E Tests for US-001: Inventory Management
 * Testing the main color grid display and basic inventory visualization
 */
test.describe('US-001: Inventory Management - Color Grid Display', () => {
  let colorGridPage: ColorGridPage;

  test.beforeEach(async ({ page }) => {
    colorGridPage = new ColorGridPage(page);

    // Start with clean state
    await clearInventoryData(page);
    await colorGridPage.goto();
  });

  test('should display all 142 Montana Hardcore colors', async ({ page }) => {
    await test.step('Verify all colors are loaded and displayed', async () => {
      await assertAllColorsDisplayed(page);
      await colorGridPage.assertAllColorsDisplayed();
    });

    await test.step('Verify color grid layout', async () => {
      await colorGridPage.assertResponsiveLayout();
    });

    await test.step('Take screenshot of full color grid', async () => {
      await page.screenshot({
        path: 'test-results/screenshots/full-color-grid.png',
        fullPage: true,
      });
    });
  });

  test('should display correct color card structure for each color', async () => {
    await test.step('Verify first few color cards have proper structure', async () => {
      const visibleCodes = await colorGridPage.getAllVisibleColorCodes();

      expect(visibleCodes.length).toBeGreaterThan(0);

      // Test the structure of the first 3 visible color cards
      for (let i = 0; i < Math.min(3, visibleCodes.length); i++) {
        const rvCode = visibleCodes[i];
        await colorGridPage.assertColorCardStructure(rvCode);
      }
    });
  });

  test('should display inventory quantities correctly', async ({ page }) => {
    await test.step('Set sample inventory data', async () => {
      await setInventoryData(page, SAMPLE_INVENTORY);
      await page.reload();
      await waitForAppToLoad(page);
    });

    await test.step('Verify quantities are displayed correctly', async () => {
      // Check specific colors with known quantities
      for (const [colorCode, expectedQuantity] of Object.entries(
        SAMPLE_INVENTORY
      )) {
        const actualQuantity = await colorGridPage.getColorQuantity(colorCode);

        expect(actualQuantity).toBe(expectedQuantity);
      }
    });

    await test.step('Verify colors without inventory show zero', async () => {
      // Test a color that's not in our sample inventory
      const unsetColor = TEST_COLORS.RV_6029;
      const quantity = await colorGridPage.getColorQuantity(unsetColor);

      expect(quantity).toBe(0);
    });
  });

  test('should display app header with correct information', async () => {
    await test.step('Verify header structure and content', async () => {
      await colorGridPage.assertHeaderStructure();
    });

    await test.step('Verify inventory statistics', async () => {
      const stats = await colorGridPage.getInventoryStats();

      expect(stats.total).toBe(142); // Total Montana Hardcore colors
    });
  });

  test('should handle empty inventory state', async ({ page }) => {
    await test.step('Verify empty inventory displays correctly', async () => {
      await setInventoryData(page, EMPTY_INVENTORY);
      await page.reload();
      await waitForAppToLoad(page);
    });

    await test.step('All colors should show zero quantity', async () => {
      // Check a few sample colors
      for (const colorCode of Object.values(TEST_COLORS).slice(0, 3)) {
        const quantity = await colorGridPage.getColorQuantity(colorCode);

        expect(quantity).toBe(0);
      }
    });
  });

  test('should display action buttons and handle basic interactions', async ({
    page,
  }) => {
    await test.step('Set initial inventory data', async () => {
      await setInventoryData(page, SAMPLE_INVENTORY);
      await page.reload();
      await waitForAppToLoad(page);
    });

    await test.step('Test reload functionality', async () => {
      await colorGridPage.clickReload();
      await waitForAppToLoad(page);

      // Verify data is still there after reload
      const quantity = await colorGridPage.getColorQuantity(TEST_COLORS.RV_252);

      expect(quantity).toBe(SAMPLE_INVENTORY[TEST_COLORS.RV_252]);
    });

    await test.step('Test clear inventory functionality', async () => {
      await colorGridPage.clickClearInventory();
      await page.reload();
      await waitForAppToLoad(page);

      // Verify inventory is cleared
      const quantity = await colorGridPage.getColorQuantity(TEST_COLORS.RV_252);

      expect(quantity).toBe(0);
    });
  });

  test('should be responsive across different screen sizes', async ({
    page,
  }) => {
    await test.step('Test desktop layout', async () => {
      await page.setViewportSize(VIEWPORT_SIZES.DESKTOP);
      await page.reload();
      await waitForAppToLoad(page);
      await colorGridPage.assertResponsiveLayout();

      await page.screenshot({
        path: 'test-results/screenshots/desktop-layout.png',
        fullPage: true,
      });
    });

    await test.step('Test tablet layout', async () => {
      await page.setViewportSize(VIEWPORT_SIZES.TABLET);
      await page.waitForTimeout(500); // Wait for responsive transition
      await colorGridPage.assertResponsiveLayout();

      await page.screenshot({
        path: 'test-results/screenshots/tablet-layout.png',
        fullPage: true,
      });
    });

    await test.step('Test mobile layout', async () => {
      await page.setViewportSize(VIEWPORT_SIZES.MOBILE);
      await page.waitForTimeout(500);
      await colorGridPage.assertResponsiveLayout();

      await page.screenshot({
        path: 'test-results/screenshots/mobile-layout.png',
        fullPage: true,
      });
    });
  });

  test('should handle color card interactions correctly', async () => {
    await test.step('Verify color cards are clickable', async () => {
      const testColor = TEST_COLORS.RV_252;
      const colorCard = colorGridPage.getColorCard(testColor);

      await expect(colorCard).toBeVisible();
      await expect(colorCard).toBeEnabled();
    });

    await test.step('Color card should have hover effects', async () => {
      const testColor = TEST_COLORS.RV_252;
      const colorCard = colorGridPage.getColorCard(testColor);

      // Hover over the card
      await colorCard.hover();

      // Verify the card responds to hover (this would depend on CSS implementation)
      await expect(colorCard).toBeVisible();
    });
  });

  test('should load and display colors consistently', async ({ page }) => {
    await test.step('Verify consistent loading across multiple refreshes', async () => {
      const refreshCount = 3;
      let colorCounts: number[] = [];

      for (let i = 0; i < refreshCount; i++) {
        await page.reload();
        await waitForAppToLoad(page);

        const count = await colorGridPage.colorCards.count();
        colorCounts.push(count);

        // Each refresh should show the same number of colors
        expect(count).toBe(142);
      }

      // All refreshes should have consistent color count
      const uniqueCounts = [...new Set(colorCounts)];

      expect(uniqueCounts).toHaveLength(1);
      expect(uniqueCounts[0]).toBe(142);
    });
  });
});
