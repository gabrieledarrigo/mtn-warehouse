import { html, TemplateResult } from 'lit-html';
import type { Color } from '../types.js';
import { ColorCard } from './ColorCard.js';

/**
 * Props for ColorGrid component
 */
export interface ColorGridProps {
  colors: Color[];
  inventory: Record<string, number>;
  onColorClick?: (color: Color) => void;
}

/**
 * Color Grid component - displays all colors in a responsive grid
 */
export function ColorGrid({ colors, inventory, onColorClick }: ColorGridProps): TemplateResult {
  return html`
    <div class="color-grid">
      ${colors.map(color => 
        ColorCard({
          color,
          quantity: inventory[color.code] || 0,
          onClick: onColorClick
        })
      )}
    </div>
  `;
}
