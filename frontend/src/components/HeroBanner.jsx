export default function HeroBanner() {
  return (
    <div className="relative bg-hero-gradient px-4 pt-5 pb-8 overflow-hidden">
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[11px] font-medium">
        <span className="text-yellow-300">✦</span> NO-COST EMIs
      </span>

      <h1 className="text-white text-[26px] font-bold leading-tight mt-3 max-w-[75%]">
        Shop today,<br />
        <span className="italic font-semibold">Pay later using</span><br />
        Mutual funds.
      </h1>

      <p className="text-white/70 text-[12px] mt-2 max-w-[70%]">
        No credit score required. No interest.
        <br />
        Backed by your investments.
      </p>

      {/* Decorative floating items, in lieu of the app's illustration asset */}
      <div className="absolute right-3 top-6 text-4xl select-none" aria-hidden="true">🎁</div>
      <div className="absolute right-8 top-2 text-2xl select-none" aria-hidden="true">📱</div>
      <div className="absolute right-1 top-16 text-2xl select-none" aria-hidden="true">💻</div>
    </div>
  );
}
