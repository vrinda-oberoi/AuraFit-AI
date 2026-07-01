function ClothingCard({ item, onView, onEdit, onDelete }) {
  return (
    <article className="group relative overflow-hidden rounded-[1.75rem] border border-white/55 bg-white/34 p-4 shadow-[0_16px_36px_rgba(91,33,182,0.12),inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-2xl transition duration-300 hover:-translate-y-2 hover:bg-white/42 hover:shadow-[0_22px_48px_rgba(91,33,182,0.18),inset_0_1px_0_rgba(255,255,255,0.82)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent"
      />

      <div className="overflow-hidden rounded-[1.35rem] border border-white/50 bg-white/32">
        <img
          src={
            item.image ||
            "https://via.placeholder.com/300x300?text=No+Image"
         }
          alt={item.name}
          className="h-56 w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
      </div>

      <div className="mt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold tracking-[-0.03em] text-[#2E1065]">
              {item.name}
            </h3>
            <p className="mt-1 text-sm font-medium text-[#6D28D9]/85">
              {item.category}
            </p>
          </div>
          <span className="rounded-full border border-white/55 bg-white/40 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#7C3AED]">
            {item.season}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-white/55 bg-white/38 px-3 py-1.5 text-xs font-medium text-[#4C1D95]/82">
            Color: {item.color}
          </span>
          <span className="rounded-full border border-white/55 bg-white/38 px-3 py-1.5 text-xs font-medium text-[#4C1D95]/82">
            Added {item.createdAt?.split("T")[0]}
          </span>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={() => onView(item)}
            className="flex-1 rounded-full border border-white/55 bg-white/42 px-4 py-2.5 text-sm font-semibold text-[#6D28D9] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] transition hover:bg-white/58"
          >
            View
          </button>
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="flex-1 rounded-full border border-[#C084FC]/45 bg-gradient-to-r from-[#6D28D9] via-[#9333EA] to-[#C084FC] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(124,58,237,0.28)] transition hover:scale-[1.01]"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(item)}
            className="rounded-full border border-[#F9A8D4]/55 bg-white/40 px-4 py-2.5 text-sm font-semibold text-[#BE185D] transition hover:bg-white/58"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

export default ClothingCard;
