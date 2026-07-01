import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { generateOutfit } from "../services/outfitBuilder";
import { getPaletteCompatibility } from "../utils/colorMatcher";
import OutfitScoreCard from "../components/OutfitScoreCard";

const ROLE_LABELS = {
  top: "Top",
  bottom: "Bottom",
  footwear: "Footwear",
  accessory: "Accessory",
  outerwear: "Outerwear",
};

const REQUIRED_ROLES = ["top", "bottom", "footwear"];
const OPTIONAL_ROLES = ["accessory", "outerwear"];

const WEATHER_TIPS = {
  hot: "Perfect for lightweight fabrics",
  mild: "Great weather for layering lightly",
  cold: "Layer up with warmer fabrics",
  rainy: "Pick weather-resistant fabrics",
};

function getHarmonyLabel(paletteScore) {
  if (paletteScore >= 85) return "Excellent Harmony";
  if (paletteScore >= 70) return "Good Harmony";
  if (paletteScore >= 50) return "Moderate Harmony";
  return "Needs Improvement";
}

function OutfitDetailCard({ roleKey, item }) {
  const label = ROLE_LABELS[roleKey];

  if (!item) {
    return (
      <div className="rounded-[1.75rem] border border-white/55 bg-white/28 p-5 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-2xl">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#6D28D9]">
          {label}
        </p>
        <p className="mt-4 text-sm font-medium text-[#4C1D95]/75">
          No {label.toLowerCase()} selected.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-white/55 bg-white/32 shadow-[0_14px_32px_rgba(91,33,182,0.12),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-2xl">
      <div className="overflow-hidden">
        <img
          src={item.image || "https://via.placeholder.com/300x300?text=No+Image"}
          alt={item.name || label}
          className="h-44 w-full object-cover"
        />
      </div>
      <div className="p-4">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#7C3AED]">
          {label}
        </p>
        <h3 className="mt-1 text-base font-semibold tracking-[-0.02em] text-[#2E1065]">
          {item.name || "Unnamed item"}
        </h3>
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-[#4C1D95]/82">
          <span className="rounded-full border border-white/55 bg-white/45 px-3 py-1">
            Category: {item.category || "Not Available"}
          </span>
          <span className="rounded-full border border-white/55 bg-white/45 px-3 py-1">
            Color: {item.color || "Not Available"}
          </span>
          <span className="rounded-full border border-white/55 bg-white/45 px-3 py-1">
            Pattern: {item.pattern || "Not Available"}
          </span>
          <span className="rounded-full border border-white/55 bg-white/45 px-3 py-1">
            Fabric: {item.fabric || "Not Available"}
          </span>
        </div>
      </div>
    </div>
  );
}

function OutfitPreview() {
  const navigate = useNavigate();
  const location = useLocation();

  const initialOutfit = location.state?.outfit ?? null;
  const initialScore = location.state?.overallScore ?? 0;
  const initialExplanations = location.state?.explanations ?? [];
  const context = useMemo(
    () =>
      location.state?.context ?? {
        occasion: location.state?.occasion ?? null,
        season: location.state?.season ?? null,
        weather: location.state?.weather ?? null,
        preferredColors: location.state?.preferredColors ?? [],
      },
    [location.state]
  );

  const [outfit, setOutfit] = useState(initialOutfit);
  const [overallScore, setOverallScore] = useState(initialScore);
  const [explanations, setExplanations] = useState(initialExplanations);
  const [wardrobe, setWardrobe] = useState([]);
  const [saveState, setSaveState] = useState("idle"); // idle | saved
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    fetchWardrobe();
  }, []);

  const fetchWardrobe = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get("http://localhost:5000/api/clothes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWardrobe(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const paletteCompatibility = useMemo(() => {
    if (!outfit) return 0;

    const colors = [
      outfit.top?.color,
      outfit.bottom?.color,
      outfit.footwear?.color,
      outfit.accessory?.color,
      outfit.outerwear?.color,
    ].filter(Boolean);

    return getPaletteCompatibility(colors);
  }, [outfit]);

  const harmonyLabel = getHarmonyLabel(paletteCompatibility);

  const weatherTip =
    context.weather && WEATHER_TIPS[context.weather.toLowerCase()]
      ? WEATHER_TIPS[context.weather.toLowerCase()]
      : null;

  const handleRegenerate = () => {
    if (!outfit || wardrobe.length === 0) {
      alert("We need your wardrobe loaded before regenerating. Please try again.");
      return;
    }

    setIsRegenerating(true);
    setSaveState("idle");

    try {
      // Reuse the existing Fashion Brain scoring/filtering completely.
      // To offer a different valid combination (rather than randomly
      // picking clothes), exclude the currently selected pieces and
      // let the brain pick its next-best valid combination.
      const currentItemIds = [
        outfit.top?._id,
        outfit.bottom?._id,
        outfit.footwear?._id,
        outfit.accessory?._id,
        outfit.outerwear?._id,
      ].filter(Boolean);

      const remainingWardrobe = wardrobe.filter(
        (item) => !currentItemIds.includes(item._id)
      );

      let result = generateOutfit(remainingWardrobe, context);

      const isValid =
        result?.outfit?.top && result?.outfit?.bottom && result?.outfit?.footwear;

      // Fall back to scoring the full wardrobe again if excluding the
      // current picks left us without enough pieces for a valid outfit.
      if (!isValid) {
        result = generateOutfit(wardrobe, context);
      }

      if (!result?.outfit?.top || !result?.outfit?.bottom || !result?.outfit?.footwear) {
        alert(
          "Your wardrobe doesn't contain enough clothing to build a complete outfit."
        );
        return;
      }

      setOutfit(result.outfit);
      setOverallScore(result.overallScore);
      setExplanations(result.explanations || []);
    } catch (error) {
      console.error(error);
      alert("Something went wrong while regenerating your outfit. Please try again.");
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleSave = async () => {
    if (!outfit) return;

    try {
      const token = localStorage.getItem("token");

      const toPayloadItem = (item) =>
        item
          ? {
              _id: item._id,
              name: item.name,
              image: item.image,
              category: item.category,
              color: item.color,
              pattern: item.pattern,
              fabric: item.fabric,
            }
          : null;

      await axios.post(
        "http://localhost:5000/api/outfits",
        {
          name: context.occasion ? `${context.occasion} Outfit` : "Generated Outfit",
          top: toPayloadItem(outfit.top),
          bottom: toPayloadItem(outfit.bottom),
          footwear: toPayloadItem(outfit.footwear),
          accessory: toPayloadItem(outfit.accessory),
          outerwear: toPayloadItem(outfit.outerwear),
          overallScore,
          explanations,
          occasion: context.occasion,
          weather: context.weather,
          createdAt: new Date().toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSaveState("saved");
      alert("Outfit Saved Successfully!");
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Failed to save outfit");
    }
  };

  if (!outfit) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#FF6B9D] via-[#C084FC] via-45% to-[#A855F7] px-4 py-6 sm:px-6 lg:px-8">
        <main className="relative z-10 mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center">
          <section className="w-full rounded-[2rem] border border-white/60 bg-white/30 p-8 text-center shadow-[0_16px_48px_rgba(91,33,182,0.16),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-3xl">
            <h1 className="text-2xl font-bold tracking-[-0.04em] text-[#2E1065]">
              Unable to generate outfit.
            </h1>
            <p className="mt-3 text-sm leading-7 text-[#4C1D95]/82">
              Please try again.
            </p>
            <button
              type="button"
              onClick={() => navigate("/generate-outfit")}
              className="mt-6 rounded-full bg-gradient-to-r from-[#6D28D9] via-[#9333EA] to-[#F472B6] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(124,58,237,0.34)] transition duration-300 hover:scale-[1.01]"
            >
              Back to Generate
            </button>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#FF6B9D] via-[#C084FC] via-45% to-[#A855F7] px-4 py-6 sm:px-6 lg:px-8">
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

      <main className="relative z-10 mx-auto max-w-6xl">
        <section className="mb-6 rounded-[2rem] border border-white/60 bg-white/30 p-6 shadow-[0_16px_48px_rgba(91,33,182,0.16),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-3xl sm:p-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-5 rounded-full border border-white/55 bg-white/38 px-5 py-2.5 text-sm font-semibold text-[#6D28D9] shadow-[inset_0_1px_0_rgba(255,255,255,0.62)] backdrop-blur-md transition hover:bg-white/48"
          >
            Back
          </button>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[#6D28D9]">
            AuraFit AI
          </p>
          <h1 className="mt-2 bg-gradient-to-r from-[#2E1065] via-[#6D28D9] to-[#F472B6] bg-clip-text text-3xl font-bold tracking-[-0.04em] text-transparent sm:text-4xl">
            Your Outfit Recommendation
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[#4C1D95]/82 sm:text-base">
            {context.occasion
              ? `Picked for a ${context.occasion.toLowerCase()} day`
              : "Picked from your own wardrobe"}
            {context.weather ? ` in ${context.weather.toLowerCase()} weather` : ""}
            {" "}— built entirely by your Fashion Brain.
          </p>
        </section>

        {/* Section 1: Outfit Score + Section 8: Color Harmony */}
        <section className="mb-6 grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
          <OutfitScoreCard score={overallScore} />

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-white/55 bg-white/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#7C3AED] shadow-[inset_0_1px_0_rgba(255,255,255,0.62)] backdrop-blur-md">
              {harmonyLabel}
            </span>
            {context.weather && (
              <span className="rounded-full border border-white/55 bg-white/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#7C3AED] shadow-[inset_0_1px_0_rgba(255,255,255,0.62)] backdrop-blur-md">
                {context.weather} Weather
              </span>
            )}
          </div>
        </section>

        {/* Section 2: Why this outfit? */}
        {explanations.length > 0 && (
          <section className="mb-6 rounded-[2rem] border border-white/55 bg-white/30 p-5 shadow-[0_16px_34px_rgba(91,33,182,0.12),inset_0_1px_0_rgba(255,255,255,0.74)] backdrop-blur-2xl sm:p-6">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#6D28D9]">
              Why this outfit?
            </h2>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {explanations.map((reason) => (
                <span
                  key={reason}
                  className="rounded-full border border-white/55 bg-white/45 px-4 py-2 text-sm font-medium text-[#4C1D95] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-md"
                >
                  ✓ {reason}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Section 7: Weather Summary */}
        {context.weather && (
          <section className="mb-6 rounded-[2rem] border border-white/55 bg-white/30 p-5 shadow-[0_16px_34px_rgba(91,33,182,0.12),inset_0_1px_0_rgba(255,255,255,0.74)] backdrop-blur-2xl sm:p-6">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#6D28D9]">
              Today's Context
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="text-2xl font-bold tracking-[-0.03em] text-[#2E1065]">
                {context.weather}
              </span>
              {weatherTip && (
                <span className="text-sm font-medium text-[#4C1D95]/82">
                  {weatherTip}
                </span>
              )}
            </div>
          </section>
        )}

        {/* Section 3 & 4: Selected Outfit */}
        <section className="mb-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {REQUIRED_ROLES.map((roleKey) => (
            <OutfitDetailCard key={roleKey} roleKey={roleKey} item={outfit[roleKey]} />
          ))}
          {OPTIONAL_ROLES.map((roleKey) => (
            <OutfitDetailCard key={roleKey} roleKey={roleKey} item={outfit[roleKey]} />
          ))}
        </section>

        {/* Section 5 & 6: Buttons */}
        <section className="mt-2 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="rounded-full border border-white/55 bg-white/38 px-6 py-3.5 text-sm font-semibold text-[#6D28D9] shadow-[inset_0_1px_0_rgba(255,255,255,0.62)] backdrop-blur-md transition hover:bg-white/48 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRegenerating ? "Regenerating..." : "Regenerate Outfit"}
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="rounded-full bg-gradient-to-r from-[#6D28D9] via-[#9333EA] to-[#F472B6] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(124,58,237,0.34)] transition duration-300 hover:scale-[1.01]"
          >
            {saveState === "saved" ? "Saved ✓" : "Save To History"}
          </button>
        </section>
      </main>
    </div>
  );
}

export default OutfitPreview;