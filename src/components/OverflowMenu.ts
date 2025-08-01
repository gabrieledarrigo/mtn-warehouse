/**
 * OverflowMenu Component
 * Provides three-dots menu for administrative actions
 */

import { html } from 'lit-html';

export interface MenuOption {
  id: string;
  label: string;
  action: () => void;
}

export interface OverflowMenuProps {
  options: MenuOption[];
  onClose?: () => void;
}

// Global state for the overflow menu
let menuState = {
  isOpen: false,
  showConfirmation: false,
  confirmationMessage: '',
  confirmationAction: null as (() => void) | null,
};

let currentRenderFunction: (() => void) | null = null;

const updateMenuState = (newState: Partial<typeof menuState>) => {
  menuState = { ...menuState, ...newState };
  if (currentRenderFunction) {
    currentRenderFunction();
  }
};

const toggleMenu = () => {
  updateMenuState({ isOpen: !menuState.isOpen });

  if (menuState.isOpen) {
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
    confirmationAction: null,
  });
  document.removeEventListener('click', handleOutsideClick);
  document.removeEventListener('keydown', handleEscapeKey);
};

const handleOptionClick = (option: MenuOption) => {
  updateMenuState({
    showConfirmation: true,
    confirmationMessage: `Are you sure you want to ${option.label.toLowerCase()}? This action cannot be undone.`,
    confirmationAction: option.action,
  });
};

const confirmAction = () => {
  if (menuState.confirmationAction) {
    menuState.confirmationAction();
  }
  closeMenu();
};

const cancelAction = () => {
  updateMenuState({
    showConfirmation: false,
    confirmationAction: null,
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
        aria-expanded=${menuState.isOpen}
        data-testid="overflow-menu-trigger"
      >
        ⋮
      </button>

      ${menuState.isOpen
        ? html`
            <div
              class="overflow-menu-dropdown"
              data-testid="overflow-menu-dropdown"
            >
              ${options.map(
                option => html`
                  <button
                    @click=${() => handleOptionClick(option)}
                    class="overflow-menu-option"
                    type="button"
                    data-testid="overflow-menu-option-${option.id}"
                  >
                    ${option.label}
                  </button>
                `
              )}
            </div>
          `
        : ''}
      ${menuState.showConfirmation
        ? html`
            <dialog open data-testid="confirmation-dialog">
              <p>${menuState.confirmationMessage}</p>
              <div class="confirmation-actions">
                <button
                  @click=${cancelAction}
                  type="button"
                  data-testid="confirmation-cancel"
                >
                  Cancel
                </button>
                <button
                  @click=${confirmAction}
                  type="button"
                  data-testid="confirmation-confirm"
                >
                  Confirm
                </button>
              </div>
            </dialog>
          `
        : ''}
    </div>
  `;
};
