"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useCurrency } from "@/hooks/use-currency"
import { safeReduce, ensureArray } from "@/lib/array-utils"

interface Expense {
  id: number
  category: string
  amount: number
  date: string
  description?: string
}

interface ExpenseChartProps {
  expenses: Expense[]
}

export function ExpenseChart({ expenses }: ExpenseChartProps) {
  const { formatAmount } = useCurrency()

  // Ensure we have an array and group expenses by month using safe reduce
  const expenseArray = ensureArray(expenses)
  const monthlyData = safeReduce(
    expenseArray,
    (acc: Record<string, number>, expense) => {
      const date = new Date(expense.date)
      const monthKey = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
      acc[monthKey] = (acc[monthKey] || 0) + expense.amount
      return acc
    },
    {},
  )

  // Convert to chart data format
  const chartData = Object.entries(monthlyData)
    .map(([month, amount]) => ({
      month,
      expenses: amount,
    }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())

  // If no data, show empty chart
  if (chartData.length === 0) {
    chartData.push({ month: "No Data", expenses: 0 })
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-yellow-200 rounded-lg shadow-lg">
          <p className="text-yellow-800 font-medium">{label}</p>
          <p className="text-yellow-600">Expenses: {formatAmount(payload[0].value)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={chartData}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey="expenses" stroke="#ca8a04" strokeWidth={2} activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
