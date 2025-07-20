import { html, TemplateResult } from 'lit-html';
import type { Color } from '../types.js';

/**
 * Stock status enum for color cards
 */
export enum StockStatus {
  OUT_OF_STOCK = 'out-of-stock',
  LOW_STOCK = 'low-stock',
  IN_STOCK = 'in-stock',
}

/**
 * Props for ColorCard component
 */
export interface ColorCardProps {
  color: Color;
  quantity: number;
  onClick?: (color: Color) => void;
}

/**
 * Color Card component - displays a single color with quantity
 */
export function ColorCard({
  color,
  quantity,
  onClick,
}: ColorCardProps): TemplateResult {
  const handleClick = () => {
    onClick?.(color);
  };

  const getStatusClass = (): StockStatus => {
    if (quantity === 0) {
      return StockStatus.OUT_OF_STOCK;
    }

    if (quantity === 1) {
      return StockStatus.LOW_STOCK;
    }

    return StockStatus.IN_STOCK;
  };

  const getQuantityDisplay = (): string => {
    if (quantity === 0) {
      return '0';
    }

    if (quantity > 99) {
      return '99+';
    }

    return quantity.toString();
  };

  return html`
    <div
      class="color-card ${getStatusClass()}"
      @click=${handleClick}
      title="${color.name} (${color.code})"
    >
      <div class="preview" style="background-color: ${color.hex}"></div>

      <div class="info">
        <div class="code">${color.code}</div>
        <div class="name">${color.name}</div>
      </div>

      <div class="quantity">${getQuantityDisplay()}</div>
    </div>
  `;
}
