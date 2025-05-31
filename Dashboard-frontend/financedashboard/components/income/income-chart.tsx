"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useCurrency } from "@/hooks/use-currency"
import { safeReduce, ensureArray } from "@/lib/array-utils"

interface Income {
  id: number
  category: string
  amount: number
  date: string
  description?: string
}

interface IncomeChartProps {
  incomes: Income[]
}

export function IncomeChart({ incomes }: IncomeChartProps) {
  const { formatAmount } = useCurrency()

  // Ensure we have an array and group incomes by month using safe reduce
  const incomeArray = ensureArray(incomes)
  const monthlyData = safeReduce(
    incomeArray,
    (acc: Record<string, number>, income) => {
      const date = new Date(income.date)
      const monthKey = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
      acc[monthKey] = (acc[monthKey] || 0) + income.amount
      return acc
    },
    {},
  )

  // Convert to chart data format
  const chartData = Object.entries(monthlyData)
    .map(([month, amount]) => ({
      month,
      income: amount,
    }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())

  // If no data, show empty chart
  if (chartData.length === 0) {
    chartData.push({ month: "No Data", income: 0 })
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-green-200 rounded-lg shadow-lg">
          <p className="text-green-800 font-medium">{label}</p>
          <p className="text-green-600">Income: {formatAmount(payload[0].value)}</p>
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
        <Line type="monotone" dataKey="income" stroke="#16a34a" strokeWidth={2} activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
