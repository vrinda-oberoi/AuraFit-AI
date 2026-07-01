/**
 * occasionMatcher.js
 *
 * Curated occasion-relatedness map, mirroring colorMatcher.js's
 * pattern. Pure JavaScript. No side effects.
 */

// Which occasions are considered "related" to which target occasion.
// Not required to be symmetric — lookups only check the target's list.
const OCCASION_RELATIONS = {
  casual: ["college", "travel", "party"],
  college: ["casual", "travel"],
  travel: ["casual", "college"],
  formal: ["office", "party"],
  office: ["formal"],
  party: ["casual", "formal"],
};

const RELATEDNESS = {
  PERFECT: "perfect",
  RELATED: "related",
  NEUTRAL: "neutral",
  DIFFERENT: "different",
};

function normalize(value) {
  if (!value || typeof value !== "string") return "";
  return value.trim().toLowerCase();
}

/**
 * Determines how related an item's occasion tag is to the target
 * occasion. Never used to eliminate items — only to grade them.
 *
 * @param {string} itemOccasion
 * @param {string} targetOccasion
 * @returns {string} one of RELATEDNESS.*
 */
function getOccasionRelatedness(itemOccasion, targetOccasion) {
  const item = normalize(itemOccasion);
  const target = normalize(targetOccasion);

  if (!target) return RELATEDNESS.NEUTRAL; // nothing selected, no opinion
  if (!item) return RELATEDNESS.NEUTRAL; // item has no occasion set, usable anywhere

  if (item === target || item === "all" || item === "all occasion") {
    return RELATEDNESS.PERFECT;
  }

  const related = OCCASION_RELATIONS[target] || [];
  if (related.includes(item)) return RELATEDNESS.RELATED;

  return RELATEDNESS.DIFFERENT;
}

export { OCCASION_RELATIONS, RELATEDNESS, getOccasionRelatedness };