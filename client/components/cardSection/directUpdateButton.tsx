import energyIcon from "../../assets/energyPng.png"
import Image from "next/image"
import { useContext, useState } from "react"
import { EnergyContext } from "@/store/energyContext"
import { toast } from "sonner"
interface ComponentProps {
  setProgress: React.Dispatch<React.SetStateAction<number>>
  setLevel: React.Dispatch<React.SetStateAction<number>>
  requiredEnergy: number
  id: string
}

export default function DirectUpdateButton({ setProgress, setLevel, id, requiredEnergy }: ComponentProps) {

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
  const { energy, setEnergy } = useContext(EnergyContext)
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  async function directUpdateItem() {
    if (energy < requiredEnergy) { // Client Check
      toast.error("Yeterli enerjin yok!", {
        className: "bg-red-700"
      })
      return;
    }

    setIsUpdating(true)
    const response = await fetch(`${BASE_URL}/instant-level`, {
      credentials: 'include',
      method: 'PATCH',
      body: JSON.stringify({ cardId: id, requiredEnergy }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const resData = await response.json()
    setProgress(resData.progress)
    setLevel(resData.level)
    setEnergy(resData.energy)
    setIsUpdating(false)
  }


  return (
    <button
      onClick={directUpdateItem}
      className="w-full text-[9px] font-semibold bg-activeNav text-navButtonColor rounded-full h-[15px] cursor-pointer flex items-center justify-center gap-1"
      style={{
        boxShadow: `inset 3px 3px 5px rgba(248, 248, 248, 0.7), inset 0 2px 4px rgba(93, 83, 107, 0.7)`
      }}
      disabled={isUpdating || energy < requiredEnergy}
    >
      <Image
        src={energyIcon}
        alt="icon"
        className="w-3 h-3"
      />
      <span className="font-semibold text-[#EE39A8]">-{requiredEnergy}</span>{isUpdating ? "Yükseliyor" : "Hızlı Yükselt"}
    </button>
  )
}