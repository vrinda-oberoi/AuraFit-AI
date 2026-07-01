// src/services/outfitGenerator.js
//
// Dummy-but-structured outfit recommendation engine.
// Works entirely off the user's own wardrobeData — no external AI call yet.
// Designed so the real AI engine can later be swapped in behind the same
// generateOutfit(...) / regenerateSlot(...) function signatures.

const TOP_CATEGORIES = ["Tops", "T-Shirts"];
const OUTERWEAR_CATEGORIES = ["Jackets"];
const BOTTOM_CATEGORIES = ["Jeans", "Trousers"];
const SHOE_CATEGORIES = ["Shoes"];
const ACCESSORY_CATEGORIES = ["Accessories"];

const FORMAL_OCCASIONS = ["Formal", "Office"];
const CASUAL_OCCASIONS = ["Casual", "College", "Travel"];

function pickRandom(list) {
  if (!list || list.length === 0) return null;
  return list[Math.floor(Math.random() * list.length)];
}

function byCategory(wardrobe, categories) {
  return wardrobe.filter((item) => categories.includes(item.category));
}

function byColorPreference(items, preferredColors = []) {
  if (preferredColors.length === 0) return items;
  const preferred = items.filter((item) => preferredColors.includes(item.color));
  return preferred.length > 0 ? preferred : items;
}

/**
 * Builds the candidate pool for the "top" slot, taking weather + occasion
 * into account. In cold/rainy weather a jacket is allowed to fill this slot.
 */
function getTopPool(wardrobe, occasion, weather) {
  const includeOuterwear = weather === "Cold" || weather === "Rainy";
  const baseCategories = includeOuterwear
    ? [...TOP_CATEGORIES, ...OUTERWEAR_CATEGORIES]
    : TOP_CATEGORIES;

  let pool = byCategory(wardrobe, baseCategories);

  // Hot weather should avoid jackets outright, even if somehow included above.
  if (weather === "Hot") {
    pool = pool.filter((item) => !OUTERWEAR_CATEGORIES.includes(item.category));
  }

  if (FORMAL_OCCASIONS.includes(occasion)) {
    pool = byColorPreference(
      pool.filter((item) => item.category === "Tops" || OUTERWEAR_CATEGORIES.includes(item.category)).length > 0
        ? pool.filter((item) => item.category === "Tops" || OUTERWEAR_CATEGORIES.includes(item.category))
        : pool,
      []
    );
  } else if (CASUAL_OCCASIONS.includes(occasion)) {
    const tshirts = pool.filter((item) => item.category === "T-Shirts");
    pool = tshirts.length > 0 ? tshirts.concat(pool.filter((i) => OUTERWEAR_CATEGORIES.includes(i.category))) : pool;
  }

  return pool.length > 0 ? pool : byCategory(wardrobe, [...TOP_CATEGORIES, ...OUTERWEAR_CATEGORIES]);
}

function getBottomPool(wardrobe, occasion) {
  let pool = byCategory(wardrobe, BOTTOM_CATEGORIES);

  if (FORMAL_OCCASIONS.includes(occasion)) {
    const trousers = pool.filter((item) => item.category === "Trousers");
    pool = trousers.length > 0 ? trousers : pool;
  } else if (CASUAL_OCCASIONS.includes(occasion)) {
    const jeans = pool.filter((item) => item.category === "Jeans");
    pool = jeans.length > 0 ? jeans : pool;
  }

  return pool.length > 0 ? pool : byCategory(wardrobe, BOTTOM_CATEGORIES);
}

function getShoesPool(wardrobe) {
  return byCategory(wardrobe, SHOE_CATEGORIES);
}

function getAccessoryPool(wardrobe) {
  return byCategory(wardrobe, ACCESSORY_CATEGORIES);
}

const SLOT_POOL_RESOLVERS = {
  top: (wardrobe, occasion, weather) => getTopPool(wardrobe, occasion, weather),
  bottom: (wardrobe, occasion) => getBottomPool(wardrobe, occasion),
  shoes: (wardrobe) => getShoesPool(wardrobe),
  accessory: (wardrobe) => getAccessoryPool(wardrobe),
};

/**
 * Picks one random item for a single outfit slot, optionally avoiding the
 * item that's currently occupying that slot so "Change Top" etc. feels fresh.
 */
export function regenerateSlot(wardrobe, slot, { occasion, weather, currentItem } = {}) {
  const resolver = SLOT_POOL_RESOLVERS[slot];
  if (!resolver) return null;

  let pool = resolver(wardrobe, occasion, weather);

  if (currentItem && pool.length > 1) {
    const withoutCurrent = pool.filter((item) => item.id !== currentItem.id);
    if (withoutCurrent.length > 0) pool = withoutCurrent;
  }

  return pickRandom(pool);
}

/**
 * Generates a full outfit recommendation: { top, bottom, shoes, accessory }.
 * Any slot the wardrobe can't fill simply comes back as null so the UI can
 * show an "Add this category" prompt instead of crashing.
 */
export function generateOutfit(wardrobe, occasion, weather) {
  return {
    top: regenerateSlot(wardrobe, "top", { occasion, weather }),
    bottom: regenerateSlot(wardrobe, "bottom", { occasion, weather }),
    shoes: regenerateSlot(wardrobe, "shoes", { occasion, weather }),
    accessory: regenerateSlot(wardrobe, "accessory", { occasion, weather }),
  };
}

export function regenerateAll(wardrobe, occasion, weather, currentOutfit = {}) {
  return {
    top: regenerateSlot(wardrobe, "top", { occasion, weather, currentItem: currentOutfit.top }),
    bottom: regenerateSlot(wardrobe, "bottom", { occasion, weather, currentItem: currentOutfit.bottom }),
    shoes: regenerateSlot(wardrobe, "shoes", { occasion, weather, currentItem: currentOutfit.shoes }),
    accessory: regenerateSlot(wardrobe, "accessory", { occasion, weather, currentItem: currentOutfit.accessory }),
  };
}