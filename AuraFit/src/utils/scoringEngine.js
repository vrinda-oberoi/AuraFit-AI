/**
 * scoringEngine.js
 *
 * Pure JavaScript scoring engine for the Fashion Brain.
 * No React. No side effects. Reusable across frontend and backend.
 */

import { getColorCompatibility, isNeutral } from "./colorMatcher";
import { getOccasionRelatedness, RELATEDNESS } from "../services/occasionMatcher";
import { createReason, toLegacyStrings } from "../services/scoringReasons";


const SCORE_WEIGHTS = {
  occasion: 40,
  season: 25,
  color: 20,
  fabric: 10,
  pattern: 5,
};

// Graded points for occasion/season matching. These never gate whether
// an item is included — every available item is scored, and
// occasion/season only influence how high it scores.
const OCCASION_SCORE = {
  perfect: 40,  // exact occasion match (or item tagged "All"/"All Occasion")
  related: 25,  // occasion is related to the target (e.g. College <-> Casual)
  missing: 15,  // item has no occasion set at all (neutral, usable anywhere)
  different: 5, // item has an unrelated occasion set
};

const SEASON_SCORE = {
  perfect: 25, // exact season match (or item is tagged "All"/"All Season")
  different: 5, // item has a different season set
  missing: 15, // item has no season set at all
};

const FALLBACK_EXPLANATION = "Showing the best available outfit from your wardrobe.";

const MAX_SCORE = 100;

function normalize(value) {
  if (!value || typeof value !== "string") return "";
  return value.trim().toLowerCase();
}

/**
 * Calculates a compatibility score for a single wardrobe item against
 * the given outfit-generation context.
 *
 * @param {Object} item - A wardrobe item (clothing piece).
 * @param {Object} context - { occasion, season, weather, preferredColors }
 * @returns {{ score: number, reasons: string[], reasonDetails: Object[] }}
 *   `reasons` is kept for backward compatibility (plain strings, same
 *   as v1). `reasonDetails` is the new structured form — an array of
 *   { code, category, message, points } — so future AI explanation
 *   features can consume the "why" behind a score without re-running
 *   any scoring logic.
 */
function calculateItemScore(item = {}, context = {}) {
  const { occasion, season, weather, preferredColors = [] } = context;

  let score = 0;
  const reasonDetails = [];
  let isPerfectMatch = true;

  // --- Occasion Match (graded, never eliminates the item) ---
  const targetOccasion = normalize(occasion);

  if (targetOccasion) {
    const relatedness = getOccasionRelatedness(item.occasion, occasion);

    if (relatedness === RELATEDNESS.PERFECT) {
      score += OCCASION_SCORE.perfect;
      reasonDetails.push(
        createReason({
          code: "occasion_perfect",
          category: "occasion",
          message: `Suitable for ${occasion}`,
          points: OCCASION_SCORE.perfect,
        })
      );
    } else if (relatedness === RELATEDNESS.RELATED) {
      score += OCCASION_SCORE.related;
      isPerfectMatch = false;
      reasonDetails.push(
        createReason({
          code: "occasion_related",
          category: "occasion",
          message: `Works well for ${occasion}`,
          points: OCCASION_SCORE.related,
        })
      );
    } else if (relatedness === RELATEDNESS.NEUTRAL) {
      score += OCCASION_SCORE.missing;
      isPerfectMatch = false;
    } else {
      score += OCCASION_SCORE.different;
      isPerfectMatch = false;
    }
  }

  // --- Season Match (graded, never eliminates the item) ---
  const itemSeason = normalize(item.season);
  const targetSeason = normalize(season);

  if (targetSeason) {
    if (!itemSeason) {
      score += SEASON_SCORE.missing;
      isPerfectMatch = false;
    } else if (
      itemSeason === targetSeason ||
      itemSeason === "all" ||
      itemSeason === "all season"
    ) {
      score += SEASON_SCORE.perfect;
      reasonDetails.push(
        createReason({
          code: itemSeason === targetSeason ? "season_perfect" : "season_wildcard",
          category: "season",
          message:
            itemSeason === targetSeason ? `Perfect for ${season}` : "Works in any season",
          points: SEASON_SCORE.perfect,
        })
      );
    } else {
      score += SEASON_SCORE.different;
      isPerfectMatch = false;
    }
  }

  if (!isPerfectMatch) {
    reasonDetails.push(
      createReason({
        code: "fallback_note",
        category: "general",
        message: FALLBACK_EXPLANATION,
        points: 0,
      })
    );
  }

  // --- Color Harmony (+20) ---
  const itemColor = item.color || (item.colors && item.colors[0]);
  let bestColorScore = 0;
  let bestMatchedColor = null;

  if (itemColor && preferredColors.length > 0) {
    preferredColors.forEach((preferredColor) => {
      const compatibility = getColorCompatibility(itemColor, preferredColor);
      if (compatibility > bestColorScore) {
        bestColorScore = compatibility;
        bestMatchedColor = preferredColor;
      }
    });

    if (bestColorScore > 0) {
      const colorPoints = Math.round((bestColorScore / 100) * SCORE_WEIGHTS.color);
      score += colorPoints;

      if (isNeutral(itemColor)) {
        reasonDetails.push(
          createReason({
            code: "color_neutral",
            category: "color",
            message: "Neutral color combination",
            points: colorPoints,
          })
        );
      } else if (bestMatchedColor) {
        reasonDetails.push(
          createReason({
            code: "color_preferred_match",
            category: "color",
            message: `Pairs well with ${bestMatchedColor}`,
            points: colorPoints,
          })
        );
      }
    }
  } else if (itemColor && isNeutral(itemColor)) {
    const colorPoints = Math.round(0.85 * SCORE_WEIGHTS.color);
    score += colorPoints;
    reasonDetails.push(
      createReason({
        code: "color_neutral",
        category: "color",
        message: "Neutral color combination",
        points: colorPoints,
      })
    );
  }

  // --- Fabric Match (+10) ---
  const itemFabric = normalize(item.fabric);
  const targetWeather = normalize(weather);

  const fabricMatches =
    (targetWeather.includes("hot") && ["cotton", "linen"].includes(itemFabric)) ||
    (targetWeather.includes("cold") && ["wool", "fleece", "denim"].includes(itemFabric)) ||
    (targetWeather.includes("rain") && itemFabric === "polyester");

  if (fabricMatches) {
    score += SCORE_WEIGHTS.fabric;
    reasonDetails.push(
      createReason({
        code: "fabric_weather_match",
        category: "fabric",
        message: `Fabric suited for ${weather} weather`,
        points: SCORE_WEIGHTS.fabric,
      })
    );
  }

  // --- Pattern Bonus (+5) ---
  const itemPattern = normalize(item.pattern);

  if (itemPattern && itemPattern !== "none" && itemPattern !== "plain") {
    score += SCORE_WEIGHTS.pattern;
    reasonDetails.push(
      createReason({
        code: "pattern_bonus",
        category: "pattern",
        message: `Stylish ${item.pattern} pattern`,
        points: SCORE_WEIGHTS.pattern,
      })
    );
  }

  score = Math.min(score, MAX_SCORE);

  return { score, reasons: toLegacyStrings(reasonDetails), reasonDetails };
}

export {
  SCORE_WEIGHTS,
  OCCASION_SCORE,
  SEASON_SCORE,
  FALLBACK_EXPLANATION,
  MAX_SCORE,
  calculateItemScore,
};