import { useNavigate } from "react-router-dom";

import logo from "../assests/logo.png";

const quickActions = [
  {
    title: "My Wardrobe",
    description: "Organize your pieces and build your digital closet.",
    accent: "from-[#C084FC] to-[#9333EA]",
    route: "/wardrobe",
  },
  {
    title: "Weekly Planner",
    description: "Preview elegant looks for every day of the week.",
    accent: "from-[#F472B6] to-[#FB7185]",
    route: "/weekly-planner",
  },
  {
    title: "Outfit History",
    description: "Revisit favorites and track your signature looks.",
    accent: "from-[#FBBF94] to-[#FB7185]",
    route: "/outfit-history",
  },
  {
    title: "Weather",
    description: "See weather-smart styling suggestions at a glance.",
    accent: "from-[#A78BFA] to-[#C084FC]",
    route: "/generate-outfit",
  },
  {
    title: "Profile",
    description: "Refine your fit profile and personal style settings.",
    accent: "from-[#FDA4AF] to-[#C084FC]",
    route: "/profile",
  },
  {
    title: "Settings",
    description: "Manage notifications, privacy, and account preferences.",
    accent: "from-[#94A3B8] to-[#7C3AED]",
    route: "/settings",
  },
];

const butterflySparkles = [
  { top: "8%", left: "24%", size: "8px", delay: "0s" },
  { top: "24%", left: "86%", size: "7px", delay: "0.9s" },
  { top: "74%", left: "16%", size: "6px", delay: "1.4s" },
  { top: "82%", left: "72%", size: "7px", delay: "2.1s" },
  { top: "42%", left: "92%", size: "5px", delay: "2.8s" },
  { top: "18%", left: "6%", size: "5px", delay: "1.7s" },
];

function Dashboard() {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @keyframes dashGlow {
          0%, 100% { transform: scale(1) translateY(0); opacity: 0.7; }
          50% { transform: scale(1.08) translateY(-10px); opacity: 1; }
        }
        @keyframes dashFloat {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(14px, -16px, 0); }
        }
        @keyframes dashTwinkle {
          0%, 100% { opacity: 0.18; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes dashParticle {
          0% { opacity: 0; transform: translateY(0) scale(0.4); }
          30% { opacity: 0.9; }
          100% { opacity: 0; transform: translateY(-42px) scale(1.05); }
        }
        @keyframes dashShimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes dashReflect {
          0% { transform: translateX(-130%) skewX(-16deg); opacity: 0; }
          42% { opacity: 0.55; }
          100% { transform: translateX(235%) skewX(-16deg); opacity: 0; }
        }
        @keyframes butterflyLift {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(-6deg) scale(1); }
          50% { transform: translate3d(0, -12px, 0) rotate(-2deg) scale(1.03); }
        }
        @keyframes butterflySparkle {
          0%, 100% { opacity: 0.2; transform: scale(0.55); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        .dash-title {
          background-size: 200% auto;
          animation: dashShimmer 5s ease infinite;
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
          style={{ animation: "dashGlow 9s ease-in-out infinite" }}
        />
        <div
          aria-hidden="true"
          className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-[#F472B6]/45 blur-[120px]"
          style={{ animation: "dashGlow 11s ease-in-out infinite 1s" }}
        />
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-[#FBBF94]/35 blur-[120px]"
          style={{ animation: "dashFloat 10s ease-in-out infinite" }}
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
              animation: `dashTwinkle 4s ease-in-out infinite ${star.delay}`,
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
              animation: `dashParticle 5s ease-in-out infinite ${particle.delay}`,
            }}
          />
        ))}

        <main className="relative z-10 mx-auto max-w-6xl">
          <div className="mb-6 flex items-center justify-between gap-4 rounded-[2rem] border border-white/55 bg-white/28 px-5 py-4 shadow-[0_12px_40px_rgba(91,33,182,0.14),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-2xl sm:px-6">
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
                {butterflySparkles.map((sparkle, index) => (
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
                      animation: `butterflySparkle 3.6s ease-in-out infinite ${sparkle.delay}`,
                    }}
                  />
                ))}
                <img
                  src={logo}
                  alt="AuraFit AI logo"
                  className="relative z-10 h-40 w-40 object-contain drop-shadow-[0_0_42px_rgba(192,132,252,0.58)] sm:h-48 sm:w-48"
                  style={{ animation: "butterflyLift 5.5s ease-in-out infinite" }}
                />
              </div>
              <div>
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-[#6D28D9]">
                  AuraFit AI
                </p>
                <h1 className="dash-title mt-1 bg-gradient-to-r from-[#2E1065] via-[#6D28D9] to-[#F472B6] bg-clip-text text-xl font-bold tracking-[-0.04em] text-transparent sm:text-2xl">
                  Good Morning, Vrinda
                </h1>
              </div>
            </div>

            <div className="hidden rounded-full border border-white/55 bg-white/35 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#6D28D9] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] backdrop-blur-md sm:block">
              Fashion Mode On
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
            <section className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/32 p-6 shadow-[0_16px_48px_rgba(91,33,182,0.16),inset_0_1px_0_rgba(255,255,255,0.82)] backdrop-blur-3xl sm:p-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]"
              >
                <div
                  className="absolute -inset-y-4 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  style={{ animation: "dashReflect 8s ease-in-out infinite 1.5s" }}
                />
              </div>
              <div
                aria-hidden="true"
                className="absolute -right-10 -top-8 h-28 w-28 rounded-full bg-[#C084FC]/35 blur-3xl"
              />
              <div
                aria-hidden="true"
                className="absolute -bottom-10 -left-8 h-24 w-24 rounded-full bg-[#F9A8D4]/30 blur-3xl"
              />

              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.32em] text-[#6D28D9]">
                Daily Styling Energy
              </p>
              <h2 className="mt-4 max-w-xl text-3xl font-bold leading-tight tracking-[-0.04em] text-[#2E1065] sm:text-4xl">
                Dress like your next big moment is already scheduled.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#4C1D95]/82 sm:text-base">
                Your wardrobe is ready. Let AuraFit AI create a polished look
                that feels effortless, elevated, and perfectly aligned with your
                vibe today.
              </p>

              <button
                type="button"
                onClick={() => navigate("/generate-outfit")}
                className="group relative mt-8 inline-flex w-full items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-[#6D28D9] via-[#9333EA] to-[#F472B6] px-8 py-4 text-base font-semibold text-white shadow-[0_16px_36px_rgba(124,58,237,0.35)] transition duration-300 hover:scale-[1.01] hover:shadow-[0_20px_44px_rgba(124,58,237,0.45)] active:scale-[0.98] sm:w-auto"
              >
                <span className="relative z-10">Generate Outfit</span>
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-500 group-hover:translate-x-full"
                />
              </button>
            </section>

            <section className="space-y-6">
              <div className="rounded-[2rem] border border-white/55 bg-white/28 p-5 shadow-[0_12px_40px_rgba(91,33,182,0.14),inset_0_1px_0_rgba(255,255,255,0.78)] backdrop-blur-2xl">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#6D28D9]">
                  Today&apos;s Style Tip
                </p>
                <p className="mt-4 text-lg font-semibold leading-7 text-[#2E1065]">
                  Build contrast with one statement piece and let everything
                  else feel intentionally refined.
                </p>
                <p className="mt-3 text-sm leading-6 text-[#4C1D95]/80">
                  Try pairing a soft lavender shirt with clean neutrals and one
                  metallic accessory for a luxury-tech finish.
                </p>
              </div>

              <div className="rounded-[2rem] border border-white/55 bg-white/28 p-5 shadow-[0_12px_40px_rgba(91,33,182,0.14),inset_0_1px_0_rgba(255,255,255,0.78)] backdrop-blur-2xl">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#6D28D9]">
                  Recent Outfit Preview
                </p>
                <div className="mt-4 rounded-[1.5rem] border border-white/50 bg-gradient-to-br from-white/50 to-white/20 p-4">
                  <div className="rounded-[1.25rem] bg-[radial-gradient(circle_at_top,rgba(192,132,252,0.35),rgba(255,255,255,0.6),rgba(244,114,182,0.18))] p-5">
                    <div className="flex min-h-40 items-center justify-center rounded-[1rem] border border-dashed border-[#C084FC]/40 bg-white/35 text-center text-sm font-medium text-[#6D28D9]/75">
                      Lavender satin shirt
                      <br />
                      Ivory wide-leg trousers
                      <br />
                      Pearl sneakers
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-[#4C1D95]/80">
                  Your last generated look balanced soft luxury tones with a
                  clean silhouette for an effortless daytime statement.
                </p>
              </div>
            </section>
          </div>

          <section className="mt-6 rounded-[2rem] border border-white/60 bg-white/30 p-5 shadow-[0_16px_48px_rgba(91,33,182,0.16),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-3xl sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#6D28D9]">
                  Quick Actions
                </p>
                <h3 className="mt-2 text-2xl font-bold tracking-[-0.04em] text-[#2E1065]">
                  Style Control Center
                </h3>
              </div>
              <div className="hidden rounded-full border border-white/55 bg-white/35 px-4 py-2 text-xs font-semibold text-[#6D28D9] backdrop-blur-md sm:block">
                Frontend Prototype
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {quickActions.map((action) => (
                <button
                  key={action.title}
                  type="button"
                  onClick={() => navigate(action.route)}
                  className="group relative overflow-hidden rounded-[1.5rem] border border-white/55 bg-white/38 p-4 text-left shadow-[0_10px_28px_rgba(91,33,182,0.12),inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:bg-white/48"
                >
                  <div
                    className={`mb-4 h-1.5 w-16 rounded-full bg-gradient-to-r ${action.accent}`}
                  />
                  <h4 className="text-base font-semibold text-[#2E1065]">
                    {action.title}
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-[#4C1D95]/78">
                    {action.description}
                  </p>
                  <div className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#7C3AED] transition group-hover:text-[#5B21B6]">
                    Open
                  </div>
                </button>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export default Dashboard;