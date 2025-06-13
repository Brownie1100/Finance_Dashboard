"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface MonthSelectionContextType {
  selectedMonth: string
  setSelectedMonth: (month: string) => void
  comparisonMonth: string
  setComparisonMonth: (month: string) => void
}

// Define getCurrentMonth function directly in this file to avoid import issues
function getCurrentMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
}

const MonthSelectionContext = createContext<MonthSelectionContextType | undefined>(undefined)

export function MonthSelectionProvider({ children }: { children: ReactNode }) {
  // Initialize with current month or from localStorage if available
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("finance-selected-month") || getCurrentMonth()
    }
    return getCurrentMonth()
  })

  const [comparisonMonth, setComparisonMonth] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const current = new Date()
      current.setMonth(current.getMonth() - 1)
      const defaultComparison = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}`
      return localStorage.getItem("finance-comparison-month") || defaultComparison
    }
    const current = new Date()
    current.setMonth(current.getMonth() - 1)
    return `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}`
  })

  // Update localStorage when values change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("finance-selected-month", selectedMonth)
    }
  }, [selectedMonth])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("finance-comparison-month", comparisonMonth)
    }
  }, [comparisonMonth])

  return (
    <MonthSelectionContext.Provider
      value={{
        selectedMonth,
        setSelectedMonth,
        comparisonMonth,
        setComparisonMonth,
      }}
    >
      {children}
    </MonthSelectionContext.Provider>
  )
}

export function useMonthSelection() {
  const context = useContext(MonthSelectionContext)
  if (context === undefined) {
    throw new Error("useMonthSelection must be used within a MonthSelectionProvider")
  }
  return context
}
