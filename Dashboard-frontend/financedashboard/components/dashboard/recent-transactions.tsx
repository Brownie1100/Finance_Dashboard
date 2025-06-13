"use client"

import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { useCurrency } from "@/hooks/use-currency"
import { ensureArray } from "@/lib/array-utils"

interface Income {
  id: number
  category: string
  amount: number
  date: string
  description?: string
}

interface Expense {
  id: number
  category: string
  amount: number
  date: string
  description?: string
}

interface Transaction {
  id: string
  description: string
  amount: number
  date: string
  type: "income" | "expense"
  category: string
}

interface RecentTransactionsProps {
  incomes: Income[]
  expenses: Expense[]
}

export function RecentTransactions({ incomes, expenses }: RecentTransactionsProps) {
  const { formatAmount } = useCurrency()

  // Ensure we have arrays
  const incomeArray = ensureArray(incomes)
  const expenseArray = ensureArray(expenses)

  // Convert to unified transaction format
  const incomeTransactions: Transaction[] = incomeArray.map((income) => ({
    id: `income-${income.id}`,
    description: income.description || `${income.category} income`,
    amount: income.amount,
    date: income.date,
    type: "income" as const,
    category: income.category,
  }))

  const expenseTransactions: Transaction[] = expenseArray.map((expense) => ({
    id: `expense-${expense.id}`,
    description: expense.description || `${expense.category} expense`,
    amount: expense.amount,
    date: expense.date,
    type: "expense" as const,
    category: expense.category,
  }))

  // Combine and sort by date (most recent first)
  const allTransactions = [...incomeTransactions, ...expenseTransactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5) // Show only 5 most recent

  if (allTransactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">No transactions available</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {allTransactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center gap-4">
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full",
              transaction.type === "income"
                ? "bg-emerald-100 dark:bg-emerald-900/20"
                : "bg-rose-100 dark:bg-rose-900/20",
            )}
          >
            {transaction.type === "income" ? (
              <ArrowUpIcon className="h-5 w-5 text-emerald-500" />
            ) : (
              <ArrowDownIcon className="h-5 w-5 text-rose-500" />
            )}
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{transaction.description}</p>
            <p className="text-xs text-muted-foreground">
              {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
            </p>
          </div>
          <div
            className={cn("text-sm font-medium", transaction.type === "income" ? "text-emerald-500" : "text-rose-500")}
          >
            {transaction.type === "income" ? "+" : "-"}
            {formatAmount(transaction.amount)}
          </div>
        </div>
      ))}
    </div>
  )
}
