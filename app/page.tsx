import DistanceCalculatorWrapper from "@/components/distance-calculator-wrapper"

export default function Home() {
  return (
    <main className="min-h-screen relative">
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-12 pt-24">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 text-balance">Cosmic Commute</h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              Explore real-time distances between Earth and other planets using NASA data
            </p>
          </div>

          {/* Main Calculator */}
          <DistanceCalculatorWrapper />
        </div>
      </div>
    </main>
  )
}
