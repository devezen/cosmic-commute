"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame, useLoader, type ThreeEvent } from "@react-three/fiber"
import { OrbitControls, Stars } from "@react-three/drei"
import { Card } from "@/components/ui/card"
import { PlanetInfoCard } from "@/components/planet-info-card"
import * as THREE from "three"

interface SolarSystem3DProps {
  selectedPlanet: string
  date: Date
}

// Planet component with realistic textures
function Planet({
  id,
  radius,
  size,
  color,
  period,
  date,
  isSelected,
  textureUrl,
  onClick,
}: {
  id: string
  radius: number
  size: number
  color: number
  period: number
  date: Date
  isSelected: boolean
  textureUrl: string
  onClick: () => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)

  const texture = useLoader(THREE.TextureLoader, textureUrl)

  useFrame((state) => {
    if (!meshRef.current) return

    const dateObj = date instanceof Date ? date : new Date(date)
    const startOfYear = new Date(dateObj.getFullYear(), 0, 1)
    const dayOfYear = Math.floor((dateObj.getTime() - startOfYear.getTime()) / 86400000)
    const angle = ((dayOfYear % period) / period) * 2 * Math.PI

    meshRef.current.position.x = radius * Math.cos(angle)
    meshRef.current.position.z = radius * Math.sin(angle)

    meshRef.current.rotation.y += 0.01

    if (ringRef.current) {
      ringRef.current.position.copy(meshRef.current.position)
    }
  })

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    onClick()
  }

  return (
    <>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "default")}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial map={texture} />
      </mesh>
      {isSelected && (
        <mesh ref={ringRef}>
          <ringGeometry args={[size * 1.5, size * 1.7, 32]} />
          <meshBasicMaterial color={0xffffff} side={THREE.DoubleSide} transparent opacity={0.6} />
        </mesh>
      )}
    </>
  )
}

export default function SolarSystem3D({ selectedPlanet, date }: SolarSystem3DProps) {
  const [clickedPlanet, setClickedPlanet] = useState<string | null>(null)

  const planets = [
    {
      id: "mercury",
      radius: 8,
      size: 0.4,
      color: 0x8c7853,
      period: 88,
      textureUrl: "/realistic-mercury-planet-surface-with-craters.jpg",
    },
    {
      id: "venus",
      radius: 12,
      size: 0.9,
      color: 0xffc649,
      period: 225,
      textureUrl: "/realistic-venus-planet-surface-with-thick-yellow-c.jpg",
    },
    {
      id: "earth",
      radius: 16,
      size: 1,
      color: 0x4a90e2,
      period: 365,
      textureUrl: "/realistic-earth-planet-with-blue-oceans-green-cont.jpg",
    },
    {
      id: "mars",
      radius: 20,
      size: 0.5,
      color: 0xe27b58,
      period: 687,
      textureUrl: "/realistic-mars-planet-surface-with-red-dust-and-ca.jpg",
    },
    {
      id: "jupiter",
      radius: 28,
      size: 2.5,
      color: 0xc88b3a,
      period: 4333,
      textureUrl: "/realistic-jupiter-planet-with-swirling-gas-bands-a.jpg",
    },
    {
      id: "saturn",
      radius: 36,
      size: 2.2,
      color: 0xfad5a5,
      period: 10759,
      textureUrl: "/realistic-saturn-planet-with-golden-bands-and-prom.jpg",
    },
    {
      id: "uranus",
      radius: 44,
      size: 1.8,
      color: 0x4fd0e7,
      period: 30687,
      textureUrl: "/realistic-uranus-planet-with-pale-blue-green-atmos.jpg",
    },
    {
      id: "neptune",
      radius: 52,
      size: 1.7,
      color: 0x4166f5,
      period: 60190,
      textureUrl: "/realistic-neptune-planet-with-deep-blue-atmosphere.jpg",
    },
  ]

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
        <h2 className="text-2xl font-bold mb-4">3D Solar System</h2>
        <p className="text-sm text-muted-foreground mb-4">Click on any planet to view detailed information</p>
        <div className="w-full h-[600px] rounded-lg overflow-hidden bg-background/50">
          <Canvas camera={{ position: [0, 30, 60], fov: 50 }}>
            <ambientLight intensity={0.3} />
            <pointLight position={[0, 0, 0]} intensity={2} />
            <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade speed={1} />

            {/* Sun */}
            <mesh>
              <sphereGeometry args={[3, 32, 32]} />
              <meshStandardMaterial
                map={useLoader(THREE.TextureLoader, "/realistic-sun-surface-with-solar-flares-and-granul.jpg")}
                emissive={0xffaa00}
                emissiveIntensity={0.5}
              />
            </mesh>

            {/* Planets */}
            {planets.map((planet) => (
              <Planet
                key={planet.id}
                {...planet}
                date={date}
                isSelected={selectedPlanet === planet.id}
                onClick={() => setClickedPlanet(planet.id)}
              />
            ))}

            <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
          </Canvas>
        </div>
      </Card>

      {clickedPlanet && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <PlanetInfoCard planetId={clickedPlanet} />
        </div>
      )}
    </div>
  )
}
