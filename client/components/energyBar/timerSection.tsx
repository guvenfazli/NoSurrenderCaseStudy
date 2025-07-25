import Image from "next/image"
import energyIcon from "../../assets/energyPng.png"
import { useEffect, useContext, useState } from "react"
import { EnergyContext } from "@/store/energyContext"


export default function TimerSection() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
  const { energy, setEnergy } = useContext(EnergyContext)
  const [activeTimer, setActiveTimer] = useState(120)

  function formatTime(seconds: number): string { // Converts the time into mm:ss
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    const paddedMinutes = String(minutes).padStart(2, "0");
    const paddedSeconds = String(secs).padStart(2, "0");

    return `${paddedMinutes}:${paddedSeconds}`;
  }

  async function updateEnergy() {
    const response = await fetch(`${BASE_URL}/energy/updateEnergy`, {
      credentials: "include",
      method: "PATCH"
    })

    const resData = await response.json()

    if (resData.energy >= 100) {
      return true
    } else {
      setEnergy(resData.energy)
      return false
    }
  }


  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTimer(((prev) => {
        if (prev < 1) {
          return 120
        } else {
          return prev -= 1
        }
      }))
    }, 1000)

    if (activeTimer === 0) {
      updateEnergy()
    }

    return () => {
      clearInterval(interval)
    }
  }, [activeTimer])



  return (
    <div className="flex items-center gap-2 mb-2 relative">
      <Image src={energyIcon} alt="Energy Icon" className="w-15 h-15 -bottom-10 -left-5 z-10 absolute" />
      <p className="text-[#F4BC79] font-bold text-sm ml-12">Enerji</p>
      <p className="text-[#5B5B60] text-xs ml-auto">%1 yenilenmesine kalan {formatTime(activeTimer)}</p>
    </div>
  )
}