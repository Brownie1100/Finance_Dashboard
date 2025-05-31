"use client"
import { useEffect, useState } from "react"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GoalsSavingsForm } from "@/components/goals/goals-savings-form"
import { GoalsSavingsList } from "@/components/goals/goals-savings-list"
import { RemainingBudget } from "@/components/dashboard/remaining-budget"
import { GoalsBudgetOverview } from "@/components/goals/goals-budget-overview"
import { GoalsBudgetChart } from "@/components/goals/goals-budget-chart"
import { GoalsBudgetTable } from "@/components/goals/goals-budget-table"
import { GoalsBudgetForm } from "@/components/goals/goals-budget-form"
import { useUser } from "@/hooks/use-user"
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

export default function GoalsPage() {
  const { userId } = useUser()
  const [incomes, setIncomes] = useState<Income[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  const fetchFinancialData = async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)

      console.log(`http://localhost:8282/api/income/${userId}`);
      console.log(`http://localhost:8282/api/expense/${userId}`);
      console.log(`http://localhost:8282/api/goal/${userId}`);

      // Fetch income, expense, and goals data
      const [incomeResponse, expenseResponse, goalsResponse] = await Promise.all([
        fetch(`http://localhost:8282/api/income/${userId}`),
        fetch(`http://localhost:8282/api/expense/${userId}`),
        fetch(`http://localhost:8282/api/goal/${userId}`),
      ])

      if (incomeResponse.ok) {
        const incomeData = await incomeResponse.json()
        console.log('Income Response: '+JSON.stringify(ensureArray(incomeData)));
        setIncomes(ensureArray(incomeData))
      }

      if (expenseResponse.ok) {
        const expenseData = await expenseResponse.json()
        console.log('Expense Response: '+JSON.stringify(ensureArray(expenseData)));
        setExpenses(ensureArray(expenseData))
      }

      if (goalsResponse.ok) {
        const goalsData = await goalsResponse.json()
        console.log('Goals Response: '+JSON.stringify(ensureArray(goalsData)));
        const goalsArray = ensureArray(goalsData)

        // Check for expired goals and delete them
        const currentDate = new Date()
        const lastMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0)

        const expiredGoals = goalsArray.filter((goal) => {
          const endDate = new Date(goal.endDate)
          return endDate <= lastMonthEnd
        })

        // Delete expired goals
        await Promise.all(
          expiredGoals.map((goal) =>
            fetch(`http://localhost:8282/api/goal/${goal.id}`, {
              method: "DELETE",
            }),
          ),
        )

        // Filter out expired goals from the state
        const activeGoals = goalsArray.filter((goal) => {
          const endDate = new Date(goal.endDate)
          return endDate > lastMonthEnd
        })

        setGoals(activeGoals)
      }
    } catch (error) {
      console.error("Error fetching financial data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFinancialData()
  }, [userId])

  // Calculate totals using safe reduce
  const totalIncome = safeReduce(incomes, (sum, income) => sum + income.amount, 0)
  const totalExpenses = safeReduce(expenses, (sum, expense) => sum + expense.amount, 0)
  const totalSavings = totalIncome - totalExpenses

  // Filter goals by type
  const savingsGoals = goals.filter((goal) => goal.type === "Savings")
  const budgetGoals = goals.filter((goal) => goal.type === "Budget")

  return (
    <div className="flex-1 space-y-4 bg-blue-50/30 dark:bg-blue-950/10">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-blue-700 dark:text-blue-400">Goals</h2>
        <div className="flex gap-2">
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setActiveTab("add-savings")}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Savings Goal
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setActiveTab("add-budget")}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Budget Goal
          </Button>
        </div>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-blue-100/50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Overview
          </TabsTrigger>
          <TabsTrigger value="savings-goals" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Savings Goals
          </TabsTrigger>
          <TabsTrigger value="budget-goals" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Budget Goals
          </TabsTrigger>
          <TabsTrigger value="add-savings" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Add Savings Goal
          </TabsTrigger>
          <TabsTrigger value="add-budget" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Add Budget Goal
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="text-blue-800 dark:text-blue-200">Savings Goals Overview</CardTitle>
                <CardDescription className="text-blue-600 dark:text-blue-400">
                  Track your progress towards savings goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GoalsSavingsList availableSavings={totalSavings} goals={savingsGoals} onRefresh={fetchFinancialData} />
              </CardContent>
            </Card>
            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="text-blue-800 dark:text-blue-200">Budget Goals Overview</CardTitle>
                <CardDescription className="text-blue-600 dark:text-blue-400">
                  Monitor your budget allocations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GoalsBudgetOverview goals={budgetGoals} />
              </CardContent>
            </Card>
          </div>
          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-blue-800 dark:text-blue-200">Available for Goals</CardTitle>
              <CardDescription className="text-blue-600 dark:text-blue-400">
                Calculate available amount for new goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RemainingBudget monthlySavings={totalSavings} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="savings-goals" className="space-y-4">
          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-blue-800 dark:text-blue-200">All Savings Goals</CardTitle>
              <CardDescription className="text-blue-600 dark:text-blue-400">
                Manage and track all your savings goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GoalsSavingsList
                availableSavings={totalSavings}
                goals={savingsGoals}
                showActions={true}
                onRefresh={fetchFinancialData}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget-goals" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="text-blue-800 dark:text-blue-200">Budget vs. Actual</CardTitle>
                <CardDescription className="text-blue-600 dark:text-blue-400">
                  Compare your budget allocations with actual spending
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <GoalsBudgetChart goals={budgetGoals} expenses={expenses} />
              </CardContent>
            </Card>
            <Card className="col-span-3 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="text-blue-800 dark:text-blue-200">Budget Categories</CardTitle>
                <CardDescription className="text-blue-600 dark:text-blue-400">
                  Breakdown of your budget by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GoalsBudgetTable goals={budgetGoals} expenses={expenses} onRefresh={fetchFinancialData} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="add-savings" className="space-y-4">
          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-blue-800 dark:text-blue-200">Add New Savings Goal</CardTitle>
              <CardDescription className="text-blue-600 dark:text-blue-400">
                Create a new savings goal to track
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GoalsSavingsForm availableSavings={totalSavings} onSuccess={fetchFinancialData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add-budget" className="space-y-4">
          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-blue-800 dark:text-blue-200">Create New Monthly Budget Goal</CardTitle>
              <CardDescription className="text-blue-600 dark:text-blue-400">
                Set up a new budget allocation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GoalsBudgetForm onSuccess={fetchFinancialData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
