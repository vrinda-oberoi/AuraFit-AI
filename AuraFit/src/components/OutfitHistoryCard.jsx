// src/components/OutfitHistoryCard.jsx
import { useState } from "react";

const SLOT_LABELS = ["top", "bottom", "shoes", "accessory"];

function SlotPill({ label, item }) {
  if (!item) return null;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/50 bg-white/30 px-3 py-1 text-xs font-medium text-[#4C1D95]">
      <span className="font-semibold text-[#6D28D9]">{label}:</span>
      {item.name}
    </span>
  );
}

export default function OutfitHistoryCard({ entry, onDelete, onView }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const date = new Date(entry.savedOn);
  const dateLabel = date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const timeLabel = date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <article className="group flex flex-col gap-4 rounded-[1.5rem] border border-white/55 bg-white/30 p-5 shadow-[0_8px_32px_rgba(91,33,182,0.12),inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-2xl transition-all duration-300 hover:bg-white/38 hover:shadow-[0_12px_40px_rgba(91,33,182,0.18)]">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-gradient-to-r from-[#6D28D9] to-[#9333EA] px-3 py-0.5 text-[0.65rem] font-bold uppercase tracking-widest text-white">
              {entry.occasion}
            </span>
            <span className="rounded-full border border-[#C084FC]/50 bg-[#F3E8FF]/60 px-3 py-0.5 text-[0.65rem] font-semibold uppercase tracking-widest text-[#7C3AED]">
              {entry.weather}
            </span>
          </div>
          <p className="mt-2 text-[0.72rem] text-[#6D28D9]/70">
            {dateLabel} · {timeLabel}
          </p>
        </div>

        {/* Outfit thumbnail strip */}
        <div className="flex -space-x-2">
          {SLOT_LABELS.map((slot) => {
            const item = entry.outfit?.[slot];
            if (!item?.image) return null;
            return (
              <img
                key={slot}
                src={item.image}
                alt={item.name}
                className="h-9 w-9 rounded-full border-2 border-white/80 object-cover shadow-sm"
              />
            );
          })}
        </div>
      </div>

      {/* Slot pills */}
      <div className="flex flex-wrap gap-2">
        {SLOT_LABELS.map((slot) => (
          <SlotPill key={slot} label={slot} item={entry.outfit?.[slot]} />
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => onView(entry)}
          className="flex-1 rounded-full border border-white/55 bg-white/38 px-4 py-2 text-xs font-semibold text-[#6D28D9] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition hover:bg-white/55"
        >
          View
        </button>

        {confirmDelete ? (
          <>
            <button
              type="button"
              onClick={() => onDelete(entry.id)}
              className="flex-1 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-2 text-xs font-semibold text-white shadow-[0_4px_14px_rgba(244,63,94,0.35)] transition hover:scale-[1.02]"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="flex-1 rounded-full border border-white/55 bg-white/38 px-4 py-2 text-xs font-semibold text-[#6D28D9] transition hover:bg-white/55"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="rounded-full border border-rose-300/60 bg-rose-50/40 px-4 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100/60"
          >
            Delete
          </button>
        )}
      </div>
    </article>
  );
}