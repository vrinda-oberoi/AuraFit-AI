import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackToDashboardButton from "../components/BackToDashboardButton";
import ToggleSwitch from "../components/ToggleSwitch";

const sectionClassName =
  "rounded-[2rem] border border-white/60 bg-white/30 p-6 shadow-[0_16px_48px_rgba(91,33,182,0.16),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-3xl sm:p-7";

const rowClassName =
  "flex items-center justify-between gap-4 rounded-2xl border border-white/45 bg-white/25 px-4 py-4 backdrop-blur-md";

const selectClassName =
  "rounded-full border border-white/50 bg-white/45 px-4 py-2 text-xs font-semibold text-[#4C1D95] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] outline-none backdrop-blur-md transition focus:border-[#C084FC] focus:ring-4 focus:ring-[#C084FC]/25";

function Settings() {
  const navigate = useNavigate();

  // Placeholder state for now — no backend / localStorage wiring yet.
  const [appearance, setAppearance] = useState("light");
  const [notifications, setNotifications] = useState({
    outfitReminders: true,
    plannerNotifications: true,
  });
  const [privacy, setPrivacy] = useState({
    dataStorage: "On Device",
    accountPrivacy: "Private",
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const updateNotification = (key, value) => {
    setNotifications((current) => ({ ...current, [key]: value }));
  };

  const handleLogout = () => {
    navigate("/login");
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
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[#6D28D9]">
              AuraFit AI
            </p>
            <h1 className="mt-2 bg-gradient-to-r from-[#2E1065] via-[#6D28D9] to-[#F472B6] bg-clip-text text-3xl font-bold tracking-[-0.04em] text-transparent sm:text-4xl">
              Settings
            </h1>
          </div>
          <BackToDashboardButton />
        </div>

        <div className="space-y-6">
          {/* Appearance */}
          <section className={sectionClassName}>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[#6D28D9]">
              Appearance
            </p>
            <h2 className="mt-2 text-xl font-bold text-[#2E1065]">Theme</h2>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                { key: "light", label: "Light Mode" },
                { key: "dark", label: "Dark Mode" },
              ].map((option) => (
                <button
                  key={option.key}
                  type="button"
                  disabled
                  onClick={() => setAppearance(option.key)}
                  title="Coming soon"
                  className={`flex items-center justify-between rounded-2xl border px-4 py-4 text-sm font-semibold transition ${
                    appearance === option.key
                      ? "border-[#C084FC]/60 bg-white/45 text-[#6D28D9]"
                      : "border-white/45 bg-white/22 text-[#6D28D9]/70"
                  } cursor-not-allowed opacity-70`}
                >
                  {option.label}
                  <span className="rounded-full bg-white/50 px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[#7C3AED]/80">
                    Soon
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Notifications */}
          <section className={sectionClassName}>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[#6D28D9]">
              Notifications
            </p>
            <h2 className="mt-2 text-xl font-bold text-[#2E1065]">
              Stay In The Loop
            </h2>

            <div className="mt-4 space-y-3">
              <div className={rowClassName}>
                <div>
                  <p className="text-sm font-semibold text-[#2E1065]">
                    Outfit Reminders
                  </p>
                  <p className="mt-1 text-xs text-[#4C1D95]/75">
                    Get nudged to generate a look before your day starts.
                  </p>
                </div>
                <ToggleSwitch
                  label="Outfit Reminders"
                  checked={notifications.outfitReminders}
                  onChange={(value) => updateNotification("outfitReminders", value)}
                />
              </div>

              <div className={rowClassName}>
                <div>
                  <p className="text-sm font-semibold text-[#2E1065]">
                    Weekly Planner Notifications
                  </p>
                  <p className="mt-1 text-xs text-[#4C1D95]/75">
                    Reminders to fill in or review your weekly outfit plan.
                  </p>
                </div>
                <ToggleSwitch
                  label="Weekly Planner Notifications"
                  checked={notifications.plannerNotifications}
                  onChange={(value) =>
                    updateNotification("plannerNotifications", value)
                  }
                />
              </div>
            </div>
          </section>

          {/* Privacy */}
          <section className={sectionClassName}>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[#6D28D9]">
              Privacy
            </p>
            <h2 className="mt-2 text-xl font-bold text-[#2E1065]">
              Your Data, Your Rules
            </h2>

            <div className="mt-4 space-y-3">
              <div className={rowClassName}>
                <div>
                  <p className="text-sm font-semibold text-[#2E1065]">
                    Data Storage Preferences
                  </p>
                  <p className="mt-1 text-xs text-[#4C1D95]/75">
                    Choose where your wardrobe data lives.
                  </p>
                </div>
                <select
                  value={privacy.dataStorage}
                  onChange={(event) =>
                    setPrivacy((current) => ({
                      ...current,
                      dataStorage: event.target.value,
                    }))
                  }
                  className={selectClassName}
                >
                  <option>On Device</option>
                  <option>Cloud Sync</option>
                </select>
              </div>

              <div className={rowClassName}>
                <div>
                  <p className="text-sm font-semibold text-[#2E1065]">
                    Account Privacy
                  </p>
                  <p className="mt-1 text-xs text-[#4C1D95]/75">
                    Control who can see your profile and saved outfits.
                  </p>
                </div>
                <select
                  value={privacy.accountPrivacy}
                  onChange={(event) =>
                    setPrivacy((current) => ({
                      ...current,
                      accountPrivacy: event.target.value,
                    }))
                  }
                  className={selectClassName}
                >
                  <option>Private</option>
                  <option>Public</option>
                </select>
              </div>
            </div>
          </section>

          {/* Account */}
          <section className={sectionClassName}>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[#6D28D9]">
              Account
            </p>
            <h2 className="mt-2 text-xl font-bold text-[#2E1065]">
              Manage Your Account
            </h2>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className="flex-1 rounded-full border border-white/55 bg-white/38 px-5 py-3 text-sm font-semibold text-[#6D28D9] shadow-[inset_0_1px_0_rgba(255,255,255,0.62)] backdrop-blur-md transition hover:bg-white/48"
              >
                Change Password
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 rounded-full bg-gradient-to-r from-[#6D28D9] via-[#9333EA] to-[#F472B6] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(124,58,237,0.34)] transition duration-300 hover:scale-[1.01]"
              >
                Logout
              </button>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="rounded-[2rem] border border-[#FB7185]/45 bg-[#FB7185]/10 p-6 shadow-[0_16px_48px_rgba(190,18,60,0.1),inset_0_1px_0_rgba(255,255,255,0.4)] backdrop-blur-3xl sm:p-7">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[#BE123C]">
              Danger Zone
            </p>
            <h2 className="mt-2 text-xl font-bold text-[#881337]">
              Delete Account
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#9D174D]/85">
              This permanently removes your profile, wardrobe, and saved
              outfits. This action cannot be undone.
            </p>

            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="mt-4 rounded-full border border-[#FB7185]/60 bg-white/40 px-5 py-3 text-sm font-semibold text-[#BE123C] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] backdrop-blur-md transition hover:bg-white/55"
              >
                Delete Account
              </button>
            ) : (
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="rounded-full border border-white/55 bg-white/40 px-5 py-3 text-sm font-semibold text-[#6D28D9] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-md transition hover:bg-white/55"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="rounded-full bg-gradient-to-r from-[#BE123C] to-[#FB7185] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(190,18,60,0.32)] transition duration-300 hover:scale-[1.01]"
                >
                  Confirm Delete (UI Only)
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default Settings;