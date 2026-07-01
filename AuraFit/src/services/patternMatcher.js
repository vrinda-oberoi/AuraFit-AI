/**
 * patternMatcher.js
 *
 * Pure JavaScript pattern-balance system. Distinct from the existing
 * per-item "has a pattern" bonus in scoringEngine.js — this scores how
 * well two patterns work together across pieces.
 *
 * No React. No side effects.
 */

const PATTERNLESS_VALUES = new Set(["", "none", "plain", "solid"]);

function normalizePattern(pattern) {
  if (!pattern || typeof pattern !== "string") return "";
  return pattern.trim().toLowerCase();
}

function isPlain(pattern) {
  return PATTERNLESS_VALUES.has(normalizePattern(pattern));
}

/**
 * Returns a balance score (0-100) for how well two patterns work
 * together in the same outfit.
 */
function getPatternBalance(patternA, patternB) {
  const a = normalizePattern(patternA);
  const b = normalizePattern(patternB);

  if (!a || !b) return 100; // nothing to clash with

  const aPlain = isPlain(a);
  const bPlain = isPlain(b);

  if (aPlain && bPlain) return 100; // plain + plain, always safe
  if (aPlain || bPlain) return 85; // one plain, one patterned, safe pairing
  if (a === b) return 60; // same bold pattern twice, matchy but mild risk

  return 35; // two different bold patterns, likely to compete
}

export { isPlain, getPatternBalance };
