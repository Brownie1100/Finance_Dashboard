"use client"
import { useEffect, useState } from "react"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExpensePieChart } from "@/components/charts/expense-pie-chart"
import { ExpenseComparisonChart } from "@/components/charts/expense-comparison-chart"
import { AmountVsDayChart } from "@/components/charts/amount-vs-day-chart"
import { ExpenseTable } from "@/components/expenses/expense-table"
import { ExpenseForm } from "@/components/expenses/expense-form"
import { MonthYearPicker } from "@/components/month-year-picker"
import { ComparisonMonthPicker } from "@/components/comparison-month-picker"
import { ExcelUpload } from "@/components/upload/excel-upload"
import { useCurrency } from "@/hooks/use-currency"
import { useUser } from "@/hooks/use-user"
import { useMonthSelection } from "@/hooks/use-month-selection"
import { safeReduce, ensureArray } from "@/lib/array-utils"
import { filterDataByMonth } from "@/lib/date-utils"
import { fetchExpenses } from "@/lib/api"
import { toast } from "sonner"

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
  const { selectedMonth, comparisonMonth, setComparisonMonth } = useMonthSelection()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  const loadExpenses = async () => {
    try {
      setLoading(true)
      const data = await fetchExpenses(userId || "default")
      const expenseArray = ensureArray(data)
      // Sort by date ascending
      expenseArray.sort((a, b) => new Date((a as Expense).date).getTime() - new Date((b as Expense).date).getTime())
      setExpenses(expenseArray as Expense[])
      toast.success(`Loaded ${expenseArray.length} expense records`)
    } catch (error) {
      console.error("Error fetching expenses:", error)
      setExpenses([])
      toast.error("Failed to load expense data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadExpenses()
  }, [userId])

  const handleExpenseAdded = () => {
    loadExpenses()
  }

  const handleExpenseDeleted = () => {
    loadExpenses()
  }

  const handleExpenseUpdated = () => {
    loadExpenses()
  }

  // Filter data by selected month and comparison month
  const filteredExpenses = filterDataByMonth(expenses, selectedMonth)
  const comparisonExpenses = filterDataByMonth(expenses, comparisonMonth)

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

  // Get month names for labels
  const getMonthName = (monthStr: string) => {
    if (!monthStr || monthStr === "all-time") return "All Time"
    const [year, month] = monthStr.split("-")
    const date = new Date(Number(year), Number(month) - 1)
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  const currentMonthName = getMonthName(selectedMonth)
  const comparisonMonthName = getMonthName(comparisonMonth)

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-yellow-50/30 dark:bg-yellow-950/10">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2 text-yellow-700 dark:text-yellow-400">Loading...</div>
          <p className="text-yellow-600 dark:text-yellow-400">Fetching your expense data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 bg-yellow-50/30 dark:bg-yellow-950/10">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-yellow-700 dark:text-yellow-400">Expenses</h2>
        <div className="flex items-center gap-2">
          <MonthYearPicker />
          <ExcelUpload type="expense" onSuccess={handleExpenseAdded} />
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
            <Card className="border-yellow-200/50 dark:border-yellow-800/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Total Expenses {selectedMonth !== "all-time" && "(Current Month)"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                  {formatAmount(totalExpenses)}
                </div>
                <p className="text-xs text-yellow-600 dark:text-yellow-400">
                  {selectedMonth === "all-time" ? "All time" : "Selected month"}
                </p>
              </CardContent>
            </Card>
            <Card className="border-yellow-200/50 dark:border-yellow-800/50">
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
            <Card className="border-yellow-200/50 dark:border-yellow-800/50">
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
            <Card className="border-yellow-200/50 dark:border-yellow-800/50">
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
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-yellow-200 dark:border-yellow-800">
              <CardHeader>
                <CardTitle className="text-yellow-800 dark:text-yellow-200">Expense Distribution</CardTitle>
                <CardDescription className="text-yellow-600 dark:text-yellow-400">
                  Breakdown of your expenses by category
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                {filteredExpenses.length > 0 ? (
                  <ExpensePieChart expenses={filteredExpenses} />
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <p className="text-yellow-600 dark:text-yellow-400">No expense data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="border-yellow-200 dark:border-yellow-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-yellow-800 dark:text-yellow-200">Expense Comparison</CardTitle>
                  <CardDescription className="text-yellow-600 dark:text-yellow-400">
                    Compare expenses between periods
                  </CardDescription>
                </div>
                <ComparisonMonthPicker
                  selectedMonth={comparisonMonth}
                  onMonthChange={setComparisonMonth}
                  className="w-[240px]"
                />
              </CardHeader>
              <CardContent className="pl-2">
                {filteredExpenses.length > 0 || comparisonExpenses.length > 0 ? (
                  <ExpenseComparisonChart
                    currentExpenses={filteredExpenses}
                    comparisonExpenses={comparisonExpenses}
                    currentLabel={currentMonthName}
                    comparisonLabel={comparisonMonthName}
                  />
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <p className="text-yellow-600 dark:text-yellow-400">No expense data available for comparison</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Amount vs Day Chart */}
          <Card className="border-yellow-200 dark:border-yellow-800">
            <CardHeader>
              <CardTitle className="text-yellow-800 dark:text-yellow-200">Expense Amount vs Day</CardTitle>
              <CardDescription className="text-yellow-600 dark:text-yellow-400">
                Daily expense amounts over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AmountVsDayChart data={filteredExpenses} color="#ca8a04" type="expense" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="categories" className="space-y-4">
          <Card className="border-yellow-200 dark:border-yellow-800">
            <CardHeader>
              <CardTitle className="text-yellow-800 dark:text-yellow-200">Expense Categories</CardTitle>
              <CardDescription className="text-yellow-600 dark:text-yellow-400">
                Manage and view all your expenses
              </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[600px] overflow-y-auto">
              {filteredExpenses.length > 0 ? (
                <ExpenseTable
                  expenses={filteredExpenses}
                  onExpenseDeleted={handleExpenseDeleted}
                  onExpenseUpdated={handleExpenseUpdated}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-yellow-600 dark:text-yellow-400">No expense data available</p>
                  <Button className="mt-4 bg-yellow-600 hover:bg-yellow-700" onClick={() => setActiveTab("add")}>
                    Add Expense
                  </Button>
                </div>
              )}
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
              <ExpenseForm onExpenseAdded={handleExpenseAdded} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
