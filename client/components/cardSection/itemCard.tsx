import example from "../../assets/uzunKilic1.png"
import UpdateButton from "./updateButton"
import UpgradeButton from "./upgradeButton"
export default function ItemCard() {
  return (
    <div className="h-[139px] flex flex-col justify-between col-span-1 relative py-2 px-1 bg-cover rounded-lg shadow-[0_0_5px_0px_white]" style={{ backgroundImage: `url(${example.src})` }}>
      <div className="flex px-2 justify-end"> {/* Item Level */}
        <p className="text-[9px] font-semibold">Level 1</p>
      </div>

      <div className="space-y-1"> {/* Item Information */}
        <p className="text-[9px] font-semibold">Name of the Item</p>
        <p className="text-[8px]">Description of the Item</p>
        <div className="flex justify-start items-center gap-1"> {/* Item Update Section */}
          <div className="flex relative bg-[#1a1a1a] w-1/2 h-[16px] px-0.5 shadow-[0_0_5px_0px_#F8B0DC] rounded-full">
            <div className="absolute top-0.5 h-[12px] rounded-full" style={{ width: `${95}%` }}>
              <span className="absolute h-[12px] rounded-full" style={{ width: `${100}%`, background: `#EE39A8`, boxShadow: `inset 0 0 5px #FFFFFF` }} />
            </div>
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[9px] text-white font-medium">100%</span>
          </div>
          <UpgradeButton />
        </div>
      </div>
    </div>

  )
}