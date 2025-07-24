import energyIcon from "../../assets/energyPng.png"
import Image from "next/image"
import { useContext } from "react"
import { EnergyContext } from "@/store/energyContext"
import { ItemType } from "@/types/globalTypes"
interface ComponentProps {
  setItemList: React.Dispatch<React.SetStateAction<ItemType[]>>
  id: string
}

export default function UpgradeButton({ setItemList, id }: ComponentProps) {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
  const { energy, setEnergy } = useContext(EnergyContext)

  async function upgradeItem() {

    const response = await fetch(`${BASE_URL}/upgradeLevelStatus/${id}`, {
      credentials: 'include',
      method: 'PATCH',
      body: JSON.stringify({ energy }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const resData = await response.json()
    console.log(resData)
    setItemList(resData.itemList)
    setEnergy(resData.energy)
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