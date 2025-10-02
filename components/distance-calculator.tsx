"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { PLANETS, calculateDistance, type DistanceData } from "@/lib/nasa-api"
import { TravelTimeDisplay } from "@/components/travel-time-display"
import { PlanetInfoCard } from "@/components/planet-info-card"

const SolarSystem3D = dynamic(() => import("@/components/solar-system-3d"), {
  ssr: false,
  loading: () => (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
      <div className="w-full h-[600px] rounded-lg overflow-hidden bg-background/50 flex items-center justify-center">
        <p className="text-muted-foreground">Loading 3D Solar System...</p>
      </div>
    </Card>
  ),
})

export default function DistanceCalculator() {
  const [selectedPlanet, setSelectedPlanet] = useState("mars")
  const [distanceData, setDistanceData] = useState<DistanceData | null>(null)

  const today = new Date()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(today.getTime()))
  const [daysOffset, setDaysOffset] = useState(0)

  const minDays = -365
  const maxDays = 730

  const handleCalculate = () => {
    const data = calculateDistance(selectedPlanet, selectedDate)
    setDistanceData(data)
  }

  const handleTimelineChange = (value: number[]) => {
    const offset = value[0]
    setDaysOffset(offset)
    const newDate = new Date(today.getTime())
    newDate.setDate(newDate.getDate() + offset)
    setSelectedDate(new Date(newDate.getTime()))

    if (selectedPlanet) {
      const data = calculateDistance(selectedPlanet, newDate)
      setDistanceData(data)
    }
  }

  const formatDateLabel = () => {
    if (daysOffset === 0) return "Today"
    if (daysOffset > 0) return `${daysOffset} days from now`
    return `${Math.abs(daysOffset)} days ago`
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Planet Selection */}
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
        <h2 className="text-2xl font-bold mb-6">Select a Planet</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {Object.values(PLANETS).map((planet) => (
            <button
              key={planet.id}
              onClick={() => setSelectedPlanet(planet.id)}
              className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                selectedPlanet === planet.id
                  ? "border-primary bg-primary/20"
                  : "border-border bg-card/30 hover:border-primary/50"
              }`}
            >
              <div className="w-12 h-12 rounded-full mx-auto mb-2" style={{ backgroundColor: planet.color }} />
              <p className="text-sm font-medium text-center">{planet.name}</p>
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <Button onClick={handleCalculate} size="lg" className="px-8">
            Calculate Distance
          </Button>
        </div>
      </Card>

      {/* Timeline Slider */}
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
        <h2 className="text-2xl font-bold mb-4">Time Travel</h2>
        <p className="text-muted-foreground mb-6">
          Explore how planetary distances change over time. Drag the slider to see past and future positions.
        </p>
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>1 year ago</span>
            <span className="font-medium text-foreground">{formatDateLabel()}</span>
            <span>2 years ahead</span>
          </div>
          <Slider
            value={[daysOffset]}
            onValueChange={handleTimelineChange}
            min={minDays}
            max={maxDays}
            step={1}
            className="w-full"
          />
          <div className="text-center text-sm text-muted-foreground">
            {selectedDate.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </Card>

      {/* Distance Results */}
      {distanceData && (
        <>
          <TravelTimeDisplay distanceData={distanceData} />
          <PlanetInfoCard planet={distanceData.planet} />
        </>
      )}

      {/* 3D Visualization */}
      <SolarSystem3D selectedPlanet={selectedPlanet} date={selectedDate} />
    </div>
  )
}
