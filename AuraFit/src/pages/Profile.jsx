import { useState } from "react";
import BackToDashboardButton from "../components/BackToDashboardButton";

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

// Placeholder data for now — wire up to real profile state / backend later.
const initialProfile = {
  fullName: "Vrinda",
  email: "vrinda@aurafit.ai",
  height: "5'5\"",
  weight: "58 kg",
  bodyType: "Athletic",
  location: "Delhi, India",
  styles: ["Luxury", "Casual Chic"],
};

const stats = [
  { label: "Total Clothing Items", value: 24 },
  { label: "Saved Outfits", value: 9 },
  { label: "Planned Outfits", value: 5 },
];

const fieldInputClassName =
  "w-full rounded-2xl border border-white/50 bg-white/45 px-4 py-3 text-sm font-medium text-[#4C1D95] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] outline-none backdrop-blur-md transition duration-300 focus:border-[#C084FC] focus:bg-white/60 focus:ring-4 focus:ring-[#C084FC]/25";

function Profile() {
  const [profile, setProfile] = useState(initialProfile);
  const [draft, setDraft] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setDraft(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraft(profile);
    setIsEditing(false);
  };

  const handleSave = () => {
    setProfile(draft);
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const toggleStyle = (style) => {
    setDraft((current) => ({
      ...current,
      styles: current.styles.includes(style)
        ? current.styles.filter((item) => item !== style)
        : [...current.styles, style],
    }));
  };

  const displayed = isEditing ? draft : profile;

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

      <main className="relative z-10 mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[#6D28D9]">
              AuraFit AI
            </p>
            <h1 className="mt-2 bg-gradient-to-r from-[#2E1065] via-[#6D28D9] to-[#F472B6] bg-clip-text text-3xl font-bold tracking-[-0.04em] text-transparent sm:text-4xl">
              Your Profile
            </h1>
          </div>
          <BackToDashboardButton />
        </div>

        <section className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/30 p-6 shadow-[0_16px_48px_rgba(91,33,182,0.16),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-3xl sm:p-8">
          <div
            aria-hidden="true"
            className="absolute -right-10 -top-8 h-28 w-28 rounded-full bg-[#C084FC]/35 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-10 -left-8 h-24 w-24 rounded-full bg-[#F9A8D4]/30 blur-3xl"
          />

          <div className="relative flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.9),rgba(249,168,212,0.35),rgba(192,132,252,0.22),transparent_72%)] text-3xl font-bold text-[#6D28D9] shadow-[0_0_30px_rgba(192,132,252,0.3)]">
              {displayed.fullName.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-[#2E1065]">
                {displayed.fullName}
              </h2>
              <p className="mt-1 text-sm font-medium text-[#7C3AED]/80">
                {profile.email}
              </p>

              <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                {displayed.styles.map((style) => (
                  <span
                    key={style}
                    className="rounded-full border border-white/55 bg-white/40 px-3 py-1.5 text-xs font-semibold text-[#6D28D9] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-md"
                  >
                    {style}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex w-full justify-center gap-3 sm:w-auto sm:justify-end">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="rounded-full bg-gradient-to-r from-[#6D28D9] via-[#9333EA] to-[#F472B6] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(124,58,237,0.34)] transition duration-300 hover:scale-[1.01]"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="rounded-full border border-white/55 bg-white/38 px-5 py-3 text-sm font-semibold text-[#6D28D9] shadow-[inset_0_1px_0_rgba(255,255,255,0.62)] backdrop-blur-md transition hover:bg-white/48"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="rounded-full bg-gradient-to-r from-[#6D28D9] via-[#9333EA] to-[#F472B6] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(124,58,237,0.34)] transition duration-300 hover:scale-[1.01]"
                  >
                    Save Changes
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="relative mt-8 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#4C1D95]">
                Email
              </label>
              <div className="w-full rounded-2xl border border-white/40 bg-white/25 px-4 py-3 text-sm font-medium text-[#4C1D95]/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] backdrop-blur-md">
                {profile.email}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#4C1D95]">
                Location
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={draft.location}
                  onChange={(event) => handleChange("location", event.target.value)}
                  className={fieldInputClassName}
                />
              ) : (
                <div className="w-full rounded-2xl border border-white/50 bg-white/40 px-4 py-3 text-sm font-medium text-[#4C1D95]">
                  {profile.location}
                </div>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#4C1D95]">
                Height
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={draft.height}
                  onChange={(event) => handleChange("height", event.target.value)}
                  className={fieldInputClassName}
                />
              ) : (
                <div className="w-full rounded-2xl border border-white/50 bg-white/40 px-4 py-3 text-sm font-medium text-[#4C1D95]">
                  {profile.height}
                </div>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#4C1D95]">
                Weight
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={draft.weight}
                  onChange={(event) => handleChange("weight", event.target.value)}
                  className={fieldInputClassName}
                />
              ) : (
                <div className="w-full rounded-2xl border border-white/50 bg-white/40 px-4 py-3 text-sm font-medium text-[#4C1D95]">
                  {profile.weight}
                </div>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#4C1D95]">
                Body Type
              </label>
              {isEditing ? (
                <select
                  value={draft.bodyType}
                  onChange={(event) => handleChange("bodyType", event.target.value)}
                  className={`${fieldInputClassName} appearance-none`}
                >
                  {bodyTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="w-full rounded-2xl border border-white/50 bg-white/40 px-4 py-3 text-sm font-medium text-[#4C1D95]">
                  {profile.bodyType}
                </div>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="relative mt-6">
              <label className="mb-3 block text-sm font-semibold text-[#4C1D95]">
                Style Preferences
              </label>
              <div className="flex flex-wrap gap-3">
                {styleOptions.map((style) => {
                  const isSelected = draft.styles.includes(style);
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
          )}
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[1.7rem] border border-white/55 bg-white/30 p-5 text-center shadow-[0_12px_36px_rgba(91,33,182,0.14),inset_0_1px_0_rgba(255,255,255,0.78)] backdrop-blur-2xl"
            >
              <p className="text-3xl font-bold text-[#2E1065]">{stat.value}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#6D28D9]/80">
                {stat.label}
              </p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default Profile;