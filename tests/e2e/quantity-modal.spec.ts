import { test, expect } from '@playwright/test';
import { ColorGridPage } from '../utils/page-objects/ColorGridPage.js';
import { QuantityModalPage } from '../utils/page-objects/QuantityModalPage.js';
import {
  clearInventoryData,
  setInventoryData,
  getInventoryData,
  waitForAppToLoad,
} from '../utils/test-helpers.js';
import {
  TEST_COLORS,
  SAMPLE_INVENTORY,
  QUANTITY_SCENARIOS,
} from '../utils/fixtures/test-data.js';

/**
 * E2E Tests for US-002: Quantity Modal Management
 * Testing modal-based quantity modification (increment/decrement, save/cancel)
 */
test.describe('US-002: Quantity Modal Management', () => {
  let colorGridPage: ColorGridPage;
  let quantityModalPage: QuantityModalPage;

  test.beforeEach(async ({ page }) => {
    colorGridPage = new ColorGridPage(page);
    quantityModalPage = new QuantityModalPage(page);

    // Navigate first, then set up clean state and sample inventory
    await colorGridPage.goto();
    await clearInventoryData(page);
    await setInventoryData(page, SAMPLE_INVENTORY);
    await page.reload(); // Reload to ensure app loads the data from localStorage
  });

  test('should open quantity modal when clicking a color card', async ({
    page,
  }) => {
    await test.step('Click on a color card', async () => {
      const testColor = TEST_COLORS.RV_252;
      await colorGridPage.clickColorCard(testColor);
    });

    await test.step('Verify modal opens with correct color information', async () => {
      await quantityModalPage.assertModalOpen(TEST_COLORS.RV_252);

      // Verify initial quantity matches the sample inventory
      const currentQuantity = await quantityModalPage.getCurrentQuantity();

      expect(currentQuantity).toBe(SAMPLE_INVENTORY[TEST_COLORS.RV_252]);
    });

    await test.step('Take screenshot of open modal', async () => {
      await page.screenshot({
        path: 'test-results/screenshots/quantity-modal-open.png',
      });
    });
  });

  test('should increment quantity using the + button', async ({ page }) => {
    const testColor = TEST_COLORS.RV_252;
    const initialQuantity = SAMPLE_INVENTORY[testColor];

    await test.step('Open modal and increment quantity', async () => {
      await colorGridPage.clickColorCard(testColor);
      await quantityModalPage.waitForOpen();

      await quantityModalPage.clickIncrement();
      await quantityModalPage.clickIncrement();
      await quantityModalPage.clickIncrement();
    });

    await test.step('Verify quantity increased correctly', async () => {
      const currentQuantity = await quantityModalPage.getCurrentQuantity();

      expect(currentQuantity).toBe(initialQuantity + 3);
    });

    await test.step('Save changes and verify persistence', async () => {
      await quantityModalPage.saveQuantity();

      // Check that the color card reflects the new quantity
      const cardQuantity = await colorGridPage.getColorQuantity(testColor);

      expect(cardQuantity).toBe(initialQuantity + 3);

      // Verify data is saved to localStorage
      const inventoryData = await getInventoryData(page);

      expect(inventoryData[testColor]).toBe(initialQuantity + 3);
    });
  });

  test('should decrement quantity using the - button', async ({ page }) => {
    const testColor = TEST_COLORS.RV_252;
    const initialQuantity = SAMPLE_INVENTORY[testColor];

    await test.step('Open modal and decrement quantity', async () => {
      await colorGridPage.clickColorCard(testColor);
      await quantityModalPage.waitForOpen();

      await quantityModalPage.clickDecrement();
      await quantityModalPage.clickDecrement();
    });

    await test.step('Verify quantity decreased correctly', async () => {
      const currentQuantity = await quantityModalPage.getCurrentQuantity();

      expect(currentQuantity).toBe(initialQuantity - 2);
    });

    await test.step('Save changes and verify persistence', async () => {
      await quantityModalPage.saveQuantity();

      const cardQuantity = await colorGridPage.getColorQuantity(testColor);

      expect(cardQuantity).toBe(initialQuantity - 2);
    });
  });

  test('should prevent quantity from going below zero', async ({ page }) => {
    const testColor = TEST_COLORS.RV_1001; // This has 0 quantity in sample data

    await test.step('Open modal for out-of-stock color', async () => {
      await colorGridPage.clickColorCard(testColor);
      await quantityModalPage.waitForOpen();

      const initialQuantity = await quantityModalPage.getCurrentQuantity();

      expect(initialQuantity).toBe(0);
    });

    await test.step('Try to decrement below zero', async () => {
      await quantityModalPage.testDecrementValidation();
    });

    await test.step('Test manual input validation', async () => {
      await quantityModalPage.testQuantityValidation();
    });
  });

  test('should handle direct quantity input in the input field', async () => {
    const testColor = TEST_COLORS.RV_252;
    const newQuantity = 15;

    await test.step('Open modal and set quantity directly', async () => {
      await colorGridPage.clickColorCard(testColor);
      await quantityModalPage.waitForOpen();

      await quantityModalPage.setQuantity(newQuantity);
    });

    await test.step('Save and verify the new quantity', async () => {
      await quantityModalPage.saveQuantity();

      const cardQuantity = await colorGridPage.getColorQuantity(testColor);

      expect(cardQuantity).toBe(newQuantity);
    });
  });

  test('should cancel changes when clicking Cancel button', async ({
    page,
  }) => {
    const testColor = TEST_COLORS.RV_252;
    const initialQuantity = SAMPLE_INVENTORY[testColor];

    await test.step('Open modal and make changes', async () => {
      await colorGridPage.clickColorCard(testColor);
      await quantityModalPage.waitForOpen();

      await quantityModalPage.incrementQuantityBy(5);

      // Verify the change is visible in the modal
      const currentQuantity = await quantityModalPage.getCurrentQuantity();

      expect(currentQuantity).toBe(initialQuantity + 5);
    });

    await test.step('Cancel changes', async () => {
      await quantityModalPage.cancelChanges();
    });

    await test.step('Verify original quantity is preserved', async () => {
      const cardQuantity = await colorGridPage.getColorQuantity(testColor);

      expect(cardQuantity).toBe(initialQuantity);

      // Verify localStorage wasn't modified
      const inventoryData = await getInventoryData(page);

      expect(inventoryData[testColor]).toBe(initialQuantity);
    });
  });

  test('should close modal when clicking outside (overlay)', async () => {
    const testColor = TEST_COLORS.RV_252;

    await test.step('Open modal and make changes', async () => {
      await colorGridPage.clickColorCard(testColor);
      await quantityModalPage.waitForOpen();

      await quantityModalPage.incrementQuantityBy(3);
    });

    await test.step('Close by clicking outside', async () => {
      await quantityModalPage.closeByClickingOutside();
    });

    await test.step('Verify changes were not saved', async () => {
      const cardQuantity = await colorGridPage.getColorQuantity(testColor);

      expect(cardQuantity).toBe(SAMPLE_INVENTORY[testColor]);
    });
  });

  test('should handle keyboard navigation (Escape to close, Enter to save)', async () => {
    const testColor = TEST_COLORS.RV_252;
    const newQuantity = 10;

    await test.step('Test Escape key to close without saving', async () => {
      await colorGridPage.clickColorCard(testColor);
      await quantityModalPage.waitForOpen();

      await quantityModalPage.setQuantity(newQuantity);
      await quantityModalPage.closeWithEscape();

      // Verify changes were not saved
      const cardQuantity = await colorGridPage.getColorQuantity(testColor);

      expect(cardQuantity).toBe(SAMPLE_INVENTORY[testColor]);
    });

    await test.step('Test Enter key to save changes', async () => {
      await colorGridPage.clickColorCard(testColor);
      await quantityModalPage.waitForOpen();

      await quantityModalPage.setQuantity(newQuantity);
      await quantityModalPage.saveWithEnter();

      // Verify changes were saved
      const cardQuantity = await colorGridPage.getColorQuantity(testColor);

      expect(cardQuantity).toBe(newQuantity);
    });
  });

  test('should test complete workflow scenarios', async ({ page }) => {
    for (const scenario of QUANTITY_SCENARIOS.slice(0, 4)) {
      // Test first 4 scenarios
      await test.step(`Test scenario: ${scenario.description}`, async () => {
        // Set up initial state
        const testColor = TEST_COLORS.RV_252;
        await setInventoryData(page, { [testColor]: scenario.initial });
        await page.reload();
        await waitForAppToLoad(page);

        // Open modal and make the change
        await colorGridPage.clickColorCard(testColor);
        await quantityModalPage.waitForOpen();

        const currentQuantity = await quantityModalPage.getCurrentQuantity();

        expect(currentQuantity).toBe(scenario.initial);

        // Apply the change (increment or decrement)
        if (scenario.change > 0) {
          await quantityModalPage.incrementQuantityBy(scenario.change);
        } else if (scenario.change < 0) {
          await quantityModalPage.decrementQuantityBy(
            Math.abs(scenario.change)
          );
        }

        // Save and verify
        await quantityModalPage.saveQuantity();

        const finalQuantity = await colorGridPage.getColorQuantity(testColor);

        expect(finalQuantity).toBe(scenario.expected);
      });
    }
  });

  test('should maintain modal state during interactions', async ({ page }) => {
    const testColor = TEST_COLORS.RV_252;

    await test.step('Open modal and verify initial state', async () => {
      await colorGridPage.clickColorCard(testColor);
      await quantityModalPage.assertModalOpen(testColor);
    });

    await test.step('Verify modal elements remain interactive', async () => {
      // Test all interactive elements
      await expect(quantityModalPage.incrementButton).toBeEnabled();
      await expect(quantityModalPage.decrementButton).toBeEnabled();
      await expect(quantityModalPage.quantityInput).toBeEditable();
      await expect(quantityModalPage.saveButton).toBeEnabled();
      await expect(quantityModalPage.cancelButton).toBeEnabled();
    });

    await test.step('Verify accessibility attributes', async () => {
      await quantityModalPage.assertAccessibility();
    });
  });
});
