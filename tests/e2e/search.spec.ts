/**
 * Search functionality tests
 */

import { test, expect } from '@playwright/test';

test.describe('Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('[data-testid="search-input"]');
  });

  test('should display search bar on page load', async ({ page }) => {
    const searchInput = page.getByTestId('search-input');
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute('placeholder', 'Search by RV code or color name...');
  });

  test('should search by RV code', async ({ page }) => {
    const searchInput = page.getByTestId('search-input');
    await searchInput.fill('RV-252');
    
    // Wait for debounced search
    await page.waitForTimeout(400);
    
    // Should show only Unicorn Yellow
    const colorCards = page.locator('[data-testid="color-grid"] > div');
    await expect(colorCards).toHaveCount(1);
    
    const firstCard = colorCards.first();
    await expect(firstCard).toContainText('RV-252');
    await expect(firstCard).toContainText('Unicorn Yellow');
  });

  test('should search by color name case-insensitively', async ({ page }) => {
    const searchInput = page.getByTestId('search-input');
    await searchInput.fill('yellow');
    
    // Wait for debounced search
    await page.waitForTimeout(400);
    
    // Should show multiple yellow colors
    const colorCards = page.locator('[data-testid="color-grid"] > div');
    const count = await colorCards.count();
    expect(count).toBeGreaterThan(5); // Should find many yellow colors
    
    // All visible cards should contain "yellow" in the name
    const cardTexts = await colorCards.allTextContents();
    for (const text of cardTexts) {
      expect(text.toLowerCase()).toContain('yellow');
    }
  });

  test('should show clear button when searching', async ({ page }) => {
    const searchInput = page.getByTestId('search-input');
    const clearButton = page.getByTestId('search-clear-button');
    
    // Clear button should not be visible initially
    await expect(clearButton).not.toBeVisible();
    
    // Type search term
    await searchInput.fill('blue');
    
    // Clear button should appear
    await expect(clearButton).toBeVisible();
  });

  test('should clear search when clear button is clicked', async ({ page }) => {
    const searchInput = page.getByTestId('search-input');
    const clearButton = page.getByTestId('search-clear-button');
    
    // Search for something
    await searchInput.fill('blue');
    await page.waitForTimeout(400);
    
    // Should have filtered results
    const colorCardsFiltered = page.locator('[data-testid="color-grid"] > div');
    const filteredCount = await colorCardsFiltered.count();
    expect(filteredCount).toBeLessThan(50); // Should be filtered
    
    // Click clear button
    await clearButton.click();
    
    // Search input should be empty
    await expect(searchInput).toHaveValue('');
    
    // Should show all colors again
    const colorCardsAll = page.locator('[data-testid="color-grid"] > div');
    const totalCount = await colorCardsAll.count();
    expect(totalCount).toBeGreaterThan(100); // Should show all colors
  });

  test('should handle uppercase search terms', async ({ page }) => {
    const searchInput = page.getByTestId('search-input');
    await searchInput.fill('BLUE');
    
    // Wait for debounced search
    await page.waitForTimeout(400);
    
    // Should find blue colors
    const colorCards = page.locator('[data-testid="color-grid"] > div');
    const count = await colorCards.count();
    expect(count).toBeGreaterThan(5); // Should find multiple blue colors
    
    // All visible cards should contain "blue" in the name (case-insensitive)
    const cardTexts = await colorCards.allTextContents();
    for (const text of cardTexts) {
      expect(text.toLowerCase()).toContain('blue');
    }
  });
});