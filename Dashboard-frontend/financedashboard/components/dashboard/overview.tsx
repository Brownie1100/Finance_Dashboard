"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useCurrency } from "@/hooks/use-currency"
import { safeReduce } from "@/lib/array-utils"

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

interface OverviewProps {
  incomes: Income[]
  expenses: Expense[]
}

export function Overview({ incomes, expenses }: OverviewProps) {
  const { formatAmount } = useCurrency()

  // Group income and expenses by month
  const monthlyIncome = safeReduce(
    incomes,
    (acc: Record<string, number>, income) => {
      const date = new Date(income.date)
      const monthKey = date.toLocaleDateString("en-US", { month: "short" })
      acc[monthKey] = (acc[monthKey] || 0) + income.amount
      return acc
    },
    {},
  )

  const monthlyExpenses = safeReduce(
    expenses,
    (acc: Record<string, number>, expense) => {
      const date = new Date(expense.date)
      const monthKey = date.toLocaleDateString("en-US", { month: "short" })
      acc[monthKey] = (acc[monthKey] || 0) + expense.amount
      return acc
    },
    {},
  )

  // Get all unique months and create chart data
  const allMonths = new Set([...Object.keys(monthlyIncome), ...Object.keys(monthlyExpenses)])

  const data = Array.from(allMonths).map((month) => ({
    name: month,
    income: monthlyIncome[month] || 0,
    expenses: monthlyExpenses[month] || 0,
  }))

  // If no data, show empty state
  if (data.length === 0) {
    data.push({ name: "No Data", income: 0, expenses: 0 })
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-green-600">Income: {formatAmount(payload[0]?.value || 0)}</p>
          <p className="text-red-600">Expenses: {formatAmount(payload[1]?.value || 0)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="income" fill="#10b981" name="Income" />
        <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
      </BarChart>
    </ResponsiveContainer>
  )
}
