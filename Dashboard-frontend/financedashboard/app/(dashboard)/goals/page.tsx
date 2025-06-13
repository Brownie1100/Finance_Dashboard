"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GoalsBudgetOverview } from "@/components/goals/goals-budget-overview"
import { GoalsBudgetChart } from "@/components/goals/goals-budget-chart"
import { GoalsBudgetTable } from "@/components/goals/goals-budget-table"
import { GoalsBudgetForm } from "@/components/goals/goals-budget-form"
import { GoalsSavingsForm } from "@/components/goals/goals-savings-form"
import { GoalsSavingsList } from "@/components/goals/goals-savings-list"
import { GoalsTable } from "@/components/goals/goals-table"
import { useCurrency } from "@/hooks/use-currency"
import { useUser } from "@/hooks/use-user"
import { safeReduce, ensureArray } from "@/lib/array-utils"
import { fetchSavingsGoals, fetchExpenses, fetchIncomes } from "@/lib/api"

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

interface Income {
  id: number
  category: string
  amount: number
  date: string
  description?: string
}

export default function GoalsPage() {
  const { formatAmount } = useCurrency()
  const { userId } = useUser()
  const [goals, setGoals] = useState<Goal[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [incomes, setIncomes] = useState<Income[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  const fetchAllData = async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)

      // Fetch all data in parallel
      const [goalsData, expensesData, incomesData] = await Promise.all([
        fetchSavingsGoals(userId),
        fetchExpenses(userId),
        fetchIncomes(userId),
      ])

      setGoals(ensureArray(goalsData) as Goal[])
      setExpenses(ensureArray(expensesData) as Expense[])
      setIncomes(ensureArray(incomesData) as Income[])
    } catch (error) {
      console.error("Error fetching data:", error)
      setGoals([])
      setExpenses([])
      setIncomes([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [userId])

  const handleRefresh = () => {
    fetchAllData()
  }

  // Separate budget and savings goals
  const budgetGoals = goals.filter((goal) => goal.type === "Budget")
  const savingsGoals = goals.filter((goal) => goal.type === "Savings")

  // Calculate available savings (income - expenses)
  const totalIncome = safeReduce(incomes, (sum, income) => sum + income.amount, 0)
  const totalExpenses = safeReduce(expenses, (sum, expense) => sum + expense.amount, 0)
  const availableSavings = totalIncome - totalExpenses

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">Loading...</div>
          <p className="text-muted-foreground">Fetching your goals data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 bg-blue-50/30 dark:bg-blue-950/10">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-blue-700 dark:text-blue-400">Goals</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-blue-100/50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Overview
          </TabsTrigger>
          <TabsTrigger value="budget" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Budget Goals
          </TabsTrigger>
          <TabsTrigger value="savings" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Savings Goals
          </TabsTrigger>
          <TabsTrigger value="manage" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Manage Goals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <GoalsBudgetOverview goals={budgetGoals} />

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="text-blue-800 dark:text-blue-200">Budget vs Spending</CardTitle>
                <CardDescription className="text-blue-600 dark:text-blue-400">
                  Compare your budget goals with actual spending
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GoalsBudgetChart goals={budgetGoals} expenses={expenses} />
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="text-blue-800 dark:text-blue-200">Savings Goals Progress</CardTitle>
                <CardDescription className="text-blue-600 dark:text-blue-400">
                  Track your savings goals progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GoalsSavingsList goals={savingsGoals} availableSavings={availableSavings} onRefresh={handleRefresh} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="text-blue-800 dark:text-blue-200">Create Budget Goal</CardTitle>
                <CardDescription className="text-blue-600 dark:text-blue-400">
                  Set monthly budget limits for different categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GoalsBudgetForm onSuccess={handleRefresh} />
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="text-blue-800 dark:text-blue-200">Budget Overview</CardTitle>
                <CardDescription className="text-blue-600 dark:text-blue-400">
                  Current month budget allocation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                      {formatAmount(safeReduce(budgetGoals, (sum, goal) => sum + goal.amount, 0))}
                    </div>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Total Monthly Budget</p>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-medium text-blue-700 dark:text-blue-300">{budgetGoals.length}</div>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Active Budget Goals</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-blue-800 dark:text-blue-200">Budget Goals</CardTitle>
              <CardDescription className="text-blue-600 dark:text-blue-400">
                Manage your monthly budget allocations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GoalsBudgetTable goals={budgetGoals} expenses={expenses} onRefresh={handleRefresh} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="savings" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="text-blue-800 dark:text-blue-200">Create Savings Goal</CardTitle>
                <CardDescription className="text-blue-600 dark:text-blue-400">
                  Set long-term savings targets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GoalsSavingsForm availableSavings={availableSavings} onSuccess={handleRefresh} />
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="text-blue-800 dark:text-blue-200">Savings Overview</CardTitle>
                <CardDescription className="text-blue-600 dark:text-blue-400">
                  Your savings capacity and goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${availableSavings >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {formatAmount(Math.abs(availableSavings))}
                    </div>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      {availableSavings >= 0 ? "Available for Savings" : "Monthly Deficit"}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-medium text-blue-700 dark:text-blue-300">{savingsGoals.length}</div>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Active Savings Goals</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-blue-800 dark:text-blue-200">Savings Goals</CardTitle>
              <CardDescription className="text-blue-600 dark:text-blue-400">
                Track your long-term savings progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GoalsSavingsList
                goals={savingsGoals}
                availableSavings={availableSavings}
                showActions={true}
                onRefresh={handleRefresh}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-4">
          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-blue-800 dark:text-blue-200">All Goals</CardTitle>
              <CardDescription className="text-blue-600 dark:text-blue-400">
                Manage all your financial goals in one place
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GoalsTable goals={goals} onRefresh={handleRefresh} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
