"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"
import { useCurrency } from "@/hooks/use-currency"
import { safeReduce, ensureArray } from "@/lib/array-utils"

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

interface IncomeExpenseLineChartProps {
  incomes: Income[]
  expenses: Expense[]
}

export function IncomeExpenseLineChart({ incomes, expenses }: IncomeExpenseLineChartProps) {
  const { formatAmount } = useCurrency()

  // Ensure we have arrays and group income and expenses by month
  const incomeArray = ensureArray(incomes)
  const expenseArray = ensureArray(expenses)

  const monthlyIncome = safeReduce(
    incomeArray,
    (acc: Record<string, number>, income) => {
      const date = new Date(income.date)
      const monthKey = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
      acc[monthKey] = (acc[monthKey] || 0) + income.amount
      return acc
    },
    {},
  )

  const monthlyExpenses = safeReduce(
    expenseArray,
    (acc: Record<string, number>, expense) => {
      const date = new Date(expense.date)
      const monthKey = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
      acc[monthKey] = (acc[monthKey] || 0) + expense.amount
      return acc
    },
    {},
  )

  // Get all unique months and create chart data
  const allMonths = new Set([...Object.keys(monthlyIncome), ...Object.keys(monthlyExpenses)])

  const data = Array.from(allMonths)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    .map((month) => ({
      name: month,
      Income: monthlyIncome[month] || 0,
      Expenses: monthlyExpenses[month] || 0,
    }))

  // If no data, show empty state
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-blue-600">Income: {formatAmount(payload[0]?.value || 0)}</p>
          <p className="text-red-600">Expenses: {formatAmount(payload[1]?.value || 0)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line type="monotone" dataKey="Income" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 6 }} dot={{ r: 4 }} />
        <Line type="monotone" dataKey="Expenses" stroke="#ef4444" strokeWidth={2} activeDot={{ r: 6 }} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
