import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assests/logo.png";
import ProfileSetup from "./ProfileSetup";

const stars = [
  { top: "12%", left: "18%", delay: "0s", size: "4px" },
  { top: "22%", left: "78%", delay: "1.2s", size: "3px" },
  { top: "38%", left: "92%", delay: "2.4s", size: "4px" },
  { top: "55%", left: "6%", delay: "0.8s", size: "3px" },
  { top: "68%", left: "88%", delay: "3s", size: "5px" },
  { top: "78%", left: "24%", delay: "1.8s", size: "3px" },
  { top: "8%", left: "52%", delay: "2s", size: "3px" },
  { top: "44%", left: "42%", delay: "3.6s", size: "4px" },
];

const particles = [
  { top: "20%", left: "30%", delay: "0s" },
  { top: "35%", left: "65%", delay: "1.5s" },
  { top: "50%", left: "15%", delay: "3s" },
  { top: "62%", left: "72%", delay: "0.5s" },
  { top: "28%", left: "85%", delay: "2s" },
  { top: "72%", left: "48%", delay: "2.8s" },
  { top: "15%", left: "70%", delay: "1s" },
  { top: "58%", left: "35%", delay: "3.5s" },
];

const dust = [
  { top: "18%", left: "45%", delay: "0.3s" },
  { top: "32%", left: "22%", delay: "1.8s" },
  { top: "48%", left: "88%", delay: "2.6s" },
  { top: "64%", left: "55%", delay: "0.9s" },
  { top: "76%", left: "38%", delay: "3.2s" },
  { top: "42%", left: "8%", delay: "1.1s" },
];

const butterflies = [
  { top: "24%", duration: "26s", delay: "0s", scale: 1 },
  { top: "58%", duration: "34s", delay: "11s", scale: 0.75 },
  { top: "40%", duration: "30s", delay: "5s", scale: 0.9, hidden: "sm" },
];

const views = {
  welcome: "welcome",
  login: "login",
  signup: "signup",
  profileSetup: "profileSetup",
};

const inputClassName =
  "w-full rounded-2xl border border-white/50 bg-white/45 px-4 py-3.5 text-sm font-medium text-[#4C1D95] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] outline-none backdrop-blur-md transition duration-300 placeholder:text-[#7C3AED]/60 focus:border-[#C084FC] focus:bg-white/60 focus:ring-4 focus:ring-[#C084FC]/25";

function Splash() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState(views.welcome);

  const handleAuthSubmit = (event) => {
    event.preventDefault();
  };

  const cardWidth =
    activeView === views.profileSetup
      ? "max-w-3xl"
      : activeView === views.signup
        ? "max-w-xl"
        : "max-w-lg";

  return (
    <>
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.72; }
          50% { transform: scale(1.18); opacity: 0.95; }
        }
        @keyframes meshDrift {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          33% { transform: translate(3%, -2%) scale(1.06) rotate(1deg); }
          66% { transform: translate(-2%, 3%) scale(1.03) rotate(-1deg); }
        }
        @keyframes auroraShift {
          0%, 100% { transform: translateX(-5%) skewY(-2deg); opacity: 0.85; }
          50% { transform: translateX(5%) skewY(2deg); opacity: 1; }
        }
        @keyframes colorWave {
          0%, 100% { transform: translateY(0) scaleY(1); opacity: 0.5; }
          50% { transform: translateY(-3%) scaleY(1.08); opacity: 0.75; }
        }
        @keyframes rayPulse {
          0%, 100% { opacity: 0.18; }
          50% { opacity: 0.42; }
        }
        @keyframes streakDrift {
          0% { transform: translateX(-20%) rotate(-8deg); opacity: 0; }
          20% { opacity: 0.35; }
          80% { opacity: 0.25; }
          100% { transform: translateX(120%) rotate(-8deg); opacity: 0; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0.3); }
          20% { opacity: 0.3; }
          50% { opacity: 1; transform: scale(1.2); }
          80% { opacity: 0.4; }
        }
        @keyframes particleDrift {
          0% { opacity: 0; transform: translateY(0) scale(0.5); }
          25% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-48px) scale(1.1); }
        }
        @keyframes dustFloat {
          0%, 100% { opacity: 0; transform: translate(0, 0); }
          30% { opacity: 0.7; }
          70% { opacity: 0.5; }
          100% { opacity: 0; transform: translate(12px, -24px); }
        }
        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(18px, -28px); }
        }
        @keyframes butterflyCross {
          0% { transform: translateX(-14vw) translateY(0); opacity: 0; }
          6% { opacity: 0.7; }
          94% { opacity: 0.6; }
          100% { transform: translateX(114vw) translateY(-50px); opacity: 0; }
        }
        @keyframes wingFlapL {
          0%, 100% { transform: rotate(-12deg) scaleX(1); }
          50% { transform: rotate(-22deg) scaleX(0.82); }
        }
        @keyframes wingFlapR {
          0%, 100% { transform: rotate(12deg) scaleX(1); }
          50% { transform: rotate(22deg) scaleX(0.82); }
        }
        @keyframes shimmerLine {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(220%); }
        }
        @keyframes bgShift {
          0%, 100% { background-position: 0% 40%; }
          50% { background-position: 100% 60%; }
        }
        @keyframes titleShimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes btnPulse {
          0%, 100% {
            box-shadow: 0 6px 28px rgba(124,58,237,0.55), 0 0 0 0 rgba(192,132,252,0.35), inset 0 1px 0 rgba(255,255,255,0.25);
          }
          50% {
            box-shadow: 0 10px 40px rgba(124,58,237,0.7), 0 0 32px 6px rgba(192,132,252,0.4), inset 0 1px 0 rgba(255,255,255,0.35);
          }
        }
        @keyframes floatDecor {
          0%, 100% { transform: translateY(0) rotate(12deg); }
          50% { transform: translateY(-14px) rotate(16deg); }
        }
        @keyframes crystalFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-9px) scale(1.03); }
        }
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.025); }
        }
        @keyframes logoBreath {
          0%, 100% { transform: scale(1); opacity: 0.96; }
          50% { transform: scale(1.04); opacity: 1; }
        }
        @keyframes logoShimmer {
          0% { transform: translateX(-140%) skewX(-18deg); opacity: 0; }
          40% { opacity: 0.4; }
          100% { transform: translateX(180%) skewX(-18deg); opacity: 0; }
        }
        @keyframes auraRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes sparkleDrift {
          0% { transform: translate3d(0, 0, 0) scale(0.2); opacity: 0; }
          25% { opacity: 0.9; }
          100% { transform: translate3d(14px, -42px, 0) scale(1); opacity: 0; }
        }
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.7); }
          50% { opacity: 1; transform: scale(1); }
        }
        @keyframes orbitSparkleA {
          0% { transform: translate(-50%, -50%) rotate(0deg) translateX(38px) rotate(0deg); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) rotate(180deg) translateX(38px) rotate(-180deg); opacity: 1; }
          100% { transform: translate(-50%, -50%) rotate(360deg) translateX(38px) rotate(-360deg); opacity: 0.3; }
        }
        @keyframes orbitSparkleB {
          0% { transform: translate(-50%, -50%) rotate(0deg) translateX(30px) rotate(0deg); opacity: 0.25; }
          50% { transform: translate(-50%, -50%) rotate(-180deg) translateX(30px) rotate(180deg); opacity: 0.9; }
          100% { transform: translate(-50%, -50%) rotate(-360deg) translateX(30px) rotate(360deg); opacity: 0.25; }
        }
        @keyframes orbitSparkleC {
          0% { transform: translate(-50%, -50%) rotate(0deg) translateX(26px) rotate(0deg); opacity: 0.2; }
          50% { transform: translate(-50%, -50%) rotate(145deg) translateX(26px) rotate(-145deg); opacity: 0.8; }
          100% { transform: translate(-50%, -50%) rotate(360deg) translateX(26px) rotate(-360deg); opacity: 0.2; }
        }
        @keyframes cardBreath {
          0%, 100% { opacity: 0.45; transform: scale(1); }
          50% { opacity: 0.75; transform: scale(1.015); }
        }
        @keyframes cardReflect {
          0%, 100% { transform: translateX(-130%) skewX(-12deg); opacity: 0; }
          40% { opacity: 0.6; }
          60% { opacity: 0.3; }
          100% { transform: translateX(230%) skewX(-12deg); opacity: 0; }
        }
        @keyframes lensPulse {
          0%, 100% { opacity: 0.35; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.55; transform: translate(-50%, -50%) scale(1.08); }
        }
        @keyframes parallaxUp {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes parallaxDown {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(16px); }
        }
        @keyframes formEnter {
          0% { opacity: 0; transform: translateY(18px) scale(0.985); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .splash-breathe { animation: breathe 7s ease-in-out infinite; }
        .splash-breathe-slow { animation: breathe 10s ease-in-out infinite 1.5s; }
        .splash-breathe-mid { animation: breathe 8s ease-in-out infinite 0.75s; }
        .splash-mesh { animation: meshDrift 16s ease-in-out infinite; }
        .splash-aurora { animation: auroraShift 14s ease-in-out infinite; }
        .splash-wave { animation: colorWave 10s ease-in-out infinite; }
        .splash-rays { animation: rayPulse 5s ease-in-out infinite; }
        .splash-orb { animation: orbFloat 6s ease-in-out infinite; }
        .splash-orb-delay { animation: orbFloat 8s ease-in-out infinite 2s; }
        .splash-bg {
          animation: bgShift 10s ease infinite;
          background-size: 220% 220%;
        }
        .splash-title {
          animation: titleShimmer 5s ease infinite;
          background-size: 220% auto;
        }
        .splash-btn-pulse { animation: btnPulse 2.5s ease-in-out infinite; }
        .splash-decor { animation: floatDecor 4.5s ease-in-out infinite; }
        .splash-crystal-float { animation: crystalFloat 5s ease-in-out infinite; }
        .splash-logo-float { animation: logoFloat 4s ease-in-out infinite; }
        .splash-logo-breathe { animation: logoBreath 3.6s ease-in-out infinite; }
        .splash-logo-shimmer { animation: logoShimmer 3.6s ease-in-out infinite; }
        .splash-aura-ring { animation: auraRotate 14s linear infinite; }
        .splash-sparkle { animation: sparkleDrift 2.8s ease-out infinite; }
        .splash-star { animation: starTwinkle 2.2s ease-in-out infinite; }
        .splash-orbit-a { animation: orbitSparkleA 4.8s ease-in-out infinite; }
        .splash-orbit-b { animation: orbitSparkleB 5.6s ease-in-out infinite 0.9s; }
        .splash-orbit-c { animation: orbitSparkleC 4.2s ease-in-out infinite 1.3s; }
        .splash-card-glow { animation: cardBreath 4s ease-in-out infinite; }
        .splash-lens { animation: lensPulse 6s ease-in-out infinite; }
        .splash-parallax-slow { animation: parallaxUp 12s ease-in-out infinite; }
        .splash-parallax-mid { animation: parallaxDown 9s ease-in-out infinite 1s; }
        .auth-panel { animation: formEnter 420ms cubic-bezier(0.22, 1, 0.36, 1); }
      `}</style>

      <div className="relative flex min-h-dvh min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-10 sm:px-8 splash-bg bg-gradient-to-br from-[#FF6B9D] via-[#C084FC] via-45% to-[#A855F7]">
        <div
          aria-hidden="true"
          className="splash-aurora pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              "linear-gradient(125deg, rgba(255,183,197,0.55) 0%, rgba(192,132,252,0.45) 35%, rgba(167,139,250,0.5) 55%, rgba(251,191,146,0.4) 75%, rgba(244,114,182,0.45) 100%)",
          }}
        />

        <div
          aria-hidden="true"
          className="splash-mesh pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 85% 65% at 18% 28%, rgba(255,186,120,0.75) 0%, transparent 52%), radial-gradient(ellipse 75% 55% at 82% 68%, rgba(255,105,180,0.7) 0%, transparent 48%), radial-gradient(ellipse 65% 45% at 52% 8%, rgba(167,139,250,0.65) 0%, transparent 42%), radial-gradient(ellipse 50% 40% at 70% 20%, rgba(251,207,232,0.5) 0%, transparent 40%)",
          }}
        />

        <div
          aria-hidden="true"
          className="splash-wave pointer-events-none absolute inset-x-0 bottom-0 h-[55%]"
          style={{
            background:
              "linear-gradient(to top, rgba(168,85,247,0.35) 0%, rgba(244,114,182,0.2) 40%, transparent 100%)",
          }}
        />

        <div
          aria-hidden="true"
          className="splash-rays pointer-events-none absolute inset-0"
          style={{
            background:
              "conic-gradient(from 195deg at 50% -8%, transparent 0deg, rgba(255,255,255,0.28) 28deg, transparent 58deg, rgba(255,255,255,0.16) 115deg, transparent 148deg, rgba(255,255,255,0.22) 215deg, transparent 255deg)",
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-[20%] h-px w-[40%]"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
            animation: "streakDrift 12s ease-in-out infinite",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-[65%] h-px w-[30%]"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(161, 84, 238, 0.6), transparent)",
            animation: "streakDrift 16s ease-in-out infinite 4s",
          }}
        />

        <div
          aria-hidden="true"
          className="splash-lens pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,214,165,0.45) 0%, rgba(192,132,252,0.25) 35%, transparent 68%)",
            filter: "blur(40px)",
            transform: "translate(-50%, -50%)",
          }}
        />

        <div
          aria-hidden="true"
          className="splash-breathe splash-parallax-slow pointer-events-none absolute -left-28 -top-28 h-80 w-80 rounded-full bg-[#A855F7] blur-[100px] sm:h-[26rem] sm:w-[26rem]"
        />
        <div
          aria-hidden="true"
          className="splash-breathe-slow splash-parallax-mid pointer-events-none absolute -bottom-36 -right-24 h-[22rem] w-[22rem] rounded-full bg-[#F472B6] blur-[110px] sm:h-[30rem] sm:w-[30rem]"
        />
        <div
          aria-hidden="true"
          className="splash-breathe-mid pointer-events-none absolute left-1/2 top-[30%] h-72 w-72 -translate-x-1/2 rounded-full bg-[#FBBF94] blur-[90px] sm:h-96 sm:w-96"
        />
        <div
          aria-hidden="true"
          className="splash-breathe pointer-events-none absolute right-6 top-14 h-36 w-36 rounded-full bg-[#E9D5FF] blur-[70px] sm:h-44 sm:w-44"
          style={{ animationDelay: "2s" }}
        />

        <div
          aria-hidden="true"
          className="splash-orb pointer-events-none absolute left-[14%] top-[28%] h-3.5 w-3.5 rounded-full bg-[#C084FC] shadow-[0_0_24px_8px_rgba(192,132,252,0.75)]"
        />
        <div
          aria-hidden="true"
          className="splash-orb-delay pointer-events-none absolute right-[18%] top-[42%] h-3 w-3 rounded-full bg-[#F472B6] shadow-[0_0_20px_6px_rgba(244,114,182,0.7)]"
        />
        <div
          aria-hidden="true"
          className="splash-orb pointer-events-none absolute bottom-[32%] left-[22%] h-2.5 w-2.5 rounded-full bg-[#FBBF94] shadow-[0_0_18px_5px_rgba(251,191,146,0.65)]"
          style={{ animationDelay: "1s" }}
        />
        <div
          aria-hidden="true"
          className="splash-orb-delay pointer-events-none absolute top-[16%] right-[32%] h-2 w-2 rounded-full bg-white shadow-[0_0_14px_4px_rgba(255,255,255,0.6)]"
          style={{ animationDelay: "3s" }}
        />

        {stars.map((star, i) => (
          <div
            key={i}
            aria-hidden="true"
            className="pointer-events-none absolute rounded-full bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.9)]"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              animation: `twinkle 4s ease-in-out infinite ${star.delay}`,
            }}
          />
        ))}

        {particles.map((particle, i) => (
          <div
            key={i}
            aria-hidden="true"
            className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_6px_1px_rgba(255,255,255,0.8)]"
            style={{
              top: particle.top,
              left: particle.left,
              animation: `particleDrift 5s ease-in-out infinite ${particle.delay}`,
            }}
          />
        ))}

        {dust.map((d, i) => (
          <div
            key={i}
            aria-hidden="true"
            className="pointer-events-none absolute h-0.5 w-0.5 rounded-full bg-[#F5D0FE]"
            style={{
              top: d.top,
              left: d.left,
              boxShadow: "0 0 4px 1px rgba(244,114,182,0.6)",
              animation: `dustFloat 6s ease-in-out infinite ${d.delay}`,
            }}
          />
        ))}

        {butterflies.map((b, i) => (
          <div
            key={i}
            aria-hidden="true"
            className={`pointer-events-none absolute text-[#5B21B6] ${b.hidden === "sm" ? "hidden sm:block" : ""}`}
            style={{
              top: b.top,
              animation: `butterflyCross ${b.duration} linear infinite ${b.delay}`,
            }}
          >
            <svg
              viewBox="0 0 56 36"
              width={56 * b.scale}
              height={36 * b.scale}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="opacity-60"
            >
              <line x1="28" y1="8" x2="28" y2="28" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
              <g style={{ transformOrigin: "28px 14px", animation: "wingFlapL 2.4s ease-in-out infinite" }}>
                <ellipse cx="16" cy="14" rx="13" ry="9" fill="currentColor" opacity="0.55" transform="rotate(-18 16 14)" />
                <ellipse cx="14" cy="24" rx="9" ry="7" fill="currentColor" opacity="0.4" transform="rotate(-12 14 24)" />
              </g>
              <g style={{ transformOrigin: "28px 14px", animation: "wingFlapR 2.4s ease-in-out infinite" }}>
                <ellipse cx="40" cy="14" rx="13" ry="9" fill="currentColor" opacity="0.55" transform="rotate(18 40 14)" />
                <ellipse cx="42" cy="24" rx="9" ry="7" fill="currentColor" opacity="0.4" transform="rotate(12 42 24)" />
              </g>
            </svg>
          </div>
        ))}

        <div
          aria-hidden="true"
          className="splash-decor pointer-events-none absolute left-[8%] top-[18%] hidden h-16 w-16 rounded-2xl border border-white/50 bg-white/25 shadow-[0_8px_32px_rgba(168,85,247,0.25)] backdrop-blur-sm sm:block"
        />
        <div
          aria-hidden="true"
          className="splash-decor pointer-events-none absolute bottom-[22%] right-[10%] hidden h-12 w-12 rounded-full border border-white/45 bg-white/20 shadow-[0_4px_24px_rgba(244,114,182,0.3)] backdrop-blur-sm sm:block"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[30%] left-[12%] hidden h-px w-28 overflow-hidden sm:block"
        >
          <div className="h-full w-full bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          <div
            className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white to-transparent"
            style={{ animation: "shimmerLine 3.5s ease-in-out infinite" }}
          />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[14%] top-[14%] hidden h-px w-20 overflow-hidden sm:block"
        >
          <div
            className="h-full w-full bg-gradient-to-r from-transparent via-[#E9D5FF]/80 to-transparent"
            style={{ animation: "shimmerLine 4.5s ease-in-out infinite 1s" }}
          />
        </div>

        <main className={`relative z-10 w-full transition-all duration-500 ${cardWidth}`}>
          <div
            aria-hidden="true"
            className="splash-card-glow pointer-events-none absolute -inset-3 rounded-[2.2rem] bg-gradient-to-br from-[#C084FC]/50 via-[#F472B6]/35 to-[#A855F7]/45 blur-2xl"
          />

          <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/50 p-8 shadow-[0_4px_24px_rgba(91,33,182,0.1),0_16px_48px_rgba(124,58,237,0.18),0_32px_80px_rgba(168,85,247,0.15),inset_0_1px_0_rgba(255,255,255,0.85),inset_0_-1px_0_rgba(255,255,255,0.2)] backdrop-blur-3xl sm:p-10 md:p-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]"
            >
              <div
                className="absolute -inset-y-4 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                style={{ animation: "cardReflect 7s ease-in-out infinite 2s" }}
              />
            </div>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-[#C084FC]/30 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-14 -left-14 h-36 w-36 rounded-full bg-[#F472B6]/25 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent"
            />

            <div className="relative mb-8 flex justify-center">
              <div className="relative flex h-40 w-40 items-center justify-center sm:h-44 sm:w-44">
                <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(244,114,182,0.36),rgba(192,132,252,0.2),transparent_72%)] blur-3xl" />
                <div className="pointer-events-none absolute inset-3 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.6),rgba(244,114,182,0.28),rgba(192,132,252,0.16),transparent_72%)] blur-2xl" />
                <div className="splash-logo-shimmer pointer-events-none absolute inset-0 overflow-hidden rounded-full">
                  <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/45 to-transparent" />
                </div>
                <div className="splash-aura-ring pointer-events-none absolute inset-2 rounded-full border border-[#F9A8D4]/60 border-t-[#FDE68A]/70 border-r-[#C084FC]/70" />
                <div className="splash-aura-ring pointer-events-none absolute inset-4 rounded-full border border-white/25" style={{ animationDuration: "18s" }} />
                <div className="splash-logo-breathe pointer-events-none absolute inset-5 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.24),transparent_70%)] blur-[2px]" />
                <div className="splash-logo-float relative z-10 flex h-36 w-36 items-center justify-center sm:h-40 sm:w-40">
                  <img
                    src={logo}
                    alt="AuraFit AI logo"
                    className="h-full w-full scale-150 object-contain drop-shadow-[0_0_32px_rgba(192,132,252,0.48)]"
                  />
                </div>
                <div className="splash-star pointer-events-none absolute left-[18%] top-[20%] h-2 w-2 rounded-full bg-white/90 shadow-[0_0_10px_rgba(255,255,255,0.9)]" />
                <div className="splash-star pointer-events-none absolute right-[12%] top-[24%] h-1.5 w-1.5 rounded-full bg-[#FDE68A] shadow-[0_0_8px_rgba(253,230,138,0.8)]" style={{ animationDelay: "0.8s" }} />
                <div className="splash-star pointer-events-none absolute bottom-[18%] left-[24%] h-1.5 w-1.5 rounded-full bg-[#F5D0FE] shadow-[0_0_8px_rgba(245,208,254,0.8)]" style={{ animationDelay: "1.2s" }} />
                <div className="splash-sparkle pointer-events-none absolute left-[22%] top-[30%] h-2 w-2 rounded-full bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.7)]" style={{ animationDelay: "0.2s" }} />
                <div className="splash-sparkle pointer-events-none absolute right-[20%] top-[38%] h-1.5 w-1.5 rounded-full bg-[#F9A8D4] shadow-[0_0_6px_rgba(249,168,212,0.7)]" style={{ animationDelay: "1.1s" }} />
                <div className="splash-sparkle pointer-events-none absolute bottom-[24%] right-[24%] h-1.5 w-1.5 rounded-full bg-[#FDE68A] shadow-[0_0_6px_rgba(253,230,138,0.7)]" style={{ animationDelay: "1.7s" }} />
                <div className="splash-orbit-a pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 rounded-full border border-white/70 bg-white/90 shadow-[0_0_12px_rgba(255,255,255,0.8)]" />
                <div className="splash-orbit-b pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-[#F9A8D4] shadow-[0_0_10px_rgba(249,168,212,0.7)]" />
                <div className="splash-orbit-c pointer-events-none absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-[#F5D0FE] shadow-[0_0_8px_rgba(245,208,254,0.7)]" />
              </div>
            </div>

            {activeView === views.welcome && (
              <section key="welcome" className="auth-panel relative">
                <p className="relative mb-4 text-center text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#6D28D9] sm:text-xs">
                  Fashion Intelligence
                </p>

                <h1 className="splash-title relative text-center text-[2.75rem] font-bold leading-[1.02] tracking-[-0.04em] sm:text-5xl md:text-[3.5rem] bg-gradient-to-r from-[#2E1065] via-[#6D28D9] via-50% to-[#9333EA] bg-clip-text text-transparent [text-shadow:0_1px_24px_rgba(124,58,237,0.15)]">
                  AuraFit AI
                </h1>

                <p className="relative mt-3 text-center text-lg font-semibold tracking-[-0.01em] text-[#3B0764] sm:text-xl">
                  Your Personal AI Stylist
                </p>

                <div className="relative mx-auto mt-6 h-px w-20 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-transparent via-[#9333EA]/50 to-transparent" />
                  <div
                    aria-hidden="true"
                    className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-[#C084FC] to-transparent"
                    style={{ animation: "shimmerLine 2.8s ease-in-out infinite" }}
                  />
                </div>

                <p className="relative mx-auto mt-6 max-w-sm text-center text-[0.9375rem] leading-relaxed text-[#4C1D95]/90 sm:text-base">
                  Plan smarter outfits, organize your wardrobe and discover your
                  perfect look with AI.
                </p>

                <div className="relative mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="splash-btn-pulse group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-[#6D28D9] via-[#9333EA] to-[#C084FC] px-8 py-3.5 text-[0.9375rem] font-semibold text-white transition-all duration-300 hover:scale-[1.04] hover:from-[#7C3AED] hover:via-[#A855F7] hover:to-[#D8B4FE] hover:shadow-[0_12px_48px_rgba(124,58,237,0.55)] active:scale-[0.97] sm:w-auto"
                  >
                    <span className="relative z-10 tracking-wide">Get Started</span>
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 group-hover:translate-x-full"
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/signup")}
                    className="group w-full rounded-full border border-[#9333EA]/40 bg-white/35 px-8 py-3.5 text-[0.9375rem] font-medium text-[#4C1D95] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-md transition-all duration-300 hover:border-[#9333EA]/60 hover:bg-white/55 hover:shadow-[0_6px_24px_rgba(124,58,237,0.18),inset_0_1px_0_rgba(255,255,255,0.8)] active:scale-[0.97] sm:w-auto"
                  >
                    Create Account
                  </button>
                </div>
              </section>
            )}

            {activeView === views.login && (
              <section key="login" className="auth-panel relative">
                <p className="text-center text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#6D28D9] sm:text-xs">
                  Welcome Back
                </p>

                <h1 className="splash-title mt-4 text-center text-[2.25rem] font-bold leading-tight tracking-[-0.04em] text-transparent bg-gradient-to-r from-[#2E1065] via-[#6D28D9] to-[#9333EA] bg-clip-text sm:text-[2.8rem]">
                  Login to AuraFit AI
                </h1>

                <p className="mx-auto mt-4 max-w-md text-center text-sm leading-relaxed text-[#4C1D95]/85 sm:text-base">
                  Step into your wardrobe universe and let AuraFit curate your
                  next standout look.
                </p>

                <form className="mt-8 space-y-4" onSubmit={handleAuthSubmit}>
                  <div>
                    <label
                      htmlFor="login-email"
                      className="mb-2 block text-sm font-semibold text-[#4C1D95]"
                    >
                      Email Address
                    </label>
                    <input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      placeholder="Enter your email"
                      className={inputClassName}
                      required
                    />
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <label
                        htmlFor="login-password"
                        className="block text-sm font-semibold text-[#4C1D95]"
                      >
                        Password
                      </label>
                      <button
                        type="button"
                        className="text-xs font-semibold text-[#7C3AED] transition hover:text-[#5B21B6]"
                      >
                        Forgot Password
                      </button>
                    </div>
                    <input
                      id="login-password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      className={inputClassName}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-[#6D28D9] via-[#9333EA] to-[#F472B6] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(124,58,237,0.35)] transition duration-300 hover:scale-[1.01] hover:shadow-[0_18px_40px_rgba(124,58,237,0.45)] focus:outline-none focus:ring-4 focus:ring-[#C084FC]/35 active:scale-[0.98]"
                  >
                    <span className="relative z-10">Login</span>
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-500 group-hover:translate-x-full"
                    />
                  </button>
                </form>

                <button
                  type="button"
                  onClick={() => navigate("/profile-setup")}
                  className="mt-4 w-full rounded-full border border-white/55 bg-white/35 px-5 py-3 text-sm font-semibold text-[#6D28D9] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-md transition duration-300 hover:bg-white/55 hover:shadow-[0_10px_24px_rgba(124,58,237,0.15)]"
                >
                  Continue to Profile Setup
                </button>

                <p className="mt-6 text-center text-sm text-[#4C1D95]/80">
                  New User?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/signup")}
                    className="font-semibold text-[#7C3AED] transition hover:text-[#5B21B6]"
                  >
                    Create Account
                  </button>
                </p>
              </section>
            )}

            {activeView === views.signup && (
              <section key="signup" className="auth-panel relative">
                <p className="text-center text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#6D28D9] sm:text-xs">
                  Create Your Aura
                </p>

                <h1 className="splash-title mt-4 text-center text-[2.25rem] font-bold leading-tight tracking-[-0.04em] text-transparent bg-gradient-to-r from-[#2E1065] via-[#6D28D9] to-[#F472B6] bg-clip-text sm:text-[2.8rem]">
                  Join AuraFit AI
                </h1>

                <p className="mx-auto mt-4 max-w-md text-center text-sm leading-relaxed text-[#4C1D95]/85 sm:text-base">
                  Create your privacy-first fashion profile and start building
                  beautifully styled AI outfit journeys.
                </p>

                <form
                  className="mt-8 space-y-4"
                  onSubmit={(event) => {
                    event.preventDefault();
                    navigate("/profile-setup");
                  }}
                >
                  <div>
                    <label
                      htmlFor="signup-name"
                      className="mb-2 block text-sm font-semibold text-[#4C1D95]"
                    >
                      Full Name
                    </label>
                    <input
                      id="signup-name"
                      type="text"
                      autoComplete="name"
                      placeholder="Enter your full name"
                      className={inputClassName}
                      required
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="signup-email"
                        className="mb-2 block text-sm font-semibold text-[#4C1D95]"
                      >
                        Email Address
                      </label>
                      <input
                        id="signup-email"
                        type="email"
                        autoComplete="email"
                        placeholder="Enter your email"
                        className={inputClassName}
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="signup-password"
                        className="mb-2 block text-sm font-semibold text-[#4C1D95]"
                      >
                        Password
                      </label>
                      <input
                        id="signup-password"
                        type="password"
                        autoComplete="new-password"
                        placeholder="Create a password"
                        className={inputClassName}
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="signup-confirm-password"
                        className="mb-2 block text-sm font-semibold text-[#4C1D95]"
                      >
                        Confirm Password
                      </label>
                      <input
                        id="signup-confirm-password"
                        type="password"
                        autoComplete="new-password"
                        placeholder="Confirm password"
                        className={inputClassName}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-[#6D28D9] via-[#9333EA] to-[#F472B6] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(124,58,237,0.35)] transition duration-300 hover:scale-[1.01] hover:shadow-[0_18px_40px_rgba(124,58,237,0.45)] focus:outline-none focus:ring-4 focus:ring-[#F9A8D4]/35 active:scale-[0.98]"
                  >
                    <span className="relative z-10">Create Account</span>
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-500 group-hover:translate-x-full"
                    />
                  </button>
                </form>

                <button
                  type="button"
                  onClick={() => navigate("/profile-setup")}
                  className="mt-4 w-full rounded-full border border-white/55 bg-white/35 px-5 py-3 text-sm font-semibold text-[#6D28D9] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-md transition duration-300 hover:bg-white/55 hover:shadow-[0_10px_24px_rgba(124,58,237,0.15)]"
                >
                  Preview Profile Setup
                </button>

                <p className="mt-6 text-center text-sm text-[#4C1D95]/80">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="font-semibold text-[#7C3AED] transition hover:text-[#5B21B6]"
                  >
                    Login
                  </button>
                </p>
              </section>
            )}

            {activeView === views.profileSetup && (
              <ProfileSetup onBackToLogin={() => navigate("/login")} />
            )}
          </div>

          <p className="mt-8 text-center text-xs font-medium tracking-[0.2em] text-[#6D28D9]/70 uppercase">
            Style with confidence
          </p>
        </main>
      </div>
    </>
  );
}

export default Splash;
