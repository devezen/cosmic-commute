"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem("cosmic_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Get existing users
      const usersData = localStorage.getItem("cosmic_users")
      const users = usersData ? JSON.parse(usersData) : []

      // Check if user already exists
      if (users.find((u: any) => u.email === email)) {
        return false
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password, // In production, this should be hashed
      }

      // Save to users list
      users.push(newUser)
      localStorage.setItem("cosmic_users", JSON.stringify(users))

      // Set as current user
      const userWithoutPassword = { id: newUser.id, name: newUser.name, email: newUser.email }
      setUser(userWithoutPassword)
      localStorage.setItem("cosmic_user", JSON.stringify(userWithoutPassword))

      return true
    } catch (error) {
      console.error("Signup error:", error)
      return false
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Get existing users
      const usersData = localStorage.getItem("cosmic_users")
      const users = usersData ? JSON.parse(usersData) : []

      // Find user
      const foundUser = users.find((u: any) => u.email === email && u.password === password)

      if (!foundUser) {
        return false
      }

      // Set as current user
      const userWithoutPassword = { id: foundUser.id, name: foundUser.name, email: foundUser.email }
      setUser(userWithoutPassword)
      localStorage.setItem("cosmic_user", JSON.stringify(userWithoutPassword))

      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("cosmic_user")
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
