/**
 * SearchBar Component
 * Provides debounced search input for filtering colors by RV code or name
 */

import { html, TemplateResult } from 'lit-html';
import type { SearchProps } from '../types.js';

/**
 * SearchBar component with debounced input handling
 */
export function SearchBar({
  value,
  placeholder = 'Search by RV code or color name...',
  onSearch,
  onClear,
}: SearchProps): TemplateResult {
  // Handle input with debouncing
  const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const searchTerm = target.value.trim();
    
    // Clear any existing timeout
    if ((window as any).searchTimeout) {
      clearTimeout((window as any).searchTimeout);
    }
    
    // Debounce the search with 300ms delay
    (window as any).searchTimeout = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);
  };

  const handleClear = () => {
    // Clear any pending search timeout
    if ((window as any).searchTimeout) {
      clearTimeout((window as any).searchTimeout);
    }
    onClear();
  };

  return html`
    <div class="search-bar" data-testid="search-bar">
      <div class="search-input-container">
        <input
          type="text"
          class="search-input"
          data-testid="search-input"
          placeholder="${placeholder}"
          .value="${value}"
          @input="${handleInput}"
        />
        ${value
          ? html`
              <button
                class="search-clear-button"
                data-testid="search-clear-button"
                @click="${handleClear}"
                aria-label="Clear search"
              >
                ✕
              </button>
            `
          : ''}
      </div>
    </div>
  `;
}