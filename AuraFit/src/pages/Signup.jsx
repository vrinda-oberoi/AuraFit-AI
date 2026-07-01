import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assests/logo.png";

const sparkles = [
  { top: "12%", left: "18%", delay: "0s", size: "4px" },
  { top: "20%", left: "78%", delay: "1.3s", size: "3px" },
  { top: "40%", left: "92%", delay: "2.5s", size: "4px" },
  { top: "62%", left: "10%", delay: "0.9s", size: "3px" },
  { top: "76%", left: "82%", delay: "3.2s", size: "5px" },
  { top: "86%", left: "28%", delay: "1.9s", size: "3px" },
];

const motes = [
  { top: "26%", left: "30%", delay: "0s" },
  { top: "36%", left: "68%", delay: "1.4s" },
  { top: "52%", left: "16%", delay: "2.6s" },
  { top: "64%", left: "74%", delay: "0.8s" },
  { top: "30%", left: "84%", delay: "1.9s" },
  { top: "72%", left: "48%", delay: "3s" },
];

const inputClassName =
  "w-full rounded-2xl border border-white/50 bg-white/45 px-4 py-3.5 text-sm font-medium text-[#4C1D95] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] outline-none backdrop-blur-md transition duration-300 placeholder:text-[#7C3AED]/60 focus:border-[#F472B6] focus:bg-white/60 focus:ring-4 focus:ring-[#F9A8D4]/25";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/signup", {
        name,
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      alert("Account created successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes signupGlow {
          0%, 100% { transform: scale(1) translateY(0); opacity: 0.68; }
          50% { transform: scale(1.09) translateY(-12px); opacity: 1; }
        }
        @keyframes signupDrift {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(-16px, -18px, 0); }
        }
        @keyframes signupTwinkle {
          0%, 100% { opacity: 0.18; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        @keyframes signupParticle {
          0% { opacity: 0; transform: translateY(0) scale(0.45); }
          30% { opacity: 0.9; }
          100% { opacity: 0; transform: translateY(-48px) scale(1.08); }
        }
        @keyframes signupCardGlow {
          0%, 100% { opacity: 0.48; transform: scale(1); }
          50% { opacity: 0.72; transform: scale(1.015); }
        }
        @keyframes signupReflect {
          0% { transform: translateX(-135%) skewX(-16deg); opacity: 0; }
          42% { opacity: 0.55; }
          100% { transform: translateX(235%) skewX(-16deg); opacity: 0; }
        }
        @keyframes signupLogoFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes signupShimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .signup-title {
          background-size: 200% auto;
          animation: signupShimmer 5s ease infinite;
        }
      `}</style>

      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#FF8AB2] via-[#E9A8FF] via-45% to-[#A855F7] px-4 py-10 sm:px-6 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-90"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,230,238,0.24) 0%, rgba(251,191,146,0.2) 22%, rgba(192,132,252,0.28) 48%, rgba(244,114,182,0.3) 78%, rgba(255,255,255,0.12) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 16% 24%, rgba(255,255,255,0.18), transparent 28%), radial-gradient(circle at 84% 22%, rgba(255,214,165,0.28), transparent 22%), radial-gradient(circle at 56% 82%, rgba(244,114,182,0.24), transparent 28%)",
          }}
        />

        <div
          aria-hidden="true"
          className="absolute -left-16 top-0 h-72 w-72 rounded-full bg-[#F9A8D4]/60 blur-[120px]"
          style={{ animation: "signupGlow 10s ease-in-out infinite" }}
        />
        <div
          aria-hidden="true"
          className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[#FBBF94]/50 blur-[130px]"
          style={{ animation: "signupGlow 12s ease-in-out infinite 1s" }}
        />
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-[30%] h-80 w-80 -translate-x-1/2 rounded-full bg-[#DDD6FE]/40 blur-[120px]"
          style={{ animation: "signupDrift 11s ease-in-out infinite" }}
        />

        {sparkles.map((sparkle, index) => (
          <div
            key={index}
            aria-hidden="true"
            className="absolute rounded-full bg-white shadow-[0_0_10px_2px_rgba(255,255,255,0.8)]"
            style={{
              top: sparkle.top,
              left: sparkle.left,
              width: sparkle.size,
              height: sparkle.size,
              animation: `signupTwinkle 4s ease-in-out infinite ${sparkle.delay}`,
            }}
          />
        ))}

        {motes.map((mote, index) => (
          <div
            key={index}
            aria-hidden="true"
            className="absolute h-1.5 w-1.5 rounded-full bg-white/90"
            style={{
              top: mote.top,
              left: mote.left,
              boxShadow: "0 0 10px rgba(255,255,255,0.75)",
              animation: `signupParticle 5.3s ease-in-out infinite ${mote.delay}`,
            }}
          />
        ))}

        <main className="relative z-10 w-full max-w-lg">
          <div
            aria-hidden="true"
            className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-[#F9A8D4]/40 via-[#C084FC]/30 to-[#FBBF94]/35 blur-2xl"
            style={{ animation: "signupCardGlow 4.5s ease-in-out infinite" }}
          />

          <section className="relative overflow-hidden rounded-[2rem] border border-white/55 bg-white/38 p-6 shadow-[0_12px_48px_rgba(91,33,182,0.18),inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-3xl sm:p-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]"
            >
              <div
                className="absolute -inset-y-4 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent"
                style={{ animation: "signupReflect 8s ease-in-out infinite 1.25s" }}
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
                  style={{ animation: "signupLogoFloat 4s ease-in-out infinite" }}
                />
              </div>

              <p className="mt-6 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-[#6D28D9]">
                Create Your Aura
              </p>
              <h1 className="signup-title mt-3 bg-gradient-to-r from-[#2E1065] via-[#7C3AED] to-[#F472B6] bg-clip-text text-4xl font-bold tracking-[-0.04em] text-transparent sm:text-[2.6rem]">
                Join AuraFit AI
              </h1>
              <p className="mt-3 text-sm leading-6 text-[#4C1D95]/80 sm:text-[0.95rem]">
                Build your privacy-first fashion profile and unlock premium AI
                outfit recommendations.
              </p>
            </div>

            <form className="relative mt-8 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-[#4C1D95]"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClassName}
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-[#4C1D95]"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClassName}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-[#4C1D95]"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClassName}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-semibold text-[#4C1D95]"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={inputClassName}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-gradient-to-r from-[#6D28D9] via-[#9333EA] to-[#F472B6] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(124,58,237,0.35)] transition duration-300 hover:scale-[1.01] hover:shadow-[0_18px_40px_rgba(124,58,237,0.45)] focus:outline-none focus:ring-4 focus:ring-[#F9A8D4]/35 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <div className="relative mt-6 overflow-hidden rounded-2xl border border-white/45 bg-white/25 px-4 py-3 text-center text-xs leading-5 text-[#4C1D95]/75 backdrop-blur-md">
              No personal photos required. AuraFit AI is designed to style with
              body data, wardrobe pieces, and your fashion preference.
            </div>

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
        </main>
      </div>
    </>
  );
}

export default Signup;
