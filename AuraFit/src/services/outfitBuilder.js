/**
 * outfitBuilder.js
 *
 * Second layer of the Fashion Brain: assembles a complete outfit from
 * the ranked wardrobe items produced by `generateBestOutfit`.
 *
 * V2: outfit assembly is combination-aware. Instead of picking the
 * single highest-scoring item per role independently, this module
 * searches bounded combinations of top-scoring candidates across
 * required roles using the centralized, role-agnostic
 * compatibilityEngine — so a Top and Bottom that clash in color,
 * pattern, or style no longer both get picked just because each
 * scored well in isolation. Optional roles (Outerwear, Accessory) are
 * then picked against the fixed required selections via
 * accessoryScoring.js, which reuses the same compatibility logic.
 *
 * This module does NOT duplicate any filtering, intrinsic-scoring, or
 * cross-piece compatibility logic — it relies entirely on
 * fashionBrain.js, compatibilityEngine.js, and accessoryScoring.js,
 * and only adds role-grouping and combination search on top.
 *
 * Pure JavaScript. No React. No Axios. No database access. No UI code.
 */

import { generateBestOutfit } from "./fashionBrain";
import { scoreCompatibility } from "./compatibilityEngine";
import { selectBestAccessory } from "./accessoryScoring";
import { resolveConfig } from "./fashionBrainConfig";

/**
 * Configurable mapping of category names -> outfit role.
 * Keys are normalized (lowercased, trimmed) category names.
 *
 * To support a new category, just add an entry here — no other code
 * in this file needs to change.
 */
const CATEGORY_ROLE_MAP = {
  // Top
  shirt: "Top",
  shirts: "Top",
  "t-shirt": "Top",
  "t-shirts": "Top",
  tshirt: "Top",
  tshirts: "Top",
  top: "Top",
  tops: "Top",
  blouse: "Top",
  kurti: "Top",
  kurtis: "Top",

  // Bottom
  jeans: "Bottom",
  trousers: "Bottom",
  trouser: "Bottom",
  "cargo pants": "Bottom",
  pants: "Bottom",
  shorts: "Bottom",
  skirt: "Bottom",
  leggings: "Bottom",

  // Footwear
  shoes: "Footwear",
  sneakers: "Footwear",
  sandals: "Footwear",
  heels: "Footwear",
  boots: "Footwear",
  footwear: "Footwear",

  // Accessory
  watch: "Accessory",
  watches: "Accessory",
  jewelry: "Accessory",
  jewellery: "Accessory",
  belt: "Accessory",
  bag: "Accessory",
  accessories: "Accessory",
  accessory: "Accessory",
  scarf: "Accessory",
  sunglasses: "Accessory",

  // Outerwear
  jacket: "Outerwear",
  jackets: "Outerwear",
  coat: "Outerwear",
  blazer: "Outerwear",
  hoodie: "Outerwear",
  sweater: "Outerwear",
};

const REQUIRED_ROLES = ["Top", "Bottom", "Footwear"];
const OPTIONAL_ROLES = ["Accessory", "Outerwear"];
const ALL_ROLES = [...REQUIRED_ROLES, ...OPTIONAL_ROLES];

function normalizeCategory(category) {
  if (!category || typeof category !== "string") return "";
  return category.trim().toLowerCase();
}

/**
 * Resolves a clothing item's outfit role using the configurable
 * CATEGORY_ROLE_MAP. Returns null if no mapping is found.
 */
function resolveRole(item) {
  const normalized = normalizeCategory(item.category);
  return CATEGORY_ROLE_MAP[normalized] || null;
}

/**
 * Groups ranked items (from generateBestOutfit) by outfit role.
 * Each role bucket preserves the existing score order (highest first),
 * since generateBestOutfit already returns items sorted by score.
 */
function groupByRole(rankedItems) {
  const grouped = ALL_ROLES.reduce((acc, role) => {
    acc[role] = [];
    return acc;
  }, {});

  rankedItems.forEach((rankedItem) => {
    const role = resolveRole(rankedItem.item);
    if (role && grouped[role]) {
      grouped[role].push(rankedItem);
    }
  });

  return grouped;
}

/**
 * Builds a deduplicated, readable list of explanation strings from
 * structured reason objects gathered across every selected piece.
 */
function buildExplanations(reasonDetailsList) {
  const seen = new Set();
  const explanations = [];

  reasonDetailsList.forEach((reason) => {
    if (!reason || !reason.message) return;
    const key = reason.message.trim().toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    explanations.push(reason.message);
  });

  return explanations;
}

/**
 * Calculates the overall outfit score as the average of all selected
 * (combined intrinsic + compatibility) piece scores.
 */
function calculateOverallScore(selectedScores) {
  if (selectedScores.length === 0) return 0;
  const total = selectedScores.reduce((sum, score) => sum + score, 0);
  return Math.round(total / selectedScores.length);
}

/**
 * Searches for the best-scoring combination of candidates across the
 * given required roles. Each candidate's score in a combination is its
 * intrinsic score (from generateBestOutfit) plus its compatibility
 * score against the other candidates in that same combination.
 * Bounded by `config.candidateLimit` per role to keep the search fast.
 *
 * Roles with zero candidates are simply excluded from the search —
 * this is the only way a required slot ends up null (genuinely missing
 * category), never because of an occasion/season mismatch.
 *
 * @returns {{ selections: Object }} map of role -> { item, score, reasonDetails }
 */
function buildRequiredCombination(grouped, requiredRoles, context, config) {
  const rolesWithCandidates = requiredRoles.filter(
    (role) => grouped[role] && grouped[role].length > 0
  );

  if (rolesWithCandidates.length === 0) {
    return { selections: {} };
  }

  const candidatesByRole = rolesWithCandidates.reduce((acc, role) => {
    acc[role] = grouped[role].slice(0, config.candidateLimit);
    return acc;
  }, {});

  const evaluate = (chosen) => {
    const chosenEntries = Object.entries(chosen);
    const items = chosenEntries.map(([, rankedItem]) => rankedItem.item);

    let totalScore = 0;
    const perRole = {};

    chosenEntries.forEach(([role, rankedItem]) => {
      const others = items.filter((i) => i !== rankedItem.item);
      const compat = scoreCompatibility(rankedItem.item, others, context);
      const combinedScore = rankedItem.score + compat.score;

      totalScore += combinedScore;
      perRole[role] = {
        item: rankedItem.item,
        score: combinedScore,
        reasonDetails: [...(rankedItem.reasonDetails || []), ...compat.reasonDetails],
      };
    });

    return { totalScore, perRole };
  };

  let best = null;

  const search = (roleIndex, chosen) => {
    if (roleIndex === rolesWithCandidates.length) {
      const { totalScore, perRole } = evaluate(chosen);
      if (!best || totalScore > best.totalScore) {
        best = { totalScore, perRole };
      }
      return;
    }

    const role = rolesWithCandidates[roleIndex];
    candidatesByRole[role].forEach((rankedItem) => {
      search(roleIndex + 1, { ...chosen, [role]: rankedItem });
    });
  };

  search(0, {});

  return { selections: best ? best.perRole : {} };
}

/**
 * Picks the best-fitting item for a single optional role (Outerwear,
 * Accessory, or any future single-slot role) against the already-fixed
 * required selections. Thin wrapper around accessoryScoring.js, which
 * is where the actual role-agnostic selection algorithm lives.
 */
function pickOptionalRole(grouped, role, assembledItems, context, config, typeLabel) {
  const candidates = (grouped[role] || []).slice(0, config.candidateLimit);
  if (candidates.length === 0) return null;

  const { selection } = selectBestAccessory(candidates, assembledItems, context, typeLabel);
  return selection; // { item, score, reasonDetails } or null
}

/**
 * Assembles a complete outfit from the wardrobe based on context.
 *
 * @param {Array} wardrobe - Array of wardrobe items.
 * @param {Object} context - { occasion, season, weather, preferredColors }
 * @param {Object} [options] - { candidateLimit } — optional tuning.
 *   Omit to use fashionBrainConfig.js defaults; fully backward
 *   compatible since existing callers pass only (wardrobe, context).
 * @returns {{
 *   outfit: { top, bottom, footwear, accessory, outerwear },
 *   overallScore: number,
 *   explanations: string[],
 *   scoringDetails: Array<{role: string, item: Object, score: number, reasonDetails: Object[]}>
 * }}
 *   `scoringDetails` is new and additive — existing callers that only
 *   destructure { outfit, overallScore, explanations } are unaffected.
 *   It exposes the full structured reasoning behind the outfit so a
 *   future AI-explanation feature can generate rich copy without
 *   re-running any scoring.
 */
function generateOutfit(wardrobe = [], context = {}, options = {}) {
  const config = resolveConfig(options);

  // Step 1: reuse the existing Fashion Brain for filtering + scoring.
  const rankedItems = generateBestOutfit(wardrobe, context);

  // Step 2: group ranked items into outfit roles.
  const grouped = groupByRole(rankedItems);

  // Step 3: find the best-compatible combination across required roles.
  const { selections: requiredSelections } = buildRequiredCombination(
    grouped,
    REQUIRED_ROLES,
    context,
    config
  );

  const assembledSoFar = Object.values(requiredSelections).map((s) => s.item);

  // Step 4: pick optional roles against the now-fixed required pieces.
  const outerwearPick = pickOptionalRole(
    grouped,
    "Outerwear",
    assembledSoFar,
    context,
    config,
    "outerwear"
  );
  const assembledWithOuterwear = outerwearPick
    ? [...assembledSoFar, outerwearPick.item]
    : assembledSoFar;

  const accessoryPick = pickOptionalRole(
    grouped,
    "Accessory",
    assembledWithOuterwear,
    context,
    config,
    "accessory"
  );

  const outfit = {
    top: requiredSelections.Top ? requiredSelections.Top.item : null,
    bottom: requiredSelections.Bottom ? requiredSelections.Bottom.item : null,
    footwear: requiredSelections.Footwear ? requiredSelections.Footwear.item : null,
    accessory: accessoryPick ? accessoryPick.item : null,
    outerwear: outerwearPick ? outerwearPick.item : null,
  };

  // Step 5: gather scores + structured reasons for the overall score,
  // the legacy `explanations` array, and the new `scoringDetails`.
  const scoringDetails = [];
  const allReasonDetails = [];
  const selectedScores = [];

  const addSelection = (role, selection) => {
    if (!selection) return;
    selectedScores.push(selection.score);
    allReasonDetails.push(...(selection.reasonDetails || []));
    scoringDetails.push({
      role,
      item: selection.item,
      score: selection.score,
      reasonDetails: selection.reasonDetails || [],
    });
  };

  addSelection("Top", requiredSelections.Top);
  addSelection("Bottom", requiredSelections.Bottom);
  addSelection("Footwear", requiredSelections.Footwear);
  addSelection("Outerwear", outerwearPick);
  addSelection("Accessory", accessoryPick);

  const overallScore = calculateOverallScore(selectedScores);
  const explanations = buildExplanations(allReasonDetails);

  return {
    outfit,
    overallScore,
    explanations,
    scoringDetails,
  };
}

export {
  CATEGORY_ROLE_MAP,
  REQUIRED_ROLES,
  OPTIONAL_ROLES,
  resolveRole,
  generateOutfit,
};