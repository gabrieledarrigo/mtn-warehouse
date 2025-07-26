/**
 * Search utilities for filtering colors by RV code or name
 */

import type { Color, SearchResult, SearchOptions } from './types.js';

/**
 * Default search options
 */
const DEFAULT_SEARCH_OPTIONS: SearchOptions = {
  caseSensitive: false,
  exactMatch: false,
  debounceMs: 300,
};

/**
 * Search colors by RV code or name with type-safe filtering
 */
export function searchColors(
  colors: Color[],
  searchTerm: string,
  options: SearchOptions = DEFAULT_SEARCH_OPTIONS
): SearchResult[] {
  if (!searchTerm.trim()) {
    return colors.map(color => ({
      color,
      matchType: 'code' as const,
      matchIndex: 0,
    }));
  }

  const { caseSensitive = false } = options;
  const normalizedSearchTerm = caseSensitive ? searchTerm : searchTerm.toLowerCase();
  
  const results: SearchResult[] = [];

  for (const color of colors) {
    const normalizedCode = caseSensitive ? color.code : color.code.toLowerCase();
    const normalizedName = caseSensitive ? color.name : color.name.toLowerCase();
    
    // Check for RV code match
    const codeIndex = normalizedCode.indexOf(normalizedSearchTerm);
    if (codeIndex !== -1) {
      results.push({
        color,
        matchType: 'code',
        matchIndex: codeIndex,
      });
      continue;
    }
    
    // Check for name match
    const nameIndex = normalizedName.indexOf(normalizedSearchTerm);
    if (nameIndex !== -1) {
      results.push({
        color,
        matchType: 'name',
        matchIndex: nameIndex,
      });
    }
  }

  // Sort results: exact matches first, then by match index
  return results.sort((a, b) => {
    // Prioritize exact matches
    const aExactCode = caseSensitive 
      ? a.color.code === searchTerm 
      : a.color.code.toLowerCase() === normalizedSearchTerm;
    const bExactCode = caseSensitive 
      ? b.color.code === searchTerm 
      : b.color.code.toLowerCase() === normalizedSearchTerm;
      
    if (aExactCode && !bExactCode) return -1;
    if (!aExactCode && bExactCode) return 1;
    
    // Then by match index (earlier matches first)
    return a.matchIndex - b.matchIndex;
  });
}

/**
 * Extract just the colors from search results
 */
export function getColorsFromSearchResults(results: SearchResult[]): Color[] {
  return results.map(result => result.color);
}

/**
 * Check if a search term matches a color
 */
export function isColorMatch(
  color: Color,
  searchTerm: string,
  caseSensitive: boolean = false
): boolean {
  if (!searchTerm.trim()) return true;
  
  const normalizedSearchTerm = caseSensitive ? searchTerm : searchTerm.toLowerCase();
  const normalizedCode = caseSensitive ? color.code : color.code.toLowerCase();
  const normalizedName = caseSensitive ? color.name : color.name.toLowerCase();
  
  return normalizedCode.includes(normalizedSearchTerm) || 
         normalizedName.includes(normalizedSearchTerm);
}