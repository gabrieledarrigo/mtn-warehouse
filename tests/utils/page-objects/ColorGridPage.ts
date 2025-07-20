import { Page, Locator, expect } from '@playwright/test';
import { waitForAppToLoad } from '../test-helpers.js';

/**
 * Page Object Model for the Color Grid component
 * Handles interactions with the main color grid display
 */
export class ColorGridPage {
  readonly page: Page;
  readonly colorGrid: Locator;
  readonly colorCards: Locator;
  readonly appHeader: Locator;
  readonly inventoryStats: Locator;
  readonly actionButtons: Locator;

  constructor(page: Page) {
    this.page = page;
    this.colorGrid = page.locator('.color-grid');
    this.colorCards = page.locator('.color-card');
    this.appHeader = page.locator('.app-header');
    this.inventoryStats = page.locator('.inventory-stats');
    this.actionButtons = page.locator('.action-buttons');
  }

  /**
   * Navigate to the application and wait for it to load
   */
  async goto(): Promise<void> {
    await this.page.goto('/');
    await waitForAppToLoad(this.page);
  }

  /**
   * Get a specific color card by RV code
   */
  getColorCard(rvCode: string): Locator {
    return this.colorCards.filter({ has: this.page.locator(`.color-code:text("${rvCode}")`) });
  }

  /**
   * Click on a color card to open the quantity modal
   */
  async clickColorCard(rvCode: string): Promise<void> {
    const colorCard = this.getColorCard(rvCode);
    await expect(colorCard).toBeVisible();
    await colorCard.click();
  }

  /**
   * Get the quantity displayed for a specific color
   */
  async getColorQuantity(rvCode: string): Promise<number> {
    const colorCard = this.getColorCard(rvCode);
    const quantityElement = colorCard.locator('.color-quantity');
    const quantityText = await quantityElement.textContent();
    return parseInt(quantityText || '0');
  }

  /**
   * Assert that all 142 colors are displayed
   */
  async assertAllColorsDisplayed(): Promise<void> {
    await expect(this.colorCards).toHaveCount(142);
  }

  /**
   * Assert that a specific color card contains all required elements
   */
  async assertColorCardStructure(rvCode: string): Promise<void> {
    const colorCard = this.getColorCard(rvCode);
    
    // Check that the card is visible
    await expect(colorCard).toBeVisible();
    
    // Check for color preview
    await expect(colorCard.locator('.color-preview')).toBeVisible();
    
    // Check for RV code display
    const codeElement = colorCard.locator('.color-code');
    await expect(codeElement).toBeVisible();
    await expect(codeElement).toHaveText(rvCode);
    
    // Check for quantity display
    await expect(colorCard.locator('.color-quantity')).toBeVisible();
  }

  /**
   * Get all visible color codes
   */
  async getAllVisibleColorCodes(): Promise<string[]> {
    const codeElements = this.colorCards.locator('.color-code');
    const count = await codeElements.count();
    const codes: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const code = await codeElements.nth(i).textContent();
      if (code) codes.push(code);
    }
    
    return codes;
  }

  /**
   * Check if the color grid is responsive
   */
  async assertResponsiveLayout(): Promise<void> {
    // The grid should be visible and contain cards
    await expect(this.colorGrid).toBeVisible();
    await expect(this.colorCards.first()).toBeVisible();
    
    // Grid should have proper CSS grid layout
    const gridComputedStyle = await this.colorGrid.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        display: styles.display,
        gridTemplateColumns: styles.gridTemplateColumns,
      };
    });
    
    expect(gridComputedStyle.display).toBe('grid');
    expect(gridComputedStyle.gridTemplateColumns).toBeTruthy();
  }

  /**
   * Get inventory statistics from header
   */
  async getInventoryStats(): Promise<{ total: number; inStock: number; outOfStock: number }> {
    const statsText = await this.inventoryStats.textContent();
    const total = 142; // Montana Hardcore total colors
    
    // Parse the stats (this would depend on the actual implementation)
    // For now, return default values
    return {
      total,
      inStock: 0,
      outOfStock: 0,
    };
  }

  /**
   * Click the clear inventory button
   */
  async clickClearInventory(): Promise<void> {
    const clearButton = this.actionButtons.locator('button:has-text("Clear")');
    await clearButton.click();
  }

  /**
   * Click the reload button
   */
  async clickReload(): Promise<void> {
    const reloadButton = this.actionButtons.locator('button:has-text("Reload")');
    await reloadButton.click();
  }

  /**
   * Assert that the app header contains expected elements
   */
  async assertHeaderStructure(): Promise<void> {
    await expect(this.appHeader).toBeVisible();
    await expect(this.appHeader.locator('h1')).toContainText('Montana Hardcore');
    await expect(this.inventoryStats).toBeVisible();
    await expect(this.actionButtons).toBeVisible();
  }
}