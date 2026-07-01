import React from "react";

/**
 * Displays a single outfit slot (top / bottom / shoes / accessory).
 * Reused on OutfitPreview — keep this dumb/presentational so it can later
 * be reused in Outfit History too.
 */
function OutfitSlotCard({ label, item, onChange, changeLabel = "Change" }) {
  return (
    <div className="rounded-[1.7rem] border border-white/55 bg-white/32 p-4 shadow-[0_16px_34px_rgba(91,33,182,0.12),inset_0_1px_0_rgba(255,255,255,0.74)] backdrop-blur-2xl">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#6D28D9]">
        {label}
      </p>

      {item ? (
        <>
          <div className="mt-3 overflow-hidden rounded-2xl border border-white/50 bg-white/40">
            <img
              src={item.image}
              alt={item.name}
              className="h-40 w-full object-cover"
            />
          </div>
          <p className="mt-3 truncate text-sm font-bold text-[#2E1065]">
            {item.name}
          </p>
          <p className="text-xs font-medium text-[#7C3AED]/80">
            {item.category}
          </p>
        </>
      ) : (
        <div className="mt-3 flex h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-[#C084FC]/60 bg-white/20 text-center">
          <p className="px-3 text-xs font-medium text-[#7C3AED]/70">
            No matching item in your wardrobe
          </p>
        </div>
      )}

      {onChange ? (
        <button
          type="button"
          onClick={onChange}
          className="mt-4 w-full rounded-full border border-white/55 bg-white/38 px-4 py-2.5 text-xs font-semibold text-[#6D28D9] shadow-[inset_0_1px_0_rgba(255,255,255,0.62)] backdrop-blur-md transition hover:bg-white/48"
        >
          {changeLabel}
        </button>
      ) : null}
    </div>
  );
}

export default OutfitSlotCard;