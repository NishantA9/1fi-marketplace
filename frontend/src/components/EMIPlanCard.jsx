const inr = (n) => `₹${n.toLocaleString('en-IN')}`;

export default function EMIPlanCard({ plan, selected, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left px-4 py-3 rounded-xl border transition-colors ${
        selected ? 'border-brand bg-brand-light' : 'border-black/10 bg-white hover:border-brand/40'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
              selected ? 'border-brand' : 'border-gray-300'
            }`}
          >
            {selected && <span className="w-2 h-2 rounded-full bg-brand" />}
          </span>
          <span className="text-[14px] font-semibold text-ink">
            {inr(plan.monthlyAmount)} <span className="font-normal text-gray-500">x {plan.tenureMonths} months</span>
          </span>
        </div>
        <span className="text-[12px] font-medium text-gray-600">
          {plan.interestRate === 0 ? '0% interest' : `${plan.interestRate}% interest`}
        </span>
      </div>
      {plan.cashback > 0 && (
        <p className="text-[11px] text-cashback font-medium mt-1 ml-6">
          Additional cashback of {inr(plan.cashback)}
        </p>
      )}
    </button>
  );
}
