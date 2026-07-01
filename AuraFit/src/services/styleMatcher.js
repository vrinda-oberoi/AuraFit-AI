/**
 * styleMatcher.js
 *
 * Pure JavaScript style compatibility system, mirroring the structure
 * of colorMatcher.js. No React. No side effects.
 */

const STYLE_COMPATIBILITY = {
  casual: ["streetwear", "sporty", "smart casual", "bohemian"],
  formal: ["business", "smart casual", "classic"],
  business: ["formal", "classic", "smart casual"],
  streetwear: ["casual", "sporty"],
  sporty: ["casual", "streetwear"],
  "smart casual": ["casual", "formal", "business", "classic"],
  classic: ["formal", "business", "smart casual"],
  bohemian: ["casual"],
};

function normalizeStyle(style) {
  if (!style || typeof style !== "string") return "";
  return style.trim().toLowerCase();
}

/**
 * Returns a compatibility score (0-100) between two styles.
 */
function getStyleCompatibility(styleA, styleB) {
  const a = normalizeStyle(styleA);
  const b = normalizeStyle(styleB);

  if (!a || !b) return 60; // unknown style, neutral, no strong opinion
  if (a === b) return 90; // same style, cohesive outfit

  const aMatches = STYLE_COMPATIBILITY[a] || [];
  const bMatches = STYLE_COMPATIBILITY[b] || [];

  if (aMatches.includes(b) || bMatches.includes(a)) return 75;

  return 40; // no known relationship, mismatched styles
}

export { STYLE_COMPATIBILITY, getStyleCompatibility };