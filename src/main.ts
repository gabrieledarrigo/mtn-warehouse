/**
 * Main entry point for Montana Hardcore Inventory
 */

import { MONTANA_COLORS } from './colors.js';
import { loadInventory, saveInventory, clearInventory, isStorageAvailable } from './inventory.js';
import { html, render } from 'lit-html';
import { ColorGrid } from './components/ColorGrid.js';
import { QuantityModal } from './components/QuantityModal.js';
import type { Color } from './types.js';

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
        'RV-2000': 5,
        'RV-1050': 0,
        'RV-2010': 1
    };
    saveInventory(inventory);
    console.log('Sample inventory saved:', inventory);
}

// Modal state
let modalOpen = false;
let selectedColor: Color | null = null;

// Event handlers
const handleClearInventory = () => {
    clearInventory();
    console.log('Inventory cleared');
    window.location.reload();
};

const handleReload = () => {
    window.location.reload();
};

const handleColorClick = (color: Color) => {
    console.log('Color clicked:', color);
    selectedColor = color;
    modalOpen = true;
    renderApp();
};

const handleModalClose = () => {
    modalOpen = false;
    selectedColor = null;
    renderApp();
};

const handleQuantitySave = (newQuantity: number) => {
    if (selectedColor) {
        inventory[selectedColor.code] = newQuantity;
        saveInventory(inventory);
        console.log(`Updated ${selectedColor.code} to quantity ${newQuantity}`);
    }
};

const renderApp = () => {
    const appTemplate = html`
        <div style="max-width: 1200px; margin: 0 auto; padding: 20px; font-family: -apple-system, sans-serif;">
            <h1 style="text-align: center; color: #333; margin-bottom: 8px;">🎨 Montana Hardcore Inventory</h1>
            <p style="text-align: center; color: #666; margin-bottom: 32px;">
                Click on any color to update its quantity
            </p>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin: 20px 0; padding: 16px; background: #f8f9fa; border-radius: 8px;">
                <div style="text-align: center;">
                    <strong>Total Colors</strong><br>
                    <span style="font-size: 1.5em; color: #28a745;">${MONTANA_COLORS.length}</span>
                </div>
                <div style="text-align: center;">
                    <strong>In Stock</strong><br>
                    <span style="font-size: 1.5em; color: #28a745;">
                        ${Object.values(inventory).filter(qty => qty > 0).length}
                    </span>
                </div>
                <div style="text-align: center;">
                    <strong>Low Stock</strong><br>
                    <span style="font-size: 1.5em; color: #ffc107;">
                        ${Object.values(inventory).filter(qty => qty === 1).length}
                    </span>
                </div>
                <div style="text-align: center;">
                    <strong>Out of Stock</strong><br>
                    <span style="font-size: 1.5em; color: #dc3545;">
                        ${Object.values(inventory).filter(qty => qty === 0).length}
                    </span>
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

            ${ColorGrid({ 
                colors: MONTANA_COLORS, 
                inventory, 
                onColorClick: handleColorClick 
            })}

            ${selectedColor ? QuantityModal({
                color: selectedColor,
                quantity: inventory[selectedColor.code] || 0,
                isOpen: modalOpen,
                onClose: handleModalClose,
                onSave: handleQuantitySave
            }) : ''}
        </div>
    `;

    const app = document.getElementById('app');
    if (app) {
        render(appTemplate, app);
    }
};

// Initial render
renderApp();
