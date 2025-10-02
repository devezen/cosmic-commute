"use client"

import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"

interface SolarSystemVizProps {
  selectedPlanet: string
  date: Date
}

export default function SolarSystemViz({ selectedPlanet, date }: SolarSystemVizProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Clear canvas
    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Draw orbits and planets
    const orbits = [
      { planet: "mercury", radius: 60 },
      { planet: "venus", radius: 90 },
      { planet: "earth", radius: 120 },
      { planet: "mars", radius: 150 },
      { planet: "jupiter", radius: 200 },
      { planet: "saturn", radius: 230 },
      { planet: "uranus", radius: 280 },
      { planet: "neptune", radius: 330 },
    ]

    const dateObj = date instanceof Date ? date : new Date(date)
    const startOfYear = new Date(dateObj.getFullYear(), 0, 1)
    const dayOfYear = Math.floor((dateObj.getTime() - startOfYear.getTime()) / 86400000)

    orbits.forEach(({ planet, radius }) => {
      // Draw orbit
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.stroke()

      // Calculate planet position
      const periods: Record<string, number> = {
        mercury: 88,
        venus: 225,
        earth: 365,
        mars: 687,
        jupiter: 4333,
        saturn: 10759,
        uranus: 30687,
        neptune: 60190,
      }

      const period = periods[planet]
      const angle = ((dayOfYear % period) / period) * 2 * Math.PI
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)

      // Draw planet
      const colors: Record<string, string> = {
        mercury: "#8c7853",
        venus: "#ffc649",
        earth: "#4a90e2",
        mars: "#e27b58",
        jupiter: "#c88b3a",
        saturn: "#fad5a5",
        uranus: "#4fd0e7",
        neptune: "#4166f5",
      }

      const sizes: Record<string, number> = {
        mercury: 4,
        venus: 6,
        earth: 6,
        mars: 5,
        jupiter: 12,
        saturn: 10,
        uranus: 8,
        neptune: 8,
      }

      ctx.fillStyle = colors[planet]
      ctx.beginPath()
      ctx.arc(x, y, sizes[planet], 0, Math.PI * 2)
      ctx.fill()

      // Highlight selected planet
      if (planet === selectedPlanet) {
        ctx.strokeStyle = "#fff"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(x, y, sizes[planet] + 4, 0, Math.PI * 2)
        ctx.stroke()
      }
    })

    // Draw Sun
    ctx.fillStyle = "#ffa500"
    ctx.beginPath()
    ctx.arc(centerX, centerY, 15, 0, Math.PI * 2)
    ctx.fill()
  }, [selectedPlanet, date])

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
      <h2 className="text-2xl font-bold mb-4">Solar System View</h2>
      <canvas ref={canvasRef} className="w-full h-[600px] rounded-lg bg-background/50" />
    </Card>
  )
}
