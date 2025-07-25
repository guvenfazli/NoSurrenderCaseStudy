import { useState, useEffect, useContext } from "react";
import { EnergyContext } from "@/store/energyContext";
export default function useEnergyController<T>(url: string) {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<string | boolean>(false)
  const { energy, setEnergy, timer, setTimer } = useContext(EnergyContext)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsError(false)
        const response = await fetch(url, {
          credentials: 'include',
        })
        if (!response.ok) {
          const resData = await response.json()
          throw resData
        }
        const resData = await response.json()
        setEnergy(resData.energy)
        setIsLoading(false)
      } catch (err: unknown) {
        const error = err as { message: string, status: number }
        setIsError(error.message)
      }
    }

    fetchData()
  }, [url])

  return { isLoading, isError, energy, timer, setTimer }
}