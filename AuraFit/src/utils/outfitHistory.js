// src/utils/outfitHistory.js
//
// Thin persistence layer for saved outfits. Backed by localStorage today;
// swap the internals for an API call later without touching call sites.

const STORAGE_KEY = "aurafit_outfit_history";

function readHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeHistory(history) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // Storage may be unavailable (private mode, quota) — fail silently for now.
  }
}

export function getOutfitHistory() {
  return readHistory().sort((a, b) => b.savedOn.localeCompare(a.savedOn));
}

export function saveOutfitToHistory({ outfit, occasion, weather }) {
  const history = readHistory();

  const entry = {
    id: `outfit-${Date.now()}`,
    outfit,
    occasion,
    weather,
    savedOn: new Date().toISOString(),
  };

  history.push(entry);
  writeHistory(history);

  return entry;
}

export function deleteOutfitFromHistory(entryId) {
  const history = readHistory().filter((entry) => entry.id !== entryId);
  writeHistory(history);
}