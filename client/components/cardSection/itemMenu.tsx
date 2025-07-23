import { useState } from "react"
import ItemCard from "./itemCard"
import { ItemType } from "@/types/globalTypes"

interface ComponentProps {
  data: ItemType[]
}

export default function ItemMenu({ data }: ComponentProps) {

  const [itemList, setItemList] = useState<ItemType[]>(data)

  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      {itemList.map((item: ItemType) => (
        <ItemCard key={item._id} item={item} />
      ))}
    </div>
  )
}