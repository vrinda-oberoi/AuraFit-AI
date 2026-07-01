// src/pages/OutfitHistory.jsx
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import OutfitHistoryCard from "../components/OutfitHistoryCard";

// ─── helpers ────────────────────────────────────────────────────────────────

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function withinDays(isoString, days) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return new Date(isoString) >= cutoff;
}

const FILTERS = ["All", "Today", "This Week", "This Month"];

function applyFilter(entries, filter) {
  const today = startOfDay(new Date());
  switch (filter) {
    case "Today":
      return entries.filter(
        (e) => startOfDay(new Date(e.savedOn)).getTime() === today.getTime()
      );
    case "This Week":
      return entries.filter((e) => withinDays(e.savedOn, 7));
    case "This Month":
      return entries.filter((e) => withinDays(e.savedOn, 30));
    default:
      return entries;
  }
}

function applySearch(entries, query) {
  if (!query.trim()) return entries;
  const q = query.toLowerCase();
  return entries.filter((e) => {
    const outfit = e.outfit ?? {};
    const slots = Object.values(outfit)
      .filter(Boolean)
      .map((item) => item.name?.toLowerCase() ?? "");
    return (
      e.occasion?.toLowerCase().includes(q) ||
      e.weather?.toLowerCase().includes(q) ||
      slots.some((s) => s.includes(q))
    );
  });
}

// ─── statistics ──────────────────────────────────────────────────────────────

function StatCard({ label, value, gradient }) {
  return (
    <div
      className={`flex flex-col items-center rounded-[1.25rem] border border-white/55 bg-white/30 px-5 py-4 shadow-[0_6px_20px_rgba(91,33,182,0.1),inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-2xl`}
    >
      <span
        className={`bg-gradient-to-r ${gradient} bg-clip-text text-3xl font-bold tabular-nums text-transparent`}
      >
        {value}
      </span>
      <span className="mt-1 text-center text-xs font-medium text-[#6D28D9]/70">{label}</span>
    </div>
  );
}

// ─── empty state ─────────────────────────────────────────────────────────────

function EmptyState({ hasFilters, onGenerate }) {
  return (
    <div className="flex flex-col items-center gap-5 py-20 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-[#C084FC]/55 bg-white/20">
        <svg
          className="h-9 w-9 text-[#C084FC]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.6}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 7a4 4 0 014-4h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6M12 9v6" />
        </svg>
      </div>
      <div>
        <p className="text-base font-semibold text-[#2E1065]">
          {hasFilters ? "No outfits match your search" : "No saved outfits yet"}
        </p>
        <p className="mt-1 text-sm text-[#4C1D95]/65">
          {hasFilters
            ? "Try a different filter or search term."
            : "Generate and save outfits to see them here."}
        </p>
      </div>
      {!hasFilters && (
        <button
          type="button"
          onClick={onGenerate}
          className="rounded-full bg-gradient-to-r from-[#6D28D9] via-[#9333EA] to-[#F472B6] px-7 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(124,58,237,0.3)] transition hover:scale-[1.02]"
        >
          Generate an Outfit
        </button>
      )}
    </div>
  );
}

// ─── outfit detail modal ──────────────────────────────────────────────────────

function OutfitDetailModal({ entry, onClose }) {
  if (!entry) return null;
  const outfit = entry.outfit ?? {};
  const slots = ["top", "bottom", "shoes", "accessory"];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#2E1065]/40 backdrop-blur-sm" />

      <div
        className="relative z-10 w-full max-w-md rounded-[2rem] border border-white/60 bg-white/40 p-6 shadow-[0_24px_60px_rgba(91,33,182,0.25),inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-gradient-to-r from-[#6D28D9] to-[#9333EA] px-3 py-0.5 text-[0.65rem] font-bold uppercase tracking-widest text-white">
                {entry.occasion}
              </span>
              <span className="rounded-full border border-[#C084FC]/50 bg-[#F3E8FF]/60 px-3 py-0.5 text-[0.65rem] font-semibold uppercase tracking-widest text-[#7C3AED]">
                {entry.weather}
              </span>
            </div>
            <p className="mt-1.5 text-xs text-[#6D28D9]/65">
              Saved{" "}
              {new Date(entry.savedOn).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
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

        <div className="grid grid-cols-2 gap-3">
          {slots.map((slot) => {
            const item = outfit[slot];
            if (!item) return null;
            return (
              <div
                key={slot}
                className="flex flex-col items-center gap-2 rounded-[1.25rem] border border-white/50 bg-white/30 p-3"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-20 w-20 rounded-xl object-cover shadow-md"
                />
                <p className="text-center text-[0.7rem] font-semibold uppercase tracking-wider text-[#6D28D9]">
                  {slot}
                </p>
                <p className="text-center text-[0.72rem] text-[#4C1D95]/80">{item.name}</p>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-full border border-white/55 bg-white/38 py-2.5 text-sm font-semibold text-[#6D28D9] transition hover:bg-white/55"
        >
          Close
        </button>
      </div>
    </div>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function OutfitHistory() {
  const navigate = useNavigate();

  const [rawHistory, setRawHistory] = useState([]);
  useEffect(() => {
  fetchHistory();
}, []);

const fetchHistory = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      "http://localhost:5000/api/outfits",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setRawHistory(response.data);
  } catch (error) {
    console.error(error);
  }
};
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewEntry, setViewEntry] = useState(null);

  const formattedHistory = useMemo(() => {
  return rawHistory.map((item) => ({
    id: item._id,
    occasion: item.occasion,
    weather: item.weather,
    savedOn: item.createdAt,

    outfit: {
      top: item.top,
      bottom: item.bottom,
      shoes: item.shoes,
      accessory: item.accessory,
    },
  }));
}, [rawHistory]);
  const filtered = useMemo(() => {
  const afterFilter = applyFilter(
    formattedHistory,
    activeFilter
  );

  return applySearch(
    afterFilter,
    searchQuery
  );
}, [formattedHistory, activeFilter, searchQuery]);
  // Stats over entire history (not filtered)
  const totalSaved = rawHistory.length;
  const savedToday = applyFilter(rawHistory, "Today").length;
  const savedThisWeek = applyFilter(rawHistory, "This Week").length;

  const uniqueOccasions = new Set(rawHistory.map((e) => e.occasion)).size;

 const handleDelete = async (id) => {
  try {
    const token = localStorage.getItem("token");

    await axios.delete(
      `http://localhost:5000/api/outfits/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setRawHistory((current) =>
      current.filter((item) => item._id !== id)
    );
  } catch (error) {
    console.error(error);
    alert("Failed to delete outfit");
  }
};
  const hasFilters = activeFilter !== "All" || searchQuery.trim().length > 0;

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

        <main className="relative z-10 mx-auto max-w-5xl">
          {/* Page header */}
          <section className="mb-6 rounded-[2rem] border border-white/60 bg-white/30 p-6 shadow-[0_16px_48px_rgba(91,33,182,0.16),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-3xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
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
                  Outfit History
                </h1>
                <p className="mt-2 text-sm leading-7 text-[#4C1D95]/80">
                  Every look you've saved — searchable, filterable, ready to revisit.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/generate-outfit")}
                className="hidden shrink-0 rounded-full bg-gradient-to-r from-[#6D28D9] via-[#9333EA] to-[#F472B6] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(124,58,237,0.3)] transition hover:scale-[1.02] sm:block"
              >
                + New Outfit
              </button>
            </div>
          </section>

          {/* Statistics */}
          <section className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard
              label="Total Saved"
              value={totalSaved}
              gradient="from-[#6D28D9] to-[#9333EA]"
            />
            <StatCard
              label="Saved Today"
              value={savedToday}
              gradient="from-[#9333EA] to-[#F472B6]"
            />
            <StatCard
              label="This Week"
              value={savedThisWeek}
              gradient="from-[#F472B6] to-[#FB923C]"
            />
            <StatCard
              label="Occasions"
              value={uniqueOccasions}
              gradient="from-[#6D28D9] to-[#F472B6]"
            />
          </section>

          {/* Search + Filters */}
          <section className="mb-6 flex flex-col gap-4 rounded-[1.5rem] border border-white/55 bg-white/28 p-4 shadow-[0_8px_24px_rgba(91,33,182,0.1),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-2xl sm:flex-row sm:items-center sm:gap-5">
            {/* Search */}
            <div className="relative flex-1">
              <svg
                className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6D28D9]/50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search by occasion, weather, or item…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-white/55 bg-white/40 py-2.5 pl-10 pr-4 text-sm text-[#2E1065] placeholder-[#6D28D9]/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-md outline-none transition focus:border-[#A855F7]/60 focus:bg-white/55"
              />
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setActiveFilter(f)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition duration-200 ${
                    activeFilter === f
                      ? "bg-gradient-to-r from-[#6D28D9] to-[#F472B6] text-white shadow-[0_6px_16px_rgba(124,58,237,0.28)]"
                      : "border border-white/55 bg-white/35 text-[#6D28D9] hover:bg-white/50"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </section>

          {/* Results count */}
          {rawHistory.length > 0 && (
            <p className="mb-4 text-xs text-[#4C1D95]/60">
              Showing {filtered.length} of {rawHistory.length} outfit
              {rawHistory.length !== 1 ? "s" : ""}
              {hasFilters ? " (filtered)" : ""}
            </p>
          )}

          {/* Cards grid / empty state */}
          {filtered.length === 0 ? (
            <div className="rounded-[2rem] border border-white/55 bg-white/28 backdrop-blur-2xl">
              <EmptyState
                hasFilters={hasFilters}
                onGenerate={() => navigate("/generate-outfit")}
              />
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((entry) => (
                <OutfitHistoryCard
                  key={entry.id}
                  entry={entry}
                  onDelete={handleDelete}
                  onView={setViewEntry}
                />
              ))}
            </div>
          )}

          {/* Mobile CTA */}
          <div className="mt-6 sm:hidden">
            <button
              type="button"
              onClick={() => navigate("/generate-outfit")}
              className="w-full rounded-full bg-gradient-to-r from-[#6D28D9] via-[#9333EA] to-[#F472B6] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(124,58,237,0.3)] transition hover:scale-[1.01]"
            >
              + Generate New Outfit
            </button>
          </div>
        </main>
      </div>

      {/* Detail modal */}
      {viewEntry && (
        <OutfitDetailModal entry={viewEntry} onClose={() => setViewEntry(null)} />
      )}
    </>
  );
}