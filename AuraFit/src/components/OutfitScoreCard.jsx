/**
 * OutfitScoreCard.jsx
 *
 * Reusable circular progress indicator for displaying the Fashion
 * Brain's overall outfit match score. Tailwind-only styling — the
 * only inline style is the dynamic conic-gradient angle, since that
 * value is computed at runtime and can't be expressed as a static
 * Tailwind utility class.
 */
function OutfitScoreCard({ score = 0 }) {
  const safeScore = Math.max(0, Math.min(100, Math.round(score || 0)));

  const ringStyle = {
    background: `conic-gradient(#9333EA ${safeScore * 3.6}deg, rgba(255,255,255,0.45) ${safeScore * 3.6}deg)`,
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-[1.75rem] border border-white/55 bg-white/32 p-6 shadow-[0_16px_36px_rgba(91,33,182,0.14),inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-2xl">
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#6D28D9]">
        Overall Match
      </p>

      <div
        className="relative mt-4 flex h-32 w-32 items-center justify-center rounded-full p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
        style={ringStyle}
      >
        <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white/85 backdrop-blur-md">
          <span className="text-3xl font-bold tracking-[-0.04em] text-[#2E1065]">
            {safeScore}
          </span>
          <span className="text-xs font-semibold text-[#6D28D9]/75">/ 100</span>
        </div>
      </div>
    </div>
  );
}

export default OutfitScoreCard;