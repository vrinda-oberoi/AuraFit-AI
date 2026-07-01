// src/components/PlannerDayCard.jsx

const SLOT_LABELS = ["top", "bottom", "footwear", "accessory", "outerwear"];

function EmptyDayState({ dayLabel, onAssign }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-[#C084FC]/60 bg-white/20">
        <svg
          className="h-6 w-6 text-[#C084FC]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </div>
      <p className="text-xs text-[#6D28D9]/60">No outfit planned</p>
      <button
        type="button"
        onClick={onAssign}
        className="rounded-full bg-gradient-to-r from-[#6D28D9] via-[#9333EA] to-[#F472B6] px-5 py-2 text-xs font-semibold text-white shadow-[0_6px_18px_rgba(124,58,237,0.28)] transition hover:scale-[1.03]"
      >
        Assign Outfit
      </button>
    </div>
  );
}

export default function PlannerDayCard({ day, entries = [], isToday, onAssign, onReplace, onRemove }) {
  const dayLabel = day.charAt(0).toUpperCase() + day.slice(1);
  const entryList = Array.isArray(entries) ? entries : (entries ? [entries] : []);

  return (
    <article
      className={`flex flex-col rounded-[1.5rem] border bg-white/28 backdrop-blur-2xl shadow-[0_8px_28px_rgba(91,33,182,0.1),inset_0_1px_0_rgba(255,255,255,0.72)] transition-all duration-300 hover:bg-white/36 ${
        isToday
          ? "border-[#A855F7]/70 shadow-[0_8px_28px_rgba(168,85,247,0.22),inset_0_1px_0_rgba(255,255,255,0.72)]"
          : "border-white/50"
      }`}
    >
      {/* Day header */}
      <div
        className={`flex items-center justify-between rounded-t-[1.5rem] px-4 py-3 ${
          isToday
            ? "bg-gradient-to-r from-[#6D28D9]/20 to-[#F472B6]/15"
            : "bg-white/15"
        }`}
      >
        <span className="text-sm font-bold text-[#2E1065]">{dayLabel}</span>
        {isToday && (
          <span className="rounded-full bg-gradient-to-r from-[#6D28D9] to-[#F472B6] px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-widest text-white">
            Today
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4 gap-4">
        {entryList.length === 0 ? (
          <EmptyDayState dayLabel={dayLabel} onAssign={onAssign} />
        ) : (
          entryList.map((entry, idx) => {
            const outfit = entry.outfit || entry; // Support direct object snapshots or full history structures
            const date = entry.createdAt || entry.savedOn ? new Date(entry.createdAt || entry.savedOn) : null;
            const dateLabel = date
              ? date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })
              : "Saved Today";
            
            const score = entry.overallScore ?? entry.score ?? 0;

            return (
              <div key={idx} className="border-b border-[#C084FC]/30 pb-4 last:border-b-0 last:pb-0">
                {/* Outfit score & weather badge */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[0.62rem] font-bold text-[#6D28D9] bg-white/40 px-2 py-0.5 rounded-full">
                    Score: {score}
                  </span>
                  <span className="text-[0.62rem] font-semibold text-[#7C3AED] border border-[#C084FC]/30 bg-white/45 px-2 py-0.5 rounded-full">
                    {entry.weather || "Any"}
                  </span>
                </div>
                
                {/* Thumbnail strip */}
                <div className="mb-3 flex justify-center -space-x-3">
                  {SLOT_LABELS.map((slot) => {
                    const item = outfit[slot] || (slot === "footwear" ? outfit.shoes : null);
                    if (!item?.image) return null;
                    return (
                      <img
                        key={slot}
                        src={item.image}
                        alt={item.name}
                        title={item.name}
                        className="h-9 w-9 rounded-full border border-white/80 object-cover shadow-sm transition hover:scale-110"
                      />
                    );
                  })}
                </div>

                {/* Info & Slot names */}
                <div className="mb-2 flex flex-col gap-0.5 text-left">
                  <div className="text-[0.7rem] font-semibold text-[#2E1065] truncate">
                    {entry.occasion || "Daily"} Outfit
                  </div>
                  <div className="text-[0.62rem] text-[#4C1D95]/60 mb-1">
                    Saved: {dateLabel}
                  </div>
                  {SLOT_LABELS.map((slot) => {
                    const item = outfit[slot] || (slot === "footwear" ? outfit.shoes : null);
                    if (!item) return null;
                    return (
                      <div key={slot} className="flex items-center gap-1.5 text-[0.65rem] min-w-0">
                        <span className="w-12 font-medium capitalize text-[#6D28D9] shrink-0">
                          {slot === "footwear" ? "shoes" : slot}:
                        </span>
                        <span className="truncate text-[#4C1D95]/75">{item.name}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Actions */}
                <div className="flex gap-1.5 mt-3">
                  <button
                    type="button"
                    onClick={() => onReplace(idx)}
                    className="flex-1 rounded-full border border-white/55 bg-white/35 py-1 text-[0.65rem] font-semibold text-[#6D28D9] transition hover:bg-white/55"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemove(idx)}
                    className="rounded-full border border-rose-300/60 bg-rose-50/40 px-2.5 py-1 text-[0.65rem] font-semibold text-rose-600 transition hover:bg-rose-100/60"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </article>
  );
}