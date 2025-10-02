"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlanetQuiz } from "@/components/planet-quiz"
import { PlanetDistanceCalculator } from "@/components/planet-distance-calculator"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-balance">Welcome back, {user.name}!</h1>
        <p className="text-muted-foreground text-lg">Explore the cosmos through quizzes and calculations</p>
      </div>

      <Tabs defaultValue="quiz" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="quiz">Planet Quiz</TabsTrigger>
          <TabsTrigger value="calculator">Distance Calculator</TabsTrigger>
        </TabsList>

        <TabsContent value="quiz" className="space-y-4">
          <PlanetQuiz />
        </TabsContent>

        <TabsContent value="calculator" className="space-y-4">
          <PlanetDistanceCalculator />
        </TabsContent>
      </Tabs>
    </div>
  )
}
