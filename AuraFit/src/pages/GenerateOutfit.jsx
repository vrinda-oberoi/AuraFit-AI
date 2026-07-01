import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { generateOutfit } from "../services/outfitBuilder";

const OCCASIONS = ["Casual", "Formal", "Party", "Office", "College", "Travel"];
const WEATHER_OPTIONS = ["Hot", "Mild", "Cold", "Rainy"];

const LOADING_MESSAGES = [
  "Analyzing your wardrobe...",
  "Finding the best outfit...",
  "Matching colors...",
  "Selecting perfect combinations...",
];

const LOADING_MESSAGE_INTERVAL_MS = 1800;

function GenerateOutfit() {
  const navigate = useNavigate();
  const [occasion, setOccasion] = useState(null);
  const [weather, setWeather] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const loadingIntervalRef = useRef(null);

  const canGenerate = Boolean(occasion && weather) && !isGenerating;

  // Rotate through loading messages while generating, without any
  // artificial delays in the actual generation logic itself.
  useEffect(() => {
    if (isGenerating) {
      setLoadingMessageIndex(0);
      loadingIntervalRef.current = setInterval(() => {
        setLoadingMessageIndex(
          (current) => (current + 1) % LOADING_MESSAGES.length
        );
      }, LOADING_MESSAGE_INTERVAL_MS);
    }

    return () => {
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current);
        loadingIntervalRef.current = null;
      }
    };
  }, [isGenerating]);

  const handleGenerate = async () => {
    if (!canGenerate) return;

    setIsGenerating(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You're not logged in. Please log in and try again.");
        return;
      }

      let wardrobe = [];

      try {
        const response = await axios.get(
          "http://localhost:5000/api/clothes",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        wardrobe = response.data || [];
      } catch (error) {
        console.error(error);
        alert(
          error.response?.data?.message ||
            "Couldn't reach the server. Please check your connection and try again."
        );
        return;
      }

      if (!Array.isArray(wardrobe) || wardrobe.length === 0) {
        alert(
          "Your wardrobe is empty. Add some clothing items before generating outfits."
        );
        return;
      }

      const context = {
        occasion,
        season: null,
        weather,
        preferredColors: [],
      };

      let result;

      try {
        result = generateOutfit(wardrobe, context);
      } catch (error) {
        console.error(error);
        alert("Something went wrong while building your outfit. Please try again.");
        return;
      }

      console.log("Wardrobe:", wardrobe);
      console.log("Fashion Brain Result:", result); 
      const { outfit, overallScore, explanations } = result || {};

      if (!outfit || !outfit.top || !outfit.bottom || !outfit.footwear) {
        alert(
          "Your wardrobe doesn't contain enough clothing to build a complete outfit."
        );
        return;
      }

      navigate("/outfit-preview", {
        state: { outfit, overallScore, explanations },
      });
    } catch (error) {
      console.error(error);
      alert("Something unexpected happened. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

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

      <main className="relative z-10 mx-auto max-w-3xl">
        <section className="rounded-[2rem] border border-white/60 bg-white/30 p-6 shadow-[0_16px_48px_rgba(91,33,182,0.16),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-3xl sm:p-8">
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
            Generate an Outfit
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[#4C1D95]/82 sm:text-base">
            Tell us the vibe and the weather — we'll put something together
            from your own wardrobe.
          </p>

          <div className="mt-8">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#6D28D9]">
              Occasion
            </h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {OCCASIONS.map((option) => {
                const isSelected = option === occasion;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setOccasion(option)}
                    disabled={isGenerating}
                    className={`rounded-full px-5 py-2.5 text-sm font-semibold transition duration-300 ${
                      isSelected
                        ? "bg-gradient-to-r from-[#6D28D9] via-[#9333EA] to-[#F472B6] text-white shadow-[0_12px_28px_rgba(124,58,237,0.3)]"
                        : "border border-white/55 bg-white/38 text-[#6D28D9] shadow-[inset_0_1px_0_rgba(255,255,255,0.62)] hover:bg-white/48"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#6D28D9]">
              Weather
            </h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {WEATHER_OPTIONS.map((option) => {
                const isSelected = option === weather;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setWeather(option)}
                    disabled={isGenerating}
                    className={`rounded-full px-5 py-2.5 text-sm font-semibold transition duration-300 ${
                      isSelected
                        ? "bg-gradient-to-r from-[#6D28D9] via-[#9333EA] to-[#F472B6] text-white shadow-[0_12px_28px_rgba(124,58,237,0.3)]"
                        : "border border-white/55 bg-white/38 text-[#6D28D9] shadow-[inset_0_1px_0_rgba(255,255,255,0.62)] hover:bg-white/48"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={!canGenerate}
            className={`mt-10 w-full rounded-full px-6 py-4 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(124,58,237,0.34)] transition duration-300 ${
              canGenerate
                ? "bg-gradient-to-r from-[#6D28D9] via-[#9333EA] to-[#F472B6] hover:scale-[1.01]"
                : "cursor-not-allowed bg-gradient-to-r from-[#6D28D9]/40 via-[#9333EA]/40 to-[#F472B6]/40"
            }`}
          >
            {isGenerating ? LOADING_MESSAGES[loadingMessageIndex] : "Generate Outfit"}
          </button>
        </section>
      </main>
    </div>
  );
}

export default GenerateOutfit;