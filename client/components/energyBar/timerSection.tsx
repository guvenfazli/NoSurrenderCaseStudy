import Image from "next/image"
import energyIcon from "../../assets/energyPng.png"
import { useEffect, useContext, useState } from "react"
import { EnergyContext } from "@/store/energyContext"
interface ComponentProps {
  energy: number
}

export default function TimerSection({ energy }: ComponentProps) {

  const { energy: contextEnergy, setEnergy } = useContext(EnergyContext)
  const [timer, setTimer] = useState(120)

  useEffect(() => {
    setEnergy(energy)

    const timer = setInterval(() => {
      setTimer(((prev) => {
        if(prev === 0){
          return 120
        } else {
          return prev -= 1
        }
      }))
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])



  return (
    <div className="flex items-center gap-2 mb-2 relative">
      <Image src={energyIcon} alt="Energy Icon" className="w-15 h-15 -bottom-10 -left-5 z-10 absolute" />
      <p className="text-[#F4BC79] font-bold text-sm ml-12">Enerji</p>
      <p className="text-[#5B5B60] text-xs ml-auto">%1 yenilenmesine kalan {timer}</p>
    </div>
  )
}