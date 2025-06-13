"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useCurrency } from "@/hooks/use-currency"
import { safeReduce, ensureArray } from "@/lib/array-utils"
import { ChartContainer } from "@/components/ui/chart"

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

interface IncomeExpenseBarChartProps {
  incomes: Income[]
  expenses: Expense[]
  selectedYear: number
}

export function IncomeExpenseBarChart({ incomes, expenses, selectedYear }: IncomeExpenseBarChartProps) {
  const { formatAmount } = useCurrency()

  const incomeArray = ensureArray(incomes)
  const expenseArray = ensureArray(expenses)

  // Filter data by selected year
  const filteredIncomes = incomeArray.filter((income) => {
    const date = new Date(income.date)
    return date.getFullYear() === selectedYear
  })

  const filteredExpenses = expenseArray.filter((expense) => {
    const date = new Date(expense.date)
    return date.getFullYear() === selectedYear
  })

  // Group income and expenses by month
  const monthlyIncome = safeReduce(
    filteredIncomes,
    (acc: Record<string, number>, income) => {
      const date = new Date(income.date)
      const monthKey = date.toLocaleDateString("en-US", { month: "short" })
      acc[monthKey] = (acc[monthKey] || 0) + income.amount
      return acc
    },
    {},
  )

  const monthlyExpenses = safeReduce(
    filteredExpenses,
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
    return {
      month,
      Income: income,
      Expenses: expenses,
    }
  })

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-green-600">Income: {formatAmount(payload[0]?.value || 0)}</p>
          <p className="text-red-600">Expenses: {formatAmount(payload[1]?.value || 0)}</p>
          <p className="text-blue-600 font-medium">
            Savings: {formatAmount((payload[0]?.value || 0) - (payload[1]?.value || 0))}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <ChartContainer
      config={{
        Income: {
          label: "Income",
          color: "hsl(var(--chart-1))",
        },
        Expenses: {
          label: "Expenses",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[400px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="Income" fill="var(--color-Income)" name="Income" />
          <Bar dataKey="Expenses" fill="var(--color-Expenses)" name="Expenses" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
