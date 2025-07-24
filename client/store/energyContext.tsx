"use client"
import { useState, createContext, Dispatch, SetStateAction } from "react"

type EnergyContextType = {
  energy: number;
  setEnergy: Dispatch<SetStateAction<number>>;
};

export const EnergyContext = createContext<EnergyContextType>({
  energy: 0,
  setEnergy: () => { }
})

export default function EnergyContextProvider({ children }: { children: React.ReactNode }) {
  const [energy, setEnergy] = useState<number>(0)


  return (
    <EnergyContext.Provider value={{ energy, setEnergy }}>
      {children}
    </EnergyContext.Provider>
  );
}

