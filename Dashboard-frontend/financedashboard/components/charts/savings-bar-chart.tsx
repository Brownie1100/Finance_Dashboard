"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
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

interface SavingsBarChartProps {
  incomes: Income[]
  expenses: Expense[]
}

export function SavingsBarChart({ incomes, expenses }: SavingsBarChartProps) {
  const { formatAmount } = useCurrency()

  const incomeArray = ensureArray(incomes)
  const expenseArray = ensureArray(expenses)

  // Group income and expenses by month
  const monthlyIncome = safeReduce(
    incomeArray,
    (acc: Record<string, number>, income) => {
      const date = new Date(income.date)
      const monthKey = date.toLocaleDateString("en-US", { month: "short" })
      acc[monthKey] = (acc[monthKey] || 0) + income.amount
      return acc
    },
    {},
  )

  const monthlyExpenses = safeReduce(
    expenseArray,
    (acc: Record<string, number>, expense) => {
      const date = new Date(expense.date)
      const monthKey = date.toLocaleDateString("en-US", { month: "short" })
      acc[monthKey] = (acc[monthKey] || 0) + expense.amount
      return acc
    },
    {},
  )

  // Create data for all 12 months
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const chartData = months.map((month) => {
    const income = monthlyIncome[month] || 0
    const expenses = monthlyExpenses[month] || 0
    const savings = income - expenses
    return {
      month,
      Savings: Math.max(0, savings), // Only show positive savings
    }
  })

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-blue-600">Savings: {formatAmount(payload[0]?.value || 0)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="Savings" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  )
}
