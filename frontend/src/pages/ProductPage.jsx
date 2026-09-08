import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DeviceFrame from '../components/DeviceFrame.jsx';
import EMIPlanCard from '../components/EMIPlanCard.jsx';
import { API_BASE, resolveImage } from '../api.js';

const inr = (n) => `₹${n.toLocaleString('en-IN')}`;

function DetailHeader({ title }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-3 px-4 py-4 bg-hero-gradient text-white">
      <button
        onClick={() => navigate(-1)}
        aria-label="Go back"
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-lg"
      >
        ‹
      </button>
      <h1 className="text-[15px] font-semibold tracking-tight truncate">{title}</h1>
    </div>
  );
}

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState('loading');
  const [variantId, setVariantId] = useState(null);
  const [planId, setPlanId] = useState(null);
  const [confirmed, setConfirmed] = useState(null);

  useEffect(() => {
    setStatus('loading');
    fetch(`${API_BASE}/api/products/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('not found');
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        const def = data.variants.find((v) => v.isDefault) || data.variants[0];
        setVariantId(def.id);
        setPlanId(def.emiPlans[0]?.id ?? null);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, [slug]);

  if (status === 'loading') {
    return (
      <DeviceFrame>
        <DetailHeader title="Product" />
        <div className="p-4 space-y-3">
          <div className="h-56 rounded-2xl bg-gray-100 animate-pulse" />
          <div className="h-4 w-1/2 rounded bg-gray-100 animate-pulse" />
          <div className="h-24 rounded-2xl bg-gray-100 animate-pulse" />
        </div>
      </DeviceFrame>
    );
  }

  if (status === 'error' || !product) {
    return (
      <DeviceFrame>
        <DetailHeader title="Product" />
        <p className="p-4 text-[13px] text-red-500">Product not found.</p>
      </DeviceFrame>
    );
  }

  const variant = product.variants.find((v) => v.id === variantId) || product.variants[0];
  const plan = variant.emiPlans.find((p) => p.id === planId) || variant.emiPlans[0];

  const handleVariantChange = (v) => {
    setVariantId(v.id);
    setPlanId(v.emiPlans[0]?.id ?? null);
    setConfirmed(null);
  };

  return (
    <DeviceFrame>
      <DetailHeader title={product.name} />
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-5 pb-8">
          <div className="rounded-2xl bg-[#F2F0F8] p-6 flex items-center justify-center">
            <img src={resolveImage(variant.imageUrl)} alt={variant.label} className="w-40 h-40 object-cover rounded-xl" />
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-wide text-brand font-semibold">{product.brand}</p>
            <h2 className="text-[18px] font-bold text-ink leading-snug">{product.name}</h2>
            <p className="text-[13px] text-gray-500">
              {variant.storage}{variant.color ? ` · ${variant.color}` : ''}
            </p>

            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-[20px] font-extrabold text-ink">{inr(variant.price)}</span>
              {variant.mrp > variant.price && (
                <span className="text-[13px] text-gray-400 line-through">{inr(variant.mrp)}</span>
              )}
            </div>
          </div>

          {product.variants.length > 1 && (
            <div>
              <p className="text-[12px] font-semibold text-gray-600 mb-2">Choose variant</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => handleVariantChange(v)}
                    className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors ${
                      v.id === variant.id
                        ? 'bg-brand text-white border-brand'
                        : 'bg-white text-gray-600 border-black/10 hover:border-brand/40'
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-[13px] font-semibold text-ink mb-2">EMI plans backed by mutual funds</p>
            <div className="space-y-2">
              {variant.emiPlans.map((p) => (
                <EMIPlanCard
                  key={p.id}
                  plan={p}
                  selected={p.id === plan.id}
                  onSelect={() => {
                    setPlanId(p.id);
                    setConfirmed(null);
                  }}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => setConfirmed(plan)}
            className="w-full py-3 rounded-xl bg-brand text-white text-[14px] font-semibold hover:bg-brand-dark transition-colors"
          >
            Proceed with {inr(plan.monthlyAmount)}/mo plan
          </button>

          {confirmed && (
            <div className="rounded-xl bg-cashback/10 border border-cashback/30 p-3 text-[12px] text-cashback font-medium">
              Selected: {inr(confirmed.monthlyAmount)} x {confirmed.tenureMonths} months
              {confirmed.interestRate === 0 ? ' (0% interest)' : ` (${confirmed.interestRate}% interest)`}.
              This is a demo - no real transaction has been made.
            </div>
          )}
        </div>
      </div>
    </DeviceFrame>
  );
}
