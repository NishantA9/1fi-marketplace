const items = [
  { key: 'home', label: 'Home', icon: '🏠' },
  { key: 'shop', label: 'Shop', icon: '🛍️' },
  { key: 'emi', label: 'EMI Dues', icon: '🧾' },
  { key: 'limit', label: 'Limit', icon: '📈' },
  { key: 'profile', label: 'Profile', icon: '👤' },
];

export default function BottomNav({ active = 'shop' }) {
  return (
    <nav className="flex items-stretch border-t border-black/5 bg-white px-1 pt-2 pb-3">
      {items.map((item) => (
        <div key={item.key} className="flex-1 flex flex-col items-center gap-0.5">
          <span className={`text-lg ${item.key === active ? 'grayscale-0' : 'grayscale opacity-60'}`}>
            {item.icon}
          </span>
          <span className={`text-[10px] font-medium ${item.key === active ? 'text-brand' : 'text-gray-400'}`}>
            {item.label}
          </span>
          {item.key === active && <span className="w-4 h-0.5 rounded-full bg-brand mt-0.5" />}
        </div>
      ))}
    </nav>
  );
}
