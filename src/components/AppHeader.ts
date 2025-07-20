/**
 * AppHeader Component
 * Renders the application header with title and subtitle
 */

import { html } from 'lit-html';

export interface AppHeaderProps {
  title: string;
  subtitle: string;
  emoji?: string;
}

export const AppHeader = ({
  title,
  subtitle,
  emoji = '🎨',
}: AppHeaderProps) => {
  return html`
    <header class="app-header">
      <h1 class="title">${emoji} ${title}</h1>
      <p class="subtitle">${subtitle}</p>
    </header>
  `;
};
