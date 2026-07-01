import { useNavigate } from "react-router-dom";

function BackToDashboardButton({ className = "" }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate("/dashboard")}
      className={`inline-flex items-center gap-2 rounded-full border border-white/55 bg-white/35 px-4 py-2 text-xs font-semibold text-[#6D28D9] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-md transition hover:bg-white/55 ${className}`}
    >
      <span aria-hidden="true">←</span>
      Back to Dashboard
    </button>
  );
}

export default BackToDashboardButton;