import './styles/variables.css';
import './styles/layout.css';
import './styles/colorGrid.css';
import './styles/quantityModal.css';
import './styles/searchBar.css';
import './styles/filterBar.css';
import './styles/overflowMenu.css';
import './styles/importModal.css';
import { MONTANA_COLORS } from './colors.js';
import { loadInventory, saveInventory, clearInventory } from './inventory.js';
import { searchColors, getColorsFromSearchResults } from './search.js';
import {
  filterColors,
  FilterType,
  FilterState,
} from './components/FilterBar.js';
import { exportInventory } from './data-export.js';
import { 
  importInventory, 
  MergeStrategy, 
  generateImportPreview,
  type ImportPreview 
} from './data-import.js';
import { html, render } from 'lit-html';
import { AppLayout } from './components/AppLayout.js';
import { ImportPreviewModal } from './components/ImportPreviewModal.js';
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

// Import modal state
let importModalOpen = false;
let importPreview: ImportPreview | null = null;
let importStrategy: MergeStrategy = MergeStrategy.MERGE;
let pendingImportData: any = null;

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
      // Show user-friendly error message
      alert(
        'Sorry, there was an error exporting your inventory. Please try again.'
      );
    });
};

const handleImportInventory = async () => {
  console.log('Starting inventory import...');
  
  try {
    // First just pick and parse the file to show preview
    const { pickFile, parseImportFile, generateImportPreview } = await import('./data-import.js');
    
    const file = await pickFile();
    if (!file) {
      alert('Nessun file selezionato');
      return;
    }
    
    const importData = await parseImportFile(file);
    const preview = generateImportPreview(inventory, importData, importStrategy);
    
    // Store the import data for later use
    pendingImportData = importData;
    importPreview = preview;
    importModalOpen = true;
    renderApp();
    
  } catch (error) {
    console.error('Import error:', error);
    alert(error instanceof Error ? error.message : 'Errore durante l\'importazione del file');
  }
};

const handleImportConfirm = async (strategy: MergeStrategy) => {
  console.log('Confirming import with strategy:', strategy);
  
  try {
    const { applyImport, createBackup } = await import('./data-import.js');
    const importData = pendingImportData;
    
    if (!importData) {
      alert('Errore: dati di importazione non trovati');
      return;
    }
    
    // Create backup before applying changes
    const backupKey = createBackup(inventory);
    console.log('Backup created:', backupKey);
    
    // Apply the import
    const newInventory = applyImport(inventory, importData, strategy);
    
    // Update the global inventory and save
    Object.assign(inventory, newInventory);
    saveInventory(inventory);
    
    // Update filtered colors to reflect changes
    updateFilteredColors();
    
    // Clean up
    importModalOpen = false;
    importPreview = null;
    pendingImportData = null;
    
    // Show success message
    alert('Importazione completata con successo!');
    console.log('Import completed successfully');
    
    renderApp();
    
  } catch (error) {
    console.error('Error during import confirmation:', error);
    alert('Errore durante l\'applicazione dell\'importazione');
  }
};

const handleImportCancel = () => {
  importModalOpen = false;
  importPreview = null;
  renderApp();
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
    ${importModalOpen && importPreview ? html`
      ${ImportPreviewModal({
        preview: importPreview,
        strategy: importStrategy,
        onConfirm: handleImportConfirm,
        onCancel: handleImportCancel,
        isOpen: importModalOpen,
      })}
    ` : ''}
  `;

  const app = document.getElementById('app');
  if (app) {
    render(appTemplate, app);
  }
};

// Listen for overflow menu state changes
window.addEventListener('overflow-menu-state-change', renderApp);

// Listen for import strategy changes
window.addEventListener('import-strategy-change', async (event: any) => {
  importStrategy = event.detail.strategy;
  if (importPreview && pendingImportData) {
    // Regenerate preview with new strategy
    const { generateImportPreview } = await import('./data-import.js');
    importPreview = generateImportPreview(inventory, pendingImportData, importStrategy);
    renderApp();
  }
});

// Initial render
renderApp();
