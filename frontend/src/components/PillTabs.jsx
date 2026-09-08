export default function PillTabs({ tabs, active, onChange }) {
  return (
    <div className="mx-4 -mt-5 relative z-10 flex bg-brand-light/60 backdrop-blur rounded-full p-1 shadow-sm">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`flex-1 text-center text-[13px] font-semibold py-2 rounded-full transition-colors ${
            active === tab.key ? 'bg-white text-brand shadow-sm' : 'text-gray-600'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
