/**
 * ImportPreviewModal Component
 * Shows preview of changes before applying import
 */
import { html } from 'lit-html';
import type { ImportPreview } from '../data-import.js';
import { MergeStrategy } from '../data-import.js';

export interface ImportPreviewModalProps {
  preview: ImportPreview;
  strategy: MergeStrategy;
  onConfirm: (strategy: MergeStrategy) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export const ImportPreviewModal = ({
  preview,
  strategy,
  onConfirm,
  onCancel,
  isOpen,
}: ImportPreviewModalProps) => {
  if (!isOpen) return '';

  const handleStrategyChange = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    const newStrategy = target.value as MergeStrategy;
    // We'll need to update this externally since we can't change props directly
    window.dispatchEvent(new CustomEvent('import-strategy-change', {
      detail: { strategy: newStrategy }
    }));
  };

  const handleConfirm = () => {
    onConfirm(strategy);
  };

  return html`
    <dialog class="import-preview-modal" ?open=${isOpen} data-testid="import-preview-modal">
      <div class="import-preview-content">
        <header class="modal-header">
          <h2>Anteprima Importazione</h2>
          <button 
            @click=${onCancel}
            class="close-button"
            type="button"
            aria-label="Chiudi"
            data-testid="import-preview-close"
          >
            ×
          </button>
        </header>

        <div class="modal-body">
          <div class="strategy-selection">
            <label for="merge-strategy">Strategia di importazione:</label>
            <select 
              id="merge-strategy" 
              @change=${handleStrategyChange}
              .value=${strategy}
              data-testid="merge-strategy-select"
            >
              <option value=${MergeStrategy.MERGE}>Unisci con esistente</option>
              <option value=${MergeStrategy.REPLACE}>Sostituisci tutto</option>
            </select>
            <p class="strategy-description">
              ${strategy === MergeStrategy.MERGE 
                ? 'I nuovi dati saranno aggiunti a quelli esistenti. I conflitti saranno sovrascritti.' 
                : 'Tutti i dati esistenti saranno sostituiti con quelli importati.'}
            </p>
          </div>

          <div class="preview-summary">
            <h3>Riepilogo delle modifiche</h3>
            <div class="changes-grid">
              ${preview.newColors.length > 0 ? html`
                <div class="change-group new-colors">
                  <h4>Nuovi colori (${preview.newColors.length})</h4>
                  <div class="color-list">
                    ${preview.newColors.slice(0, 5).map(code => html`
                      <span class="color-code">${code}</span>
                    `)}
                    ${preview.newColors.length > 5 ? html`
                      <span class="more-items">+${preview.newColors.length - 5} altri</span>
                    ` : ''}
                  </div>
                </div>
              ` : ''}

              ${preview.updatedColors.length > 0 ? html`
                <div class="change-group updated-colors">
                  <h4>Colori aggiornati (${preview.updatedColors.length})</h4>
                  <div class="color-list">
                    ${preview.updatedColors.slice(0, 5).map(code => html`
                      <span class="color-code">${code}</span>
                    `)}
                    ${preview.updatedColors.length > 5 ? html`
                      <span class="more-items">+${preview.updatedColors.length - 5} altri</span>
                    ` : ''}
                  </div>
                </div>
              ` : ''}

              ${preview.removedColors.length > 0 ? html`
                <div class="change-group removed-colors">
                  <h4>Colori rimossi (${preview.removedColors.length})</h4>
                  <div class="color-list">
                    ${preview.removedColors.slice(0, 5).map(code => html`
                      <span class="color-code">${code}</span>
                    `)}
                    ${preview.removedColors.length > 5 ? html`
                      <span class="more-items">+${preview.removedColors.length - 5} altri</span>
                    ` : ''}
                  </div>
                </div>
              ` : ''}

              ${preview.unchangedColors.length > 0 ? html`
                <div class="change-group unchanged-colors">
                  <h4>Colori invariati (${preview.unchangedColors.length})</h4>
                </div>
              ` : ''}
            </div>

            ${preview.totalChanges === 0 ? html`
              <div class="no-changes">
                <p>Nessuna modifica sarà applicata. L'inventario importato è identico a quello esistente.</p>
              </div>
            ` : html`
              <div class="total-changes">
                <strong>Totale modifiche: ${preview.totalChanges}</strong>
              </div>
            `}
          </div>
        </div>

        <footer class="modal-footer">
          <button 
            @click=${onCancel}
            type="button"
            class="btn cancel"
            data-testid="import-preview-cancel"
          >
            Annulla
          </button>
          <button 
            @click=${handleConfirm}
            type="button"
            class="btn primary"
            data-testid="import-preview-confirm"
            ?disabled=${preview.totalChanges === 0}
          >
            Conferma Importazione
          </button>
        </footer>
      </div>
    </dialog>
  `;
};