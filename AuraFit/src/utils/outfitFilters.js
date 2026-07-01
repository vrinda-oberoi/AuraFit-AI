/**
 * outfitFilters.js
 *
 * Pure JavaScript filtering utilities for wardrobe items.
 * No React. No side effects. Reusable across frontend and backend.
 *
 * Each function accepts an array of wardrobe `items` and returns a
 * filtered array. Filters are intentionally tolerant of missing or
 * inconsistently-cased fields, since data may come from manual entry
 * or AI metadata.
 */

function normalize(value) {
  if (!value || typeof value !== "string") return "";
  return value.trim().toLowerCase();
}

// Values that mean "this item works for any occasion" — either the field
// was never set, or it was explicitly tagged as universally applicable.
const WILDCARD_OCCASION_VALUES = new Set(["", "all", "all occasion"]);

// Values that mean "this item works in any season".
const WILDCARD_SEASON_VALUES = new Set(["", "all", "all season"]);

/**
 * Filters items by occasion (e.g. "Casual", "Formal", "Party").
 * Matches against item.occasion. If no occasion is provided, all
 * items are returned unfiltered. Items with no occasion set (empty,
 * null, undefined) or tagged "All"/"All Occasion" are always kept,
 * since they're valid for any occasion.
 */
function filterByOccasion(items = [], occasion) {
  const target = normalize(occasion);

  // Agar user ne koi occasion select hi nahi kiya
  if (!target) return items;

  console.log("Selected Occasion:", target);

items.forEach((item) => {
  console.log(item.name, "=>", item.occasion);
});
  return items.filter((item) => {
    const value = item.occasion;

    // Missing occasion => valid for every occasion
    if (value === null || value === undefined || value === "") {
      return true;
    }

    // Agar array hai
    if (Array.isArray(value)) {
      const normalized = value.map(normalize);

      if (
        normalized.includes("all") ||
        normalized.includes("all occasion")
      ) {
        return true;
      }

      return normalized.includes(target);
    }

    // Agar string hai
    const normalized = normalize(value);

    if (
      normalized === "" ||
      normalized === "all" ||
      normalized === "all occasion"
    ) {
      return true;
    }

    return normalized === target;
  });
}

/**
 * Filters items by season (e.g. "Summer", "Winter", "Monsoon", "All Season").
 * Items with no season set (empty, null, undefined) or tagged
 * "All"/"All Season" are always kept, since they're valid for any season.
 */
function filterBySeason(items = [], season) {
  const target = normalize(season);

  // Agar season select nahi hua
  if (!target) return items;

  console.log("Selected Season:", target);

items.forEach((item) => {
  console.log(item.name, "=>", item.season);
});
  return items.filter((item) => {
    const value = item.season;

    // Missing season => valid for every season
    if (value === null || value === undefined || value === "") {
      return true;
    }

    // Array support
    if (Array.isArray(value)) {
      const normalized = value.map(normalize);

      if (
        normalized.includes("all") ||
        normalized.includes("all season")
      ) {
        return true;
      }

      return normalized.includes(target);
    }

    // String support
    const normalized = normalize(value);

    if (
      normalized === "" ||
      normalized === "all" ||
      normalized === "all season"
    ) {
      return true;
    }

    return normalized === target;
  });
}

/**
 * Filters items by category (e.g. "Tops", "Jeans", "Shoes").
 */
function filterByCategory(items = [], category) {
  const target = normalize(category);

  if (!target) return items;

  return items.filter((item) => normalize(item.category) === target);
}

/**
 * Filters out items that are not currently available for use
 * (e.g. marked unavailable, in laundry, archived, or soft-deleted).
 * Items are considered available unless explicitly flagged otherwise.
 */
function filterAvailableItems(items = []) {
  return items.filter((item) => {
    if (item.isAvailable === false) return false;
    if (item.available === false) return false;
    if (item.inLaundry === true) return false;
    if (item.archived === true) return false;
    if (item.deleted === true) return false;
    return true;
  });
}

export {
  filterByOccasion,
  filterBySeason,
  filterByCategory,
  filterAvailableItems,
};