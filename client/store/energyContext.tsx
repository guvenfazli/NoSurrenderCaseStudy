"use client"
import { useState, createContext, Dispatch, SetStateAction } from "react"

type EnergyContextType = {
  energy: number;
  setEnergy: Dispatch<SetStateAction<number>>;
  timer: number;
  setTimer: Dispatch<SetStateAction<number>>;
};

export const EnergyContext = createContext<EnergyContextType>({
  energy: 0,
  setEnergy: () => { },
  timer: 120,
  setTimer: () => { }
})

export default function EnergyContextProvider({ children }: { children: React.ReactNode }) {
  const [energy, setEnergy] = useState<number>(0)
  const [timer, setTimer] = useState<number>(120)

  return (
    <EnergyContext.Provider value={{ energy, setEnergy, timer, setTimer }}>
      {children}
    </EnergyContext.Provider>
  );
}

