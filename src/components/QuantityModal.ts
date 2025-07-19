import { html, TemplateResult } from 'lit-html';
import type { Color } from '../types.js';

export interface QuantityModalProps {
  color: Color;
  quantity: number;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newQuantity: number) => void;
}

export function QuantityModal({ color, quantity, isOpen, onClose, onSave }: QuantityModalProps): TemplateResult {
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
      @click=${handleOverlayClick}
      @keydown=${handleKeydown}
      tabindex="-1"
    >
      <div class="content">
        <div class="header">
          <div class="preview" style="background-color: ${color.hex}"></div>
          <div class="details">
            <h3 class="title">${color.name}</h3>
            <p class="code">${color.code}</p>
          </div>
          <button class="close" @click=${handleCancel} aria-label="Close">
            ×
          </button>
        </div>

        <div class="body">
          <div class="quantity-section">
            <label for="quantity-input" class="label">Quantity</label>
            
            <div class="controls">
              <button 
                class="button decrease"
                @click=${handleDecrement}
                ?disabled=${currentQuantity <= 0}
                aria-label="Decrease quantity"
              >
                −
              </button>
              
              <input 
                id="quantity-input"
                type="number"
                class="input"
                .value=${currentQuantity.toString()}
                min="0"
                max="999"
                @input=${handleInputChange}
                @focus=${(e: Event) => (e.target as HTMLInputElement).select()}
              />
              
              <button 
                class="button increase"
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
          <button class="button cancel" @click=${handleCancel}>
            Cancel
          </button>
          <button class="button save" @click=${handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  `;
}
