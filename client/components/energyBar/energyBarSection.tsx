"use client"
import TimerSection from "./timerSection"
import ProgressBar from "./progressBar"
import Error from "../layoutComponents/error"
import { Energy } from "@/types/globalTypes"
import LoadingComponent from "../layoutComponents/loading"
import useEnergyController from "@/hooks/useEnergyController"
export default function EnergyBarSection() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
  const { energy, isError, isLoading } = useEnergyController<Energy>(`${BASE_URL}/energy`)
 
  return (
    <div>
      {isLoading && <LoadingComponent />}
      {isError && <Error message={isError} />}
      {energy &&
        <>
          <TimerSection />
          <ProgressBar />
        </>
      }
    </div>
  )
}