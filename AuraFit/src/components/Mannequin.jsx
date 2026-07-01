import React from "react";

/**
 * Stylish stand-in mannequin: stacked glass "zones" for head/top/bottom/shoes
 * that light up with the currently selected outfit pieces. No avatar art —
 * purely shape + gradient, matching AuraFit's glassmorphism language.
 */
function Mannequin({ outfit }) {
  const zones = [
    { key: "head", label: "Head", item: null, height: "h-16", isHead: true },
    { key: "top", label: "Top", item: outfit.top, height: "h-32" },
    { key: "bottom", label: "Bottom", item: outfit.bottom, height: "h-28" },
    { key: "shoes", label: "Shoes", item: outfit.shoes, height: "h-14" },
  ];

  return (
    <div className="relative mx-auto flex w-full max-w-[260px] flex-col items-center gap-3 rounded-[2rem] border border-white/55 bg-white/25 p-6 shadow-[0_16px_48px_rgba(91,33,182,0.16),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-3xl">
      <div
        aria-hidden="true"
        className="absolute -top-6 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-[#F472B6]/35 blur-2xl"
      />

      {zones.map((zone) => (
        <div
          key={zone.key}
          className={`relative w-full ${zone.height} overflow-hidden rounded-[1.4rem] border border-white/50 ${
            zone.isHead
              ? "bg-gradient-to-br from-white/55 to-[#C084FC]/30"
              : "bg-white/30"
          } shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]`}
          style={
            zone.isHead
              ? { width: "44%", borderRadius: "9999px" }
              : undefined
          }
        >
          {zone.isHead ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#F9A8D4] to-[#C084FC]" />
            </div>
          ) : zone.item ? (
            <img
              src={zone.item.image}
              alt={zone.item.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#7C3AED]/60">
                {zone.label}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Mannequin;