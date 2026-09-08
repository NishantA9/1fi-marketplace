import { useEffect, useState } from 'react';
import DeviceFrame from '../components/DeviceFrame.jsx';
import HeroBanner from '../components/HeroBanner.jsx';
import PillTabs from '../components/PillTabs.jsx';
import BottomNav from '../components/BottomNav.jsx';
import ListCard from '../components/ListCard.jsx';
import { API_BASE, resolveImage } from '../api.js';

const TABS = [
  { key: 'top-brands', label: 'Top Brands' },
  { key: 'nearby-stores', label: 'Nearby Stores' },
  { key: 'marketplace', label: '1Fi Marketplace' },
];

const SEARCH_PLACEHOLDER = {
  'top-brands': 'Search online stores...',
  'nearby-stores': 'Search stores...',
  marketplace: 'Search products...',
};

const inr = (n) => `₹${n.toLocaleString('en-IN')}`;

function EmptyTab({ label }) {
  return (
    <div className="py-16 text-center">
      <div className="text-3xl mb-2">🛠️</div>
      <p className="text-[13px] font-medium text-gray-500">{label} is coming soon</p>
    </div>
  );
}

function MarketplaceList() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    fetch(`${API_BASE}/api/products`)
      .then((res) => {
        if (!res.ok) throw new Error('failed');
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  if (status === 'loading') {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 rounded-2xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (status === 'error') {
    return (
      <p className="text-[13px] text-red-500 py-6 text-center">
        Couldn't load products. Check that the backend API is running.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {products.map((product) => {
        const variant = product.variants.find((v) => v.isDefault) || product.variants[0];
        return (
          <ListCard
            key={product.id}
            to={`/products/${product.slug}`}
            imageUrl={resolveImage(variant.imageUrl)}
            title={product.name}
            subtitle={`No-cost EMIs upto 24 months · from ${inr(Math.round(variant.price / 24))}/mo`}
          />
        );
      })}
    </div>
  );
}

export default function ShopPage() {
  const [activeTab, setActiveTab] = useState('marketplace');
  const activeLabel = TABS.find((t) => t.key === activeTab)?.label ?? '';

  return (
    <DeviceFrame>
      <div className="flex-1 overflow-y-auto">
        <HeroBanner />
        <PillTabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

        <div className="px-4 pt-4">
          <div className="flex items-center gap-2 bg-white border border-black/10 rounded-full px-4 py-2.5 mb-4">
            <span className="text-gray-400">🔍</span>
            <input
              disabled
              placeholder={SEARCH_PLACEHOLDER[activeTab]}
              className="bg-transparent outline-none text-[13px] text-gray-400 placeholder:text-gray-400 w-full"
            />
          </div>

          <h2 className="text-[16px] font-bold text-ink mb-3">{activeLabel}</h2>

          {activeTab === 'top-brands' && <EmptyTab label="Top Brands" />}
          {activeTab === 'nearby-stores' && <EmptyTab label="Nearby Stores" />}
          {activeTab === 'marketplace' && <MarketplaceList />}
        </div>
      </div>

      <BottomNav active="shop" />
    </DeviceFrame>
  );
}
