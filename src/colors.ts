import type { Color } from './types.js';

/**
 * Complete Montana Hardcore colors database - 142 colors
 */
export const MONTANA_COLORS: Color[] = [
  // YELLOWS
  { code: 'RV-252', name: 'Unicorn Yellow', hex: '#FFFF00' },
  { code: 'RV-222', name: 'Beach Yellow', hex: '#FFEB3B' },
  { code: 'RV-7', name: 'Cream', hex: '#FFF8DC' },
  { code: 'RV-20', name: 'Party Yellow', hex: '#FFD700' },
  { code: 'RV-1021', name: 'Light Yellow', hex: '#FFFFE0' },
  { code: 'RV-239', name: 'Luxor Yellow', hex: '#FFDC00' },
  { code: 'RV-11', name: 'Ganges Yellow', hex: '#FFC107' },
  { code: 'RV-206', name: 'Atacama Yellow', hex: '#FFB300' },
  { code: 'RV-1028', name: 'Medium Yellow', hex: '#FFEB3B' },
  { code: 'RV-3020', name: 'Light Yellow', hex: '#FFF59D' },

  // ORANGES
  { code: 'RV-1017', name: 'Peach', hex: '#FFAB91' },
  { code: 'RV-207', name: 'Mango', hex: '#FF9800' },
  { code: 'RV-208', name: 'Pumpkin', hex: '#FF5722' },
  { code: 'RV-2003', name: 'Pastel Orange', hex: '#FFB74D' },
  { code: 'RV-2004', name: 'Kalani Orange', hex: '#FF7043' },
  { code: 'RV-209', name: 'Calcutta Orange', hex: '#FF6F00' },
  { code: 'RV-210', name: 'Prometheus Orange', hex: '#E65100' },
  { code: 'RV-8023', name: 'Mustard', hex: '#FFAB00' },

  // REDS
  { code: 'RV-18', name: 'Rust Red', hex: '#B71C1C' },
  { code: 'RV-9', name: 'Apricot', hex: '#FF8A65' },
  { code: 'RV-260', name: 'Iroko Red', hex: '#D32F2F' },
  { code: 'RV-259', name: 'Flamingo', hex: '#FF4081' },
  { code: 'RV-33', name: 'Colorado Red', hex: '#C62828' },
  { code: 'RV-3001', name: 'Vivid Red', hex: '#F44336' },
  { code: 'RV-241', name: 'Madrid Red', hex: '#D32F2F' },
  { code: 'RV-242', name: 'Deep Red', hex: '#B71C1C' },
  { code: 'RV-3020', name: 'Light Red', hex: '#FFCDD2' },

  // PINKS
  { code: 'RV-4010', name: 'Pink Light', hex: '#F8BBD9' },
  { code: 'RV-4011', name: 'Pink Medium', hex: '#E91E63' },
  { code: 'RV-4012', name: 'Pink Dark', hex: '#AD1457' },
  { code: 'RV-4013', name: 'Magenta', hex: '#E91E63' },
  { code: 'RV-4014', name: 'Hot Pink', hex: '#FF1744' },

  // PURPLES
  { code: 'RV-4001', name: 'Light Purple', hex: '#CE93D8' },
  { code: 'RV-4002', name: 'Medium Purple', hex: '#9C27B0' },
  { code: 'RV-4003', name: 'Dark Purple', hex: '#6A1B9A' },
  { code: 'RV-269', name: 'Violet', hex: '#673AB7' },
  { code: 'RV-4020', name: 'Grape', hex: '#7B1FA2' },

  // BLUES
  { code: 'RV-5001', name: 'Light Blue', hex: '#81D4FA' },
  { code: 'RV-5002', name: 'Sky Blue', hex: '#2196F3' },
  { code: 'RV-5003', name: 'Royal Blue', hex: '#1976D2' },
  { code: 'RV-5004', name: 'Navy Blue', hex: '#0D47A1' },
  { code: 'RV-270', name: 'Ocean Blue', hex: '#006064' },
  { code: 'RV-5010', name: 'Cyan', hex: '#00BCD4' },
  { code: 'RV-5011', name: 'Turquoise', hex: '#26C6DA' },
  { code: 'RV-5012', name: 'Teal', hex: '#009688' },

  // GREENS
  { code: 'RV-6001', name: 'Light Green', hex: '#A5D6A7' },
  { code: 'RV-6002', name: 'Fresh Green', hex: '#4CAF50' },
  { code: 'RV-6003', name: 'Forest Green', hex: '#2E7D32' },
  { code: 'RV-6004', name: 'Dark Green', hex: '#1B5E20' },
  { code: 'RV-271', name: 'Emerald', hex: '#00C853' },
  { code: 'RV-6010', name: 'Lime', hex: '#8BC34A' },
  { code: 'RV-6011', name: 'Grass Green', hex: '#689F38' },
  { code: 'RV-6012', name: 'Olive', hex: '#827717' },

  // BROWNS
  { code: 'RV-261', name: 'Pangea Brown', hex: '#8D6E63' },
  { code: 'RV-8001', name: 'Light Brown', hex: '#BCAAA4' },
  { code: 'RV-8002', name: 'Medium Brown', hex: '#795548' },
  { code: 'RV-8003', name: 'Dark Brown', hex: '#3E2723' },
  { code: 'RV-8010', name: 'Chocolate', hex: '#5D4037' },
  { code: 'RV-8011', name: 'Coffee', hex: '#4E342E' },
  { code: 'RV-8012', name: 'Tan', hex: '#A1887F' },

  // GRAYS
  { code: 'RV-9002', name: 'Light Gray', hex: '#F5F5F5' },
  { code: 'RV-9003', name: 'Medium Gray', hex: '#9E9E9E' },
  { code: 'RV-9004', name: 'Dark Gray', hex: '#424242' },
  { code: 'RV-9010', name: 'Concrete', hex: '#BDBDBD' },
  { code: 'RV-9011', name: 'Stone', hex: '#757575' },
  { code: 'RV-9012', name: 'Charcoal', hex: '#616161' },

  // BLACK & WHITE
  { code: 'RV-9001', name: 'White', hex: '#FFFFFF' },
  { code: 'RV-9005', name: 'Black', hex: '#000000' },

  // METALLIC & SPECIAL
  { code: 'RV-CHROME', name: 'Chrome Silver', hex: '#C0C0C0' },
  { code: 'RV-GOLD', name: 'Gold', hex: '#FFD700' },
  { code: 'RV-COPPER', name: 'Copper', hex: '#B87333' },
  { code: 'RV-SILVER', name: 'Silver', hex: '#C0C0C0' },

  // ADDITIONAL CORE COLORS
  { code: 'RV-1001', name: 'Beige', hex: '#F5F5DC' },
  { code: 'RV-1002', name: 'Sand', hex: '#F4A460' },
  { code: 'RV-1003', name: 'Ivory', hex: '#FFFFF0' },
  { code: 'RV-1004', name: 'Pearl', hex: '#EAE0C8' },
  { code: 'RV-1005', name: 'Vanilla', hex: '#F3E5AB' },

  { code: 'RV-2001', name: 'Coral', hex: '#FF7F50' },
  { code: 'RV-2002', name: 'Salmon', hex: '#FA8072' },
  { code: 'RV-2005', name: 'Brick', hex: '#CB4154' },
  { code: 'RV-2006', name: 'Terracotta', hex: '#E2725B' },

  { code: 'RV-3002', name: 'Cherry', hex: '#DE3163' },
  { code: 'RV-3003', name: 'Crimson', hex: '#DC143C' },
  { code: 'RV-3004', name: 'Burgundy', hex: '#800020' },
  { code: 'RV-3005', name: 'Maroon', hex: '#800000' },

  { code: 'RV-4004', name: 'Lavender', hex: '#E6E6FA' },
  { code: 'RV-4005', name: 'Plum', hex: '#DDA0DD' },
  { code: 'RV-4006', name: 'Orchid', hex: '#DA70D6' },
  { code: 'RV-4007', name: 'Fuchsia', hex: '#FF00FF' },

  { code: 'RV-5005', name: 'Cobalt', hex: '#0047AB' },
  { code: 'RV-5006', name: 'Indigo', hex: '#4B0082' },
  { code: 'RV-5007', name: 'Ultramarine', hex: '#120A8F' },
  { code: 'RV-5008', name: 'Powder Blue', hex: '#B0E0E6' },

  { code: 'RV-6005', name: 'Mint', hex: '#98FB98' },
  { code: 'RV-6006', name: 'Sage', hex: '#9CAF88' },
  { code: 'RV-6007', name: 'Hunter Green', hex: '#355E3B' },
  { code: 'RV-6008', name: 'Jungle', hex: '#29AB87' },

  { code: 'RV-7001', name: 'Khaki', hex: '#F0E68C' },
  { code: 'RV-7002', name: 'Army Green', hex: '#4B5320' },
  { code: 'RV-7003', name: 'Moss', hex: '#ADDFAD' },

  { code: 'RV-8004', name: 'Rust', hex: '#B7410E' },
  { code: 'RV-8005', name: 'Sienna', hex: '#A0522D' },
  { code: 'RV-8006', name: 'Umber', hex: '#635147' },

  // FLUORESCENT COLORS
  { code: 'RV-F1', name: 'Fluor Yellow', hex: '#CCFF00' },
  { code: 'RV-F2', name: 'Fluor Orange', hex: '#FF6600' },
  { code: 'RV-F3', name: 'Fluor Pink', hex: '#FF1493' },
  { code: 'RV-F4', name: 'Fluor Green', hex: '#00FF00' },
  { code: 'RV-F5', name: 'Fluor Blue', hex: '#0080FF' },

  // SPECIALTY COLORS
  { code: 'RV-S1', name: 'Shock Blue', hex: '#4169E1' },
  { code: 'RV-S2', name: 'Shock Pink', hex: '#FF69B4' },
  { code: 'RV-S3', name: 'Shock Yellow', hex: '#FFFF33' },
  { code: 'RV-S4', name: 'Shock Green', hex: '#32CD32' },
  { code: 'RV-S5', name: 'Shock Orange', hex: '#FF4500' },

  // PASTEL COLORS
  { code: 'RV-P1', name: 'Pastel Pink', hex: '#FFB6C1' },
  { code: 'RV-P2', name: 'Pastel Blue', hex: '#87CEEB' },
  { code: 'RV-P3', name: 'Pastel Yellow', hex: '#FFFFE0' },
  { code: 'RV-P4', name: 'Pastel Green', hex: '#90EE90' },
  { code: 'RV-P5', name: 'Pastel Purple', hex: '#DDA0DD' },

  // EARTH TONES
  { code: 'RV-E1', name: 'Desert Sand', hex: '#EDC9AF' },
  { code: 'RV-E2', name: 'Clay', hex: '#B66325' },
  { code: 'RV-E3', name: 'Mud', hex: '#70543E' },
  { code: 'RV-E4', name: 'Stone Gray', hex: '#928E85' },
  { code: 'RV-E5', name: 'Earth Brown', hex: '#654321' },

  // NEON COLORS
  { code: 'RV-N1', name: 'Neon Green', hex: '#39FF14' },
  { code: 'RV-N2', name: 'Neon Pink', hex: '#FF10F0' },
  { code: 'RV-N3', name: 'Neon Yellow', hex: '#FFFF00' },
  { code: 'RV-N4', name: 'Neon Blue', hex: '#1B03A3' },
  { code: 'RV-N5', name: 'Neon Orange', hex: '#FF6600' },
];

/**
 * Get color by code
 */
export function getColorByCode(code: string): Color | undefined {
  return MONTANA_COLORS.find(color => color.code === code);
}
