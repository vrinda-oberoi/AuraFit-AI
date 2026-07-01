import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assests/logo.png";

const stars = [
  { top: "10%", left: "14%", delay: "0s", size: "4px" },
  { top: "18%", left: "82%", delay: "1.2s", size: "3px" },
  { top: "34%", left: "90%", delay: "2.6s", size: "4px" },
  { top: "56%", left: "8%", delay: "0.8s", size: "3px" },
  { top: "70%", left: "84%", delay: "3s", size: "5px" },
  { top: "82%", left: "20%", delay: "1.7s", size: "3px" },
];

const particles = [
  { top: "24%", left: "24%", delay: "0s" },
  { top: "42%", left: "72%", delay: "1.4s" },
  { top: "58%", left: "16%", delay: "2.8s" },
  { top: "68%", left: "64%", delay: "0.6s" },
  { top: "30%", left: "86%", delay: "2s" },
  { top: "76%", left: "46%", delay: "3.3s" },
];

const inputClassName =
  "w-full rounded-2xl border border-white/50 bg-white/45 px-4 py-3.5 text-sm font-medium text-[#4C1D95] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] outline-none backdrop-blur-md transition duration-300 placeholder:text-[#7C3AED]/60 focus:border-[#C084FC] focus:bg-white/60 focus:ring-4 focus:ring-[#C084FC]/25";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/login",
      {
        email,
        password,
      }
    );

    localStorage.setItem(
      "token",
      response.data.token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(response.data.user)
    );

    navigate("/dashboard");
  } catch (error) {
    alert(
      error.response?.data?.message ||
        "Login failed"
    );
  }
};

  return (
    <>
      <style>{`
        @keyframes authGlow {
          0%, 100% { transform: scale(1) translateY(0); opacity: 0.7; }
          50% { transform: scale(1.08) translateY(-10px); opacity: 1; }
        }
        @keyframes authDrift {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(18px, -22px, 0); }
        }
        @keyframes authTwinkle {
          0%, 100% { opacity: 0.15; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1); }
        }
        @keyframes authParticle {
          0% { opacity: 0; transform: translateY(0) scale(0.4); }
          30% { opacity: 0.9; }
          100% { opacity: 0; transform: translateY(-44px) scale(1.05); }
        }
        @keyframes authCardGlow {
          0%, 100% { opacity: 0.45; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.02); }
        }
        @keyframes authReflect {
          0% { transform: translateX(-140%) skewX(-18deg); opacity: 0; }
          40% { opacity: 0.55; }
          100% { transform: translateX(230%) skewX(-18deg); opacity: 0; }
        }
        @keyframes authLogoFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes authShimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .auth-title {
          background-size: 200% auto;
          animation: authShimmer 5s ease infinite;
        }
      `}</style>

      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#FF6B9D] via-[#C084FC] via-45% to-[#A855F7] px-4 py-10 sm:px-6 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-90"
          style={{
            background:
              "linear-gradient(130deg, rgba(255,214,165,0.28) 0%, rgba(251,191,146,0.24) 18%, rgba(192,132,252,0.3) 42%, rgba(244,114,182,0.28) 72%, rgba(255,255,255,0.12) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 18% 20%, rgba(255,255,255,0.22), transparent 26%), radial-gradient(circle at 82% 26%, rgba(251,191,146,0.3), transparent 24%), radial-gradient(circle at 58% 78%, rgba(244,114,182,0.24), transparent 30%)",
          }}
        />

        <div
          aria-hidden="true"
          className="absolute -left-20 top-6 h-64 w-64 rounded-full bg-[#F9A8D4]/60 blur-[110px]"
          style={{ animation: "authGlow 9s ease-in-out infinite" }}
        />
        <div
          aria-hidden="true"
          className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-[#FBBF94]/50 blur-[120px]"
          style={{ animation: "authGlow 11s ease-in-out infinite 1s" }}
        />
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-[#DDD6FE]/40 blur-[120px]"
          style={{ animation: "authDrift 10s ease-in-out infinite" }}
        />

        {stars.map((star, index) => (
          <div
            key={index}
            aria-hidden="true"
            className="absolute rounded-full bg-white shadow-[0_0_10px_2px_rgba(255,255,255,0.8)]"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              animation: `authTwinkle 4s ease-in-out infinite ${star.delay}`,
            }}
          />
        ))}

        {particles.map((particle, index) => (
          <div
            key={index}
            aria-hidden="true"
            className="absolute h-1.5 w-1.5 rounded-full bg-white/90"
            style={{
              top: particle.top,
              left: particle.left,
              boxShadow: "0 0 10px rgba(255,255,255,0.75)",
              animation: `authParticle 5s ease-in-out infinite ${particle.delay}`,
            }}
          />
        ))}

        <main className="relative z-10 w-full max-w-md">
          <div
            aria-hidden="true"
            className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-[#F9A8D4]/40 via-[#C084FC]/30 to-[#FBBF94]/40 blur-2xl"
            style={{ animation: "authCardGlow 4.5s ease-in-out infinite" }}
          />

          <section className="relative overflow-hidden rounded-[2rem] border border-white/55 bg-white/38 p-6 shadow-[0_12px_48px_rgba(91,33,182,0.18),inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-3xl sm:p-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]"
            >
              <div
                className="absolute -inset-y-4 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent"
                style={{ animation: "authReflect 8s ease-in-out infinite 1.5s" }}
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

            <div className="relative text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.9),rgba(249,168,212,0.35),rgba(192,132,252,0.22),transparent_72%)] shadow-[0_0_40px_rgba(192,132,252,0.3)]">
                <img
                  src={logo}
                  alt="AuraFit AI logo"
                  className="h-16 w-16 object-contain drop-shadow-[0_0_16px_rgba(192,132,252,0.5)]"
                  style={{ animation: "authLogoFloat 4s ease-in-out infinite" }}
                />
              </div>

              <p className="mt-6 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-[#6D28D9]">
                Welcome Back
              </p>
              <h1 className="auth-title mt-3 bg-gradient-to-r from-[#2E1065] via-[#7C3AED] to-[#A855F7] bg-clip-text text-4xl font-bold tracking-[-0.04em] text-transparent sm:text-[2.6rem]">
                Login to AuraFit AI
              </h1>
              <p className="mt-3 text-sm leading-6 text-[#4C1D95]/80 sm:text-[0.95rem]">
                Step back into your wardrobe universe and let AI style your next
                standout look.
              </p>
            </div>

            <form className="relative mt-8 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-[#4C1D95]"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  name="email"
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
                    htmlFor="password"
                    className="block text-sm font-semibold text-[#4C1D95]"
                  >
                    Password
                  </label>
                  <a
                    href="/forgot-password"
                    className="text-xs font-semibold text-[#7C3AED] transition hover:text-[#5B21B6]"
                  >
                    Forgot Password?
                  </a>
                </div>
                <input
                  id="password"
                  value={password}
                    onChange={(e) =>
                    setPassword(e.target.value)
                    }
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className={inputClassName}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-gradient-to-r from-[#6D28D9] via-[#9333EA] to-[#F472B6] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(124,58,237,0.35)] transition duration-300 hover:scale-[1.01] hover:shadow-[0_18px_40px_rgba(124,58,237,0.45)] focus:outline-none focus:ring-4 focus:ring-[#C084FC]/35 active:scale-[0.98]"
              >
                Login
              </button>
            </form>

            <div className="relative mt-6 overflow-hidden rounded-2xl border border-white/45 bg-white/25 px-4 py-3 text-center text-xs leading-5 text-[#4C1D95]/75 backdrop-blur-md">
              Privacy-first styling means your wardrobe data stays at the center,
              not your personal photos.
            </div>

            <p className="mt-6 text-center text-sm text-[#4C1D95]/80">
              New to AuraFit AI?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="font-semibold text-[#7C3AED] transition hover:text-[#5B21B6]"
              >
                Sign Up
              </button>
            </p>
          </section>
        </main>
      </div>
    </>
  );
}

export default Login;
