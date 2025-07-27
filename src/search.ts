import type { Color } from './types.js';

export interface SearchResult {
  color: Color;
  matchType: 'code' | 'name';
  matchIndex: number;
}

/**
 * Search colors by RV code or name with type-safe filtering
 */
export function searchColors(
  colors: Color[],
  searchTerm: string
): SearchResult[] {
  if (!searchTerm.trim()) {
    return colors.map(color => ({
      color,
      matchType: 'code' as const,
      matchIndex: 0,
    }));
  }

  const normalizedSearchTerm = searchTerm.toLowerCase();

  const results: SearchResult[] = [];

  for (const color of colors) {
    const normalizedCode = color.code.toLowerCase();
    const normalizedName = color.name.toLowerCase();

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
    const aExactCode = a.color.code.toLowerCase() === normalizedSearchTerm;
    const bExactCode = b.color.code.toLowerCase() === normalizedSearchTerm;

    if (aExactCode && !bExactCode) {
      return -1;
    }

    if (!aExactCode && bExactCode) {
      return 1;
    }

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
