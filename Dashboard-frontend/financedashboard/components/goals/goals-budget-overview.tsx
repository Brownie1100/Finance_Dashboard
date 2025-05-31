"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCurrency } from "@/hooks/use-currency"
import { safeReduce } from "@/lib/array-utils"

interface Goal {
  id: number
  userId: number
  category: string
  type: "Savings" | "Budget"
  amount: number
  startDate: string
  endDate: string
  description?: string
}

interface GoalsBudgetOverviewProps {
  goals: Goal[]
}

export function GoalsBudgetOverview({ goals }: GoalsBudgetOverviewProps) {
  const { formatAmount } = useCurrency()

  // Calculate total budget
  const totalBudget = safeReduce(goals, (sum, goal) => sum + goal.amount, 0)

  // Calculate days remaining in current month
  const today = new Date()
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const daysRemaining = lastDayOfMonth - today.getDate()

  // Assume 50% spent for now (would be calculated from actual expenses in a real app)
  const spentSoFar = totalBudget * 0.5
  const remaining = totalBudget - spentSoFar
  const percentSpent = totalBudget > 0 ? (spentSoFar / totalBudget) * 100 : 0
  const dailyBudget = remaining > 0 && daysRemaining > 0 ? remaining / daysRemaining : 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-200">Total Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300 truncate">
            {formatAmount(totalBudget)}
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400">Monthly allocation</p>
        </CardContent>
      </Card>
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-200">Spent So Far</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300 truncate">{formatAmount(spentSoFar)}</div>
          <p className="text-xs text-blue-600 dark:text-blue-400">{percentSpent.toFixed(1)}% of budget</p>
        </CardContent>
      </Card>
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-200">Remaining</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300 truncate">{formatAmount(remaining)}</div>
          <p className="text-xs text-blue-600 dark:text-blue-400">{(100 - percentSpent).toFixed(1)}% of budget</p>
        </CardContent>
      </Card>
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-200">Days Remaining</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300 truncate">{daysRemaining}</div>
          <p className="text-xs text-blue-600 dark:text-blue-400">{formatAmount(dailyBudget)} per day</p>
        </CardContent>
      </Card>
    </div>
  )
}
