/**
 * SearchBar Component
 * Provides debounced search input for filtering colors by RV code or name
 */

import { html, TemplateResult } from 'lit-html';

export interface SearchProps {
  value: string;
  placeholder?: string;
  onSearch: (searchTerm: string) => void;
  onClear: () => void;
}

/**
 * SearchBar component with debounced input handling
 */
export function SearchBar({
  value,
  placeholder = 'Search by RV code or color name...',
  onSearch,
  onClear,
}: SearchProps): TemplateResult {
  let searchTimeout: number | undefined;

  const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const searchTerm = target.value.trim();

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Debounce the search with 300ms delay
    searchTimeout = window.setTimeout(() => {
      onSearch(searchTerm);
    }, 300);
  };

  const handleClear = () => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
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
