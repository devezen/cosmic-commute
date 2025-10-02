"use client"

import { useEffect, useRef } from "react"

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create stars
    const stars: Array<{ x: number; y: number; size: number; opacity: number; speed: number; twinkleSpeed: number }> =
      []
    const starCount = 200

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        opacity: Math.random(),
        speed: Math.random() * 0.3 + 0.1,
        twinkleSpeed: Math.random() * 0.5,
      })
    }

    const meteors: Array<{
      x: number
      y: number
      length: number
      speed: number
      angle: number
      opacity: number
      size: number
    }> = []

    const createMeteor = () => {
      meteors.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.5,
        length: Math.random() * 80 + 40,
        speed: Math.random() * 8 + 4,
        angle: (Math.random() * Math.PI) / 6 + Math.PI / 6,
        opacity: 1,
        size: Math.random() * 2 + 1,
      })
    }

    const meteorInterval = setInterval(() => {
      createMeteor()
    }, 10000)

    // Animation
    let animationFrame: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      stars.forEach((star) => {
        star.x -= star.speed

        if (star.x < 0) {
          star.x = canvas.width
          star.y = Math.random() * canvas.height
        }

        star.opacity += star.twinkleSpeed * 0.02
        if (star.opacity > 1 || star.opacity < 0.3) {
          star.twinkleSpeed *= -1
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()
      })

      meteors.forEach((meteor, index) => {
        meteor.x += Math.cos(meteor.angle) * meteor.speed
        meteor.y += Math.sin(meteor.angle) * meteor.speed
        meteor.opacity -= 0.01

        if (meteor.x > canvas.width + 100 || meteor.y > canvas.height + 100 || meteor.opacity <= 0) {
          meteors.splice(index, 1)
          return
        }

        // Draw meteor trail
        const gradient = ctx.createLinearGradient(
          meteor.x,
          meteor.y,
          meteor.x - Math.cos(meteor.angle) * meteor.length,
          meteor.y - Math.sin(meteor.angle) * meteor.length,
        )
        gradient.addColorStop(0, `rgba(255, 255, 255, ${meteor.opacity})`)
        gradient.addColorStop(0.5, `rgba(200, 220, 255, ${meteor.opacity * 0.5})`)
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)")

        ctx.strokeStyle = gradient
        ctx.lineWidth = meteor.size
        ctx.lineCap = "round"
        ctx.beginPath()
        ctx.moveTo(meteor.x, meteor.y)
        ctx.lineTo(meteor.x - Math.cos(meteor.angle) * meteor.length, meteor.y - Math.sin(meteor.angle) * meteor.length)
        ctx.stroke()

        // Draw meteor head glow
        const glowGradient = ctx.createRadialGradient(meteor.x, meteor.y, 0, meteor.x, meteor.y, meteor.size * 3)
        glowGradient.addColorStop(0, `rgba(255, 255, 255, ${meteor.opacity})`)
        glowGradient.addColorStop(0.5, `rgba(200, 220, 255, ${meteor.opacity * 0.3})`)
        glowGradient.addColorStop(1, "rgba(255, 255, 255, 0)")

        ctx.fillStyle = glowGradient
        ctx.beginPath()
        ctx.arc(meteor.x, meteor.y, meteor.size * 3, 0, Math.PI * 2)
        ctx.fill()
      })

      animationFrame = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrame)
      clearInterval(meteorInterval)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />
}
