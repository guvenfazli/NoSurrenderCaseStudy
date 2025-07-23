"use client"
import { useState, createContext, Dispatch, SetStateAction } from "react"

type EnergyContextType = {
  energy: number | undefined;
  setEnergy: Dispatch<SetStateAction<number | undefined>>;
};

export const EnergyContext = createContext<EnergyContextType>({
  energy: undefined,
  setEnergy: () => { }
})

export default function EnergyContextProvider({ children }: { children: React.ReactNode }) {
  const [energy, setEnergy] = useState<number | undefined>(undefined)


  return (
    <EnergyContext.Provider value={{ energy, setEnergy }}>
      {children}
    </EnergyContext.Provider>
  );
}

