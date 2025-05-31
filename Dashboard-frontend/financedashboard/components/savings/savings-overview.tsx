"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCurrency } from "@/hooks/use-currency"

interface SavingsOverviewProps {
  totalIncome: number
  totalExpenses: number
  totalSavings: number
}

export function SavingsOverview({ totalIncome, totalExpenses, totalSavings }: SavingsOverviewProps) {
  const { formatAmount } = useCurrency()

  // Calculate savings rate
  const savingsRate = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0

  // Calculate if savings are positive or negative
  const isPositiveSavings = totalSavings >= 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-red-800 dark:text-red-200">Total Income</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-700 dark:text-red-300">{formatAmount(totalIncome)}</div>
          <p className="text-xs text-red-600 dark:text-red-400">Current period</p>
        </CardContent>
      </Card>
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-red-800 dark:text-red-200">Total Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-700 dark:text-red-300">{formatAmount(totalExpenses)}</div>
          <p className="text-xs text-red-600 dark:text-red-400">Current period</p>
        </CardContent>
      </Card>
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-red-800 dark:text-red-200">
            {isPositiveSavings ? "Available Savings" : "Deficit"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${isPositiveSavings ? "text-green-600" : "text-red-600"}`}>
            {formatAmount(Math.abs(totalSavings))}
          </div>
          <p className="text-xs text-red-600 dark:text-red-400">
            {isPositiveSavings ? "Income - Expenses" : "Expenses exceed income"}
          </p>
        </CardContent>
      </Card>
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-red-800 dark:text-red-200">Savings Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${isPositiveSavings ? "text-green-600" : "text-red-600"}`}>
            {savingsRate.toFixed(1)}%
          </div>
          <p className="text-xs text-red-600 dark:text-red-400">
            {isPositiveSavings ? "Of total income" : "Overspending"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
