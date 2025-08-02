/**
 * OverflowMenu Component
 * Provides three-dots menu for administrative actions
 */
import { html } from 'lit-html';

export interface MenuOption {
  id: string;
  label: string;
  action: () => void;
  confirmation?: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
  };
}

export interface OverflowMenuProps {
  options: MenuOption[];
  onClose?: () => void;
}

interface MenuState {
  isOpen: boolean;
  confirmationAction: (() => void) | null;
  currentConfirmation: MenuOption['confirmation'] | null;
}

let menuState: MenuState = {
  isOpen: false,
  confirmationAction: null,
  currentConfirmation: null,
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
    currentConfirmation: null,
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
    currentConfirmation: null,
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
  if (option.confirmation) {
    updateMenuState({
      confirmationAction: option.action,
      currentConfirmation: option.confirmation,
    });
    openDialog();
  } else {
    option.action();
    closeMenu();
  }
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
          <h2>
            ${menuState.currentConfirmation?.title ||
            'Sei sicuro di voler continuare?'}
          </h2>
          <p>
            ${menuState.currentConfirmation?.message ||
            'Questa azione non può essere annullata.'}
          </p>
          <footer class="confirmation-actions">
            <button
              @click=${cancelAction}
              type="button"
              class="btn cancel"
              data-testid="confirmation-cancel"
            >
              ${menuState.currentConfirmation?.cancelText || 'Annulla'}
            </button>
            <button
              @click=${confirmAction}
              type="button"
              class="btn danger"
              data-testid="confirmation-confirm"
            >
              ${menuState.currentConfirmation?.confirmText || 'Conferma'}
            </button>
          </footer>
        </div>
      </dialog>
    </div>
  `;
};
