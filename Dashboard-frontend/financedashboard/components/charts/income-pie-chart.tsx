"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { useCurrency } from "@/hooks/use-currency"

interface Income {
  id: number
  category: string
  amount: number
  date: string
  description?: string
}

interface IncomePieChartProps {
  incomes: Income[]
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

export function IncomePieChart({ incomes }: IncomePieChartProps) {
  const { formatAmount } = useCurrency()

  // Check if incomes is undefined or empty
  if (!incomes || incomes.length === 0) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <p className="text-muted-foreground">No income data available</p>
      </div>
    )
  }

  // Group incomes by category
  const incomesByCategory = incomes.reduce((acc: Record<string, number>, income) => {
    acc[income.category] = (acc[income.category] || 0) + income.amount
    return acc
  }, {})

  // Convert to array for chart
  const totalAmount = Object.values(incomesByCategory).reduce((sum, amount) => sum + amount, 0)
  const chartData = Object.entries(incomesByCategory)
    .map(([category, amount]) => ({
      category: category.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      amount,
      percentage: totalAmount > 0 ? Number(((amount / totalAmount) * 100).toFixed(2)) : 0,
    }))
    .filter((item) => item.amount > 0) // Filter out zero amounts

  // Sort by amount descending
  chartData.sort((a, b) => b.amount - a.amount)

  // Colors for the pie chart
  const COLORS = ["#4CAF50", "#8BC34A", "#CDDC39", "#FFC107", "#FF9800", "#FF5722", "#795548", "#607D8B"]

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-green-50 border border-green-200 p-3 rounded-lg shadow-lg dark:bg-green-900 dark:border-green-700">
          <p className="font-semibold text-green-800 dark:text-green-200">{data.category}</p>
          <p className="text-green-700 dark:text-green-300">{formatAmount(data.amount)}</p>
          <p className="text-green-600 text-sm dark:text-green-400">{data.percentage}% of total</p>
        </div>
      )
    }
    return null
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
            className="flex items-center gap-3 p-3 rounded-lg bg-green-50/80 dark:bg-green-900/30 border border-green-200/50 dark:border-green-700/50"
          >
            <div
              className="w-4 h-4 rounded-full flex-shrink-0 border border-white/20"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-green-900 dark:text-green-100 truncate">{entry.category}</p>
              <p className="text-xs text-green-700 dark:text-green-300 font-medium">
                {formatAmount(entry.amount)} ({entry.percentage}%)
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
