import { Page, Locator, expect } from '@playwright/test';
import { waitForModal } from '../test-helpers.js';

/**
 * Page Object Model for the Quantity Modal component
 * Handles interactions with the modal for quantity management
 */
export class QuantityModalPage {
  readonly page: Page;
  readonly modal: Locator;
  readonly colorPreview: Locator;
  readonly colorCode: Locator;
  readonly colorName: Locator;
  readonly quantityInput: Locator;
  readonly incrementButton: Locator;
  readonly decrementButton: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly closeButton: Locator;
  readonly modalOverlay: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modal = page.locator('.quantity-modal');
    this.colorPreview = this.modal.locator('.color-preview');
    this.colorCode = this.modal.locator('.color-code');
    this.colorName = this.modal.locator('.color-name');
    this.quantityInput = this.modal.locator('input[type="number"]');
    this.incrementButton = this.modal.locator('button[data-action="increment"]');
    this.decrementButton = this.modal.locator('button[data-action="decrement"]');
    this.saveButton = this.modal.locator('button:has-text("Save")');
    this.cancelButton = this.modal.locator('button:has-text("Cancel")');
    this.closeButton = this.modal.locator('.close-button, button[aria-label="Close"]');
    this.modalOverlay = page.locator('.modal-overlay');
  }

  /**
   * Wait for the modal to be visible
   */
  async waitForOpen(): Promise<void> {
    await waitForModal(this.page, true);
    await expect(this.modal).toBeVisible();
  }

  /**
   * Wait for the modal to be hidden
   */
  async waitForClose(): Promise<void> {
    await waitForModal(this.page, false);
    await expect(this.modal).toBeHidden();
  }

  /**
   * Assert that the modal is open and displays correct color information
   */
  async assertModalOpen(expectedRvCode: string): Promise<void> {
    await this.waitForOpen();
    
    // Check that all modal elements are visible
    await expect(this.colorPreview).toBeVisible();
    await expect(this.colorCode).toBeVisible();
    await expect(this.colorName).toBeVisible();
    await expect(this.quantityInput).toBeVisible();
    await expect(this.incrementButton).toBeVisible();
    await expect(this.decrementButton).toBeVisible();
    await expect(this.saveButton).toBeVisible();
    await expect(this.cancelButton).toBeVisible();
    
    // Verify the correct color is displayed
    await expect(this.colorCode).toHaveText(expectedRvCode);
  }

  /**
   * Get the current quantity value from the input field
   */
  async getCurrentQuantity(): Promise<number> {
    const value = await this.quantityInput.inputValue();
    return parseInt(value) || 0;
  }

  /**
   * Set the quantity directly in the input field
   */
  async setQuantity(quantity: number): Promise<void> {
    await this.quantityInput.clear();
    await this.quantityInput.fill(quantity.toString());
  }

  /**
   * Click the increment button and verify the quantity increases
   */
  async clickIncrement(): Promise<void> {
    const currentQuantity = await this.getCurrentQuantity();
    await this.incrementButton.click();
    
    // Wait for the quantity to update
    await expect(this.quantityInput).toHaveValue((currentQuantity + 1).toString());
  }

  /**
   * Click the decrement button and verify the quantity decreases
   */
  async clickDecrement(): Promise<void> {
    const currentQuantity = await this.getCurrentQuantity();
    const expectedQuantity = Math.max(0, currentQuantity - 1);
    
    await this.decrementButton.click();
    
    // Wait for the quantity to update
    await expect(this.quantityInput).toHaveValue(expectedQuantity.toString());
  }

  /**
   * Increment quantity multiple times
   */
  async incrementQuantityBy(amount: number): Promise<void> {
    for (let i = 0; i < amount; i++) {
      await this.clickIncrement();
    }
  }

  /**
   * Decrement quantity multiple times
   */
  async decrementQuantityBy(amount: number): Promise<void> {
    for (let i = 0; i < amount; i++) {
      await this.clickDecrement();
    }
  }

  /**
   * Save the current quantity and close the modal
   */
  async saveQuantity(): Promise<void> {
    await this.saveButton.click();
    await this.waitForClose();
  }

  /**
   * Cancel changes and close the modal
   */
  async cancelChanges(): Promise<void> {
    await this.cancelButton.click();
    await this.waitForClose();
  }

  /**
   * Close the modal using the close button
   */
  async closeModal(): Promise<void> {
    await this.closeButton.click();
    await this.waitForClose();
  }

  /**
   * Close the modal by clicking outside (on overlay)
   */
  async closeByClickingOutside(): Promise<void> {
    await this.modalOverlay.click();
    await this.waitForClose();
  }

  /**
   * Close the modal using the Escape key
   */
  async closeWithEscape(): Promise<void> {
    await this.page.keyboard.press('Escape');
    await this.waitForClose();
  }

  /**
   * Save the modal using the Enter key
   */
  async saveWithEnter(): Promise<void> {
    await this.page.keyboard.press('Enter');
    await this.waitForClose();
  }

  /**
   * Test quantity validation (ensure it cannot go below 0)
   */
  async testQuantityValidation(): Promise<void> {
    // Try to set a negative value
    await this.setQuantity(-5);
    await this.quantityInput.blur();
    
    // Should be corrected to 0
    await expect(this.quantityInput).toHaveValue('0');
    
    // Try to set a very large value
    await this.setQuantity(9999);
    await this.quantityInput.blur();
    
    // Should be limited (implementation dependent)
    const value = await this.getCurrentQuantity();
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThanOrEqual(999); // Assuming max limit of 999
  }

  /**
   * Verify that the quantity cannot go below 0 using decrement button
   */
  async testDecrementValidation(): Promise<void> {
    // Set quantity to 0
    await this.setQuantity(0);
    
    // Try to decrement
    await this.clickDecrement();
    
    // Should remain at 0
    await expect(this.quantityInput).toHaveValue('0');
  }

  /**
   * Assert that the modal has proper accessibility attributes
   */
  async assertAccessibility(): Promise<void> {
    // Check for proper ARIA attributes
    await expect(this.modal).toHaveAttribute('role', 'dialog');
    await expect(this.modal).toHaveAttribute('aria-modal', 'true');
    
    // Check that buttons have proper accessibility labels
    await expect(this.incrementButton).toHaveAttribute('aria-label');
    await expect(this.decrementButton).toHaveAttribute('aria-label');
    
    // Check that the input has proper labeling
    await expect(this.quantityInput).toHaveAttribute('aria-label');
  }

  /**
   * Complete workflow: open, modify, and save quantity
   */
  async completeQuantityUpdate(newQuantity: number): Promise<void> {
    await this.waitForOpen();
    await this.setQuantity(newQuantity);
    await this.saveQuantity();
  }

  /**
   * Complete workflow: open, modify, and cancel changes
   */
  async testCancelWorkflow(newQuantity: number): Promise<number> {
    await this.waitForOpen();
    const originalQuantity = await this.getCurrentQuantity();
    await this.setQuantity(newQuantity);
    await this.cancelChanges();
    return originalQuantity;
  }
}