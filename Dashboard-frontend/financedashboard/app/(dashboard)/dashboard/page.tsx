"use client"
import { useEffect, useState } from "react"
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon, CreditCard, DollarSign, PiggyBank } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/dashboard/overview"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { RemainingBudget } from "@/components/dashboard/remaining-budget"
import { MonthFilter } from "@/components/month-filter"
import { useCurrency } from "@/hooks/use-currency"
import { useUser } from "@/hooks/use-user"
import { safeReduce } from "@/lib/array-utils"
import { filterDataByMonth } from "@/lib/date-utils"

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

export default function DashboardPage() {
  const { formatAmount } = useCurrency()
  const { userId } = useUser()
  const [incomes, setIncomes] = useState<Income[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState("all")

  const fetchAllFinancialData = async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)

      // Fetch all financial data in parallel
      const [incomeResponse, expenseResponse] = await Promise.all([
        fetch(`http://localhost:8282/api/income/${userId}`),
        fetch(`http://localhost:8282/api/expense/${userId}`),
      ])

      if (incomeResponse.ok) {
        const incomeData = await incomeResponse.json()
        setIncomes(Array.isArray(incomeData) ? incomeData : incomeData ? [incomeData] : [])
      }

      if (expenseResponse.ok) {
        const expenseData = await expenseResponse.json()
        setExpenses(Array.isArray(expenseData) ? expenseData : expenseData ? [expenseData] : [])
      }
    } catch (error) {
      console.error("Error fetching financial data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllFinancialData()
  }, [userId])

  // Filter data by selected month
  const filteredIncomes = filterDataByMonth(incomes, selectedMonth)
  const filteredExpenses = filterDataByMonth(expenses, selectedMonth)

  // Calculate totals using safe reduce on filtered data
  const totalIncome = safeReduce(filteredIncomes, (sum, income) => sum + income.amount, 0)
  const totalExpenses = safeReduce(filteredExpenses, (sum, expense) => sum + expense.amount, 0)
  const totalSavings = totalIncome - totalExpenses

  // Calculate expense categories breakdown for budget display
  const expensesByCategory = safeReduce(
    filteredExpenses,
    (acc: Record<string, number>, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    },
    {},
  )

  // Calculate income sources breakdown
  const incomeBySource = safeReduce(
    filteredIncomes,
    (acc: Record<string, number>, income) => {
      acc[income.category] = (acc[income.category] || 0) + income.amount
      return acc
    },
    {},
  )

  const primaryIncome = incomeBySource["salary"] || 0
  const secondaryIncome = totalIncome - primaryIncome

  // Calculate percentage changes (mock for now, could be calculated from historical data)
  const incomeChange = totalIncome > 0 ? "+5.1%" : "0%"
  const expenseChange = totalExpenses > 0 ? "-3.2%" : "0%"
  const balanceChange = totalSavings > 0 ? "+2.5%" : totalSavings < 0 ? "-2.5%" : "0%"

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-2">
          <MonthFilter selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
          <Button variant="outline" size="sm">
            Download
          </Button>
          <Button size="sm">
            <span className="sr-only sm:not-sr-only">View All</span>
            <span className="sm:hidden">
              <ArrowRightIcon className="h-4 w-4" />
            </span>
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalSavings >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatAmount(Math.abs(totalSavings))}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalSavings >= 0 ? `+${balanceChange} from last month` : `${balanceChange} from last month`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <ArrowUpIcon className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatAmount(totalIncome)}</div>
            <p className="text-xs text-muted-foreground">{incomeChange} from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <ArrowDownIcon className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatAmount(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">{expenseChange} from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Savings</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalSavings >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatAmount(Math.abs(totalSavings))}
            </div>
            <p className="text-xs text-muted-foreground">{totalSavings >= 0 ? "Income - Expenses" : "Deficit"}</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
            <CardDescription>Your income and expenses over time</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview incomes={filteredIncomes} expenses={filteredExpenses} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your most recent financial activities</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentTransactions incomes={filteredIncomes} expenses={filteredExpenses} />
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Transactions
            </Button>
          </CardFooter>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
            <CardDescription>Your spending breakdown by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(expensesByCategory).length > 0 ? (
                Object.entries(expensesByCategory).map(([category, amount]) => {
                  const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium capitalize">{category}</span>
                        </div>
                        <div className="text-sm font-medium">{formatAmount(amount)}</div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${percentage}%` }} />
                      </div>
                      <p className="text-xs text-muted-foreground text-right">{percentage.toFixed(1)}%</p>
                    </div>
                  )
                })
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No expense data available</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View Expense Details
            </Button>
          </CardFooter>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Savings Calculator</CardTitle>
            <CardDescription>Available amount for new savings goals</CardDescription>
          </CardHeader>
          <CardContent>
            <RemainingBudget monthlySavings={totalSavings} />
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Goals
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
