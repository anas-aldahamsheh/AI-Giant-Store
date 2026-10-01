export function LanguageSwitcher() {
  return (
    <button
      type="button"
      className="inline-flex h-10 items-center gap-2 rounded-full border border-white/60 bg-white/70 px-3 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
      aria-label="Switch language"
    >
      <span aria-hidden="true">EN</span>
      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
    </button>
  );
}
