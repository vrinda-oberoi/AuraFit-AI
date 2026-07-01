// src/components/PlannerDayCard.jsx

const SLOT_LABELS = ["top", "bottom", "shoes", "accessory"];

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

export default function PlannerDayCard({ day, entry, isToday, onAssign, onReplace, onRemove }) {
  const dayLabel = day.charAt(0).toUpperCase() + day.slice(1);
  const outfit = entry?.outfit;

  const date = entry?.savedOn ? new Date(entry.savedOn) : null;
  const dateLabel = date
    ? date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })
    : null;

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
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[#2E1065]">{dayLabel}</span>
          {isToday && (
            <span className="rounded-full bg-gradient-to-r from-[#6D28D9] to-[#F472B6] px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-widest text-white">
              Today
            </span>
          )}
        </div>
        {entry && (
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-white/55 bg-white/35 px-2.5 py-0.5 text-[0.65rem] font-semibold text-[#6D28D9]">
              {entry.occasion}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        {!outfit ? (
          <EmptyDayState dayLabel={dayLabel} onAssign={onAssign} />
        ) : (
          <>
            {/* Thumbnail strip */}
            <div className="mb-3 flex justify-center -space-x-3">
              {SLOT_LABELS.map((slot) => {
                const item = outfit[slot];
                if (!item?.image) return null;
                return (
                  <img
                    key={slot}
                    src={item.image}
                    alt={item.name}
                    title={item.name}
                    className="h-11 w-11 rounded-full border-2 border-white/80 object-cover shadow-md transition hover:scale-110"
                  />
                );
              })}
            </div>

            {/* Slot names */}
            <div className="mb-4 flex flex-col gap-1">
              {SLOT_LABELS.map((slot) => {
                const item = outfit[slot];
                if (!item) return null;
                return (
                  <div key={slot} className="flex items-center gap-1.5 text-[0.7rem]">
                    <span className="w-14 font-semibold capitalize text-[#6D28D9]">
                      {slot}
                    </span>
                    <span className="truncate text-[#4C1D95]/75">{item.name}</span>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="mt-auto flex gap-2">
              <button
                type="button"
                onClick={onReplace}
                className="flex-1 rounded-full border border-white/55 bg-white/35 px-3 py-1.5 text-[0.7rem] font-semibold text-[#6D28D9] transition hover:bg-white/55"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={onRemove}
                className="rounded-full border border-rose-300/60 bg-rose-50/40 px-3 py-1.5 text-[0.7rem] font-semibold text-rose-600 transition hover:bg-rose-100/60"
              >
                Remove
              </button>
            </div>
          </>
        )}
      </div>
    </article>
  );
}