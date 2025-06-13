"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useCurrency } from "@/hooks/use-currency"
import { safeReduce } from "@/lib/array-utils"

interface Income {
  id: number
  category: string
  amount: number
  date: string
  description?: string
}

interface IncomeComparisonChartProps {
  currentIncome: Income[]
  comparisonIncome: Income[]
  currentLabel?: string
  comparisonLabel?: string
}

export function IncomeComparisonChart({
  currentIncome,
  comparisonIncome,
  currentLabel = "Current income",
  comparisonLabel = "Comparison income",
}: IncomeComparisonChartProps) {
  const { formatAmount } = useCurrency()

  // Group income by source
  const currentIncomeBySource = safeReduce(
    currentIncome,
    (acc: Record<string, number>, income) => {
      acc[income.category] = (acc[income.category] || 0) + income.amount
      return acc
    },
    {},
  )

  const comparisonIncomeBySource = safeReduce(
    comparisonIncome,
    (acc: Record<string, number>, income) => {
      acc[income.category] = (acc[income.category] || 0) + income.amount
      return acc
    },
    {},
  )

  // Combine all sources
  const allSources = Array.from(
    new Set([...Object.keys(currentIncomeBySource), ...Object.keys(comparisonIncomeBySource)]),
  )

  // Create chart data
  const chartData = allSources.map((source) => ({
    source: source.charAt(0).toUpperCase() + source.slice(1),
    originalSource: source,
    current: currentIncomeBySource[source] || 0,
    comparison: comparisonIncomeBySource[source] || 0,
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const sourceData = chartData.find((item) => item.source === label)
      return (
        <div className="bg-green-50 border border-green-200 p-3 rounded-lg shadow-lg">
          <p className="font-semibold text-green-800">Source: {sourceData?.originalSource}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="text-green-700">
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
        <XAxis dataKey="source" tick={false} axisLine={false} />
        <YAxis tickFormatter={(value) => formatAmount(value)} />
        <Tooltip content={<CustomTooltip />} />
        <Legend payload={[{ value: "Sources", type: "line", color: "#8884d8" }]} />
        <Bar name={currentLabel} dataKey="current" fill="#10b981" />
        <Bar name={comparisonLabel} dataKey="comparison" fill="#f59e0b" />
      </BarChart>
    </ResponsiveContainer>
  )
}
