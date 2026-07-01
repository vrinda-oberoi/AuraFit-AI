// src/services/memoryService.js
import axios from "axios";

/**
 * Memory Service acts as a clean abstraction layer between the Fashion Brain and Outfit History.
 * Future extensibility: can support liked/disliked outfits, style frequency, favorite colors, etc.
 */
export async function getRecentOutfitsMemory() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { today: null, yesterday: null, last7: [], last30: [] };
    }

    const response = await axios.get("http://localhost:5000/api/outfits", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const history = response.data || [];
    return processHistoryToMemory(history);
  } catch (err) {
    console.error("Failed to load recent outfits memory:", err);
    return { today: null, yesterday: null, last7: [], last30: [] };
  }
}

export function processHistoryToMemory(history) {
  const now = new Date();
  
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  const yesterdayEnd = new Date(todayStart);
  yesterdayEnd.setMilliseconds(-1);

  let todayOutfit = null;
  let yesterdayOutfit = null;
  const last7 = [];
  const last30 = [];

  history.forEach((entry, idx) => {
    const savedDate = new Date(entry.createdAt || entry.savedOn);
    
    // 1. Check Today
    if (savedDate >= todayStart) {
      if (!todayOutfit) todayOutfit = entry;
    }
    // 2. Check Yesterday
    else if (savedDate >= yesterdayStart && savedDate <= yesterdayEnd) {
      if (!yesterdayOutfit) yesterdayOutfit = entry;
    }

    // 3. Last 7 (idx 0 to 6)
    if (idx < 7) {
      last7.push(entry);
    }
    // 4. Last 30 (idx 0 to 29)
    if (idx < 30) {
      last30.push(entry);
    }
  });

  return {
    today: todayOutfit,
    yesterday: yesterdayOutfit,
    last7,
    last30,
    // Extensible placeholders for future styled memory
    favoriteColors: [],
    favoriteStyles: [],
    frequentlyWorn: [],
    likedOutfits: [],
    dislikedOutfits: [],
  };
}
