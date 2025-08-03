/**
 * AppHeader Component
 * Renders the application header with title and overflow menu
 */
import { html } from 'lit-html';
import { OverflowMenu, MenuOption } from './OverflowMenu.js';

export interface AppHeaderProps {
  title: string;
  onClearInventory: () => void;
  onExportInventory: () => void;
  onImportInventory: () => void;
}

export const AppHeader = ({
  title,
  onClearInventory,
  onExportInventory,
  onImportInventory,
}: AppHeaderProps) => {
  const menuOptions: MenuOption[] = [
    {
      id: 'export-inventory',
      label: 'Esporta Inventario',
      action: onExportInventory,
    },
    {
      id: 'import-inventory',
      label: 'Importa Inventario',
      action: onImportInventory,
    },
    {
      id: 'clear-inventory',
      label: 'Svuota Inventario',
      action: onClearInventory,
      confirmation: {
        title: "Svuotare l'inventario?",
        message:
          'Questa azione rimuoverà tutte le quantità dei colori. Non può essere annullata.',
        confirmText: 'Svuota',
        cancelText: 'Annulla',
      },
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
