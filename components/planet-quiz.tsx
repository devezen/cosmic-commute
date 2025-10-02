"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, XCircle, Trophy, RotateCcw } from "lucide-react"

interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
}

const quizQuestions: QuizQuestion[] = [
  {
    question: "Which planet is the largest in our solar system?",
    options: ["Saturn", "Jupiter", "Neptune", "Uranus"],
    correctAnswer: "Jupiter",
    explanation: "Jupiter is the largest planet with a mass of 1.90 × 10²⁷ kg and 95 known moons!",
  },
  {
    question: "Which planet has the most moons?",
    options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
    correctAnswer: "Saturn",
    explanation: "Saturn has 146 known moons, the most in our solar system!",
  },
  {
    question: "Which planet is closest to the Sun?",
    options: ["Venus", "Mercury", "Mars", "Earth"],
    correctAnswer: "Mercury",
    explanation: "Mercury orbits at just 57.9 million km from the Sun and completes an orbit in only 88 Earth days.",
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Mercury"],
    correctAnswer: "Mars",
    explanation: "Mars appears red due to iron oxide (rust) on its surface and has evidence of ancient water.",
  },
  {
    question: "Which planet has the most spectacular ring system?",
    options: ["Jupiter", "Uranus", "Neptune", "Saturn"],
    correctAnswer: "Saturn",
    explanation: "Saturn's rings are made of ice and rock particles and are the most visible from Earth.",
  },
  {
    question: "Which planet rotates on its side?",
    options: ["Neptune", "Uranus", "Saturn", "Jupiter"],
    correctAnswer: "Uranus",
    explanation: "Uranus has an extreme axial tilt of 98 degrees, making it rotate on its side!",
  },
  {
    question: "Which planet is the hottest?",
    options: ["Mercury", "Venus", "Mars", "Jupiter"],
    correctAnswer: "Venus",
    explanation:
      "Despite being farther from the Sun than Mercury, Venus is hottest at 462°C due to its thick atmosphere.",
  },
  {
    question: "Which planet has the fastest winds?",
    options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
    correctAnswer: "Neptune",
    explanation: "Neptune has supersonic winds reaching speeds of up to 2,100 km/h!",
  },
  {
    question: "Which planet has the shortest day?",
    options: ["Mars", "Earth", "Jupiter", "Saturn"],
    correctAnswer: "Jupiter",
    explanation: "Jupiter rotates once every 9.9 hours, making it the fastest spinning planet in our solar system!",
  },
  {
    question: "Which planet is the densest?",
    options: ["Earth", "Mercury", "Venus", "Mars"],
    correctAnswer: "Earth",
    explanation:
      "Earth has the highest density of all planets at 5.52 g/cm³, due to its iron core and rocky composition.",
  },
]

export function PlanetQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [quizComplete, setQuizComplete] = useState(false)

  const question = quizQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return
    setSelectedAnswer(answer)
  }

  const handleSubmit = () => {
    if (!selectedAnswer) return

    setShowResult(true)
    if (selectedAnswer === question.correctAnswer) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setQuizComplete(true)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setQuizComplete(false)
  }

  if (quizComplete) {
    const percentage = Math.round((score / quizQuestions.length) * 100)
    return (
      <Card className="bg-background/80 backdrop-blur-xl border-primary/20">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Trophy className="h-12 w-12 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
          <CardDescription className="text-lg">
            You scored {score} out of {quizQuestions.length}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-6xl font-bold text-primary mb-2">{percentage}%</div>
            <p className="text-muted-foreground">
              {percentage >= 80
                ? "Excellent! You're a space expert!"
                : percentage >= 60
                  ? "Great job! Keep learning!"
                  : "Good effort! Try again to improve!"}
            </p>
          </div>
          <Button onClick={handleRestart} className="w-full" size="lg">
            <RotateCcw className="mr-2 h-4 w-4" />
            Take Quiz Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-background/80 backdrop-blur-xl border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardDescription>
            Question {currentQuestion + 1} of {quizQuestions.length}
          </CardDescription>
          <CardDescription>Score: {score}</CardDescription>
        </div>
        <Progress value={progress} className="mb-4" />
        <CardTitle className="text-2xl text-balance">{question.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {question.options.map((option) => {
            const isSelected = selectedAnswer === option
            const isCorrect = option === question.correctAnswer
            const showCorrect = showResult && isCorrect
            const showIncorrect = showResult && isSelected && !isCorrect

            return (
              <button
                key={option}
                onClick={() => handleAnswerSelect(option)}
                disabled={showResult}
                className={`
                  p-4 rounded-lg border-2 text-left transition-all
                  ${isSelected && !showResult ? "border-primary bg-primary/10" : "border-border"}
                  ${showCorrect ? "border-green-500 bg-green-500/10" : ""}
                  ${showIncorrect ? "border-red-500 bg-red-500/10" : ""}
                  ${!showResult ? "hover:border-primary/50 cursor-pointer" : "cursor-default"}
                  disabled:opacity-100
                `}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option}</span>
                  {showCorrect && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                  {showIncorrect && <XCircle className="h-5 w-5 text-red-500" />}
                </div>
              </button>
            )
          })}
        </div>

        {showResult && (
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground">{question.explanation}</p>
          </div>
        )}

        <div className="flex gap-3">
          {!showResult ? (
            <Button onClick={handleSubmit} disabled={!selectedAnswer} className="w-full" size="lg">
              Submit Answer
            </Button>
          ) : (
            <Button onClick={handleNext} className="w-full" size="lg">
              {currentQuestion < quizQuestions.length - 1 ? "Next Question" : "View Results"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
