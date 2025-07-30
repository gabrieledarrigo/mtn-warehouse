/**
 * OverflowMenu Component
 * Provides three-dots menu for administrative actions
 */

import { html } from 'lit-html';

export interface MenuOption {
  id: string;
  label: string;
  action: () => void;
  destructive?: boolean;
}

export interface OverflowMenuProps {
  options: MenuOption[];
  onClose?: () => void;
}

// Global state for the overflow menu
let globalMenuState = {
  isOpen: false,
  showConfirmation: false,
  confirmationMessage: '',
  confirmationAction: null as (() => void) | null,
};

let currentRenderFunction: (() => void) | null = null;

const updateMenuState = (newState: Partial<typeof globalMenuState>) => {
  globalMenuState = { ...globalMenuState, ...newState };
  if (currentRenderFunction) {
    currentRenderFunction();
  }
};

const toggleMenu = () => {
  updateMenuState({ isOpen: !globalMenuState.isOpen });
  
  if (globalMenuState.isOpen) {
    // Add event listeners when menu opens
    setTimeout(() => {
      document.addEventListener('click', handleOutsideClick);
      document.addEventListener('keydown', handleEscapeKey);
    }, 0);
  } else {
    // Remove event listeners when menu closes
    document.removeEventListener('click', handleOutsideClick);
    document.removeEventListener('keydown', handleEscapeKey);
  }
};

const closeMenu = () => {
  updateMenuState({ 
    isOpen: false, 
    showConfirmation: false, 
    confirmationAction: null 
  });
  document.removeEventListener('click', handleOutsideClick);
  document.removeEventListener('keydown', handleEscapeKey);
};

const handleOptionClick = (option: MenuOption) => {
  if (option.destructive) {
    updateMenuState({
      showConfirmation: true,
      confirmationMessage: `Are you sure you want to ${option.label.toLowerCase()}? This action cannot be undone.`,
      confirmationAction: option.action,
    });
  } else {
    option.action();
    closeMenu();
  }
};

const confirmAction = () => {
  if (globalMenuState.confirmationAction) {
    globalMenuState.confirmationAction();
  }
  closeMenu();
};

const cancelAction = () => {
  updateMenuState({ 
    showConfirmation: false, 
    confirmationAction: null 
  });
};

const handleOutsideClick = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.overflow-menu-container')) {
    closeMenu();
  }
};

const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeMenu();
  }
};

export const OverflowMenu = ({ options }: OverflowMenuProps) => {
  // Set up the render function for state updates
  const appElement = document.getElementById('app');
  if (appElement && !currentRenderFunction) {
    currentRenderFunction = () => {
      // Trigger a re-render of the entire app when menu state changes
      window.dispatchEvent(new CustomEvent('overflow-menu-state-change'));
    };
  }

  return html`
    <div class="overflow-menu-container" data-testid="overflow-menu">
      <button 
        @click=${toggleMenu}
        class="overflow-menu-trigger"
        type="button"
        aria-label="More options"
        aria-expanded=${globalMenuState.isOpen}
        data-testid="overflow-menu-trigger"
      >
        ⋮
      </button>
      
      ${globalMenuState.isOpen ? html`
        <div class="overflow-menu-dropdown" data-testid="overflow-menu-dropdown">
          ${options.map(option => html`
            <button
              @click=${() => handleOptionClick(option)}
              class="overflow-menu-option ${option.destructive ? 'destructive' : ''}"
              type="button"
              data-testid="overflow-menu-option-${option.id}"
            >
              ${option.label}
            </button>
          `)}
        </div>
      ` : ''}
      
      ${globalMenuState.showConfirmation ? html`
        <div class="confirmation-overlay" data-testid="confirmation-overlay">
          <div class="confirmation-dialog" data-testid="confirmation-dialog">
            <h3>Confirm Action</h3>
            <p>${globalMenuState.confirmationMessage}</p>
            <div class="confirmation-actions">
              <button 
                @click=${cancelAction}
                class="btn secondary"
                type="button"
                data-testid="confirmation-cancel"
              >
                Cancel
              </button>
              <button 
                @click=${confirmAction}
                class="btn danger"
                type="button"
                data-testid="confirmation-confirm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      ` : ''}
    </div>
  `;
};