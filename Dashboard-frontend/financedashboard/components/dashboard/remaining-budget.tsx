"use client"

import { AlertCircle, CheckCircle } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { useCurrency } from "@/hooks/use-currency"

interface RemainingBudgetProps {
  monthlySavings: number
}

export function RemainingBudget({ monthlySavings }: RemainingBudgetProps) {
  const { formatAmount } = useCurrency()

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Available Savings</span>
          <span className={`text-sm font-medium ${monthlySavings >= 0 ? "text-green-600" : "text-red-600"}`}>
            {formatAmount(monthlySavings)}
          </span>
        </div>

        <div className="border-t pt-2">
          <div className="flex items-center justify-between font-medium">
            <span className="text-sm">Available for New Goals</span>
            <span className={`text-sm ${monthlySavings >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatAmount(monthlySavings)}
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
      ) : (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>You have {formatAmount(monthlySavings)} available for new savings goals.</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
