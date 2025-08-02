/**
 * AppLayout Component
 * Main layout component that orchestrates all UI pieces
 */

import { html } from 'lit-html';
import { AppHeader } from './AppHeader.js';
import { InventoryStats } from './InventoryStats.js';
import { SearchBar } from './SearchBar.js';
import { FilterBar, FilterType, FilterState } from './FilterBar.js';
import { ColorGrid } from './ColorGrid.js';
import { QuantityModal } from './QuantityModal.js';
import type { Color } from '../colors.js';
import type { InventoryItems } from '../inventory.js';

export interface AppLayoutProps {
  // Header props
  title: string;

  // Stats props
  totalColors: number;
  inventory: InventoryItems;

  // Action handlers
  onClearInventory: () => void;
  onExportInventory: () => void;
  onImportInventory: () => void;

  // Search props
  searchTerm: string;
  onSearch: (searchTerm: string) => void;
  onClearSearch: () => void;

  // Filter props
  filterState: FilterState;
  onFilterChange: (filterType: FilterType) => void;
  onFilterReset: () => void;

  // Grid props
  colors: Color[];
  onColorClick: (color: Color) => void;

  // Modal props
  selectedColor: Color | null;
  modalOpen: boolean;
  onModalClose: () => void;
  onQuantitySave: (quantity: number) => void;
}

export const AppLayout = ({
  title,
  totalColors,
  inventory,
  onClearInventory,
  onExportInventory,
  onImportInventory,
  searchTerm,
  onSearch,
  onClearSearch,
  filterState,
  onFilterChange,
  onFilterReset,
  colors,
  onColorClick,
  selectedColor,
  modalOpen,
  onModalClose,
  onQuantitySave,
}: AppLayoutProps) => {
  return html`
    <div class="app-container">
      ${AppHeader({
        title,
        onClearInventory,
        onExportInventory,
        onImportInventory,
      })}
      ${InventoryStats({
        totalColors,
        inventory,
      })}
      ${SearchBar({
        value: searchTerm,
        onSearch,
        onClear: onClearSearch,
      })}
      ${FilterBar({
        filterState,
        onFilterChange,
        onReset: onFilterReset,
      })}
      ${ColorGrid({
        colors,
        inventory,
        onColorClick,
      })}
      ${selectedColor
        ? QuantityModal({
            color: selectedColor,
            quantity: inventory[selectedColor.code] || 0,
            isOpen: modalOpen,
            onClose: onModalClose,
            onSave: onQuantitySave,
          })
        : ''}
    </div>
  `;
};
