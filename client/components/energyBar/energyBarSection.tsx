"use client"
import TimerSection from "./timerSection"
import ProgressBar from "./progressBar"
import useFetchData from "@/hooks/useFetchData"
import Error from "../layoutComponents/error"
import { Energy } from "@/types/globalTypes"
import LoadingComponent from "../layoutComponents/loading"
export default function EnergyBarSection() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
  const { data, isError, isLoading } = useFetchData<Energy>(`${BASE_URL}/energy`)

  return (
    <div>
      {isLoading && <LoadingComponent />}
      {isError && <Error message={isError} />}
      {data &&
        <>
          <TimerSection energy={data.energy} />
          <ProgressBar energy={data.energy} />
        </>
      }
    </div>
  )
}