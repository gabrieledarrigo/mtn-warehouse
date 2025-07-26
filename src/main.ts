/**
 * Main entry point for Montana Hardcore Inventory
 */

import './styles/variables.css';
import './styles/layout.css';
import './styles/colorGrid.css';
import './styles/quantityModal.css';
import './styles/searchBar.css';
import { MONTANA_COLORS } from './colors.js';
import { loadInventory, saveInventory, clearInventory } from './inventory.js';
import { searchColors, getColorsFromSearchResults } from './search.js';
import { html, render } from 'lit-html';
import { AppLayout } from './components/AppLayout.js';
import type { Color } from './types.js';

console.log('Montana Hardcore Inventory - Starting...');
console.log(`Loaded ${MONTANA_COLORS.length} colors`);

// Load existing inventory or create empty
let inventory = loadInventory();
console.log('Loaded inventory:', inventory);

// Search state
let searchTerm = '';
let filteredColors = MONTANA_COLORS;

// Modal state
let modalOpen = false;
let selectedColor: Color | null = null;

// Event handlers
const handleClearInventory = () => {
  clearInventory();
  console.log('Inventory cleared');
  window.location.reload();
};

const handleReload = () => {
  window.location.reload();
};

const handleColorClick = (color: Color) => {
  console.log('Color clicked:', color);
  selectedColor = color;
  modalOpen = true;
  renderApp();
};

const handleModalClose = () => {
  modalOpen = false;
  selectedColor = null;
  renderApp();
};

const handleQuantitySave = (newQuantity: number) => {
  if (selectedColor) {
    inventory[selectedColor.code] = newQuantity;
    saveInventory(inventory);
    console.log(`Updated ${selectedColor.code} to quantity ${newQuantity}`);
  }
};

// Search handlers
const handleSearch = (searchValue: string) => {
  searchTerm = searchValue;
  const searchResults = searchColors(MONTANA_COLORS, searchTerm);
  filteredColors = getColorsFromSearchResults(searchResults);
  console.log(`Search: "${searchTerm}" - Found ${filteredColors.length} colors`);
  renderApp();
};

const handleClearSearch = () => {
  searchTerm = '';
  filteredColors = MONTANA_COLORS;
  renderApp();
};

const renderApp = () => {
  const appTemplate = html`
    ${AppLayout({
      title: 'Montana Hardcore Inventory',
      totalColors: MONTANA_COLORS.length,
      inventory,
      onClearInventory: handleClearInventory,
      onReload: handleReload,
      colors: filteredColors,
      onColorClick: handleColorClick,
      selectedColor,
      modalOpen,
      onModalClose: handleModalClose,
      onQuantitySave: handleQuantitySave,
      // Search props
      searchTerm,
      onSearch: handleSearch,
      onClearSearch: handleClearSearch,
    })}
  `;

  const app = document.getElementById('app');
  if (app) {
    render(appTemplate, app);
  }
};

// Initial render
renderApp();
