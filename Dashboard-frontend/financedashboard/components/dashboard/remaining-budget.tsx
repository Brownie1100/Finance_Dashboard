"use client"

import { AlertCircle, CheckCircle, PiggyBank } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { useCurrency } from "@/hooks/use-currency"

interface RemainingBudgetProps {
  monthlySavings: number
}

// Mock existing savings goals
const existingSavingsGoals = [
  { name: "Emergency Fund", monthlyContribution: 500 },
  { name: "Vacation", monthlyContribution: 250 },
  { name: "New Car", monthlyContribution: 375 },
]

export function RemainingBudget({ monthlySavings }: RemainingBudgetProps) {
  const { formatAmount } = useCurrency()
  const totalExistingContributions = existingSavingsGoals.reduce((sum, goal) => sum + goal.monthlyContribution, 0)

  const remainingAmount = monthlySavings - totalExistingContributions

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Available Savings</span>
          <span className={`text-sm font-medium ${monthlySavings >= 0 ? "text-green-600" : "text-red-600"}`}>
            {formatAmount(monthlySavings)}
          </span>
        </div>

        <div className="space-y-2">
          <span className="text-xs text-muted-foreground">Current Goal Allocations:</span>
          {existingSavingsGoals.map((goal, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <PiggyBank className="h-3 w-3 text-muted-foreground" />
                <span>{goal.name}</span>
              </div>
              <span>-{formatAmount(goal.monthlyContribution)}</span>
            </div>
          ))}
        </div>

        <div className="border-t pt-2">
          <div className="flex items-center justify-between font-medium">
            <span className="text-sm">Available for New Goals</span>
            <span className={`text-sm ${remainingAmount >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatAmount(remainingAmount)}
            </span>
          </div>
        </div>
      </div>

      {monthlySavings <= 0 ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You currently have no available savings. Your expenses equal or exceed your income.
          </AlertDescription>
        </Alert>
      ) : remainingAmount >= 0 ? (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>You have {formatAmount(remainingAmount)} available for new savings goals.</AlertDescription>
        </Alert>
      ) : (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your current goals exceed your monthly savings by {formatAmount(Math.abs(remainingAmount))}.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
