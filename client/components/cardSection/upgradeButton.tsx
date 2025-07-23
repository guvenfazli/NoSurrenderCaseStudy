import energy from "../../assets/energyPng.png"
import Image from "next/image"
export default function UpgradeButton() {
  return (
    <button
      className="w-1/2 text-[9px] font-semibold bg-activeNav text-navButtonColor rounded-full h-[15px] cursor-pointer flex items-center justify-center gap-1"
      style={{
        boxShadow: `inset 3px 3px 5px rgba(248, 248, 248, 0.7), inset 0 -1px 3px rgba(93, 83, 107, 0.7)`
      }}
    >
      <Image
        src={energy}
        alt="icon"
        className="w-3 h-3"
      />
      <span className="font-semibold text-[#EE39A8]">-1</span> Geliştir
    </button>
  )
}