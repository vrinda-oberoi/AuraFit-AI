import React from "react";

/**
 * Mannequin.jsx
 *
 * Future-Ready AI Avatar Architecture.
 * Supports layered rendering for overlays, dynamic body type settings,
 * rotation, pose, and AR try-on mode.
 */
function Mannequin({
  outfit = {},
  // Future-ready extensibility slots (Phase 4)
  bodyType = "standard", // standard | athletic | slim | curvy
  height = "medium",     // short | medium | tall
  skinTone = "neutral",  // fair | neutral | warm | dark
  pose = "standing",     // standing | walking | pose_a | pose_b
  rotation = 0,          // 0 to 360 degrees
  arMode = false,        // AR try-on mode
}) {
  const topItem = outfit?.top;
  const bottomItem = outfit?.bottom;
  const footwearItem = outfit?.footwear;
  const accessoryItem = outfit?.accessory;
  const outerwearItem = outfit?.outerwear;

  return (
    <div className="relative mx-auto flex w-full max-w-[320px] h-[540px] flex-col items-center justify-between rounded-[2rem] border border-white/55 bg-white/20 p-6 shadow-[0_16px_48px_rgba(91,33,182,0.16),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-3xl overflow-hidden">
      {/* Background radial highlight */}
      <div
        aria-hidden="true"
        className="absolute -top-6 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-[#F472B6]/35 blur-2xl pointer-events-none"
      />

      {/* Dynamic parameters feedback for verification / Phase 4 showcase */}
      <div className="absolute top-4 left-4 right-4 flex justify-between text-[0.62rem] font-bold uppercase tracking-wider text-[#6D28D9]/70 pointer-events-none">
        <span>Avatar: {bodyType} ({height})</span>
        <span>Skin: {skinTone} | Pose: {pose}</span>
      </div>

      {/* Silhouette Base & Overlay Container */}
      <div className="relative w-full flex-1 flex items-center justify-center mt-6">
        {/* Central Mannequin Silhouette SVG */}
        <svg
          className="w-48 h-[380px] text-[#C084FC]/25 transition-all duration-500"
          viewBox="0 0 100 200"
          fill="currentColor"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {/* A futuristic stylized body path */}
          <path d="M 50 15 C 55 15, 58 20, 58 25 C 58 30, 55 35, 50 35 C 45 35, 42 30, 42 25 C 42 20, 45 15, 50 15 Z M 38 45 L 62 45 C 68 45, 70 50, 70 55 L 67 95 C 67 98, 64 100, 60 100 L 40 100 C 36 100, 33 98, 33 95 L 30 55 C 30 50, 32 45, 38 45 Z M 40 102 L 60 102 C 63 102, 64 105, 64 108 L 62 165 C 62 169, 58 172, 55 172 L 45 172 C 42 172, 38 169, 38 165 L 36 108 C 36 105, 37 102, 40 102 Z" />
        </svg>

        {/* --- LAYERED CLOTHING OVERLAYS (Extensible Architecture) --- */}
        
        {/* Z-Index 10: Accessories Layer */}
        <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-12 h-12 z-10 flex items-center justify-center">
          {accessoryItem ? (
            <div className="w-10 h-10 rounded-full border border-white/60 bg-white/45 shadow-md overflow-hidden hover:scale-105 transition duration-300">
              <img src={accessoryItem.image} alt={accessoryItem.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full border border-dashed border-[#C084FC]/40 bg-white/10 flex items-center justify-center text-[9px] text-[#7C3AED]/40">
              Acc
            </div>
          )}
        </div>

        {/* Z-Index 20: Top Layer */}
        <div className="absolute top-[22%] left-1/2 -translate-x-1/2 w-32 h-28 z-20 flex items-center justify-center">
          {topItem ? (
            <div className="w-28 h-24 rounded-2xl border border-white/60 bg-white/45 shadow-md overflow-hidden hover:scale-105 transition duration-300">
              <img src={topItem.image} alt={topItem.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-24 h-20 rounded-xl border border-dashed border-[#C084FC]/40 bg-white/10 flex items-center justify-center text-xs text-[#7C3AED]/40">
              Top
            </div>
          )}
        </div>

        {/* Z-Index 30: Outerwear Layer (Renders on top of the Top) */}
        {outerwearItem && (
          <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-36 h-30 z-30 flex items-center justify-center pointer-events-none">
            <div className="w-32 h-26 rounded-2xl border border-[#C084FC]/80 bg-white/50 shadow-lg overflow-hidden pointer-events-auto hover:scale-105 transition duration-300">
              <img src={outerwearItem.image} alt={outerwearItem.name} className="w-full h-full object-cover" />
              <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full bg-[#9333EA] text-[8px] text-white font-bold">
                Outer
              </div>
            </div>
          </div>
        )}

        {/* Z-Index 40: Bottom Layer */}
        <div className="absolute top-[48%] left-1/2 -translate-x-1/2 w-30 h-28 z-20 flex items-center justify-center">
          {bottomItem ? (
            <div className="w-26 h-24 rounded-2xl border border-white/60 bg-white/45 shadow-md overflow-hidden hover:scale-105 transition duration-300">
              <img src={bottomItem.image} alt={bottomItem.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-22 h-20 rounded-xl border border-dashed border-[#C084FC]/40 bg-white/10 flex items-center justify-center text-xs text-[#7C3AED]/40">
              Bottom
            </div>
          )}
        </div>

        {/* Z-Index 50: Footwear (Shoes) Layer */}
        <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-28 h-12 z-20 flex items-center justify-center">
          {footwearItem ? (
            <div className="w-24 h-10 rounded-xl border border-white/60 bg-white/45 shadow-md overflow-hidden hover:scale-105 transition duration-300">
              <img src={footwearItem.image} alt={footwearItem.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-20 h-8 rounded-lg border border-dashed border-[#C084FC]/40 bg-white/10 flex items-center justify-center text-xs text-[#7C3AED]/40">
              Shoes
            </div>
          )}
        </div>
      </div>

      {/* Future-Ready Controls Interface (Visual Showcase for Phase 4) */}
      <div className="w-full border-t border-white/40 pt-3 flex items-center justify-between text-xs font-semibold text-[#6D28D9]">
        <span className="flex items-center gap-1.5">
          <span>🧍</span> 3D Avatar Active
        </span>
        {arMode ? (
          <span className="text-[#10B981] animate-bounce">● AR Try-On On</span>
        ) : (
          <span className="text-[#6D28D9]/60">AR Try-On Ready</span>
        )}
      </div>
    </div>
  );
}

export default Mannequin;