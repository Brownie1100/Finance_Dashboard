"use client"
import { useEffect, useState } from "react"
import { ArrowUpIcon, ArrowDownIcon, Target, PiggyBank } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { IncomeExpenseLineChart } from "@/components/charts/income-expense-line-chart"
import { MonthYearPicker } from "@/components/month-year-picker"
import { useCurrency } from "@/hooks/use-currency"
import { useUser } from "@/hooks/use-user"
import { useMonthSelection } from "@/hooks/use-month-selection"
import { safeReduce } from "@/lib/array-utils"
import { filterDataByMonth, getPreviousMonth, calculatePercentageChange } from "@/lib/date-utils"
import { DownloadData } from "@/components/download-data"
import { useRouter } from "next/navigation"
import { fetchIncomes, fetchExpenses, fetchGoals } from "@/lib/api"

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

export default function DashboardPage() {
  const { formatAmount } = useCurrency()
  const { userId } = useUser()
  const { selectedMonth } = useMonthSelection()
  const [incomes, setIncomes] = useState<Income[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchAllFinancialData = async () => {
    try {
      setLoading(true)

      // Fetch all financial data in parallel
      const [incomesData, expensesData, goalsData] = await Promise.all([
        fetchIncomes(userId || "1"),
        fetchExpenses(userId || "1"),
        fetchGoals(userId || "1"),
      ])

      setIncomes((incomesData as Income[]) || [])
      setExpenses((expensesData as Expense[]) || [])
      setGoals((goalsData as Goal[]) || [])
    } catch (error) {
      console.error("Error fetching financial data:", error)
      setIncomes([])
      setExpenses([])
      setGoals([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllFinancialData()
  }, [userId])

  // Filter data by selected month and previous month
  const filteredIncomes = selectedMonth === "all-time" ? incomes : filterDataByMonth(incomes, selectedMonth)
  const filteredExpenses = selectedMonth === "all-time" ? expenses : filterDataByMonth(expenses, selectedMonth)
  const previousMonthIncomes = filterDataByMonth(incomes, getPreviousMonth())
  const previousMonthExpenses = filterDataByMonth(expenses, getPreviousMonth())

  // Calculate current month totals
  const totalIncome = safeReduce(filteredIncomes, (sum, income) => sum + income.amount, 0)
  const totalExpenses = safeReduce(filteredExpenses, (sum, expense) => sum + expense.amount, 0)
  const totalSavings = totalIncome - totalExpenses

  // Calculate previous month totals
  const previousTotalIncome = safeReduce(previousMonthIncomes, (sum, income) => sum + income.amount, 0)
  const previousTotalExpenses = safeReduce(previousMonthExpenses, (sum, expense) => sum + expense.amount, 0)
  const previousTotalSavings = previousTotalIncome - previousTotalExpenses

  // Calculate percentage changes
  const incomeChange = calculatePercentageChange(totalIncome, previousTotalIncome)
  const expenseChange = calculatePercentageChange(totalExpenses, previousTotalExpenses)
  const savingsChange = calculatePercentageChange(totalSavings, previousTotalSavings)

  // Calculate goals data
  const totalGoals = goals.length
  const activeGoals = goals.filter((goal) => new Date(goal.endDate) >= new Date()).length
  const totalGoalAmount = safeReduce(goals, (sum, goal) => sum + goal.amount, 0)

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">Loading...</div>
          <p className="text-muted-foreground">Fetching your financial data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-2">
          <MonthYearPicker />
          <DownloadData incomes={incomes} expenses={expenses} goals={goals} />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-gray-200/50 dark:border-gray-800/50 bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <ArrowUpIcon className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatAmount(totalIncome)}</div>
            <p className="text-xs text-muted-foreground">{incomeChange} from last month</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200/50 dark:border-gray-800/50 bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <ArrowDownIcon className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatAmount(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">{expenseChange} from last month</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200/50 dark:border-gray-800/50 bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Savings</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalSavings >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatAmount(Math.abs(totalSavings))}
            </div>
            <p className="text-xs text-muted-foreground">{savingsChange} from last month</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200/50 dark:border-gray-800/50 bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goals Progress</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeGoals}/{totalGoals}
            </div>
            <p className="text-xs text-muted-foreground">Active goals</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-gray-200/50 dark:border-gray-800/50 bg-card">
          <CardHeader>
            <CardTitle>Income and Expenses</CardTitle>
            <CardDescription>Your income and expenses over time</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {incomes.length > 0 || expenses.length > 0 ? (
              <IncomeExpenseLineChart incomes={incomes} expenses={expenses} />
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">No financial data available</p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="col-span-3 border-gray-200/50 dark:border-gray-800/50 bg-card">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your most recent financial activities</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredIncomes.length > 0 || filteredExpenses.length > 0 ? (
              <RecentTransactions incomes={filteredIncomes} expenses={filteredExpenses} />
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No recent transactions</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-gray-200/50 dark:border-gray-800/50 bg-card">
          <CardHeader>
            <CardTitle>Goals Overview</CardTitle>
            <CardDescription>Your financial goals summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{totalGoals}</div>
                  <p className="text-sm text-muted-foreground">Total Goals</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{activeGoals}</div>
                  <p className="text-sm text-muted-foreground">Active Goals</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{formatAmount(totalGoalAmount)}</div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => router.push("/goals")}>
              Manage Goals
            </Button>
          </CardFooter>
        </Card>
        <Card className="col-span-3 border-gray-200/50 dark:border-gray-800/50 bg-card">
          <CardHeader>
            <CardTitle>Savings Calculator</CardTitle>
            <CardDescription>Available amount for new savings goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <div className={`text-3xl font-bold ${totalSavings >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatAmount(Math.abs(totalSavings))}
              </div>
              <p className="text-sm text-muted-foreground">
                {totalSavings >= 0 ? "Available for savings" : "Budget deficit"}
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => router.push("/goals")}>
              View All Goals
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
