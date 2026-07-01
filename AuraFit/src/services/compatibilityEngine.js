/**
 * compatibilityEngine.js
 *
 * Centralized, ROLE-AGNOSTIC cross-piece compatibility scoring.
 *
 * This module has no concept of "Top", "Bottom", "Accessory", "Bag",
 * or any other role — it only reads item attributes (color, pattern,
 * style, occasion) and scores how well a candidate item fits alongside
 * an arbitrary set of already-selected items. This lets outfitBuilder.js
 * and accessoryScoring.js share the exact same compatibility logic for
 * any current or future clothing/accessory type, with zero changes
 * required here when new types are added.
 *
 * Pure JavaScript. No side effects.
 */
import { getColorCompatibility, isNeutral } from "../utils/colorMatcher";
import { getStyleCompatibility } from "./styleMatcher";
import { getPatternBalance } from "./patternMatcher";
import { getOccasionRelatedness, RELATEDNESS } from "./occasionMatcher";
import { createReason, toLegacyStrings } from "./scoringReasons";

const COMPATIBILITY_WEIGHTS = {
  color: 40,
  pattern: 25,
  style: 25,
  occasionCoherence: 10,
};

function getItemColor(item) {
  return item.color || (Array.isArray(item.colors) && item.colors[0]) || "";
}

/**
 * Scores how well a single candidate item fits alongside a set of
 * already-selected items. Role-agnostic: `selectedItems` can be any
 * mix of clothing pieces or accessories, current or future.
 *
 * @param {Object} candidate - The item being evaluated.
 * @param {Array} selectedItems - Items already chosen for this outfit.
 * @param {Object} [context] - { occasion, season, weather, preferredColors }
 * @returns {{ score: number, reasons: string[], reasonDetails: Object[] }}
 */
function scoreCompatibility(candidate = {}, selectedItems = [], context = {}) {
  const others = (selectedItems || []).filter(Boolean).filter((i) => i !== candidate);

  if (others.length === 0) {
    return { score: 0, reasons: [], reasonDetails: [] };
  }

  const reasonDetails = [];
  let colorTotal = 0;
  let colorCount = 0;
  let patternTotal = 0;
  let patternCount = 0;
  let styleTotal = 0;
  let styleCount = 0;
  let occasionTotal = 0;
  let occasionCount = 0;

  const candidateColor = getItemColor(candidate);

  others.forEach((other) => {
    const otherColor = getItemColor(other);
    if (candidateColor && otherColor) {
      colorTotal += getColorCompatibility(candidateColor, otherColor);
      colorCount += 1;
    }

    if (candidate.pattern && other.pattern) {
      patternTotal += getPatternBalance(candidate.pattern, other.pattern);
      patternCount += 1;
    }

    if (candidate.style && other.style) {
      styleTotal += getStyleCompatibility(candidate.style, other.style);
      styleCount += 1;
    }

    if (candidate.occasion && other.occasion) {
      const relatedness = getOccasionRelatedness(candidate.occasion, other.occasion);
      const points =
        relatedness === RELATEDNESS.PERFECT
          ? 100
          : relatedness === RELATEDNESS.RELATED
          ? 75
          : relatedness === RELATEDNESS.NEUTRAL
          ? 60
          : 30;
      occasionTotal += points;
      occasionCount += 1;
    }
  });

  let score = 0;

  if (colorCount > 0) {
    const avgColor = colorTotal / colorCount;
    const points = Math.round((avgColor / 100) * COMPATIBILITY_WEIGHTS.color);
    score += points;
    if (avgColor >= 75) {
      reasonDetails.push(
        createReason({
          code: "compat_color_harmony",
          category: "color",
          message: isNeutral(candidateColor)
            ? "Neutral tone blends with the outfit"
            : "Color harmonizes with the rest of the outfit",
          points,
        })
      );
    }
  }

  if (patternCount > 0) {
    const avgPattern = patternTotal / patternCount;
    const points = Math.round((avgPattern / 100) * COMPATIBILITY_WEIGHTS.pattern);
    score += points;
    if (avgPattern < 50) {
      reasonDetails.push(
        createReason({
          code: "compat_pattern_clash",
          category: "pattern",
          message: "Pattern may compete with other pieces",
          points,
        })
      );
    } else if (avgPattern >= 75) {
      reasonDetails.push(
        createReason({
          code: "compat_pattern_balance",
          category: "pattern",
          message: "Pattern balances well with the outfit",
          points,
        })
      );
    }
  }

  if (styleCount > 0) {
    const avgStyle = styleTotal / styleCount;
    const points = Math.round((avgStyle / 100) * COMPATIBILITY_WEIGHTS.style);
    score += points;
    if (avgStyle >= 75) {
      reasonDetails.push(
        createReason({
          code: "compat_style_match",
          category: "style",
          message: "Style is consistent with the rest of the outfit",
          points,
        })
      );
    }
  }

  if (occasionCount > 0) {
    const avgOccasion = occasionTotal / occasionCount;
    const points = Math.round((avgOccasion / 100) * COMPATIBILITY_WEIGHTS.occasionCoherence);
    score += points;
  }

  return { score, reasons: toLegacyStrings(reasonDetails), reasonDetails };
}

export { COMPATIBILITY_WEIGHTS, scoreCompatibility };