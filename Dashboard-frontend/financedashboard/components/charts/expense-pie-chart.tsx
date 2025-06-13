"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { useCurrency } from "@/hooks/use-currency"

interface Expense {
  id: number
  category: string
  amount: number
  date: string
  description?: string
}

interface ExpensePieChartProps {
  expenses: Expense[]
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    payload: {
      category: string
      amount: number
      percentage: number
    }
  }>
}

export function ExpensePieChart({ expenses = [] }: ExpensePieChartProps) {
  const { formatAmount } = useCurrency()

  // Check if expenses is undefined or empty
  if (!expenses || expenses.length === 0) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <p className="text-muted-foreground">No expense data available</p>
      </div>
    )
  }

  // Group expenses by category
  const expensesByCategory = expenses.reduce((acc: Record<string, number>, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {})

  // Convert to array for chart
  const totalAmount = Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0)
  const chartData = Object.entries(expensesByCategory)
    .map(([category, amount]) => ({
      category: category.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      amount,
      percentage: totalAmount > 0 ? Number(((amount / totalAmount) * 100).toFixed(2)) : 0,
    }))
    .filter((item) => item.amount > 0) // Filter out zero amounts

  // Sort by amount descending
  chartData.sort((a, b) => b.amount - a.amount)

  // Colors for the pie chart
  const COLORS = ["#FF8042", "#FFBB28", "#00C49F", "#0088FE", "#8884D8", "#82CA9D", "#FF6B6B", "#6A7FDB"]

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg shadow-lg dark:bg-yellow-900 dark:border-yellow-700">
          <p className="font-semibold text-yellow-800 dark:text-yellow-200">{data.category}</p>
          <p className="text-yellow-700 dark:text-yellow-300">{formatAmount(data.amount)}</p>
          <p className="text-yellow-600 text-sm dark:text-yellow-400">{data.percentage}% of total</p>
        </div>
      )
    }
    return null
  }

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <p className="text-muted-foreground">No expense data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Pie Chart */}
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={140}
              fill="#8884d8"
              dataKey="amount"
              nameKey="category"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend Below Chart */}
      <div className="grid grid-cols-2 gap-3 px-4">
        {chartData.map((entry, index) => (
          <div
            key={entry.category}
            className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50/80 dark:bg-yellow-900/30 border border-yellow-200/50 dark:border-yellow-700/50"
          >
            <div
              className="w-4 h-4 rounded-full flex-shrink-0 border border-white/20"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 truncate">{entry.category}</p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 font-medium">
                {formatAmount(entry.amount)} ({entry.percentage}%)
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
