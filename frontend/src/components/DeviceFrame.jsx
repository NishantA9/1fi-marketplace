export default function DeviceFrame({ children }) {
  return (
    <div className="min-h-screen bg-[#E9E6F2] flex justify-center py-6 px-3">
      <div className="w-full max-w-[420px] bg-white rounded-[28px] shadow-xl overflow-hidden border border-black/5 flex flex-col">
        {/* status bar */}
        <div className="h-6 bg-hero-gradient" />
        {children}
      </div>
    </div>
  );
}
