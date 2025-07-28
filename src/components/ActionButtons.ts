/**
 * ActionButtons Component
 * Renders Clear Inventory and Reload buttons
 */

import { html } from 'lit-html';

export interface ActionButtonsProps {
  onClearInventory: () => void;
  onReload: () => void;
}

export const ActionButtons = ({
  onClearInventory,
  onReload,
}: ActionButtonsProps) => {
  return html`
    <div class="action-buttons" data-testid="action-buttons">
      <button
        @click=${onClearInventory}
        class="btn danger"
        type="button"
        data-testid="clear-inventory-btn"
      >
        Clear Inventory
      </button>
      <button
        @click=${onReload}
        class="btn primary"
        type="button"
        data-testid="reload-btn"
      >
        Reload
      </button>
    </div>
  `;
};
