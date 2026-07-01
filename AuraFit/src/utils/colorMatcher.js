/**
 * colorMatcher.js
 *
 * Pure JavaScript color compatibility system for the Fashion Brain.
 * No React. No side effects. Reusable across frontend and backend.
 */

// Colors that are considered "neutral" and pair well with almost everything.
const NEUTRAL_COLORS = [
  "white",
  "black",
  "grey",
  "gray",
  "beige",
  "cream",
  "brown",
  "navy",
];

// Curated compatibility map. Each color lists the colors it pairs well with.
// This is intentionally symmetric-ish but doesn't need to be perfectly
// symmetric — lookups check both directions.
const COLOR_COMPATIBILITY = {
  white: ["blue", "black", "grey", "beige", "cream", "brown", "navy", "pink", "lavender", "green", "red"],
  blue: ["white", "grey", "beige", "cream", "brown", "navy", "pink"],
  black: ["white", "grey", "beige", "cream", "pink", "red", "lavender", "green"],
  grey: ["white", "black", "blue", "pink", "lavender", "navy", "red", "green"],
  beige: ["white", "blue", "black", "brown", "navy", "green", "red"],
  cream: ["white", "blue", "black", "brown", "navy", "pink", "lavender"],
  brown: ["white", "beige", "cream", "navy", "green"],
  navy: ["white", "blue", "beige", "cream", "pink", "grey"],
  pink: ["white", "black", "grey", "cream", "navy", "lavender"],
  lavender: ["white", "black", "grey", "cream", "pink"],
  green: ["white", "black", "beige", "brown", "grey"],
  red: ["white", "black", "grey", "beige"],
};

function normalizeColor(color) {
  if (!color || typeof color !== "string") return "";
  return color.trim().toLowerCase();
}

function isNeutral(color) {
  return NEUTRAL_COLORS.includes(normalizeColor(color));
}

/**
 * Returns a compatibility score (0-100) between two colors.
 */
function getColorCompatibility(colorA, colorB) {
  const a = normalizeColor(colorA);
  const b = normalizeColor(colorB);

  if (!a || !b) return 0;

  // Same color always pairs well (tonal outfit).
  if (a === b) return 90;

  // Neutrals match almost everything.
  if (isNeutral(a) || isNeutral(b)) return 85;

  const aMatches = COLOR_COMPATIBILITY[a] || [];
  const bMatches = COLOR_COMPATIBILITY[b] || [];

  if (aMatches.includes(b) || bMatches.includes(a)) return 75;

  // No known relationship — still wearable, just not a curated match.
  return 35;
}

/**
 * Scores compatibility across an array of colors (e.g. an outfit).
 * Returns the average pairwise compatibility score (0-100).
 */
function getPaletteCompatibility(colors = []) {
  const cleaned = colors.map(normalizeColor).filter(Boolean);

  if (cleaned.length < 2) return 100;

  let total = 0;
  let pairs = 0;

  for (let i = 0; i < cleaned.length; i += 1) {
    for (let j = i + 1; j < cleaned.length; j += 1) {
      total += getColorCompatibility(cleaned[i], cleaned[j]);
      pairs += 1;
    }
  }

  return pairs === 0 ? 100 : Math.round(total / pairs);
}

export {
  NEUTRAL_COLORS,
  COLOR_COMPATIBILITY,
  isNeutral,
  getColorCompatibility,
  getPaletteCompatibility,
};