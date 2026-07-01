// src/pages/WeeklyPlanner.jsx
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getOutfitHistory } from "../utils/outfitHistory";
import {
  DAYS,
  readWeekPlan,
  assignOutfitToDay,
  removeOutfitFromDay,
  clearWeekPlan,
  generateWeekPlan,
  writeWeekPlan,
} from "../utils/plannerStorage";
import PlannerDayCard from "../components/PlannerDayCard";

// ─── helpers ─────────────────────────────────────────────────────────────────

function getTodayDayName() {
  return new Date()
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();
}

// ─── assign-outfit modal ──────────────────────────────────────────────────────

function AssignModal({ day, history, onAssign, onClose }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return history;
    const q = search.toLowerCase();
    return history.filter(
      (e) =>
        e.occasion?.toLowerCase().includes(q) ||
        e.weather?.toLowerCase().includes(q) ||
        Object.values(e.outfit ?? {})
          .filter(Boolean)
          .some((item) => item.name?.toLowerCase().includes(q))
    );
  }, [history, search]);

  const dayLabel = day.charAt(0).toUpperCase() + day.slice(1);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-[#2E1065]/40 backdrop-blur-sm" />

      <div
        className="relative z-10 flex w-full max-w-lg flex-col rounded-[2rem] border border-white/60 bg-white/40 shadow-[0_24px_60px_rgba(91,33,182,0.25),inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-3xl"
        style={{ maxHeight: "80vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between border-b border-white/40 px-6 py-4">
          <div>
            <h2 className="text-base font-bold text-[#2E1065]">
              Assign Outfit — {dayLabel}
            </h2>
            <p className="text-xs text-[#6D28D9]/65">
              Choose from your saved outfits
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/55 bg-white/40 p-2 text-[#6D28D9] transition hover:bg-white/60"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-3">
          <div className="relative">
            <svg
              className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6D28D9]/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search outfits…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-white/55 bg-white/40 py-2 pl-10 pr-4 text-sm text-[#2E1065] placeholder-[#6D28D9]/40 outline-none transition focus:border-[#A855F7]/60 focus:bg-white/55"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {filtered.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm text-[#4C1D95]/65">
                {history.length === 0
                  ? "No saved outfits yet. Generate and save one first."
                  : "No outfits match your search."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => onAssign(entry)}
                  className="flex w-full items-center gap-3 rounded-[1.25rem] border border-white/50 bg-white/30 p-3 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] transition hover:bg-white/50"
                >
                  {/* Thumbnails */}
                  <div className="flex shrink-0 -space-x-2">
                    {["top", "bottom", "shoes", "accessory"].map((slot) => {
                      const item = entry.outfit?.[slot];
                      if (!item?.image) return null;
                      return (
                        <img
                          key={slot}
                          src={item.image}
                          alt={item.name}
                          className="h-9 w-9 rounded-full border-2 border-white/80 object-cover"
                        />
                      );
                    })}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="rounded-full bg-gradient-to-r from-[#6D28D9] to-[#9333EA] px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-widest text-white">
                        {entry.occasion}
                      </span>
                      <span className="rounded-full border border-[#C084FC]/50 bg-[#F3E8FF]/60 px-2.5 py-0.5 text-[0.6rem] font-semibold text-[#7C3AED]">
                        {entry.weather}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-[0.7rem] text-[#4C1D95]/65">
                      {new Date(entry.savedOn).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── stat card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, gradient }) {
  return (
    <div className="flex flex-col items-center rounded-[1.25rem] border border-white/55 bg-white/30 px-5 py-4 shadow-[0_6px_20px_rgba(91,33,182,0.1),inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-2xl">
      <span
        className={`bg-gradient-to-r ${gradient} bg-clip-text text-3xl font-bold tabular-nums text-transparent`}
      >
        {value}
      </span>
      <span className="mt-1 text-center text-xs font-medium text-[#6D28D9]/70">
        {label}
      </span>
    </div>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function WeeklyPlanner() {
  const navigate = useNavigate();

  const [plan, setPlan] = useState(() => readWeekPlan());
  const [history] = useState(() => getOutfitHistory());
  const [modal, setModal] = useState(null); // null | { day, mode }

  const today = getTodayDayName();

  // Stats
  const plannedDays = DAYS.filter((d) => plan[d] !== null).length;
  const remainingDays = 7 - plannedDays;
  const totalAssigned = plannedDays; // same metric; kept explicit for clarity

  const openAssign = (day) => setModal({ day, mode: "assign" });
  const closeModal = () => setModal(null);

  const handleAssign = (entry) => {
    if (!modal) return;
    const updated = assignOutfitToDay(modal.day, entry);
    setPlan({ ...updated });
    closeModal();
  };

  const handleRemove = (day) => {
    const updated = removeOutfitFromDay(day);
    setPlan({ ...updated });
  };

  const handleGenerateWeekPlan = () => {
    if (!history.length) return;
    const generated = generateWeekPlan(history);
    writeWeekPlan(generated);
    setPlan({ ...generated });
  };

  const handleClear = () => {
    const cleared = clearWeekPlan();
    setPlan({ ...cleared });
  };

  return (
    <>
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#FF6B9D] via-[#C084FC] via-45% to-[#A855F7] px-4 py-6 sm:px-6 lg:px-8">
        {/* Ambient layers */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-90"
          style={{
            background:
              "linear-gradient(125deg, rgba(255,183,197,0.52) 0%, rgba(192,132,252,0.42) 35%, rgba(167,139,250,0.48) 55%, rgba(251,191,146,0.36) 75%, rgba(244,114,182,0.4) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute -left-16 top-8 h-64 w-64 rounded-full bg-[#C084FC]/50 blur-[110px]"
        />
        <div
          aria-hidden="true"
          className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-[#F472B6]/45 blur-[120px]"
        />

        <main className="relative z-10 mx-auto max-w-7xl">
          {/* Header */}
          <section className="mb-6 rounded-[2rem] border border-white/60 bg-white/30 p-6 shadow-[0_16px_48px_rgba(91,33,182,0.16),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-3xl sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="mb-4 rounded-full border border-white/55 bg-white/38 px-4 py-2 text-sm font-semibold text-[#6D28D9] shadow-[inset_0_1px_0_rgba(255,255,255,0.62)] backdrop-blur-md transition hover:bg-white/48"
                >
                  Back
                </button>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[#6D28D9]">
                  AuraFit AI
                </p>
                <h1 className="mt-2 bg-gradient-to-r from-[#2E1065] via-[#6D28D9] to-[#F472B6] bg-clip-text text-3xl font-bold tracking-[-0.04em] text-transparent sm:text-4xl">
                  Weekly Planner
                </h1>
                <p className="mt-2 text-sm leading-7 text-[#4C1D95]/80">
                  Plan your week ahead — assign a saved outfit to each day.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleGenerateWeekPlan}
                  disabled={!history.length}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(124,58,237,0.28)] transition ${
                    history.length
                      ? "bg-gradient-to-r from-[#6D28D9] via-[#9333EA] to-[#F472B6] hover:scale-[1.02]"
                      : "cursor-not-allowed bg-gradient-to-r from-[#6D28D9]/40 to-[#F472B6]/40"
                  }`}
                >
                  Auto-Fill Week
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="rounded-full border border-white/55 bg-white/38 px-5 py-2.5 text-sm font-semibold text-[#6D28D9] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition hover:bg-white/55"
                >
                  Clear All
                </button>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="mb-6 grid grid-cols-3 gap-4">
            <StatCard
              label="Days Planned"
              value={plannedDays}
              gradient="from-[#6D28D9] to-[#9333EA]"
            />
            <StatCard
              label="Days Remaining"
              value={remainingDays}
              gradient="from-[#9333EA] to-[#F472B6]"
            />
            <StatCard
              label="Total Assigned"
              value={totalAssigned}
              gradient="from-[#F472B6] to-[#FB923C]"
            />
          </section>

          {/* No saved outfits banner */}
          {!history.length && (
            <div className="mb-6 flex items-center gap-4 rounded-[1.5rem] border border-amber-300/60 bg-amber-50/40 px-5 py-4 backdrop-blur-xl">
              <svg
                className="h-5 w-5 shrink-0 text-amber-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                />
              </svg>
              <p className="text-sm text-amber-800">
                You have no saved outfits yet.{" "}
                <button
                  type="button"
                  onClick={() => navigate("/generate-outfit")}
                  className="font-semibold underline underline-offset-2 hover:text-amber-900"
                >
                  Generate one
                </button>{" "}
                and save it to start planning.
              </p>
            </div>
          )}

          {/* Day cards grid */}
          <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
            {DAYS.map((day) => (
              <PlannerDayCard
                key={day}
                day={day}
                entry={plan[day]}
                isToday={day === today}
                onAssign={() => openAssign(day)}
                onReplace={() => openAssign(day)}
                onRemove={() => handleRemove(day)}
              />
            ))}
          </section>

          {/* Quick nav */}
          <section className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={() => navigate("/outfit-history")}
              className="rounded-full border border-white/55 bg-white/38 px-6 py-3 text-sm font-semibold text-[#6D28D9] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition hover:bg-white/50"
            >
              ← Outfit History
            </button>
            <button
              type="button"
              onClick={() => navigate("/generate-outfit")}
              className="rounded-full bg-gradient-to-r from-[#6D28D9] via-[#9333EA] to-[#F472B6] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(124,58,237,0.3)] transition hover:scale-[1.02]"
            >
              Generate New Outfit →
            </button>
          </section>
        </main>
      </div>

      {/* Assign modal */}
      {modal && (
        <AssignModal
          day={modal.day}
          history={history}
          onAssign={handleAssign}
          onClose={closeModal}
        />
      )}
    </>
  );
}