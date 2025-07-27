/**
 * Main entry point for Montana Hardcore Inventory
 */

import './styles/variables.css';
import './styles/layout.css';
import './styles/colorGrid.css';
import './styles/quantityModal.css';
import './styles/searchBar.css';
import './styles/filterBar.css';
import { MONTANA_COLORS } from './colors.js';
import { loadInventory, saveInventory, clearInventory } from './inventory.js';
import { searchColors, getColorsFromSearchResults } from './search.js';
import { filterColors } from './components/FilterBar.js';
import { html, render } from 'lit-html';
import { AppLayout } from './components/AppLayout.js';
import { FilterType } from './types.js';
import type { Color, FilterState } from './types.js';

console.log('Montana Hardcore Inventory - Starting...');
console.log(`Loaded ${MONTANA_COLORS.length} colors`);

// Load existing inventory or create empty
let inventory = loadInventory();
console.log('Loaded inventory:', inventory);

// Search and filter state
let searchTerm = '';
let filterState: FilterState = {
  activeFilter: FilterType.ALL,
  filteredCount: MONTANA_COLORS.length,
};
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
    
    // Update filtered colors as quantities may have changed the filter results
    updateFilteredColors();
  }
};

// Search and filter handlers
const updateFilteredColors = () => {
  // First apply search if there's a search term
  let colors = MONTANA_COLORS;
  if (searchTerm) {
    const searchResults = searchColors(MONTANA_COLORS, searchTerm);
    colors = getColorsFromSearchResults(searchResults);
  }
  
  // Then apply filter
  filteredColors = filterColors(colors, inventory, filterState.activeFilter);
  filterState.filteredCount = filteredColors.length;
  
  console.log(
    `Filter: ${filterState.activeFilter}, Search: "${searchTerm}" - Found ${filteredColors.length} colors`
  );
};

const handleSearch = (searchValue: string) => {
  searchTerm = searchValue;
  updateFilteredColors();
  renderApp();
};

const handleClearSearch = () => {
  searchTerm = '';
  updateFilteredColors();
  renderApp();
};

const handleFilterChange = (filterType: FilterType) => {
  filterState.activeFilter = filterType;
  updateFilteredColors();
  renderApp();
};

const handleFilterReset = () => {
  filterState.activeFilter = FilterType.ALL;
  updateFilteredColors();
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
      searchTerm,
      onSearch: handleSearch,
      onClearSearch: handleClearSearch,
      filterState,
      onFilterChange: handleFilterChange,
      onFilterReset: handleFilterReset,
    })}
  `;

  const app = document.getElementById('app');
  if (app) {
    render(appTemplate, app);
  }
};

// Initial render
renderApp();
