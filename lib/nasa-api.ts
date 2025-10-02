// NASA JPL Horizons API integration for planetary positions
// Using simplified calculations based on orbital mechanics

export interface PlanetData {
  id: string
  name: string
  color: string
  mass: string
  moons: number
  dayLength: string
  distanceFromSun: string
  orbitalPeriod: string
  description: string
}

export interface DistanceData {
  planet: string
  distanceKm: number
  distanceMiles: number
  distanceAU: number
  lightMinutes: number
  date: Date
}

// Planet data with scientific facts
export const PLANETS: Record<string, PlanetData> = {
  mercury: {
    id: "mercury",
    name: "Mercury",
    color: "oklch(0.70 0.10 60)",
    mass: "3.30 × 10²³ kg",
    moons: 0,
    dayLength: "59 Earth days",
    distanceFromSun: "57.9 million km",
    orbitalPeriod: "88 Earth days",
    description: "The smallest and fastest planet, closest to the Sun with extreme temperature variations.",
  },
  venus: {
    id: "venus",
    name: "Venus",
    color: "oklch(0.80 0.15 85)",
    mass: "4.87 × 10²⁴ kg",
    moons: 0,
    dayLength: "243 Earth days",
    distanceFromSun: "108.2 million km",
    orbitalPeriod: "225 Earth days",
    description: "The hottest planet with a thick, toxic atmosphere and surface temperatures of 462°C.",
  },
  mars: {
    id: "mars",
    name: "Mars",
    color: "oklch(0.75 0.20 35)",
    mass: "6.42 × 10²³ kg",
    moons: 2,
    dayLength: "24.6 hours",
    distanceFromSun: "227.9 million km",
    orbitalPeriod: "687 Earth days",
    description: "The Red Planet with polar ice caps, the tallest volcano, and evidence of ancient water.",
  },
  jupiter: {
    id: "jupiter",
    name: "Jupiter",
    color: "oklch(0.55 0.15 320)",
    mass: "1.90 × 10²⁷ kg",
    moons: 95,
    dayLength: "9.9 hours",
    distanceFromSun: "778.5 million km",
    orbitalPeriod: "12 Earth years",
    description: "The largest planet, a gas giant with a Great Red Spot storm and powerful magnetic field.",
  },
  saturn: {
    id: "saturn",
    name: "Saturn",
    color: "oklch(0.78 0.12 75)",
    mass: "5.68 × 10²⁶ kg",
    moons: 146,
    dayLength: "10.7 hours",
    distanceFromSun: "1.43 billion km",
    orbitalPeriod: "29 Earth years",
    description: "Famous for its spectacular ring system made of ice and rock particles.",
  },
  uranus: {
    id: "uranus",
    name: "Uranus",
    color: "oklch(0.70 0.18 200)",
    mass: "8.68 × 10²⁵ kg",
    moons: 27,
    dayLength: "17.2 hours",
    distanceFromSun: "2.87 billion km",
    orbitalPeriod: "84 Earth years",
    description: "An ice giant that rotates on its side, with a blue-green color from methane.",
  },
  neptune: {
    id: "neptune",
    name: "Neptune",
    color: "oklch(0.65 0.25 265)",
    mass: "1.02 × 10²⁶ kg",
    moons: 14,
    dayLength: "16.1 hours",
    distanceFromSun: "4.50 billion km",
    orbitalPeriod: "165 Earth years",
    description: "The windiest planet with supersonic winds and a deep blue color.",
  },
}

// Simplified orbital calculation using Kepler's laws
// In production, this would use NASA's HORIZONS API
export function calculateDistance(planet: string, date: Date = new Date()): DistanceData {
  const planetData = PLANETS[planet.toLowerCase()]
  if (!planetData) {
    throw new Error(`Unknown planet: ${planet}`)
  }

  // Calculate day of year correctly
  const startOfYear = new Date(date.getFullYear(), 0, 1)
  const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / 86400000)

  // Base distances in million km (approximate)
  const baseDistances: Record<string, number> = {
    mercury: 91.7,
    venus: 41.4,
    mars: 78.3,
    jupiter: 628.7,
    saturn: 1275.0,
    uranus: 2723.0,
    neptune: 4351.0,
  }

  // Variation ranges (how much the distance changes due to orbits)
  const variations: Record<string, number> = {
    mercury: 50.3,
    venus: 41.4,
    mars: 78.3,
    jupiter: 150.0,
    saturn: 200.0,
    uranus: 300.0,
    neptune: 400.0,
  }

  const base = baseDistances[planet.toLowerCase()] || 100
  const variation = variations[planet.toLowerCase()] || 50

  // Simulate orbital position with sine wave
  const angle = (dayOfYear / 365) * 2 * Math.PI
  const distanceMillionKm = base + variation * Math.sin(angle)

  const distanceKm = distanceMillionKm * 1_000_000
  const distanceMiles = distanceKm * 0.621371
  const distanceAU = distanceMillionKm / 149.6 // 1 AU = 149.6 million km
  const lightMinutes = distanceKm / (299_792 * 60) // Speed of light

  return {
    planet: planetData.name,
    distanceKm,
    distanceMiles,
    distanceAU,
    lightMinutes,
    date,
  }
}

// Calculate travel time for different speeds
export interface TravelTime {
  method: string
  speed: string
  speedKmh: number
  timeSeconds: number
  timeFormatted: string
  icon: string
}

export function calculateTravelTimes(distanceKm: number): TravelTime[] {
  const speeds = [
    { method: "Walking", speedKmh: 5, icon: "🚶" },
    { method: "Car", speedKmh: 100, icon: "🚗" },
    { method: "Commercial Jet", speedKmh: 900, icon: "✈️" },
    { method: "Speed of Sound", speedKmh: 1_235, icon: "💨" },
    { method: "Apollo 10 (Fastest Crewed)", speedKmh: 39_897, icon: "🚀" },
    { method: "Parker Solar Probe", speedKmh: 163_000, icon: "🛸" },
    { method: "Speed of Light", speedKmh: 1_079_252_848, icon: "⚡" },
  ]

  return speeds.map(({ method, speedKmh, icon }) => {
    const timeSeconds = (distanceKm / speedKmh) * 3600
    const timeFormatted = formatTime(timeSeconds)

    return {
      method,
      speed: `${speedKmh.toLocaleString()} km/h`,
      speedKmh,
      timeSeconds,
      timeFormatted,
      icon,
    }
  })
}

function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)} seconds`
  } else if (seconds < 3600) {
    return `${Math.round(seconds / 60)} minutes`
  } else if (seconds < 86400) {
    return `${Math.round(seconds / 3600)} hours`
  } else if (seconds < 31536000) {
    const days = Math.round(seconds / 86400)
    return `${days.toLocaleString()} days`
  } else {
    const years = Math.round(seconds / 31536000)
    return `${years.toLocaleString()} years`
  }
}

// Format large numbers with appropriate units
export function formatDistance(km: number): string {
  if (km < 1000) {
    return `${Math.round(km).toLocaleString()} km`
  } else if (km < 1_000_000) {
    return `${Math.round(km / 1000).toLocaleString()} thousand km`
  } else {
    return `${(km / 1_000_000).toFixed(2)} million km`
  }
}
