const CATEGORY_KEYWORDS = [
  { keywords: ["t-shirt", "tshirt", "tee"], category: "T-Shirts" },
  { keywords: ["shirt"], category: "Shirts" },
  { keywords: ["hoodie", "hoody"], category: "Hoodies" },
  { keywords: ["sweater", "pullover", "jumper"], category: "Sweaters" },
  { keywords: ["jacket", "blazer", "coat"], category: "Jackets" },
  { keywords: ["top", "blouse"], category: "Tops" },
  { keywords: ["jean", "denim"], category: "Jeans" },
  { keywords: ["short"], category: "Shorts" },
  {
    keywords: [
      "pant",
      "pants",
      "trouser",
      "trousers",
      "cargo",
      "cargo pants",
      "wide leg",
      "wide-leg",
      "slacks",
      "joggers",
      "leggings",
      "formal pants",
      "chinos",
    ],
    category: "Trousers",
  },
  { keywords: ["skirt"], category: "Skirts" },
  { keywords: ["dress", "gown", "frock"], category: "Dresses" },
  { keywords: ["kurti", "kurta"], category: "Kurtis" },
  {
    keywords: [
      "shoe",
      "shoes",
      "sneaker",
      "sneakers",
      "trainer",
      "running shoe",
      "footwear",
      "boot",
      "boots",
      "loafer",
      "heels",
      "heel",
      "sandals",
      "slippers",
    ],
    category: "Shoes",
  },
  { keywords: ["bag", "handbag", "backpack", "tote", "clutch"], category: "Bags" },
  {
    keywords: [
      "jhumka",
      "earring",
      "earrings",
      "necklace",
      "bracelet",
      "ring",
      "watch",
      "belt",
      "cap",
      "bag",
      "clutch",
      "scarf",
    ],
    category: "Accessories",
  },
];

const CATEGORY_TITLE_MAP = {
  Tops: "Top",
  "T-Shirts": "T-Shirt",
  Shirts: "Shirt",
  Jeans: "Jeans",
  Trousers: "Trousers",
  Shorts: "Shorts",
  Skirts: "Skirt",
  Dresses: "Dress",
  Jackets: "Jacket",
  Hoodies: "Hoodie",
  Sweaters: "Sweater",
  Shoes: "Sneakers",
  Accessories: "Accessories",
  Bags: "Bag",
  Kurtis: "Kurti",
};

const COLOR_MAP = {
  "dark brown": "Brown",
  "chocolate brown": "Brown",
  "light brown": "Brown",
  "off white": "White",
  ivory: "White",
  cream: "White",
  charcoal: "Black",
  navy: "Blue",
  "sky blue": "Blue",
  maroon: "Red",
};

const normalizeCategory = (category) => {
  if (!category || typeof category !== "string") {
    return "";
  }

  const value = category.trim().toLowerCase();

  const match = CATEGORY_KEYWORDS.find(({ keywords }) =>
    keywords.some((keyword) => value.includes(keyword))
  );

  return match ? match.category : category.trim();
};

const titleCase = (text) => {
  if (!text || typeof text !== "string") {
    return "";
  }

  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) =>
      word
        .split(/(-)/)
        .map((part) => {
          if (!part || part === "-") {
            return part || "";
          }

          return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
        })
        .join("")
    )
    .join(" ");
};

const normalizeColor = (color) => {
  if (!color || typeof color !== "string") {
    return "";
  }

  const trimmed = color.trim();
  if (!trimmed) {
    return "";
  }

  const normalizedKey = trimmed.toLowerCase().replace(/[^a-z]+/g, " ").trim();
  if (COLOR_MAP[normalizedKey]) {
    return COLOR_MAP[normalizedKey];
  }

  return titleCase(trimmed);
};

const normalizeColors = (colors) => {
  if (!Array.isArray(colors)) {
    return [];
  }

  const cleaned = colors
    .map((color) => normalizeColor(color))
    .filter((color) => color.length > 0);

  const seen = new Set();
  return cleaned.filter((color) => {
    const key = color.toLowerCase();
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
};

const clampConfidence = (confidence) => {
  const num = Number(confidence);

  if (isNaN(num)) {
    return 0;
  }

  return Math.min(1, Math.max(0, num));
};

const formatFit = (fit) => {
  if (!fit || typeof fit !== "string") return "";

  const trimmed = fit.trim();
  if (!trimmed) return "";

  return titleCase(trimmed);
};

const buildTitle = (data) => {
  if (!data || typeof data !== "object") {
    return "";
  }

  const category = normalizeCategory(data.category);
  const colors = normalizeColors(data.colors);
  const primaryColor = colors[0] || "";
  const style = data.style ? titleCase(data.style.trim()) : data.pattern ? titleCase(data.pattern.trim()) : "";
  const fabric = data.fabric ? titleCase(data.fabric.trim()) : "";
  const fit = formatFit(data.fit);
  const categoryTitle = category ? CATEGORY_TITLE_MAP[category] || category : "";

  const titleParts = [primaryColor, style, fabric, fit, categoryTitle].filter(Boolean);
  const dedupedParts = [];
  const seen = new Set();

  titleParts.forEach((part) => {
    const key = part.toLowerCase();
    if (seen.has(key)) {
      return;
    }

    seen.add(key);
    dedupedParts.push(part);
  });

  return dedupedParts.join(" ").replace(/\s+/g, " ").trim();
};

const normalizeVisionData = (data) => {
  if (!data || typeof data !== "object") {
    return data;
  }

  const normalized = {
    ...data,
    category: normalizeCategory(data.category),
    colors: normalizeColors(data.colors),
    confidence: clampConfidence(data.confidence),
  };

  normalized.description = buildTitle(normalized);
  normalized.title = normalized.description;

  return normalized;
};

module.exports = {
  normalizeVisionData,
};