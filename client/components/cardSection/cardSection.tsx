"use client"
import NavBar from "../navBar/navBar"
import ItemMenu from "./itemMenu"
import { ItemList } from "@/types/globalTypes"
import useFetchData from "@/hooks/useFetchData"

export default function CardSection() {

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
  const { data, isError, isLoading } = useFetchData<ItemList>(`${BASE_URL}/items`)
  console.log(data)

  return (
    <section className="flex flex-col justify-start items-start gap-5">
      <NavBar />
      {data && <ItemMenu data={data.itemList} />}
    </section>
  )
}