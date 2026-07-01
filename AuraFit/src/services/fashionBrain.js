/**
 * fashionBrain.js
 * ...(header comment unchanged)...
 */

import { filterAvailableItems } from "../utils/outfitFilters";
import { calculateItemScore } from "../utils/scoringEngine";

function generateBestOutfit(wardrobe = [], context = {}) {
  const allItems = Array.isArray(wardrobe) ? wardrobe : [];

  const available = filterAvailableItems(allItems);

  const scoredItems = available.map((item) => {
    const { score, reasons, reasonDetails } = calculateItemScore(item, context);
    return { item, score, reasons, reasonDetails };
  });

  return scoredItems.sort((a, b) => b.score - a.score);
}

export { generateBestOutfit };