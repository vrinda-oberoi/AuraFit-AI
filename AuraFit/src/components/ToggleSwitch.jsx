function ToggleSwitch({ checked, onChange, disabled = false, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => !disabled && onChange?.(!checked)}
      className={`relative h-7 w-12 shrink-0 rounded-full border transition duration-300 ${
        disabled
          ? "cursor-not-allowed border-white/40 bg-white/25 opacity-60"
          : checked
          ? "border-transparent bg-gradient-to-r from-[#6D28D9] via-[#9333EA] to-[#F472B6] shadow-[0_6px_16px_rgba(124,58,237,0.35)]"
          : "border-white/55 bg-white/40"
      }`}
    >
      <span
        className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-[0_2px_6px_rgba(91,33,182,0.3)] transition duration-300 ${
          checked ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  );
}

export default ToggleSwitch;