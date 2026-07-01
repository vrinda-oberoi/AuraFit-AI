// src/utils/plannerStorage.js
//
// Persistence layer for the Weekly Planner.
// Backed by localStorage today; swap internals for an API call without
// touching call sites.

function getStorageKey() {
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      const id = user._id || user.id || "guest";
      return `aurafit_weekly_planner_${id}`;
    }
  } catch (e) {
    // Fail silently
  }
  return "aurafit_weekly_planner_guest";
}

export const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

function emptyWeek() {
  return Object.fromEntries(DAYS.map((d) => [d, []]));
}

export function readWeekPlan() {
  try {
    const raw = localStorage.getItem(getStorageKey());
    const stored = raw ? JSON.parse(raw) : {};
    
    // Normalize stored plan to reference-based array format
    const normalized = {};
    DAYS.forEach((day) => {
      const val = stored[day];
      if (!val) {
        normalized[day] = [];
      } else if (Array.isArray(val)) {
        normalized[day] = val;
      } else if (val._id || val.id) {
        normalized[day] = [{ id: val._id || val.id, slot: "all" }];
      } else {
        normalized[day] = [];
      }
    });
    return normalized;
  } catch {
    return emptyWeek();
  }
}

export function writeWeekPlan(plan) {
  try {
    localStorage.setItem(getStorageKey(), JSON.stringify(plan));
  } catch {
    // Fail silently (private mode / quota)
  }
}

export function assignOutfitToDay(day, outfitEntry, option = "replace") {
  const plan = readWeekPlan();
  const id = outfitEntry._id || outfitEntry.id;
  const newRef = { id, slot: "all" };

  if (option === "replace") {
    plan[day] = [newRef];
  } else if (option === "keepBoth") {
    if (!Array.isArray(plan[day])) {
      plan[day] = [];
    }
    // Prevent duplicate entries of same ID on the same day
    if (!plan[day].some(ref => ref.id === id)) {
      plan[day].push(newRef);
    }
  }

  writeWeekPlan(plan);
  return plan;
}

export function removeOutfitFromDay(day, entryIndex = 0) {
  const plan = readWeekPlan();
  if (Array.isArray(plan[day])) {
    plan[day].splice(entryIndex, 1);
  } else {
    plan[day] = [];
  }
  writeWeekPlan(plan);
  return plan;
}

export function clearWeekPlan() {
  writeWeekPlan(emptyWeek());
  return emptyWeek();
}

/**
 * Auto-fills the week from a list of saved outfit entries.
 * Uses round-robin rotation to avoid repeating outfits where possible.
 */
export function generateWeekPlan(savedOutfits) {
  const plan = emptyWeek();
  if (!savedOutfits.length) return plan;

  DAYS.forEach((day, idx) => {
    const outfit = savedOutfits[idx % savedOutfits.length];
    plan[day] = [{ id: outfit._id || outfit.id, slot: "all" }];
  });

  return plan;
}