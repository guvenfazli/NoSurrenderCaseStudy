export default function NavBar() {
  return (
    <div className="flex items-center justify-between border-2 border-[#FFFFFF]/30 py-0.5 px-0.5 relative w-full rounded-full">
      <button className="text-[10px] text-navButtonColor bg-activeNav rounded-full px-2 py-1 font-bold cursor-pointer">Tüm Seviyeler</button>
      <button className="text-[10px] rounded-full px-2 py-1 font-bold opacity-30 cursor-pointer">Sv1</button>
      <button className="text-[10px] rounded-full px-2 py-1 font-bold opacity-30 cursor-pointer">Sv2</button>
      <button className="text-[10px] rounded-full px-2 py-1 font-bold opacity-30 cursor-pointer">Max Sv</button>
    </div>
  )
}