// src/utils/plannerStorage.js
//
// Persistence layer for the Weekly Planner.
// Backed by localStorage today; swap internals for an API call without
// touching call sites.

const STORAGE_KEY = "aurafit_weekly_planner";

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
  return Object.fromEntries(DAYS.map((d) => [d, null]));
}

export function readWeekPlan() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const stored = raw ? JSON.parse(raw) : {};
    // Ensure all seven days always exist in the returned object
    return { ...emptyWeek(), ...stored };
  } catch {
    return emptyWeek();
  }
}

export function writeWeekPlan(plan) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
  } catch {
    // Fail silently (private mode / quota)
  }
}

export function assignOutfitToDay(day, outfitEntry) {
  const plan = readWeekPlan();
  plan[day] = outfitEntry;
  writeWeekPlan(plan);
  return plan;
}

export function removeOutfitFromDay(day) {
  const plan = readWeekPlan();
  plan[day] = null;
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
    plan[day] = savedOutfits[idx % savedOutfits.length];
  });

  return plan;
}