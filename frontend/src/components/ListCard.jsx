import { Link } from 'react-router-dom';

// Mirrors the real app's brand/store row: rounded logo tile, bold title, gray subtitle.
export default function ListCard({ to, imageUrl, title, subtitle, badge }) {
  const Wrapper = to ? Link : 'div';
  const wrapperProps = to ? { to } : {};

  return (
    <Wrapper
      {...wrapperProps}
      className="flex items-center gap-3 bg-white rounded-2xl p-3 border border-black/5 hover:shadow-sm transition-shadow"
    >
      <img
        src={imageUrl}
        alt={title}
        className="w-12 h-12 rounded-xl object-cover bg-[#F2F0F8] shrink-0"
      />
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-semibold text-ink truncate">{title}</p>
        <p className="text-[12px] text-gray-500 truncate">{subtitle}</p>
      </div>
      {badge && (
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium shrink-0">
          {badge}
        </span>
      )}
    </Wrapper>
  );
}
