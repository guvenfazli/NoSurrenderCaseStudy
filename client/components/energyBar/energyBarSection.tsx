"use client"
import TimerSection from "./timerSection"
import ProgressBar from "./progressBar"
import { useState } from "react"

export default function EnergyBarSection() {

  const [energy, setEnergy] = useState(95)

  return (
    <div>
      <TimerSection />
      <ProgressBar energy={energy} />
    </div>
  )
}