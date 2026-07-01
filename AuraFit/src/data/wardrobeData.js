const svgDataUrl = (background, accent, label) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 760">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${background[0]}" />
          <stop offset="100%" stop-color="${background[1]}" />
        </linearGradient>
        <linearGradient id="card" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="rgba(255,255,255,0.82)" />
          <stop offset="100%" stop-color="rgba(255,255,255,0.35)" />
        </linearGradient>
      </defs>
      <rect width="600" height="760" rx="48" fill="url(#bg)" />
      <circle cx="470" cy="146" r="130" fill="${accent}" opacity="0.22" />
      <circle cx="150" cy="608" r="150" fill="white" opacity="0.16" />
      <rect x="74" y="82" width="452" height="596" rx="40" fill="url(#card)" opacity="0.94" />
      <path d="M300 190c-54 0-98 44-98 98v122h196V288c0-54-44-98-98-98Z" fill="${accent}" opacity="0.92" />
      <rect x="188" y="396" width="224" height="172" rx="32" fill="${accent}" opacity="0.78" />
      <rect x="152" y="570" width="296" height="26" rx="13" fill="white" opacity="0.34" />
      <text x="300" y="652" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="700" fill="white">
        ${label}
      </text>
    </svg>
  `)}`;

export const wardrobeData = [
  {
    id: 1,
    name: "Black Oversized Hoodie",
    category: "Tops",
    color: "Black",
    season: "Winter",
    addedOn: "2026-06-22",
    image: svgDataUrl(["#1f113d", "#4c1d95"], "#f472b6", "Hoodie"),
  },
  {
    id: 2,
    name: "White Sneakers",
    category: "Shoes",
    color: "White",
    season: "All Season",
    addedOn: "2026-06-21",
    image: svgDataUrl(["#ddd6fe", "#c084fc"], "#7c3aed", "Sneakers"),
  },
  {
    id: 3,
    name: "Blue Denim Jeans",
    category: "Jeans",
    color: "Blue",
    season: "All Season",
    addedOn: "2026-06-20",
    image: svgDataUrl(["#1e3a8a", "#60a5fa"], "#bfdbfe", "Denim"),
  },
  {
    id: 4,
    name: "Casual Black T-Shirt",
    category: "T-Shirts",
    color: "Black",
    season: "Summer",
    addedOn: "2026-06-19",
    image: svgDataUrl(["#111827", "#374151"], "#f9a8d4", "T-Shirt"),
  },
  {
    id: 5,
    name: "Formal White Shirt",
    category: "Tops",
    color: "White",
    season: "All Season",
    addedOn: "2026-06-18",
    image: svgDataUrl(["#f8fafc", "#dbeafe"], "#a855f7", "Shirt"),
  },
  {
    id: 6,
    name: "Beige Trousers",
    category: "Trousers",
    color: "Beige",
    season: "All Season",
    addedOn: "2026-06-17",
    image: svgDataUrl(["#fde68a", "#f5d0fe"], "#c084fc", "Trousers"),
  },
  {
    id: 7,
    name: "Denim Jacket",
    category: "Jackets",
    color: "Indigo",
    season: "Winter",
    addedOn: "2026-06-16",
    image: svgDataUrl(["#312e81", "#818cf8"], "#f472b6", "Jacket"),
  },
  {
    id: 8,
    name: "Silver Watch",
    category: "Accessories",
    color: "Silver",
    season: "All Season",
    addedOn: "2026-06-15",
    image: svgDataUrl(["#cbd5e1", "#94a3b8"], "#e879f9", "Watch"),
  },
];

export const wardrobeCategories = [
  "All",
  "Tops",
  "T-Shirts",
  "Jeans",
  "Trousers",
  "Kurtis",
  "Shoes",
  "Accessories",
  "Jackets",
];
