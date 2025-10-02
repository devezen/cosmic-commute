"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PLANETS } from "@/lib/nasa-api"
import { Ruler, Fuel, Package } from "lucide-react"

export function PlanetDistanceCalculator() {
  const [planet1, setPlanet1] = useState("earth")
  const [planet2, setPlanet2] = useState("mars")
  const [cargoWeight, setCargoWeight] = useState(1000) // in kg

  // Calculate distance between two planets
  // Using simplified orbital mechanics
  const calculatePlanetDistance = (p1: string, p2: string) => {
    // Average distances from Sun in million km
    const sunDistances: Record<string, number> = {
      mercury: 57.9,
      venus: 108.2,
      earth: 149.6,
      mars: 227.9,
      jupiter: 778.5,
      saturn: 1433.5,
      uranus: 2872.5,
      neptune: 4495.1,
    }

    const d1 = sunDistances[p1] || 0
    const d2 = sunDistances[p2] || 0

    // Simplified: assuming planets are on same side of sun (minimum distance)
    const minDistance = Math.abs(d2 - d1)
    // Maximum distance when on opposite sides
    const maxDistance = d1 + d2
    // Average distance
    const avgDistance = (minDistance + maxDistance) / 2

    return {
      min: minDistance,
      max: maxDistance,
      avg: avgDistance,
    }
  }

  const calculateFuelConsumption = (distanceKm: number, cargoKg: number) => {
    // Fuel efficiency in kg fuel per kg cargo per million km
    const propulsionSystems = {
      chemical: {
        name: "Chemical Rocket",
        efficiency: 15, // kg fuel per kg cargo per million km
        description: "Traditional rocket fuel (high thrust, inefficient)",
      },
      ion: {
        name: "Ion Drive",
        efficiency: 0.3, // kg fuel per kg cargo per million km
        description: "Electric propulsion (low thrust, very efficient)",
      },
      nuclear: {
        name: "Nuclear Propulsion",
        efficiency: 2, // kg fuel per kg cargo per million km
        description: "Nuclear thermal rocket (balanced performance)",
      },
    }

    const results = Object.entries(propulsionSystems).map(([key, system]) => {
      const fuelNeeded = (distanceKm * system.efficiency * cargoKg) / 1000000 // Convert to total fuel
      return {
        ...system,
        fuelKg: fuelNeeded,
        fuelTons: fuelNeeded / 1000,
      }
    })

    return results
  }

  const distance = calculatePlanetDistance(planet1, planet2)
  const planet1Data = PLANETS[planet1]
  const planet2Data = PLANETS[planet2]

  const fuelConsumption = calculateFuelConsumption(distance.avg * 1000000, cargoWeight)

  return (
    <div className="space-y-6">
      <Card className="bg-background/80 backdrop-blur-xl border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5" />
            Planet-to-Planet Distance Calculator
          </CardTitle>
          <CardDescription>Calculate the distance between any two planets in our solar system</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="planet1">From Planet</Label>
              <Select value={planet1} onValueChange={setPlanet1}>
                <SelectTrigger id="planet1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PLANETS).map(([key, planet]) => (
                    <SelectItem key={key} value={key} disabled={key === planet2}>
                      {planet.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="planet2">To Planet</Label>
              <Select value={planet2} onValueChange={setPlanet2}>
                <SelectTrigger id="planet2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PLANETS).map(([key, planet]) => (
                    <SelectItem key={key} value={key} disabled={key === planet1}>
                      {planet.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <Label className="text-base font-semibold">Cargo Weight</Label>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Slider
                  value={[cargoWeight]}
                  onValueChange={(value) => setCargoWeight(value[0])}
                  min={100}
                  max={100000}
                  step={100}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={cargoWeight}
                  onChange={(e) => setCargoWeight(Number(e.target.value))}
                  min={100}
                  max={100000}
                  className="w-32"
                />
                <span className="text-sm text-muted-foreground whitespace-nowrap">kg</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {(cargoWeight / 1000).toFixed(2)} tons • Approximately{" "}
                {cargoWeight < 1000
                  ? "a small satellite"
                  : cargoWeight < 10000
                    ? "a large spacecraft"
                    : cargoWeight < 50000
                      ? "a space station module"
                      : "a heavy cargo vessel"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-background/80 backdrop-blur-xl border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Minimum Distance</CardTitle>
            <CardDescription>When planets are closest</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{distance.min.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">million km</div>
            <div className="text-xs text-muted-foreground mt-2">
              {(distance.min * 0.621371).toFixed(1)} million miles
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background/80 backdrop-blur-xl border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Average Distance</CardTitle>
            <CardDescription>Typical separation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{distance.avg.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">million km</div>
            <div className="text-xs text-muted-foreground mt-2">
              {(distance.avg * 0.621371).toFixed(1)} million miles
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background/80 backdrop-blur-xl border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Maximum Distance</CardTitle>
            <CardDescription>When planets are farthest</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{distance.max.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">million km</div>
            <div className="text-xs text-muted-foreground mt-2">
              {(distance.max * 0.621371).toFixed(1)} million miles
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-background/80 backdrop-blur-xl border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">{planet1Data?.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Distance from Sun:</span>
              <span className="font-medium">{planet1Data?.distanceFromSun}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Orbital Period:</span>
              <span className="font-medium">{planet1Data?.orbitalPeriod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Moons:</span>
              <span className="font-medium">{planet1Data?.moons}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background/80 backdrop-blur-xl border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">{planet2Data?.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Distance from Sun:</span>
              <span className="font-medium">{planet2Data?.distanceFromSun}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Orbital Period:</span>
              <span className="font-medium">{planet2Data?.orbitalPeriod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Moons:</span>
              <span className="font-medium">{planet2Data?.moons}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-background/80 backdrop-blur-xl border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fuel className="h-5 w-5" />
            Fuel Consumption Estimates
          </CardTitle>
          <CardDescription>
            Estimated fuel needed to transport {(cargoWeight / 1000).toFixed(1)} tons from {planet1Data?.name} to{" "}
            {planet2Data?.name} (average distance)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {fuelConsumption.map((system, index) => (
              <Card key={index} className="bg-background/50 border-primary/10">
                <CardHeader>
                  <CardTitle className="text-base">{system.name}</CardTitle>
                  <CardDescription className="text-xs">{system.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {system.fuelTons >= 1 ? system.fuelTons.toFixed(1) : system.fuelKg.toFixed(0)}
                    </div>
                    <div className="text-sm text-muted-foreground">{system.fuelTons >= 1 ? "tons" : "kg"}</div>
                  </div>
                  <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                    Efficiency: {system.efficiency} kg fuel per kg cargo per million km
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Note:</strong> These are simplified estimates based on average
              distance. Actual fuel requirements depend on trajectory optimization, gravity assists, launch windows, and
              spacecraft design. Chemical rockets provide high thrust but require massive fuel. Ion drives are extremely
              efficient but take much longer. Nuclear propulsion offers a balance between the two.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
