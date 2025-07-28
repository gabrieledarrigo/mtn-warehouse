/**
 * FilterBar Component
 * Provides filtering options for inventory based on availability status
 */

import { html, TemplateResult } from 'lit-html';
import type { InventoryItems, Color } from '../types.js';

/**
 * Filter types for inventory filtering
 */
export enum FilterType {
  ALL = 'tutti',
  IN_STOCK = 'in_stock',
  OUT_OF_STOCK = 'esauriti',
  LOW_STOCK = 'scarsi',
}

export interface FilterOption {
  type: FilterType;
  label: string;
  shortcut?: string;
}

export interface FilterState {
  activeFilter: FilterType;
  filteredCount: number;
}

export interface FilterBarProps {
  filterState: FilterState;
  onFilterChange: (filterType: FilterType) => void;
  onReset: () => void;
}

/**
 * Filter options configuration
 */
export const FILTER_OPTIONS: FilterOption[] = [
  { type: FilterType.ALL, label: 'Tutti', shortcut: 'a' },
  { type: FilterType.IN_STOCK, label: 'In Stock', shortcut: 's' },
  { type: FilterType.OUT_OF_STOCK, label: 'Esauriti', shortcut: 'e' },
  { type: FilterType.LOW_STOCK, label: 'Scarsi', shortcut: 'l' },
];

/**
 * Type-safe filter functions for each status type
 */
export const filterColors = (
  colors: Color[],
  inventory: InventoryItems,
  filterType: FilterType
): Color[] => {
  switch (filterType) {
    case FilterType.ALL:
      return colors;
    case FilterType.IN_STOCK:
      return colors.filter(color => (inventory[color.code] || 0) > 0);
    case FilterType.OUT_OF_STOCK:
      return colors.filter(color => (inventory[color.code] || 0) === 0);
    case FilterType.LOW_STOCK:
      return colors.filter(color => (inventory[color.code] || 0) === 1);
    default:
      return colors;
  }
};

/**
 * FilterBar component with typed radio buttons for filter options
 */
export function FilterBar({
  filterState,
  onFilterChange,
  onReset,
}: FilterBarProps): TemplateResult {
  const handleFilterChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const filterType = target.value as FilterType;
    onFilterChange(filterType);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    // Handle keyboard shortcuts for quick filter switching
    if (event.altKey) {
      const option = FILTER_OPTIONS.find(
        opt => opt.shortcut === event.key.toLowerCase()
      );
      if (option) {
        event.preventDefault();
        onFilterChange(option.type);
      }
    }

    // Reset with Escape key
    if (event.key === 'Escape') {
      event.preventDefault();
      onReset();
    }
  };

  // Add global keyboard event listener
  window.addEventListener('keydown', handleKeyDown);

  return html`
    <div class="filter-bar" data-testid="filter-bar">
      <div class="filter-controls">
        <span class="filter-label">Filtra per:</span>
        <div class="filter-options">
          ${FILTER_OPTIONS.map(
            option => html`
              <label
                class="filter-option ${filterState.activeFilter === option.type
                  ? 'active'
                  : ''}"
              >
                <input
                  type="radio"
                  name="filter"
                  value="${option.type}"
                  .checked="${filterState.activeFilter === option.type}"
                  @change="${handleFilterChange}"
                  data-testid="filter-${option.type}"
                />
                <span class="filter-label-text">
                  ${option.label}
                  ${option.shortcut
                    ? html`<kbd>Alt+${option.shortcut.toUpperCase()}</kbd>`
                    : ''}
                </span>
              </label>
            `
          )}
        </div>
      </div>

      <div class="filter-info">
        <span class="filter-badge" data-testid="filter-count">
          ${filterState.filteredCount} colori
        </span>
        ${filterState.activeFilter !== FilterType.ALL
          ? html`
              <button
                class="filter-reset-button"
                data-testid="filter-reset"
                @click="${onReset}"
                aria-label="Reset filter"
                title="Reset filter (Esc)"
              >
                ✕ Reset
              </button>
            `
          : ''}
      </div>
    </div>
  `;
}
