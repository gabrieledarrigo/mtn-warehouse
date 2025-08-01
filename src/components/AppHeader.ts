/**
 * AppHeader Component
 * Renders the application header with title and overflow menu
 */

import { html } from 'lit-html';
import { OverflowMenu, MenuOption } from './OverflowMenu.js';

export interface AppHeaderProps {
  title: string;
  onClearInventory: () => void;
}

export const AppHeader = ({ title, onClearInventory }: AppHeaderProps) => {
  const menuOptions: MenuOption[] = [
    {
      id: 'clear-inventory',
      label: 'Clear Inventory',
      action: onClearInventory,
    },
  ];

  return html`
    <header class="app-header" data-testid="app-header">
      <h1 class="title" data-testid="app-title">${title}</h1>
      <div class="app-header-actions">
        ${OverflowMenu({ options: menuOptions })}
      </div>
    </header>
  `;
};
