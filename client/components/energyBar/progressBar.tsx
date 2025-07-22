export default function ProgressBar() {
  return (
    <div className="relative w-full">
      <div className="flex relative bg-[#1a1a1a] w-full h-[26px] shadow-[0_0_6px_2px_#F8B0DC] rounded-full">
        <div className="absolute top-1 h-[17px] rounded-full" style={{ width: `${87}%` }}>
          <span className={`absolute h-[17px] rounded-full`} style={{ width: `${100}%`, background: `#EE39A8`, boxShadow: `inset 0 0 4px #FFFFFF` }} />
        </div>
      </div>
      <p className="absolute right-2 top-1/2 -translate-y-1/2 text-[#EE39A8] font-semibold text-sm pointer-events-none">
        %100
      </p>
    </div>
  )
}