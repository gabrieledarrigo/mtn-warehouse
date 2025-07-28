import { html, TemplateResult } from 'lit-html';
import type { Color } from '../colors.js';

export interface QuantityModalProps {
  color: Color;
  quantity: number;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newQuantity: number) => void;
}

export function QuantityModal({
  color,
  quantity,
  isOpen,
  onClose,
  onSave,
}: QuantityModalProps): TemplateResult {
  if (!isOpen) {
    return html``;
  }

  let currentQuantity = quantity;

  const handleIncrement = () => {
    currentQuantity = Math.min(currentQuantity + 1, 999);
    updateQuantityDisplay();
  };

  const handleDecrement = () => {
    currentQuantity = Math.max(currentQuantity - 1, 0);
    updateQuantityDisplay();
  };

  const handleInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const value = parseInt(target.value) || 0;
    currentQuantity = Math.max(0, Math.min(999, value));
    target.value = currentQuantity.toString();
  };

  const handleSave = () => {
    onSave(currentQuantity);
    onClose();
  };

  const handleCancel = () => {
    currentQuantity = quantity;
    onClose();
  };

  const handleOverlayClick = (e: Event) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    }
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  const updateQuantityDisplay = () => {
    const input = document.getElementById('quantity-input') as HTMLInputElement;
    if (input) {
      input.value = currentQuantity.toString();
    }
  };

  return html`
    <div
      class="modal overlay"
      data-testid="quantity-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabindex="-1"
      @click=${handleOverlayClick}
      @keydown=${handleKeydown}
    >
      <div class="content">
        <div class="header">
          <div class="preview" style="background-color: ${color.hex}"></div>
          <div class="details">
            <h3 class="title" id="modal-title" data-testid="modal-color-name">
              ${color.name}
            </h3>
            <p class="code" data-testid="modal-color-code">${color.code}</p>
          </div>
          <button
            class="close"
            @click=${handleCancel}
            aria-label="Close"
            data-testid="modal-close-btn"
          >
            ×
          </button>
        </div>

        <div class="body">
          <div class="quantity-section">
            <label for="quantity-input" class="label">Quantity</label>

            <div class="controls">
              <button
                class="button decrease"
                data-testid="decrement-btn"
                @click=${handleDecrement}
                ?disabled=${currentQuantity <= 0}
                aria-label="Decrease quantity"
              >
                −
              </button>

              <input
                id="quantity-input"
                data-testid="quantity-input"
                type="number"
                class="input"
                .value=${currentQuantity.toString()}
                min="0"
                max="999"
                aria-label="Quantity"
                @input=${handleInputChange}
                @focus=${(e: Event) => (e.target as HTMLInputElement).select()}
              />

              <button
                class="button increase"
                data-testid="increment-btn"
                @click=${handleIncrement}
                ?disabled=${currentQuantity >= 999}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div class="footer">
          <button
            class="button cancel"
            @click=${handleCancel}
            data-testid="modal-cancel-btn"
          >
            Cancel
          </button>
          <button
            class="button save"
            @click=${handleSave}
            data-testid="modal-save-btn"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  `;
}
