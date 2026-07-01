import { useState } from "react";
import logo from "../assests/logo.png";
import AddItem from "./AddItem";

const categories = [
  "Tops",
  "T-Shirts",
  "Jeans",
  "Trousers",
  "Kurtis",
  "Shoes",
  "Accessories",
  "Jackets",
];

const stats = [
  { label: "Total Items", value: "0" },
  { label: "Categories", value: "8" },
  { label: "Recently Added", value: "0" },
];

function Wardrobe() {
  const [isAddingItem, setIsAddingItem] = useState(false);

  if (isAddingItem) {
    return <AddItem onCancel={() => setIsAddingItem(false)} />;
  }

  return (
    <>
      <style>{`
        @keyframes wardrobeGlow {
          0%, 100% { transform: scale(1) translateY(0); opacity: 0.72; }
          50% { transform: scale(1.08) translateY(-10px); opacity: 1; }
        }
        @keyframes wardrobeFloat {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(14px, -18px, 0); }
        }
        @keyframes wardrobeTwinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.55); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        @keyframes wardrobeParticle {
          0% { opacity: 0; transform: translateY(0) scale(0.4); }
          30% { opacity: 0.9; }
          100% { opacity: 0; transform: translateY(-42px) scale(1.05); }
        }
        @keyframes wardrobeShimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes wardrobeLift {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(-6deg) scale(1); }
          50% { transform: translate3d(0, -12px, 0) rotate(-2deg) scale(1.03); }
        }
        @keyframes wardrobeSparkle {
          0%, 100% { opacity: 0.2; transform: scale(0.55); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        .wardrobe-title {
          background-size: 200% auto;
          animation: wardrobeShimmer 5s ease infinite;
        }
      `}</style>

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
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 18% 20%, rgba(255,255,255,0.18), transparent 24%), radial-gradient(circle at 82% 24%, rgba(251,191,146,0.28), transparent 22%), radial-gradient(circle at 56% 78%, rgba(244,114,182,0.22), transparent 28%)",
          }}
        />

        <div
          aria-hidden="true"
          className="absolute -left-16 top-8 h-64 w-64 rounded-full bg-[#C084FC]/50 blur-[110px]"
          style={{ animation: "wardrobeGlow 9s ease-in-out infinite" }}
        />
        <div
          aria-hidden="true"
          className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-[#F472B6]/45 blur-[120px]"
          style={{ animation: "wardrobeGlow 11s ease-in-out infinite 1s" }}
        />
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-[#FBBF94]/35 blur-[120px]"
          style={{ animation: "wardrobeFloat 10s ease-in-out infinite" }}
        />

        {[
          { top: "10%", left: "12%", delay: "0s", size: "4px" },
          { top: "22%", left: "84%", delay: "1.1s", size: "3px" },
          { top: "38%", left: "92%", delay: "2.4s", size: "4px" },
          { top: "58%", left: "8%", delay: "0.8s", size: "3px" },
          { top: "76%", left: "86%", delay: "3s", size: "5px" },
          { top: "84%", left: "20%", delay: "1.9s", size: "3px" },
        ].map((star, index) => (
          <div
            key={index}
            aria-hidden="true"
            className="absolute rounded-full bg-white shadow-[0_0_10px_2px_rgba(255,255,255,0.85)]"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              animation: `wardrobeTwinkle 4s ease-in-out infinite ${star.delay}`,
            }}
          />
        ))}

        {[
          { top: "24%", left: "28%", delay: "0s" },
          { top: "36%", left: "70%", delay: "1.4s" },
          { top: "54%", left: "16%", delay: "2.7s" },
          { top: "66%", left: "74%", delay: "0.6s" },
          { top: "30%", left: "86%", delay: "1.9s" },
          { top: "74%", left: "48%", delay: "3.2s" },
        ].map((particle, index) => (
          <div
            key={index}
            aria-hidden="true"
            className="absolute h-1.5 w-1.5 rounded-full bg-white/90"
            style={{
              top: particle.top,
              left: particle.left,
              boxShadow: "0 0 10px rgba(255,255,255,0.75)",
              animation: `wardrobeParticle 5s ease-in-out infinite ${particle.delay}`,
            }}
          />
        ))}

        <main className="relative z-10 mx-auto max-w-6xl">
          <section className="mb-6 rounded-[2rem] border border-white/60 bg-white/30 p-5 shadow-[0_16px_48px_rgba(91,33,182,0.16),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-3xl sm:p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative flex h-44 w-44 items-center justify-center sm:h-52 sm:w-52">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(244,114,182,0.34),rgba(192,132,252,0.22),transparent_72%)] blur-2xl"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.36),rgba(249,168,212,0.16),transparent_70%)] blur-xl"
                  />
                  {[
                    { top: "8%", left: "24%", size: "8px", delay: "0s" },
                    { top: "24%", left: "86%", size: "7px", delay: "0.9s" },
                    { top: "74%", left: "16%", size: "6px", delay: "1.4s" },
                    { top: "82%", left: "72%", size: "7px", delay: "2.1s" },
                    { top: "42%", left: "92%", size: "5px", delay: "2.8s" },
                    { top: "18%", left: "6%", size: "5px", delay: "1.7s" },
                  ].map((sparkle, index) => (
                    <div
                      key={index}
                      aria-hidden="true"
                      className="absolute rounded-full"
                      style={{
                        top: sparkle.top,
                        left: sparkle.left,
                        width: sparkle.size,
                        height: sparkle.size,
                        background:
                          index % 2 === 0
                            ? "rgba(255,255,255,0.92)"
                            : "rgba(249,168,212,0.92)",
                        boxShadow:
                          index % 2 === 0
                            ? "0 0 14px rgba(255,255,255,0.8)"
                            : "0 0 14px rgba(249,168,212,0.75)",
                        animation: `wardrobeSparkle 3.6s ease-in-out infinite ${sparkle.delay}`,
                      }}
                    />
                  ))}
                  <img
                    src={logo}
                    alt="AuraFit AI logo"
                    className="relative z-10 h-40 w-40 object-contain drop-shadow-[0_0_42px_rgba(192,132,252,0.58)] sm:h-48 sm:w-48"
                    style={{ animation: "wardrobeLift 5.5s ease-in-out infinite" }}
                  />
                </div>

                <div>
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[#6D28D9]">
                    AuraFit AI
                  </p>
                  <h1 className="wardrobe-title mt-2 bg-gradient-to-r from-[#2E1065] via-[#6D28D9] to-[#F472B6] bg-clip-text text-3xl font-bold tracking-[-0.04em] text-transparent sm:text-4xl">
                    My Wardrobe
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-[#4C1D95]/82 sm:text-base">
                    Curate your digital closet and prepare every category for
                    future AI outfit generation.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAddingItem(true)}
                className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-[#6D28D9] via-[#9333EA] to-[#F472B6] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(124,58,237,0.35)] transition duration-300 hover:scale-[1.01] hover:shadow-[0_20px_44px_rgba(124,58,237,0.45)] active:scale-[0.98] sm:w-auto"
              >
                <span className="relative z-10">Add Item</span>
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-500 group-hover:translate-x-full"
                />
              </button>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-[2rem] border border-white/60 bg-white/30 p-5 shadow-[0_16px_48px_rgba(91,33,182,0.16),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-3xl sm:p-6">
              <div className="mb-5">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#6D28D9]">
                  Category Grid
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-[-0.04em] text-[#2E1065]">
                  Build Your Closet by Category
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {categories.map((category, index) => (
                  <button
                    key={category}
                    type="button"
                    className="group rounded-[1.5rem] border border-white/55 bg-white/38 p-4 text-left shadow-[0_10px_28px_rgba(91,33,182,0.12),inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:bg-white/48"
                  >
                    <div
                      className={`mb-4 h-1.5 w-16 rounded-full bg-gradient-to-r ${
                        index % 4 === 0
                          ? "from-[#C084FC] to-[#9333EA]"
                          : index % 4 === 1
                            ? "from-[#F472B6] to-[#FB7185]"
                            : index % 4 === 2
                              ? "from-[#FBBF94] to-[#FB7185]"
                              : "from-[#A78BFA] to-[#C084FC]"
                      }`}
                    />
                    <h3 className="text-base font-semibold text-[#2E1065]">
                      {category}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#4C1D95]/78">
                      No items yet. Start curating your {category.toLowerCase()} collection.
                    </p>
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <div className="rounded-[2rem] border border-white/55 bg-white/28 p-5 shadow-[0_12px_40px_rgba(91,33,182,0.14),inset_0_1px_0_rgba(255,255,255,0.78)] backdrop-blur-2xl">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#6D28D9]">
                  Empty State
                </p>
                <div className="mt-4 rounded-[1.5rem] border border-dashed border-[#C084FC]/40 bg-white/34 px-5 py-8 text-center">
                  <h3 className="text-xl font-semibold text-[#2E1065]">
                    Start building your digital wardrobe.
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#4C1D95]/78">
                    Add your first fashion pieces so AuraFit can begin planning
                    more personalized outfit combinations.
                  </p>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/55 bg-white/28 p-5 shadow-[0_12px_40px_rgba(91,33,182,0.14),inset_0_1px_0_rgba(255,255,255,0.78)] backdrop-blur-2xl">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#6D28D9]">
                  Wardrobe Statistics
                </p>
                <div className="mt-4 grid gap-3">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="flex items-center justify-between rounded-[1.25rem] border border-white/50 bg-white/38 px-4 py-4"
                    >
                      <span className="text-sm font-medium text-[#4C1D95]/82">
                        {stat.label}
                      </span>
                      <span className="text-2xl font-bold text-[#6D28D9]">
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}

export default Wardrobe;
