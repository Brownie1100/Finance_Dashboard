"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Currency = "INR" | "PHP"

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  formatAmount: (amount: number) => string
  getCurrencySymbol: () => string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

const currencyConfig = {
  INR: { symbol: "₹", locale: "en-IN" },
  PHP: { symbol: "₱", locale: "en-PH" },
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("INR")

  const formatAmount = (amount: number) => {
    const config = currencyConfig[currency]
    return `${config.symbol}${amount.toLocaleString(config.locale)}`
  }

  const getCurrencySymbol = () => {
    return currencyConfig[currency].symbol
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatAmount, getCurrencySymbol }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}
