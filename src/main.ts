/**
 * Main entry point for Montana Hardcore Inventory
 */

import { MONTANA_COLORS } from './colors.js';
import { loadInventory, saveInventory, clearInventory, isStorageAvailable } from './inventory.js';

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

// Simple initialization
const app = document.getElementById('app');
if (app) {
    app.innerHTML = `
        <h1>🎨 Montana Hardcore Inventory</h1>
        <p>Colors loaded: ${MONTANA_COLORS.length}</p>
        <p>Storage available: ${storageAvailable ? '✅' : '❌'}</p>
        <p>Inventory items: ${Object.keys(inventory).length}</p>
        <div style="margin: 20px 0;">
            <button onclick="window.clearInventory()">Clear Inventory</button>
            <button onclick="window.location.reload()">Reload</button>
        </div>
        <ul>
            ${MONTANA_COLORS.slice(0, 10).map(color => 
                `<li>${color.code} - ${color.name} (qty: ${inventory[color.code] || 0})</li>`
            ).join('')}
            ${MONTANA_COLORS.length > 10 ? `<li>... and ${MONTANA_COLORS.length - 10} more</li>` : ''}
        </ul>
    `;
}

// Global function for testing
(window as any).clearInventory = () => {
    clearInventory();
    console.log('Inventory cleared');
    window.location.reload();
};
