import './styles/variables.css';
import './styles/layout.css';
import './styles/colorGrid.css';
import './styles/quantityModal.css';
import './styles/searchBar.css';
import './styles/filterBar.css';
import './styles/overflowMenu.css';
import { MONTANA_COLORS } from './colors.js';
import {
  loadInventory,
  saveInventory,
  clearInventory,
} from './lib/inventory.js';
import { searchColors, getColorsFromSearchResults } from './lib/search.js';
import {
  filterColors,
  FilterType,
  FilterState,
} from './components/FilterBar.js';
import { exportInventory } from './lib/data-export.js';
import { importInventory, applyImport } from './lib/data-import.js';
import { html, render } from 'lit-html';
import { AppLayout } from './components/AppLayout.js';
import type { Color } from './colors.js';

console.log('Montana Hardcore Inventory - Starting...');
console.log(`Loaded ${MONTANA_COLORS.length} colors`);

// Load existing inventory or create empty
let inventory = loadInventory();

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

const handleExportInventory = async () => {
  console.log('Exporting inventory...');
  await exportInventory(inventory)
    .then(() => {
      console.log('Inventory exported successfully');
    })
    .catch(error => {
      console.error('Failed to export inventory:', error);
      alert(
        'Sorry, there was an error exporting your inventory. Please try again.'
      );
    });
};

const handleImportInventory = async () => {
  console.log('Importing inventory...');

  try {
    const result = await importInventory(inventory);
    const { preview, importData } = result;

    const message = `
Anteprima importazione:
• ${preview.newColors.length} nuovi colori
• ${preview.updatedColors.length} colori aggiornati  
• Totale modifiche: ${preview.totalChanges}

Fonte: ${preview.metadata.importSource}

Vuoi procedere con l'importazione?
    `.trim();

    const confirmed = confirm(message);
    if (!confirmed) {
      return;
    }

    const newInventory = applyImport(importData, inventory);

    // Step 4: Save the new inventory
    saveInventory(newInventory);
    alert('Importazione completata con successo!');

    // Reload the page to refresh the inventory
    window.location.reload();
  } catch (error) {
    console.error('Failed to import inventory:', error);
    alert(
      `Errore durante l'importazione: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`
    );
  }
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
      onExportInventory: handleExportInventory,
      onImportInventory: handleImportInventory,
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

// Listen for overflow menu state changes
window.addEventListener('overflow-menu-state-change', renderApp);

// Initial render
renderApp();
