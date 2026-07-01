import { useState } from "react";
import { useNavigate } from "react-router-dom";

const bodyTypeOptions = [
  "Petite",
  "Lean",
  "Athletic",
  "Curvy",
  "Plus Size",
  "Tall",
];

const styleOptions = [
  "Minimal",
  "Streetwear",
  "Luxury",
  "Casual Chic",
  "Athleisure",
  "Vintage",
  "Smart Formal",
  "Soft Girl",
];

const baseInputClassName =
  "w-full rounded-2xl border border-white/50 bg-white/45 px-4 py-3.5 text-sm font-medium text-[#4C1D95] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] outline-none backdrop-blur-md transition duration-300 placeholder:text-[#7C3AED]/60 focus:border-[#C084FC] focus:bg-white/60 focus:ring-4 focus:ring-[#C084FC]/25";

function ProfileSetup({ onBackToLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    height: "",
    weight: "",
    bodyType: "Athletic",
    location: "",
  });
  const [selectedStyles, setSelectedStyles] = useState([
    "Luxury",
    "Casual Chic",
  ]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const toggleStyle = (style) => {
    setSelectedStyles((current) =>
      current.includes(style)
        ? current.filter((item) => item !== style)
        : [...current, style]
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/dashboard");
  };

  return (
    <section className="auth-panel relative">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#6D28D9] sm:text-xs">
            Onboarding Progress
          </p>
          <h1 className="splash-title mt-3 bg-gradient-to-r from-[#2E1065] via-[#6D28D9] to-[#F472B6] bg-clip-text text-[2rem] font-bold leading-tight tracking-[-0.04em] text-transparent sm:text-[2.6rem]">
            Complete Your Style Profile
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#4C1D95]/85 sm:text-base">
            These details help AuraFit AI prepare future outfit
            recommendations without needing personal photos.
          </p>
        </div>

        <button
          type="button"
          onClick={onBackToLogin ?? (() => navigate(-1))}
          className="hidden rounded-full border border-white/50 bg-white/35 px-4 py-2 text-xs font-semibold text-[#6D28D9] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-md transition hover:bg-white/55 sm:block"
        >
          Back to Login
        </button>
      </div>

      <div className="mb-8 rounded-[1.5rem] border border-white/45 bg-white/30 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-md">
        <div className="flex items-center justify-between text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#6D28D9]/80">
          <span>Step 2 of 2</span>
          <span>Profile Setup</span>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/45">
          <div className="h-full w-[88%] rounded-full bg-gradient-to-r from-[#C084FC] via-[#F472B6] to-[#FBBF94] shadow-[0_0_20px_rgba(244,114,182,0.35)]" />
        </div>
        <div className="mt-4 grid gap-3 text-xs text-[#4C1D95]/80 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/50 bg-white/40 px-3 py-3">
            Account basics
            <div className="mt-1 font-semibold text-[#6D28D9]">Complete</div>
          </div>
          <div className="rounded-2xl border border-[#C084FC]/50 bg-white/45 px-3 py-3">
            Fit profile
            <div className="mt-1 font-semibold text-[#6D28D9]">In progress</div>
          </div>
          <div className="rounded-2xl border border-white/50 bg-white/30 px-3 py-3">
            Recommendations
            <div className="mt-1 font-semibold text-[#6D28D9]/70">Coming next</div>
          </div>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label
              htmlFor="profile-full-name"
              className="mb-2 block text-sm font-semibold text-[#4C1D95]"
            >
              Full Name
            </label>
            <input
              id="profile-full-name"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={baseInputClassName}
              required
            />
          </div>

          <div>
            <label
              htmlFor="profile-height"
              className="mb-2 block text-sm font-semibold text-[#4C1D95]"
            >
              Height
            </label>
            <input
              id="profile-height"
              name="height"
              type="text"
              value={formData.height}
              onChange={handleChange}
              placeholder="e.g. 5'8 or 173 cm"
              className={baseInputClassName}
              required
            />
          </div>

          <div>
            <label
              htmlFor="profile-weight"
              className="mb-2 block text-sm font-semibold text-[#4C1D95]"
            >
              Weight
            </label>
            <input
              id="profile-weight"
              name="weight"
              type="text"
              value={formData.weight}
              onChange={handleChange}
              placeholder="e.g. 68 kg"
              className={baseInputClassName}
              required
            />
          </div>

          <div>
            <label
              htmlFor="profile-body-type"
              className="mb-2 block text-sm font-semibold text-[#4C1D95]"
            >
              Body Type
            </label>
            <select
              id="profile-body-type"
              name="bodyType"
              value={formData.bodyType}
              onChange={handleChange}
              className={`${baseInputClassName} appearance-none`}
            >
              {bodyTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="profile-location"
              className="mb-2 block text-sm font-semibold text-[#4C1D95]"
            >
              Location
            </label>
            <input
              id="profile-location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              placeholder="City, Country"
              className={baseInputClassName}
              required
            />
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <label className="block text-sm font-semibold text-[#4C1D95]">
              Style Preferences
            </label>
            <span className="text-xs font-medium text-[#6D28D9]/75">
              Select multiple
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            {styleOptions.map((style) => {
              const isSelected = selectedStyles.includes(style);

              return (
                <button
                  key={style}
                  type="button"
                  onClick={() => toggleStyle(style)}
                  className={`rounded-full px-4 py-2.5 text-sm font-semibold transition duration-300 ${
                    isSelected
                      ? "border border-[#C084FC]/60 bg-gradient-to-r from-[#6D28D9] via-[#9333EA] to-[#F472B6] text-white shadow-[0_10px_24px_rgba(124,58,237,0.28)]"
                      : "border border-white/55 bg-white/40 text-[#6D28D9] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-md hover:bg-white/55"
                  }`}
                >
                  {style}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-white/45 bg-white/28 p-4 text-sm leading-relaxed text-[#4C1D95]/80 backdrop-blur-md">
          AuraFit will use this profile to personalize silhouettes, occasion
          matching, and future weather-aware outfit suggestions.
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onBackToLogin ?? (() => navigate(-1))}
            className="rounded-full border border-white/50 bg-white/35 px-5 py-3 text-sm font-semibold text-[#6D28D9] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-md transition hover:bg-white/55 sm:hidden"
          >
            Back to Login
          </button>

          <button
            type="submit"
            className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-[#6D28D9] via-[#9333EA] to-[#F472B6] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(124,58,237,0.35)] transition duration-300 hover:scale-[1.01] hover:shadow-[0_18px_40px_rgba(124,58,237,0.45)] focus:outline-none focus:ring-4 focus:ring-[#F9A8D4]/35 active:scale-[0.98] sm:w-auto"
          >
            <span className="relative z-10">Continue</span>
            <span
              aria-hidden="true"
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-500 group-hover:translate-x-full"
            />
          </button>
        </div>
      </form>
    </section>
  );
}

export default ProfileSetup;
