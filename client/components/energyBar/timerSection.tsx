import Image from "next/image"
import energyIcon from "../../assets/energyPng.png"

export default function TimerSection() {
  return (
    <div className="flex items-center gap-2 mb-2 relative">
      <Image src={energyIcon} alt="Energy Icon" className="w-15 h-15 -bottom-10 -left-5 z-10 absolute" />
      <p className="text-[#F4BC79] font-bold text-sm ml-12">Enerji</p>
      <p className="text-[#5B5B60] text-xs ml-auto">%1 yenilenmesine kalan 1:59</p>
    </div>
  )
}