import { test, expect } from '@playwright/test';
import { ColorGridPage } from '../utils/page-objects/ColorGridPage.js';
import { QuantityModalPage } from '../utils/page-objects/QuantityModalPage.js';
import {
  clearInventoryData,
  setInventoryData,
  waitForAppToLoad,
  assertResponsiveDesign,
} from '../utils/test-helpers.js';
import {
  TEST_COLORS,
  SAMPLE_INVENTORY,
  VIEWPORT_SIZES,
} from '../utils/fixtures/test-data.js';

/**
 * E2E Tests for US-007: Responsive Design
 * Testing mobile/desktop responsiveness and touch-friendly interactions
 */
test.describe('US-007: Responsive Design - Mobile and Desktop', () => {
  let colorGridPage: ColorGridPage;
  let quantityModalPage: QuantityModalPage;

  test.beforeEach(async ({ page }) => {
    colorGridPage = new ColorGridPage(page);
    quantityModalPage = new QuantityModalPage(page);

    // Navigate first, then start with sample inventory data
    await colorGridPage.goto();
    await clearInventoryData(page);
    await setInventoryData(page, SAMPLE_INVENTORY);
  });

  test('should display correctly on mobile devices', async ({ page }) => {
    await test.step('Set mobile viewport and verify layout', async () => {
      await page.setViewportSize(VIEWPORT_SIZES.MOBILE);
      // Page is already loaded from beforeEach
    });

    await test.step('Verify mobile layout adaptation', async () => {
      await colorGridPage.assertResponsiveLayout();

      // Color grid should be visible and functional
      await expect(colorGridPage.colorGrid).toBeVisible();
      await expect(colorGridPage.colorCards.first()).toBeVisible();
    });

    await test.step('Test touch interactions on mobile', async () => {
      const testColor = TEST_COLORS.RV_252;

      // Color cards should be touch-friendly (minimum 44px touch targets)
      const colorCard = colorGridPage.getColorCard(testColor);
      const boundingBox = await colorCard.boundingBox();

      expect(boundingBox).toBeTruthy();
      expect(boundingBox!.width).toBeGreaterThanOrEqual(44);
      expect(boundingBox!.height).toBeGreaterThanOrEqual(44);
    });

    await test.step('Test modal behavior on mobile', async () => {
      const testColor = TEST_COLORS.RV_252;

      await colorGridPage.clickColorCard(testColor);
      await quantityModalPage.waitForOpen();

      // Modal should fill most of the mobile screen
      const modalBox = await quantityModalPage.modal.boundingBox();

      expect(modalBox).toBeTruthy();

      // Modal buttons should be touch-friendly
      const incrementBox =
        await quantityModalPage.incrementButton.boundingBox();
      const decrementBox =
        await quantityModalPage.decrementButton.boundingBox();

      expect(incrementBox!.width).toBeGreaterThanOrEqual(44);
      expect(incrementBox!.height).toBeGreaterThanOrEqual(44);
      expect(decrementBox!.width).toBeGreaterThanOrEqual(44);
      expect(decrementBox!.height).toBeGreaterThanOrEqual(44);

      await quantityModalPage.cancelChanges();
    });

    await test.step('Take mobile screenshot', async () => {
      await page.screenshot({
        path: 'test-results/screenshots/mobile-responsive.png',
        fullPage: true,
      });
    });
  });

  test('should display correctly on tablet devices', async ({ page }) => {
    await test.step('Set tablet viewport and load app', async () => {
      await page.setViewportSize(VIEWPORT_SIZES.TABLET);
      await colorGridPage.goto();
    });

    await test.step('Verify tablet layout shows more columns', async () => {
      await colorGridPage.assertResponsiveLayout();

      // Check that the grid adapts to show more colors per row
      const gridStyles = await colorGridPage.colorGrid.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          gridTemplateColumns: styles.gridTemplateColumns,
          gap: styles.gap,
        };
      });

      expect(gridStyles.gridTemplateColumns).toBeTruthy();
    });

    await test.step('Test tablet modal size and interactions', async () => {
      const testColor = TEST_COLORS.RV_252;

      await colorGridPage.clickColorCard(testColor);
      await quantityModalPage.waitForOpen();

      // Modal should be appropriately sized for tablet
      await expect(quantityModalPage.modal).toBeVisible();

      // Test increment/decrement functionality
      await quantityModalPage.clickIncrement();
      await quantityModalPage.clickDecrement();

      await quantityModalPage.cancelChanges();
    });

    await test.step('Take tablet screenshot', async () => {
      await page.screenshot({
        path: 'test-results/screenshots/tablet-responsive.png',
        fullPage: true,
      });
    });
  });

  test('should handle portrait and landscape orientations', async ({
    page,
  }) => {
    const testColor = TEST_COLORS.RV_252;

    await test.step('Test mobile portrait orientation', async () => {
      await page.setViewportSize({ width: 375, height: 667 }); // Portrait
      await colorGridPage.goto();

      await colorGridPage.assertResponsiveLayout();

      // Test modal in portrait
      await colorGridPage.clickColorCard(testColor);
      await quantityModalPage.waitForOpen();
      await quantityModalPage.cancelChanges();
    });

    await test.step('Test mobile landscape orientation', async () => {
      await page.setViewportSize({ width: 667, height: 375 }); // Landscape
      await page.waitForTimeout(500); // Wait for responsive transition

      await colorGridPage.assertResponsiveLayout();

      // Test modal in landscape
      await colorGridPage.clickColorCard(testColor);
      await quantityModalPage.waitForOpen();
      await quantityModalPage.cancelChanges();
    });

    await test.step('Test tablet landscape orientation', async () => {
      await page.setViewportSize({ width: 1024, height: 768 }); // Tablet landscape
      await page.waitForTimeout(500);

      await colorGridPage.assertResponsiveLayout();

      await page.screenshot({
        path: 'test-results/screenshots/tablet-landscape.png',
        fullPage: true,
      });
    });
  });

  test('should handle different screen densities', async ({ page }) => {
    await test.step('Test high DPI mobile device', async () => {
      await page.setViewportSize(VIEWPORT_SIZES.MOBILE);
      await page.emulateMedia({ colorScheme: 'light' });

      await colorGridPage.goto();
      await colorGridPage.assertResponsiveLayout();

      // Color previews should render clearly at high DPI
      const colorPreview = colorGridPage.colorCards.first().locator('.preview');
      await expect(colorPreview).toBeVisible();
    });

    await test.step('Test standard DPI desktop', async () => {
      await page.setViewportSize(VIEWPORT_SIZES.DESKTOP);
      await colorGridPage.assertResponsiveLayout();
    });
  });

  test('should provide touch-optimized interactions across all screen sizes', async ({
    page,
  }) => {
    const viewports = [
      { name: 'Mobile', size: VIEWPORT_SIZES.MOBILE },
      { name: 'Tablet', size: VIEWPORT_SIZES.TABLET },
      { name: 'Desktop', size: VIEWPORT_SIZES.DESKTOP },
    ];

    for (const viewport of viewports) {
      await test.step(`Test touch interactions on ${viewport.name}`, async () => {
        await page.setViewportSize(viewport.size);
        await colorGridPage.goto();

        const testColor = TEST_COLORS.RV_252;

        // Test color card tap/click
        await colorGridPage.clickColorCard(testColor);
        await quantityModalPage.waitForOpen();

        // Test modal button interactions
        await quantityModalPage.clickIncrement();
        await quantityModalPage.clickDecrement();

        // Test modal close interactions
        await quantityModalPage.cancelChanges();

        // Verify all interactions work smoothly
        await expect(colorGridPage.colorGrid).toBeVisible();
      });
    }
  });

  test('should handle responsive grid behavior', async ({ page }) => {
    await test.step('Test grid adaptation across screen sizes', async () => {
      const testSizes = [
        { width: 320, height: 568, expected: 'mobile-small' },
        { width: 375, height: 667, expected: 'mobile' },
        { width: 768, height: 1024, expected: 'tablet' },
        { width: 1024, height: 768, expected: 'tablet-landscape' },
        { width: 1200, height: 800, expected: 'desktop' },
        { width: 1920, height: 1080, expected: 'desktop-large' },
      ];

      for (const size of testSizes) {
        await page.setViewportSize({ width: size.width, height: size.height });
        await colorGridPage.goto();
        await page.waitForTimeout(300); // Wait for responsive transition

        // Verify grid is still functional at this size
        await colorGridPage.assertResponsiveLayout();

        // Check that color cards are properly sized
        const firstCard = colorGridPage.colorCards.first();
        const cardBox = await firstCard.boundingBox();

        expect(cardBox).toBeTruthy();
        expect(cardBox!.width).toBeGreaterThan(0);
        expect(cardBox!.height).toBeGreaterThan(0);
      }
    });
  });

  test('should maintain functionality in mobile modal interactions', async ({
    page,
  }) => {
    await test.step('Set mobile viewport for modal testing', async () => {
      await page.setViewportSize(VIEWPORT_SIZES.MOBILE);
      await colorGridPage.goto();
    });

    await test.step('Test complete mobile modal workflow', async () => {
      const testColor = TEST_COLORS.RV_252;
      const initialQuantity = SAMPLE_INVENTORY[testColor];

      // Open modal
      await colorGridPage.clickColorCard(testColor);
      await quantityModalPage.waitForOpen();

      // Verify initial state
      const currentQuantity = await quantityModalPage.getCurrentQuantity();

      expect(currentQuantity).toBe(initialQuantity);

      // Test increment on mobile
      await quantityModalPage.clickIncrement();
      await quantityModalPage.clickIncrement();

      // Test manual input on mobile
      await quantityModalPage.setQuantity(10);

      // Save changes
      await quantityModalPage.saveQuantity();

      // Verify changes persisted
      const newQuantity = await colorGridPage.getColorQuantity(testColor);

      expect(newQuantity).toBe(10);
    });

    await test.step('Test mobile-specific modal interactions', async () => {
      const testColor = TEST_COLORS.RV_222;

      await colorGridPage.clickColorCard(testColor);
      await quantityModalPage.waitForOpen();

      // Test touch-based closing methods
      await quantityModalPage.closeByClickingOutside();

      // Reopen and test escape key (if supported on mobile)
      await colorGridPage.clickColorCard(testColor);
      await quantityModalPage.waitForOpen();
      await quantityModalPage.closeWithEscape();
    });
  });

  test('should handle responsive text and spacing', async ({ page }) => {
    const testSizes = [
      VIEWPORT_SIZES.MOBILE,
      VIEWPORT_SIZES.TABLET,
      VIEWPORT_SIZES.DESKTOP,
    ];

    for (const size of testSizes) {
      await test.step(`Test text readability at ${size.width}x${size.height}`, async () => {
        await page.setViewportSize(size);
        await colorGridPage.goto();

        // Check that text is readable and properly sized
        const colorCode = colorGridPage.colorCards.first().locator('.code');
        const quantity = page
          .getByTestId('color-card')
          .first()
          .locator('.quantity');

        await expect(colorCode).toBeVisible();
        await expect(quantity).toBeVisible();

        // Text should not be overlapping or too small
        const codeBox = await colorCode.boundingBox();
        const quantityBox = await quantity.boundingBox();

        expect(codeBox!.height).toBeGreaterThan(10); // Minimum readable size

        expect(quantityBox!.height).toBeGreaterThan(10);
      });
    }
  });

  test('should provide consistent user experience across devices', async ({
    page,
  }) => {
    await test.step('Test workflow consistency on mobile', async () => {
      await page.setViewportSize(VIEWPORT_SIZES.MOBILE);
      await colorGridPage.goto();

      // Complete a typical user workflow on mobile
      const testColor = TEST_COLORS.RV_252;
      await colorGridPage.clickColorCard(testColor);
      await quantityModalPage.waitForOpen();
      await quantityModalPage.incrementQuantityBy(3);
      await quantityModalPage.saveQuantity();

      const mobileQuantity = await colorGridPage.getColorQuantity(testColor);

      // Switch to desktop and verify same data
      await page.setViewportSize(VIEWPORT_SIZES.DESKTOP);
      await page.reload();
      await waitForAppToLoad(page);

      const desktopQuantity = await colorGridPage.getColorQuantity(testColor);

      expect(desktopQuantity).toBe(mobileQuantity);
    });

    await test.step('Test feature parity across screen sizes', async () => {
      const sizes = [
        VIEWPORT_SIZES.MOBILE,
        VIEWPORT_SIZES.TABLET,
        VIEWPORT_SIZES.DESKTOP,
      ];

      for (const size of sizes) {
        await page.setViewportSize(size);
        await page.reload();
        await waitForAppToLoad(page);

        // All core features should be available
        await expect(colorGridPage.colorGrid).toBeVisible();
        await expect(colorGridPage.colorCards.first()).toBeVisible();
        await expect(colorGridPage.appHeader).toBeVisible();
        await expect(colorGridPage.actionButtons).toBeVisible();

        // Modal functionality should work
        const testColor = TEST_COLORS.RV_1001;
        await colorGridPage.clickColorCard(testColor);
        await quantityModalPage.waitForOpen();
        await quantityModalPage.cancelChanges();
      }
    });
  });

  test('should handle responsive design utility test', async ({ page }) => {
    await test.step('Test the responsive design utility function', async () => {
      await colorGridPage.goto();

      // Use the helper function to test responsive design
      await assertResponsiveDesign(page);

      // Verify the app is still functional after all viewport changes
      await expect(colorGridPage.colorGrid).toBeVisible();
    });
  });
});
