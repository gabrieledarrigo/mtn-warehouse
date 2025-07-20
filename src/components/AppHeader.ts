/**
 * AppHeader Component
 * Renders the application header with title and subtitle
 */

import { html } from 'lit-html';

export interface AppHeaderProps {
  title: string;
}

export const AppHeader = ({ title }: AppHeaderProps) => {
  return html`
    <header class="app-header" data-testid="app-header">
      <h1 class="title" data-testid="app-title">${title}</h1>
    </header>
  `;
};
