"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useCurrency } from "@/hooks/use-currency"
import { safeReduce } from "@/lib/array-utils"

interface Expense {
  id: number
  category: string
  amount: number
  date: string
  description?: string
}

interface ExpenseComparisonChartProps {
  currentExpenses: Expense[]
  comparisonExpenses: Expense[]
  currentLabel?: string
  comparisonLabel?: string
}

export function ExpenseComparisonChart({
  currentExpenses,
  comparisonExpenses,
  currentLabel = "Current expenses",
  comparisonLabel = "Comparison expenses",
}: ExpenseComparisonChartProps) {
  const { formatAmount } = useCurrency()

  // Group expenses by category
  const currentExpensesByCategory = safeReduce(
    currentExpenses,
    (acc: Record<string, number>, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    },
    {},
  )

  const comparisonExpensesByCategory = safeReduce(
    comparisonExpenses,
    (acc: Record<string, number>, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    },
    {},
  )

  // Combine all categories
  const allCategories = Array.from(
    new Set([...Object.keys(currentExpensesByCategory), ...Object.keys(comparisonExpensesByCategory)]),
  )

  // Create chart data
  const chartData = allCategories.map((category) => ({
    category: category.charAt(0).toUpperCase() + category.slice(1),
    originalCategory: category,
    current: currentExpensesByCategory[category] || 0,
    comparison: comparisonExpensesByCategory[category] || 0,
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const categoryData = chartData.find((item) => item.category === label)
      return (
        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg shadow-lg">
          <p className="font-semibold text-yellow-800">Category: {categoryData?.originalCategory}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="text-yellow-700">
              {entry.name === "current" ? currentLabel : comparisonLabel}: {formatAmount(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No data available for comparison</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" tick={false} axisLine={false} />
        <YAxis tickFormatter={(value) => formatAmount(value)} />
        <Tooltip content={<CustomTooltip />} />
        <Legend payload={[{ value: "Categories", type: "line", color: "#8884d8" }]} />
        <Bar name={currentLabel} dataKey="current" fill="#3b82f6" />
        <Bar name={comparisonLabel} dataKey="comparison" fill="#ef4444" />
      </BarChart>
    </ResponsiveContainer>
  )
}
