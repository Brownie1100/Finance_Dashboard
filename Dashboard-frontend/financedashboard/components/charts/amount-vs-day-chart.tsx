"use client"

import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useCurrency } from "@/hooks/use-currency"

interface DataItem {
  id: number
  amount: number
  date: string
  [key: string]: any
}

interface AmountVsDayChartProps {
  data: DataItem[]
  color?: string
  type?: "income" | "expense"
}

interface DailyData {
  date: string
  formattedDate: string
  amount: number
}

export function AmountVsDayChart({ data = [], color = "#10b981", type = "income" }: AmountVsDayChartProps) {
  const { formatAmount } = useCurrency()

  // Process data to group by day
  const dailyData = useMemo(() => {
    if (!data || data.length === 0) return []

    const dailyMap = new Map<string, number>()

    // Group data by day
    data.forEach((item) => {
      const date = new Date(item.date)
      const dateStr = date.toISOString().split("T")[0] // YYYY-MM-DD
      const currentAmount = dailyMap.get(dateStr) || 0
      dailyMap.set(dateStr, currentAmount + item.amount)
    })

    // Convert to array and sort by date
    const result: DailyData[] = Array.from(dailyMap.entries()).map(([date, amount]) => {
      const d = new Date(date)
      const formattedDate = d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      })
      return { date, formattedDate, amount }
    })

    // Sort by date
    result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return result
  }, [data])

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`p-3 rounded-lg shadow-lg border ${type === "income" ? "bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-800" : "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-800"}`}
        >
          <p
            className={`font-semibold ${type === "income" ? "text-green-800 dark:text-green-200" : "text-yellow-800 dark:text-yellow-200"}`}
          >
            {payload[0].payload.formattedDate}
          </p>
          <p
            className={`${type === "income" ? "text-green-700 dark:text-green-300" : "text-yellow-700 dark:text-yellow-300"}`}
          >
            {formatAmount(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  if (!dailyData || dailyData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dailyData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis
            dataKey="formattedDate"
            angle={-45}
            textAnchor="end"
            tick={{ fontSize: 12 }}
            height={60}
            tickMargin={10}
          />
          <YAxis tickFormatter={(value) => formatAmount(value, { notation: "compact" })} width={80} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="amount" fill={color} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
