"use client"
import NavBar from "../navBar/navBar"
import ItemMenu from "./itemMenu"
import { ItemList } from "@/types/globalTypes"
import useFetchData from "@/hooks/useFetchData"
import Error from "../layoutComponents/error"
import LoadingComponent from "../layoutComponents/loading"
export default function CardSection() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
  const { data, isError, isLoading, setData } = useFetchData<ItemList>(`${BASE_URL}/items`)

  return (
    <section className="flex flex-col justify-start items-start gap-5">
      <NavBar />
      {isLoading && <LoadingComponent />}
      {isError && <Error message={isError} />}
      {data && <ItemMenu data={data.itemList} />}
    </section>
  )
}