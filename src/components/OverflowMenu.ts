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

let menuState = {
  isOpen: false,
  confirmationAction: null as (() => void) | null,
};

const updateMenuState = (newState: Partial<typeof menuState>) => {
  menuState = { ...menuState, ...newState };

  window.dispatchEvent(new CustomEvent('overflow-menu-state-change'));
};

const toggleMenu = () => {
  updateMenuState({ isOpen: !menuState.isOpen });

  if (menuState.isOpen) {
    // Add event listeners when menu opens
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleEscapeKey);
  } else {
    // Remove event listeners when menu closes
    document.removeEventListener('click', handleOutsideClick);
    document.removeEventListener('keydown', handleEscapeKey);
  }
};

const closeMenu = () => {
  updateMenuState({
    isOpen: false,
    confirmationAction: null,
  });
  document.removeEventListener('click', handleOutsideClick);
  document.removeEventListener('keydown', handleEscapeKey);
};

const confirmAction = () => {
  if (menuState.confirmationAction) {
    menuState.confirmationAction();
  }
  closeMenu();
  closeDialog();
};

const cancelAction = () => {
  updateMenuState({
    confirmationAction: null,
  });
  closeDialog();
  closeMenu(); // Also close the overflow menu when canceling
};

const openDialog = () => {
  const dialog = document.querySelector(
    '.confirmation-dialog'
  ) as HTMLDialogElement;

  if (dialog) {
    dialog.showModal();

    // Handle backdrop click to close
    dialog.addEventListener(
      'click',
      event => {
        if (event.target === dialog) {
          cancelAction();
        }
      },
      { once: true }
    );
  }
};

const closeDialog = () => {
  const dialog = document.querySelector(
    '.confirmation-dialog'
  ) as HTMLDialogElement;

  if (dialog) {
    dialog.close();
  }
};

const handleOptionClick = (option: MenuOption) => {
  updateMenuState({
    confirmationAction: option.action,
  });
  openDialog();
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

      <dialog class="confirmation-dialog" data-testid="confirmation-dialog">
        <div class="confirmation-dialog-content">
          <h2>Are you sure you want to proceed?</h2>
          <p>This action cannot be undone.</p>
          <footer class="confirmation-actions">
            <button
              @click=${cancelAction}
              type="button"
              class="btn cancel"
              data-testid="confirmation-cancel"
            >
              Cancel
            </button>
            <button
              @click=${confirmAction}
              type="button"
              class="btn danger"
              data-testid="confirmation-confirm"
            >
              Confirm
            </button>
          </footer>
        </div>
      </dialog>
    </div>
  `;
};
