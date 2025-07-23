import { useState, useEffect } from "react";
export default function useFetchData<T>(url: string) {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<string | boolean>(false)
  const [data, setData] = useState<T | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsError(false)

        const response = await fetch(url, {
          credentials: 'include'
        })

        if (!response.ok) { 
          const resData = await response.json()
          throw resData
        }

        const resData = await response.json()

        setData(resData)
        setIsLoading(false)
      } catch (err: unknown) {
        const error = err as { message: string, status: number }
        setIsError(error.message)
      }
    }

    fetchData()
  }, [url])

  return { isLoading, isError, data }
}