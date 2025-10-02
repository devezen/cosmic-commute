"use client"

import { Card } from "@/components/ui/card"
import { calculateTravelTimes } from "@/lib/nasa-api"
import { Rocket, Car, Plane, Zap, PersonStanding } from "lucide-react"

interface TravelTimeDisplayProps {
  distanceKm: number
  planetName: string
}

export function TravelTimeDisplay({ distanceKm, planetName }: TravelTimeDisplayProps) {
  const travelTimes = calculateTravelTimes(distanceKm)

  const getIcon = (method: string) => {
    if (method.includes("Walking")) return <PersonStanding className="w-6 h-6" />
    if (method.includes("Car")) return <Car className="w-6 h-6" />
    if (method.includes("Jet")) return <Plane className="w-6 h-6" />
    if (method.includes("Light")) return <Zap className="w-6 h-6" />
    return <Rocket className="w-6 h-6" />
  }

  return (
    <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold mb-2">How Long Would It Take?</h3>
        <p className="text-muted-foreground">Travel time to {planetName} using different methods</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {travelTimes.map((travel) => (
          <div
            key={travel.method}
            className="p-6 rounded-lg border border-border bg-card/30 hover:bg-card/50 transition-colors"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="text-primary">{getIcon(travel.method)}</div>
              <div>
                <h4 className="font-semibold text-lg">{travel.method}</h4>
                <p className="text-xs text-muted-foreground">{travel.speed}</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-primary">{travel.timeFormatted}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border">
        <p className="text-sm text-muted-foreground text-center">
          These calculations assume constant speed and a straight-line path. Actual space travel requires complex
          orbital mechanics and gravitational assists.
        </p>
      </div>
    </Card>
  )
}
