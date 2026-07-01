import { useEffect } from "react";

const FALLBACK = "Not Available";

function formatValue(value) {
  if (value === null || value === undefined) return FALLBACK;
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : FALLBACK;
  }
  if (typeof value === "string" && value.trim().length === 0) return FALLBACK;
  return value;
}

function formatConfidence(confidence) {
  if (confidence === null || confidence === undefined || confidence === "") {
    return FALLBACK;
  }
  return `${Math.round(confidence * 100)}%`;
}

function formatDate(dateString) {
  if (!dateString) return FALLBACK;
  return dateString.split("T")[0];
}

function ViewItemModal({ item, onClose }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  const detailFields = [
    { label: "Category", value: formatValue(item.category) },
    { label: "Sub Category", value: formatValue(item.subCategory) },
    { label: "Color", value: formatValue(item.color) },
    { label: "Colors (AI)", value: formatValue(item.colors) },
    { label: "Occasion", value: formatValue(item.occasion) },
    { label: "Season", value: formatValue(item.season) },
    { label: "Pattern", value: formatValue(item.pattern) },
    { label: "Fabric", value: formatValue(item.fabric) },
    { label: "Sleeve", value: formatValue(item.sleeve) },
    { label: "Fit", value: formatValue(item.fit) },
    { label: "Brand", value: formatValue(item.brand) },
    { label: "AI Confidence", value: formatConfidence(item.confidence) },
    { label: "Added Date", value: formatDate(item.createdAt) },
  ];

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2E1065]/45 p-4 backdrop-blur-sm"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={item.name || "Wardrobe item details"}
        onClick={(event) => event.stopPropagation()}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-white/60 bg-white/85 p-5 shadow-[0_24px_64px_rgba(91,33,182,0.28),inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-3xl sm:p-6"
      >
        <div className="overflow-hidden rounded-[1.5rem] border border-white/55 bg-white/35">
          <img
            src={
              item.image ||
              "https://via.placeholder.com/600x400?text=No+Image"
            }
            alt={item.name || "Wardrobe item"}
            className="h-64 w-full object-cover sm:h-80"
          />
        </div>

        <div className="mt-5">
          <h2 className="text-2xl font-bold tracking-[-0.04em] text-[#2E1065] sm:text-3xl">
            {formatValue(item.name)}
          </h2>

          {item.description && (
            <p className="mt-2 text-sm leading-6 text-[#4C1D95]/82">
              {item.description}
            </p>
          )}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {detailFields.map((field) => (
            <div
              key={field.label}
              className="rounded-2xl border border-white/55 bg-white/45 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-md"
            >
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#7C3AED]">
                {field.label}
              </p>
              <p className="mt-1 text-sm font-medium text-[#4C1D95]">
                {field.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/55 bg-white/42 px-6 py-3 text-sm font-semibold text-[#6D28D9] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] transition hover:bg-white/58"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewItemModal;