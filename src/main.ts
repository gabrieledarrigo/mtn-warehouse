/**
 * Main entry point for Montana Hardcore Inventory
 */

import { MONTANA_COLORS } from './colors.js';
import { loadInventory, saveInventory, clearInventory, isStorageAvailable } from './inventory.js';
import { html, render } from 'lit-html';

console.log('Montana Hardcore Inventory - Starting...');
console.log(`Loaded ${MONTANA_COLORS.length} colors`);

// Test storage
const storageAvailable = isStorageAvailable();
console.log('Storage available:', storageAvailable);

// Load existing inventory or create empty
let inventory = loadInventory();
console.log('Loaded inventory:', inventory);

// Test: add some sample quantities
if (Object.keys(inventory).length === 0) {
    console.log('Adding sample inventory...');
    inventory = {
        'RV-1000': 3,
        'RV-1010': 1,
        'RV-1020': 2,
        'RV-2000': 5
    };
    saveInventory(inventory);
    console.log('Sample inventory saved:', inventory);
}

// Event handlers
const handleClearInventory = () => {
    clearInventory();
    console.log('Inventory cleared');
    window.location.reload();
};

const handleReload = () => {
    window.location.reload();
};

// Main app template using lit-html
const appTemplate = html`
    <div style="max-width: 800px; margin: 0 auto; padding: 20px; font-family: -apple-system, sans-serif;">
        <h1 style="text-align: center; color: #333;">🎨 Montana Hardcore Inventory</h1>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin: 20px 0; padding: 16px; background: #f8f9fa; border-radius: 8px;">
            <div style="text-align: center;">
                <strong>Colors loaded</strong><br>
                <span style="font-size: 1.5em; color: #28a745;">${MONTANA_COLORS.length}</span>
            </div>
            <div style="text-align: center;">
                <strong>Storage</strong><br>
                <span style="font-size: 1.5em;">${storageAvailable ? '✅' : '❌'}</span>
            </div>
            <div style="text-align: center;">
                <strong>Items in inventory</strong><br>
                <span style="font-size: 1.5em; color: #007bff;">${Object.keys(inventory).length}</span>
            </div>
        </div>

        <div style="margin: 20px 0; text-align: center;">
            <button @click=${handleClearInventory} style="margin: 0 8px; padding: 8px 16px; border: 1px solid #dc3545; background: white; color: #dc3545; border-radius: 4px; cursor: pointer;">
                Clear Inventory
            </button>
            <button @click=${handleReload} style="margin: 0 8px; padding: 8px 16px; border: 1px solid #007bff; background: white; color: #007bff; border-radius: 4px; cursor: pointer;">
                Reload
            </button>
        </div>

        <div style="margin: 20px 0;">
            <h3 style="margin-bottom: 16px;">Sample Colors (showing first 10)</h3>
            <ul style="list-style: none; padding: 0;">
                ${MONTANA_COLORS.slice(0, 10).map(color => html`
                    <li style="margin: 8px 0; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div 
                                style="width: 24px; height: 24px; border-radius: 50%; background: ${color.hex}; border: 1px solid #ccc;"
                                title="${color.name}"
                            ></div>
                            <span style="font-weight: bold; min-width: 80px;">${color.code}</span>
                            <span style="flex: 1;">${color.name}</span>
                            <span style="background: #f0f0f0; padding: 4px 8px; border-radius: 12px;">
                                qty: ${inventory[color.code] || 0}
                            </span>
                        </div>
                    </li>
                `)}
                ${MONTANA_COLORS.length > 10 ? html`
                    <li style="text-align: center; margin: 16px 0; color: #666; font-style: italic;">
                        ... and ${MONTANA_COLORS.length - 10} more colors
                    </li>
                ` : ''}
            </ul>
        </div>
    </div>
`;

// Render app
const app = document.getElementById('app');
if (app) {
    render(appTemplate, app);
}
