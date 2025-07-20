/**
 * AppLayout Component
 * Main layout component that orchestrates all UI pieces
 */

import { html } from 'lit-html';
import { AppHeader } from './AppHeader.js';
import { InventoryStats } from './InventoryStats.js';
import { ActionButtons } from './ActionButtons.js';
import { ColorGrid } from './ColorGrid.js';
import { QuantityModal } from './QuantityModal.js';
import type { Color, InventoryItems } from '../types.js';

export interface AppLayoutProps {
  // Header props
  title: string;

  // Stats props
  totalColors: number;
  inventory: InventoryItems;

  // Action handlers
  onClearInventory: () => void;
  onReload: () => void;

  // Grid props
  colors: Color[];
  onColorClick: (color: Color) => void;

  // Modal props
  selectedColor: Color | null;
  modalOpen: boolean;
  onModalClose: () => void;
  onQuantitySave: (quantity: number) => void;
}

export const AppLayout = ({
  title,
  totalColors,
  inventory,
  onClearInventory,
  onReload,
  colors,
  onColorClick,
  selectedColor,
  modalOpen,
  onModalClose,
  onQuantitySave,
}: AppLayoutProps) => {
  return html`
    <div class="app-container">
      ${AppHeader({
        title,
      })}
      ${InventoryStats({
        totalColors,
        inventory,
      })}
      ${ActionButtons({
        onClearInventory,
        onReload,
      })}
      ${ColorGrid({
        colors,
        inventory,
        onColorClick,
      })}
      ${selectedColor
        ? QuantityModal({
            color: selectedColor,
            quantity: inventory[selectedColor.code] || 0,
            isOpen: modalOpen,
            onClose: onModalClose,
            onSave: onQuantitySave,
          })
        : ''}
    </div>
  `;
};
