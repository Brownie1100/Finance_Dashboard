"use client"
import { useEffect, useState } from "react"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExpenseChart } from "@/components/expenses/expense-chart"
import { ExpenseTable } from "@/components/expenses/expense-table"
import { MonthFilter } from "@/components/month-filter"
import { useCurrency } from "@/hooks/use-currency"
import { useUser } from "@/hooks/use-user"
import { safeReduce, ensureArray } from "@/lib/array-utils"
import { filterDataByMonth } from "@/lib/date-utils"
import { ExpenseFormDebug } from "@/components/expenses/expense-form-debug"

interface Expense {
  id: number
  category: string
  amount: number
  date: string
  description?: string
}

export default function ExpensesPage() {
  const { formatAmount } = useCurrency()
  const { userId } = useUser()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedMonth, setSelectedMonth] = useState("all")

  const fetchExpenses = async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`http://localhost:8282/api/expense/${userId}`)
      if (response.ok) {
        const data = await response.json()
        const expenseArray = ensureArray(data)
        setExpenses(expenseArray)
      }
    } catch (error) {
      console.error("Error fetching expenses:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [userId])

  const handleExpenseAdded = () => {
    fetchExpenses() // Refresh the data
  }

  const handleExpenseDeleted = () => {
    fetchExpenses() // Refresh the data
  }

  const handleExpenseUpdated = () => {
    fetchExpenses() // Refresh the data
  }

  // Filter data by selected month
  const filteredExpenses = filterDataByMonth(expenses, selectedMonth)

  // Calculate totals using safe reduce on filtered data
  const totalExpenses = safeReduce(filteredExpenses, (sum, expense) => sum + expense.amount, 0)

  // Calculate expense categories breakdown
  const expensesByCategory = safeReduce(
    filteredExpenses,
    (acc: Record<string, number>, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    },
    {},
  )

  const largestExpenseCategory = Object.entries(expensesByCategory).reduce(
    (max, [category, amount]) => (amount > max.amount ? { category, amount } : max),
    { category: "None", amount: 0 },
  )

  const dailyAverage = filteredExpenses.length > 0 ? totalExpenses / 30 : 0

  return (
    <div className="flex-1 space-y-4 bg-yellow-50/30 dark:bg-yellow-950/10">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-yellow-700 dark:text-yellow-400">Expenses</h2>
        <div className="flex items-center gap-2">
          <MonthFilter selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
          <Button className="bg-yellow-600 hover:bg-yellow-700" onClick={() => setActiveTab("add")}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        </div>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-yellow-100/50 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-100">
          <TabsTrigger value="overview" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white">
            Overview
          </TabsTrigger>
          <TabsTrigger value="categories" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white">
            Categories
          </TabsTrigger>
          <TabsTrigger value="add" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white">
            Add Expense
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-yellow-200 dark:border-yellow-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Total Expenses {selectedMonth !== "all" && "(Filtered)"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                  {formatAmount(totalExpenses)}
                </div>
                <p className="text-xs text-yellow-600 dark:text-yellow-400">
                  {selectedMonth === "all" ? "All time" : "Selected month"}
                </p>
              </CardContent>
            </Card>
            <Card className="border-yellow-200 dark:border-yellow-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Largest Expense
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                  {formatAmount(largestExpenseCategory.amount)}
                </div>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 capitalize">
                  {largestExpenseCategory.category}
                </p>
              </CardContent>
            </Card>
            <Card className="border-yellow-200 dark:border-yellow-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Daily Average
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                  {formatAmount(dailyAverage)}
                </div>
                <p className="text-xs text-yellow-600 dark:text-yellow-400">30 days</p>
              </CardContent>
            </Card>
            <Card className="border-yellow-200 dark:border-yellow-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Total Entries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{filteredExpenses.length}</div>
                <p className="text-xs text-yellow-600 dark:text-yellow-400">Expense records</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 border-yellow-200 dark:border-yellow-800">
              <CardHeader>
                <CardTitle className="text-yellow-800 dark:text-yellow-200">Expense Trends</CardTitle>
                <CardDescription className="text-yellow-600 dark:text-yellow-400">
                  Your expenses over time
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ExpenseChart expenses={filteredExpenses} />
              </CardContent>
            </Card>
            <Card className="col-span-3 border-yellow-200 dark:border-yellow-800">
              <CardHeader>
                <CardTitle className="text-yellow-800 dark:text-yellow-200">Expense Categories</CardTitle>
                <CardDescription className="text-yellow-600 dark:text-yellow-400">
                  Breakdown of your expenses by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(expensesByCategory).map(([category, amount]) => {
                    const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200 capitalize">
                            {category}
                          </span>
                          <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                            {formatAmount(amount)}
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-yellow-100 dark:bg-yellow-900">
                          <div className="h-full rounded-full bg-yellow-500" style={{ width: `${percentage}%` }} />
                        </div>
                        <p className="text-xs text-yellow-600 dark:text-yellow-400 text-right">
                          {percentage.toFixed(1)}%
                        </p>
                      </div>
                    )
                  })}
                  {Object.keys(expensesByCategory).length === 0 && (
                    <p className="text-sm text-yellow-600 dark:text-yellow-400 text-center py-4">
                      No expense data available for selected period
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="categories" className="space-y-4">
          <Card className="border-yellow-200 dark:border-yellow-800">
            <CardHeader>
              <CardTitle className="text-yellow-800 dark:text-yellow-200">Expense Categories</CardTitle>
              <CardDescription className="text-yellow-600 dark:text-yellow-400">
                Manage and view all your expenses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExpenseTable
                expenses={filteredExpenses}
                onExpenseDeleted={handleExpenseDeleted}
                onExpenseUpdated={handleExpenseUpdated}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="add" className="space-y-4">
          <Card className="border-yellow-200 dark:border-yellow-800">
            <CardHeader>
              <CardTitle className="text-yellow-800 dark:text-yellow-200">Add New Expense</CardTitle>
              <CardDescription className="text-yellow-600 dark:text-yellow-400">
                Record a new expense transaction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExpenseFormDebug onExpenseAdded={handleExpenseAdded} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
