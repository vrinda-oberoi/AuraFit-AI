/**
 * scoringReasons.js
 *
 * Shared helper for building structured scoring reasons across the
 * Fashion Brain. Used by scoringEngine.js, compatibilityEngine.js, and
 * accessoryScoring.js so every module produces reasons in the same
 * shape — enabling future AI-generated explanations to consume the
 * "why" behind a score without re-running any scoring logic.
 *
 * Pure JavaScript. No side effects.
 */

/**
 * @param {{code: string, category: string, message: string, points?: number}} params
 * @returns {{code: string, category: string, message: string, points: number}}
 */
function createReason({ code, category, message, points = 0 }) {
  return { code, category, message, points };
}

/**
 * Flattens structured reason objects into the legacy plain-string
 * format, for backward compatibility with any code that still expects
 * `reasons: string[]`.
 */
function toLegacyStrings(reasonDetails = []) {
  return reasonDetails.map((reason) => reason.message);
}

export { createReason, toLegacyStrings };