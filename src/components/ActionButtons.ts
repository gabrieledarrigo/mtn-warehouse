/**
 * ActionButtons Component
 * Renders Clear Inventory and Reload buttons
 */

import { html } from 'lit-html';

export interface ActionButtonsProps {
  onClearInventory: () => void;
}

export const ActionButtons = ({ onClearInventory }: ActionButtonsProps) => {
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
    </div>
  `;
};
