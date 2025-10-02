"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { PLANETS } from "@/lib/nasa-api"
import { Globe, Moon, Clock, Orbit } from "lucide-react"

interface PlanetInfoCardProps {
  planetId: string
}

export function PlanetInfoCard({ planetId }: PlanetInfoCardProps) {
  const planet = PLANETS[planetId]

  if (!planet) return null

  return (
    <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 rounded-full" style={{ backgroundColor: planet.color }} />
        <div>
          <h3 className="text-3xl font-bold">{planet.name}</h3>
          <p className="text-muted-foreground">Planet Facts</p>
        </div>
      </div>

      <p className="text-lg mb-6 leading-relaxed">{planet.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoItem icon={<Globe className="w-5 h-5" />} label="Mass" value={planet.mass} />
        <InfoItem icon={<Moon className="w-5 h-5" />} label="Moons" value={planet.moons.toString()} />
        <InfoItem icon={<Clock className="w-5 h-5" />} label="Day Length" value={planet.dayLength} />
        <InfoItem icon={<Orbit className="w-5 h-5" />} label="Orbital Period" value={planet.orbitalPeriod} />
      </div>

      <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border">
        <div className="flex items-center gap-2 mb-2">
          <Orbit className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-semibold">Distance from Sun</span>
        </div>
        <p className="text-lg font-bold">{planet.distanceFromSun}</p>
      </div>
    </Card>
  )
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-card/30 border border-border">
      <div className="text-primary mt-1">{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  )
}
