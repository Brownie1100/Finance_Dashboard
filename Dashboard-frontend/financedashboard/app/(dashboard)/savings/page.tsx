"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SavingsBarChart } from "@/components/charts/savings-bar-chart"
import { YearPicker } from "@/components/year-picker"
import { useCurrency } from "@/hooks/use-currency"
import { useUser } from "@/hooks/use-user"
import { safeReduce, ensureArray } from "@/lib/array-utils"
import { IncomeExpenseBarChart } from "@/components/charts/income-expense-bar-chart"
import { fetchIncomes, fetchExpenses } from "@/lib/api"
import { TrendingUp, TrendingDown, Target, PiggyBank } from "lucide-react"

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

export default function SavingsPage() {
  const { formatAmount } = useCurrency()
  const { userId } = useUser()
  const [incomes, setIncomes] = useState<Income[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const fetchAllData = async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)

      // Fetch income and expense data
      const [incomeData, expenseData] = await Promise.all([fetchIncomes(userId), fetchExpenses(userId)])

      setIncomes(ensureArray(incomeData) as Income[])
      setExpenses(ensureArray(expenseData) as Expense[])
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [userId])

  // Calculate totals using safe reduce on all data
  const totalIncome = safeReduce(incomes, (sum, income) => sum + income.amount, 0)
  const totalExpenses = safeReduce(expenses, (sum, expense) => sum + expense.amount, 0)
  const totalSavings = totalIncome - totalExpenses

  // Calculate savings rate for all time
  const savingsRate = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0

  // Calculate monthly savings for the year
  const monthlySavings = safeReduce(
    incomes,
    (acc: Record<string, number>, income) => {
      const date = new Date(income.date)
      const monthKey = date.toLocaleDateString("en-US", { month: "short" })
      acc[monthKey] = (acc[monthKey] || 0) + income.amount
      return acc
    },
    {},
  )

  const monthlyExpensesData = safeReduce(
    expenses,
    (acc: Record<string, number>, expense) => {
      const date = new Date(expense.date)
      const monthKey = date.toLocaleDateString("en-US", { month: "short" })
      acc[monthKey] = (acc[monthKey] || 0) + expense.amount
      return acc
    },
    {},
  )

  // Calculate average monthly savings
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const totalYearlySavings = months.reduce((sum, month) => {
    const income = monthlySavings[month] || 0
    const expense = monthlyExpensesData[month] || 0
    return sum + Math.max(0, income - expense)
  }, 0)
  const averageMonthlySavings = totalYearlySavings / 12

  // Calculate year-specific data for analysis
  const yearIncomes = incomes.filter((income) => new Date(income.date).getFullYear() === selectedYear)
  const yearExpenses = expenses.filter((expense) => new Date(expense.date).getFullYear() === selectedYear)

  const yearTotalIncome = safeReduce(yearIncomes, (sum, income) => sum + income.amount, 0)
  const yearTotalExpenses = safeReduce(yearExpenses, (sum, expense) => sum + expense.amount, 0)
  const yearTotalSavings = yearTotalIncome - yearTotalExpenses
  const yearSavingsRate = yearTotalIncome > 0 ? (yearTotalSavings / yearTotalIncome) * 100 : 0

  // Calculate best and worst months
  const monthlyData = months.map((month) => {
    const income = monthlySavings[month] || 0
    const expense = monthlyExpensesData[month] || 0
    return {
      month,
      income,
      expense,
      savings: income - expense,
    }
  })

  const bestMonth = monthlyData.reduce((best, current) => (current.savings > best.savings ? current : best))
  const worstMonth = monthlyData.reduce((worst, current) => (current.savings < worst.savings ? current : worst))

  const handleYearChange = (year: number) => {
    setSelectedYear(year)
  }

  return (
    <div className="flex-1 space-y-4 bg-red-50/30 dark:bg-red-950/10">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-red-700 dark:text-red-400">Savings</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-red-100/50 dark:bg-red-900/30 text-red-900 dark:text-red-100">
          <TabsTrigger value="overview" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Overview
          </TabsTrigger>
          <TabsTrigger value="analysis" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-red-200/50 dark:border-red-800/50 bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-red-800 dark:text-red-200">
                  Overall Savings Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-700 dark:text-red-300">{savingsRate.toFixed(1)}%</div>
                <p className="text-xs text-red-600 dark:text-red-400">Of total income</p>
              </CardContent>
            </Card>
            <Card className="border-red-200/50 dark:border-red-800/50 bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-red-800 dark:text-red-200">
                  Average Monthly Savings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                  {formatAmount(averageMonthlySavings)}
                </div>
                <p className="text-xs text-red-600 dark:text-red-400">Yearly average</p>
              </CardContent>
            </Card>
            <Card className="border-red-200/50 dark:border-red-800/50 bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-red-800 dark:text-red-200">Savings Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${totalSavings >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {totalSavings >= 0 ? "Positive" : "Deficit"}
                </div>
                <p className="text-xs text-red-600 dark:text-red-400">Overall</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-red-200/50 dark:border-red-800/50 bg-card">
            <CardHeader>
              <CardTitle className="text-red-800 dark:text-red-200">Savings vs Month</CardTitle>
              <CardDescription className="text-red-600 dark:text-red-400">
                Your monthly savings pattern (Income - Expenses)
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <SavingsBarChart incomes={incomes} expenses={expenses} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Half - Savings Insights */}
            <div className="space-y-4">
              <Card className="border-red-200/50 dark:border-red-800/50 bg-card">
                <CardHeader>
                  <CardTitle className="text-red-800 dark:text-red-200 flex items-center gap-2">
                    <PiggyBank className="h-5 w-5" />
                    Savings Insights for {selectedYear}
                  </CardTitle>
                  <CardDescription className="text-red-600 dark:text-red-400">
                    Detailed analysis of your savings performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Year Summary */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <div className="text-sm text-green-600 dark:text-green-400">Total Income</div>
                      <div className="text-lg font-semibold text-green-700 dark:text-green-300">
                        {formatAmount(yearTotalIncome)}
                      </div>
                    </div>
                    <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                      <div className="text-sm text-red-600 dark:text-red-400">Total Expenses</div>
                      <div className="text-lg font-semibold text-red-700 dark:text-red-300">
                        {formatAmount(yearTotalExpenses)}
                      </div>
                    </div>
                  </div>

                  {/* Savings Rate */}
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-blue-600 dark:text-blue-400">Annual Savings Rate</div>
                        <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                          {yearSavingsRate.toFixed(1)}%
                        </div>
                      </div>
                      <Target className="h-8 w-8 text-blue-500" />
                    </div>
                  </div>

                  {/* Best and Worst Months */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="text-sm text-green-600 dark:text-green-400">Best Savings Month</div>
                        <div className="font-semibold text-green-700 dark:text-green-300">
                          {bestMonth.month}: {formatAmount(bestMonth.savings)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                      <TrendingDown className="h-5 w-5 text-red-600" />
                      <div>
                        <div className="text-sm text-red-600 dark:text-red-400">Lowest Savings Month</div>
                        <div className="font-semibold text-red-700 dark:text-red-300">
                          {worstMonth.month}: {formatAmount(worstMonth.savings)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Savings Goal Progress */}
                  <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                    <div className="text-sm text-purple-600 dark:text-purple-400">Monthly Savings Target</div>
                    <div className="text-xs text-purple-500 dark:text-purple-400 mt-1">
                      Recommended: 20% of income ({formatAmount((yearTotalIncome * 0.2) / 12)}/month)
                    </div>
                    <div className="mt-2">
                      <div className="flex justify-between text-sm">
                        <span>Current Average</span>
                        <span>{formatAmount(yearTotalSavings / 12)}</span>
                      </div>
                      <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-2 mt-1">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min(100, (yearTotalSavings / 12 / ((yearTotalIncome * 0.2) / 12)) * 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Half - Income vs Expenses Chart */}
            <div>
              <Card className="border-red-200/50 dark:border-red-800/50 bg-card h-full">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-red-800 dark:text-red-200">Income vs Expenses</CardTitle>
                    <CardDescription className="text-red-600 dark:text-red-400">
                      Monthly comparison for {selectedYear}
                    </CardDescription>
                  </div>
                  <YearPicker selectedYear={selectedYear} onChange={handleYearChange} />
                </CardHeader>
                <CardContent>
                  <IncomeExpenseBarChart incomes={incomes} expenses={expenses} selectedYear={selectedYear} />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
