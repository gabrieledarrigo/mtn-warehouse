/**
 * InventoryStats Component
 * Displays inventory statistics dashboard
 */

import { html } from 'lit-html';
import type { InventoryItems } from '../types.js';

export interface InventoryStatsProps {
  totalColors: number;
  inventory: InventoryItems;
}

export interface StatItem {
  label: string;
  value: number;
  variant: 'success' | 'warning' | 'danger';
}

const calculateStats = (
  totalColors: number,
  inventory: InventoryItems
): StatItem[] => {
  const inventoryValues = Object.values(inventory);

  return [
    {
      label: 'Total Colors',
      value: totalColors,
      variant: 'success',
    },
    {
      label: 'In Stock',
      value: inventoryValues.filter(quantity => quantity > 0).length,
      variant: 'success',
    },
    {
      label: 'Low Stock',
      value: inventoryValues.filter(quantity => quantity === 1).length,
      variant: 'warning',
    },
    {
      label: 'Out of Stock',
      value: inventoryValues.filter(quantity => quantity === 0).length,
      variant: 'danger',
    },
  ];
};

export const InventoryStats = ({
  totalColors,
  inventory,
}: InventoryStatsProps) => {
  const stats = calculateStats(totalColors, inventory);

  return html`
    <div class="inventory-stats">
      ${stats.map(
        stat => html`
          <div class="item">
            <strong class="label">${stat.label}</strong>
            <span class="value ${stat.variant}"> ${stat.value} </span>
          </div>
        `
      )}
    </div>
  `;
};
