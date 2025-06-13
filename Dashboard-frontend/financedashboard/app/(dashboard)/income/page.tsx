"use client"
import { useEffect, useState } from "react"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IncomePieChart } from "@/components/charts/income-pie-chart"
import { IncomeComparisonChart } from "@/components/charts/income-comparison-chart"
import { IncomeTable } from "@/components/income/income-table"
import { IncomeForm } from "@/components/income/income-form"
import { MonthYearPicker } from "@/components/month-year-picker"
import { ComparisonMonthPicker } from "@/components/comparison-month-picker"
import { ExcelUpload } from "@/components/upload/excel-upload"
import { useCurrency } from "@/hooks/use-currency"
import { useUser } from "@/hooks/use-user"
import { useMonthSelection } from "@/hooks/use-month-selection"
import { safeReduce, ensureArray } from "@/lib/array-utils"
import { filterDataByMonth } from "@/lib/date-utils"
import { AmountVsDayChart } from "@/components/charts/amount-vs-day-chart"
import { fetchIncomes } from "@/lib/api"
import { toast } from "sonner"

interface Income {
  id: number
  category: string
  amount: number
  date: string
  description?: string
}

export default function IncomePage() {
  const { formatAmount } = useCurrency()
  const { userId } = useUser()
  const { selectedMonth, comparisonMonth, setComparisonMonth } = useMonthSelection()
  const [incomes, setIncomes] = useState<Income[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  const loadIncomes = async () => {
    try {
      setLoading(true)
      const data = await fetchIncomes(userId || "default")
      const incomeArray = ensureArray(data)
      // Sort by date ascending
      incomeArray.sort((a, b) => new Date((a as Income).date).getTime() - new Date((b as Income).date).getTime())
      setIncomes(incomeArray as Income[])
      toast.success(`Loaded ${incomeArray.length} income records`)
    } catch (error) {
      console.error("Error fetching incomes:", error)
      setIncomes([])
      toast.error("Failed to load income data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadIncomes()
  }, [userId])

  const handleIncomeAdded = () => {
    loadIncomes()
  }

  const handleIncomeDeleted = () => {
    loadIncomes()
  }

  const handleIncomeUpdated = () => {
    loadIncomes()
  }

  // Filter data by selected month and comparison month
  const filteredIncomes = filterDataByMonth(incomes, selectedMonth)
  const comparisonIncomes = filterDataByMonth(incomes, comparisonMonth)

  // Calculate totals using safe reduce on filtered data
  const totalIncome = safeReduce(filteredIncomes, (sum, income) => sum + income.amount, 0)

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
      <div className="flex-1 flex items-center justify-center bg-green-50/30 dark:bg-green-950/10">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2 text-green-700 dark:text-green-400">Loading...</div>
          <p className="text-green-600 dark:text-green-400">Fetching your income data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 bg-green-50/30 dark:bg-green-950/10">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-green-700 dark:text-green-400">Income</h2>
        <div className="flex items-center gap-2">
          <MonthYearPicker />
          <ExcelUpload type="income" onSuccess={handleIncomeAdded} />
          <Button className="bg-green-600 hover:bg-green-700" onClick={() => setActiveTab("add")}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Income
          </Button>
        </div>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-green-100/50 dark:bg-green-900/30 text-green-900 dark:text-green-100">
          <TabsTrigger value="overview" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            Overview
          </TabsTrigger>
          <TabsTrigger value="sources" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            Sources
          </TabsTrigger>
          <TabsTrigger value="add" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            Add Income
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-green-200/50 dark:border-green-800/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200">
                  Total Income {selectedMonth !== "all-time" && "(Current Month)"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">{formatAmount(totalIncome)}</div>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {selectedMonth === "all-time" ? "All time" : "Selected month"}
                </p>
              </CardContent>
            </Card>
            <Card className="border-green-200/50 dark:border-green-800/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200">Primary Income</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {formatAmount(primaryIncome)}
                </div>
                <p className="text-xs text-green-600 dark:text-green-400">Salary</p>
              </CardContent>
            </Card>
            <Card className="border-green-200/50 dark:border-green-800/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200">
                  Secondary Income
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {formatAmount(secondaryIncome)}
                </div>
                <p className="text-xs text-green-600 dark:text-green-400">Other sources</p>
              </CardContent>
            </Card>
            <Card className="border-green-200/50 dark:border-green-800/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200">Total Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">{filteredIncomes.length}</div>
                <p className="text-xs text-green-600 dark:text-green-400">Income records</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-green-200/50 dark:border-green-800/50">
              <CardHeader>
                <CardTitle className="text-green-800 dark:text-green-200">Income Distribution</CardTitle>
                <CardDescription className="text-green-600 dark:text-green-400">
                  Breakdown of your income by source
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                {filteredIncomes.length > 0 ? (
                  <IncomePieChart incomes={filteredIncomes} />
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <p className="text-green-600 dark:text-green-400">No income data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="border-green-200/50 dark:border-green-800/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-green-800 dark:text-green-200">Income Comparison</CardTitle>
                  <CardDescription className="text-green-600 dark:text-green-400">
                    Compare income between periods
                  </CardDescription>
                </div>
                <ComparisonMonthPicker
                  selectedMonth={comparisonMonth}
                  onMonthChange={setComparisonMonth}
                  className="w-[240px]"
                />
              </CardHeader>
              <CardContent className="pl-2">
                {filteredIncomes.length > 0 || comparisonIncomes.length > 0 ? (
                  <IncomeComparisonChart
                    currentIncome={filteredIncomes}
                    comparisonIncome={comparisonIncomes}
                    currentLabel={currentMonthName}
                    comparisonLabel={comparisonMonthName}
                  />
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <p className="text-green-600 dark:text-green-400">No income data available for comparison</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Add Income Amount vs Day Chart */}
          <Card className="border-green-200/50 dark:border-green-800/50">
            <CardHeader>
              <CardTitle className="text-green-800 dark:text-green-200">Income Amount vs Day</CardTitle>
              <CardDescription className="text-green-600 dark:text-green-400">
                Daily income distribution over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AmountVsDayChart data={filteredIncomes} color="#22c55e" type="income" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sources" className="space-y-4">
          <Card className="border-green-200/50 dark:border-green-800/50">
            <CardHeader>
              <CardTitle className="text-green-800 dark:text-green-200">Income Sources</CardTitle>
              <CardDescription className="text-green-600 dark:text-green-400">
                Manage and view all your income sources
              </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[600px] overflow-y-auto">
              {filteredIncomes.length > 0 ? (
                <IncomeTable
                  incomes={filteredIncomes}
                  onIncomeDeleted={handleIncomeDeleted}
                  onIncomeUpdated={handleIncomeUpdated}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-green-600 dark:text-green-400">No income data available</p>
                  <Button className="mt-4 bg-green-600 hover:bg-green-700" onClick={() => setActiveTab("add")}>
                    Add Income
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="add" className="space-y-4">
          <Card className="border-green-200/50 dark:border-green-800/50">
            <CardHeader>
              <CardTitle className="text-green-800 dark:text-green-200">Add New Income</CardTitle>
              <CardDescription className="text-green-600 dark:text-green-400">
                Record a new income transaction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <IncomeForm onIncomeAdded={handleIncomeAdded} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
