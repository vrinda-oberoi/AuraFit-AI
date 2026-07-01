/**
 * accessoryScoring.js
 *
 * Selects the best-fitting item for a single optional outfit slot,
 * reusing the centralized, role-agnostic compatibilityEngine. Designed
 * to generalize to any accessory type (bag, watch, belt, necklace,
 * cap, sunglasses, ...) via the `typeLabel` parameter — the selection
 * algorithm itself never changes when new types are added, only the
 * label used in the generated reason text.
 *
 * Also reused internally by outfitBuilder.js for Outerwear, since the
 * underlying algorithm — score every candidate's fit against the
 * assembled outfit, pick the best — is identical for any single-slot
 * optional role.
 *
 * Pure JavaScript. No side effects.
 */

import { scoreCompatibility } from "./compatibilityEngine";
import { createReason } from "./scoringReasons";

/**
 * @param {Array} candidates - Ranked candidates ({item, score, reasonDetails}).
 * @param {Array} assembledOutfitItems - Items already selected for the outfit.
 * @param {Object} [context] - { occasion, season, weather, preferredColors }
 * @param {string} [typeLabel] - Label used only for reason text (e.g. "bag", "watch", "outerwear").
 * @returns {{ selection: {item: Object, score: number, reasonDetails: Object[]} | null }}
 */
function selectBestAccessory(candidates = [], assembledOutfitItems = [], context = {}, typeLabel = "accessory") {
  if (!candidates || candidates.length === 0) {
    return { selection: null };
  }

  let best = null;

  candidates.forEach((rankedItem) => {
    const compat = scoreCompatibility(rankedItem.item, assembledOutfitItems, context);
    const combinedScore = rankedItem.score + compat.score;

    if (!best || combinedScore > best.combinedScore) {
      best = {
        item: rankedItem.item,
        combinedScore,
        reasonDetails: [...(rankedItem.reasonDetails || []), ...compat.reasonDetails],
      };
    }
  });

  if (!best) return { selection: null };

  const label = typeLabel.charAt(0).toUpperCase() + typeLabel.slice(1);
  const reasonDetails = [
    ...best.reasonDetails,
    createReason({
      code: `${typeLabel}_selected`,
      category: typeLabel,
      message: `${label} complements the outfit`,
      points: 0,
    }),
  ];

  return {
    selection: { item: best.item, score: best.combinedScore, reasonDetails },
  };
}

export { selectBestAccessory };