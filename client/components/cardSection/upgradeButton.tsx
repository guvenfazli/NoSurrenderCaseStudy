import energyIcon from "../../assets/energyPng.png"
import Image from "next/image"
import { useContext } from "react"
import { EnergyContext } from "@/store/energyContext"
import { toast } from "sonner"
interface ComponentProps {
  setProgress: React.Dispatch<React.SetStateAction<number>>
  id: string
}

export default function UpgradeButton({ setProgress, id }: ComponentProps) {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
  const { energy, setEnergy } = useContext(EnergyContext)

  async function upgradeItem() {
    if (energy < 1) { // Client Check
      toast.error("Yeterli enerjin yok!", {
        className: "bg-red-700"
      })
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/progress`, {
        credentials: 'include',
        method: 'PATCH',
        body: JSON.stringify({ cardId: id }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const resData = await response.json()
        const error = new Error()
        error.message = resData.message
        throw error
      }

      const resData = await response.json()

      setProgress(resData.progress)
      setEnergy(resData.energy)
    } catch (err: unknown) {
      const error = err as Error

      toast.error(error.message, {
        className: "bg-red-700"
      })
    }
  }


  return (
    <button
      onClick={upgradeItem}
      className="w-1/2 text-[9px] font-semibold bg-activeNav text-navButtonColor rounded-full h-[15px] cursor-pointer flex items-center justify-center gap-1"
      style={{
        boxShadow: `inset 3px 3px 5px rgba(248, 248, 248, 0.7), inset 0 2px 4px rgba(93, 83, 107, 0.7)`
      }}
    >
      <Image
        src={energyIcon}
        alt="icon"
        className="w-3 h-3"
      />
      <span className="font-semibold text-[#EE39A8]">-1</span> Geliştir
    </button>
  )
}