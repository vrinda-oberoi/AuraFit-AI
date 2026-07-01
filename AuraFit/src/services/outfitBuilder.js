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
  bottom: "Bottom",
  bottoms: "Bottom",
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
  outerwear: "Outerwear",
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

function getItemId(item) {
  if (!item) return null;
  return item._id || item.id || null;
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
  return Math.round(total / (selectedScores.length * 2));
}

/**
 * Evaluates memory cooldown penalties and reasons for an item being recently worn
 */
function evaluateRecentMemoryPenalty(item, role, context, config) {
  if (!context || !context.recentOutfits) {
    return { penalty: 0, reasons: [] };
  }

  const penalties = config.penalties || {};
  let totalPenalty = 0;
  const reasons = [];

  const id = getItemId(item);
  if (!id) return { penalty: 0, reasons: [] };

  const getRoleItem = (entry) => {
    const o = entry.outfit || entry;
    return o[role.toLowerCase()] || (role.toLowerCase() === "footwear" ? o.shoes : null);
  };

  // Check Today
  const todayEntry = context.recentOutfits.today;
  if (todayEntry) {
    const todayItem = getRoleItem(todayEntry);
    if (getItemId(todayItem) === id) {
      totalPenalty += penalties.wornToday ?? 40;
      reasons.push({
        type: "cooldown",
        message: `This ${role.toLowerCase()} was recently worn today, so another strong alternative was preferred.`
      });
    }
  }

  // Check Yesterday
  const yesterdayEntry = context.recentOutfits.yesterday;
  if (yesterdayEntry) {
    const yesterdayItem = getRoleItem(yesterdayEntry);
    if (getItemId(yesterdayItem) === id) {
      totalPenalty += penalties.wornYesterday ?? 25;
      reasons.push({
        type: "cooldown",
        message: `This ${role.toLowerCase()} was recently worn yesterday, so another strong alternative was preferred.`
      });
    }
  }

  // Check Last 7 (excluding today/yesterday to not double penalize)
  const last7 = context.recentOutfits.last7 || [];
  const inLast7 = last7.some((entry) => {
    if (entry === todayEntry || entry === yesterdayEntry) return false;
    return getItemId(getRoleItem(entry)) === id;
  });
  if (inLast7) {
    totalPenalty += penalties.wornLast7Days ?? 10;
    reasons.push({
      type: "cooldown",
      message: `This ${role.toLowerCase()} was recently worn in the last 7 outfits, so another strong alternative was preferred.`
    });
  }

  // Check Last 30 (excluding today/yesterday/last7)
  const last30 = context.recentOutfits.last30 || [];
  const inLast30 = last30.some((entry) => {
    if (entry === todayEntry || entry === yesterdayEntry || last7.includes(entry)) return false;
    return getItemId(getRoleItem(entry)) === id;
  });
  if (inLast30) {
    totalPenalty += penalties.wornLast30Days ?? 5;
    reasons.push({
      type: "cooldown",
      message: `This ${role.toLowerCase()} was recently worn in the last 30 outfits, so another strong alternative was preferred.`
    });
  }

  return { penalty: totalPenalty, reasons };
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
    const isRegeneratingThisRole = config.regenerateSlot && config.regenerateSlot.toLowerCase() === role.toLowerCase();
    const isRegenerationSession = config.previousOutfit && config.regenerateSlot;

    if (isRegenerationSession && !isRegeneratingThisRole) {
      // It is fixed. Find the item in grouped[role] to get its actual score and reasons
      const prevItem = config.previousOutfit[role.toLowerCase()];
      const prevId = prevItem && (prevItem._id || prevItem.id);
      const foundRanked = prevId && (grouped[role] || []).find((r) => {
        const currId = r.item._id || r.item.id;
        return currId && currId === prevId;
      });

      if (foundRanked) {
        acc[role] = [foundRanked];
      } else if (prevItem) {
        acc[role] = [{ item: prevItem, score: prevItem.score || 0, reasonDetails: [] }];
      } else {
        acc[role] = [];
      }
    } else {
      acc[role] = grouped[role].slice(0, config.candidateLimit);
    }
    return acc;
  }, {});

  const evaluate = (chosen) => {
    const chosenEntries = Object.entries(chosen);
    const items = chosenEntries.map(([, rankedItem]) => rankedItem.item);

    let totalSelectionScore = 0;
    const perRole = {};

    chosenEntries.forEach(([role, rankedItem]) => {
      const others = items.filter((i) => i !== rankedItem.item);
      const compat = scoreCompatibility(rankedItem.item, others, context);
      
      const cleanCombinedScore = rankedItem.score + compat.score;
      let selectionCombinedScore = cleanCombinedScore;

      // Apply item-level penalty if this item was in the previous outfit
      if (config.previousOutfit) {
        const prevItem = config.previousOutfit[role.toLowerCase()];
        if (prevItem) {
          const prevId = getItemId(prevItem);
          const currId = getItemId(rankedItem.item);
          if (prevId && currId && prevId === currId) {
            // Apply a stronger penalty to required roles to encourage changing them
            selectionCombinedScore -= 30;
          }
        }
      }

      // Phase 6: Memory Cooldown Penalty
      const memory = evaluateRecentMemoryPenalty(rankedItem.item, role, context, config);
      selectionCombinedScore -= memory.penalty;

      totalSelectionScore += selectionCombinedScore;
      perRole[role] = {
        item: rankedItem.item,
        score: cleanCombinedScore,
        reasonDetails: [
          ...(rankedItem.reasonDetails || []),
          ...compat.reasonDetails,
          ...memory.reasons,
        ],
      };
    });

    // Apply penalties for reusing combinations
    if (config.previousOutfit) {
      let matchesAll = true;
      let matchesCoreCount = 0; // Tracks Top + Bottom reuse

      rolesWithCandidates.forEach((role) => {
        const prevItem = config.previousOutfit[role.toLowerCase()];
        const currentItem = chosen[role]?.item;
        if (prevItem && currentItem) {
          const prevId = getItemId(prevItem);
          const currId = getItemId(currentItem);
          if (prevId && currId && prevId === currId) {
            if (role === "Top" || role === "Bottom") {
              matchesCoreCount++;
            }
          } else {
            matchesAll = false;
          }
        } else {
          matchesAll = false;
        }
      });

      // 1. Core-silhouette reuse penalty (Top + Bottom are both reused)
      if (matchesCoreCount === 2) {
        totalSelectionScore -= 150;
      }

      // 2. Full combination reuse penalty (all matching)
      if (matchesAll && rolesWithCandidates.length > 0) {
        totalSelectionScore -= 1000;
      }
    }

    // Phase 6: Avoid duplicate combination yesterday
    if (context.recentOutfits?.yesterday) {
      const yesterday = context.recentOutfits.yesterday;
      const yesterdayOutfit = yesterday.outfit || yesterday;
      
      let matchesAllYesterday = true;
      rolesWithCandidates.forEach((role) => {
        const yesterdayItem = yesterdayOutfit[role.toLowerCase()] || (role.toLowerCase() === "footwear" ? yesterdayOutfit.shoes : null);
        const currentItem = chosen[role]?.item;
        if (yesterdayItem && currentItem) {
          if (getItemId(yesterdayItem) !== getItemId(currentItem)) {
            matchesAllYesterday = false;
          }
        } else {
          matchesAllYesterday = false;
        }
      });

      if (matchesAllYesterday && rolesWithCandidates.length > 0) {
        totalSelectionScore -= (config.penalties?.exactDuplicateYesterday ?? 150);
      }
    }

    return { totalSelectionScore, perRole };
  };

  let best = null;

  const search = (roleIndex, chosen) => {
    if (roleIndex === rolesWithCandidates.length) {
      const { totalSelectionScore, perRole } = evaluate(chosen);
      if (!best || totalSelectionScore > best.totalSelectionScore) {
        best = { totalSelectionScore, perRole };
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
  const isRegeneratingThisRole = config.regenerateSlot && config.regenerateSlot.toLowerCase() === typeLabel;
  const isRegenerationSession = config.previousOutfit && config.regenerateSlot;

  if (isRegenerationSession && !isRegeneratingThisRole) {
    // Keep it fixed. Find the previous item in grouped or fallback.
    const prevItem = config.previousOutfit[typeLabel];
    if (!prevItem) return null;

    const prevId = getItemId(prevItem);
    const foundRanked = prevId && (grouped[role] || []).find((r) => {
      const currId = getItemId(r.item);
      return currId && currId === prevId;
    });

    if (foundRanked) {
      const compat = scoreCompatibility(foundRanked.item, assembledItems, context);
      return {
        item: foundRanked.item,
        score: foundRanked.score + compat.score,
        reasonDetails: [...(foundRanked.reasonDetails || []), ...compat.reasonDetails],
      };
    } else {
      const compat = scoreCompatibility(prevItem, assembledItems, context);
      return {
        item: prevItem,
        score: compat.score,
        reasonDetails: compat.reasonDetails,
      };
    }
  }

  const candidates = (grouped[role] || []).slice(0, config.candidateLimit);
  if (candidates.length === 0) return null;

  // Apply item penalty for selection
  let selectionCandidates = candidates.map((candidate) => {
    let penalty = 0;
    const reasons = [];

    if (config.previousOutfit) {
      const prevItem = config.previousOutfit[typeLabel];
      if (prevItem) {
        const prevId = getItemId(prevItem);
        const currId = getItemId(candidate.item);
        if (prevId && currId && prevId === currId) {
          penalty += 30;
        }
      }
    }

    // Phase 6: Memory Cooldown Penalty
    const memory = evaluateRecentMemoryPenalty(candidate.item, role, context, config);
    penalty += memory.penalty;
    reasons.push(...memory.reasons);

    if (penalty > 0) {
      return {
        ...candidate,
        score: candidate.score - penalty,
        reasonDetails: [...(candidate.reasonDetails || []), ...reasons],
      };
    }
    return candidate;
  });

  const { selection } = selectBestAccessory(selectionCandidates, assembledItems, context, typeLabel);
  if (!selection) return null;

  // Restore clean combined score for returned selection
  const originalCandidate = candidates.find((c) => {
    const selId = getItemId(selection.item);
    const candId = getItemId(c.item);
    return selId && candId && selId === candId;
  });

  if (originalCandidate) {
    const compat = scoreCompatibility(selection.item, assembledItems, context);
    selection.score = originalCandidate.score + compat.score;
    // Add memory reasons to final selection if selected candidate was penalized
    const selectedPenalized = selectionCandidates.find((sc) => getItemId(sc.item) === getItemId(selection.item));
    if (selectedPenalized) {
      selection.reasonDetails = [...(selectedPenalized.reasonDetails || []), ...compat.reasonDetails];
    }
  }

  return selection;
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