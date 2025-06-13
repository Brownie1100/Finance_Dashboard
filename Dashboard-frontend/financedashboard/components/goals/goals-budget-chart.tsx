"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface Goal {
  id: number
  userId: number
  category: string
  type: "Savings" | "Budget"
  amount: number
  startDate: string
  endDate: string
  description?: string
}

interface Expense {
  id: number
  category: string
  amount: number
  date: string
  description?: string
}

interface GoalsBudgetChartProps {
  goals: Goal[]
  expenses: Expense[]
}

export function GoalsBudgetChart({ goals, expenses }: GoalsBudgetChartProps) {
  // Calculate spent amount for each category
  const getSpentAmount = (category: string) => {
    return expenses.filter((expense) => expense.category === category).reduce((sum, expense) => sum + expense.amount, 0)
  }

  // Prepare data for chart
  const chartData = goals.map((goal) => ({
    category: goal.category,
    budget: goal.amount,
    spent: getSpentAmount(goal.category),
  }))

  return (
    <ChartContainer
      config={{
        budget: {
          label: "Budget",
          color: "hsl(220, 100%, 50%)",
        },
        spent: {
          label: "Spent",
          color: "hsl(140, 100%, 40%)",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barGap={0} barCategoryGap={30}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="category" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend verticalAlign="top" height={36} />
          <Bar dataKey="budget" fill="var(--color-budget)" name="Budget" radius={[4, 4, 0, 0]} />
          <Bar dataKey="spent" fill="var(--color-spent)" name="Spent" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
