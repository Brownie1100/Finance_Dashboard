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

interface Expense {
  id: number
  category: string
  amount: number
  date: string
  description?: string
}

interface SavingsChartProps {
  incomes: Income[]
  expenses: Expense[]
}

export function SavingsChart({ incomes, expenses }: SavingsChartProps) {
  const { formatAmount } = useCurrency()

  // Ensure we have arrays and group income and expenses by month using safe reduce
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

  // Get all unique months from both income and expenses
  const allMonths = new Set([...Object.keys(monthlyIncome), ...Object.keys(monthlyExpenses)])

  // Calculate savings for each month
  const chartData = Array.from(allMonths)
    .map((month) => {
      const income = monthlyIncome[month] || 0
      const expense = monthlyExpenses[month] || 0
      const savings = income - expense
      return {
        month,
        savings,
        income,
        expenses: expense,
      }
    })
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())

  // If no data, show empty chart
  if (chartData.length === 0) {
    chartData.push({ month: "No Data", savings: 0, income: 0, expenses: 0 })
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-red-200 rounded-lg shadow-lg">
          <p className="text-red-800 font-medium">{label}</p>
          <p className="text-green-600">Income: {formatAmount(data.income)}</p>
          <p className="text-yellow-600">Expenses: {formatAmount(data.expenses)}</p>
          <p className={`font-medium ${data.savings >= 0 ? "text-green-600" : "text-red-600"}`}>
            Savings: {formatAmount(data.savings)}
          </p>
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
        <Line
          type="monotone"
          dataKey="savings"
          stroke="#dc2626"
          strokeWidth={2}
          activeDot={{ r: 8 }}
          connectNulls={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
