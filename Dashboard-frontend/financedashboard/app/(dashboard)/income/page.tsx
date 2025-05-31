"use client"
import { useEffect, useState } from "react"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IncomeChart } from "@/components/income/income-chart"
import { IncomeTable } from "@/components/income/income-table"
import { MonthFilter } from "@/components/month-filter"
import { useCurrency } from "@/hooks/use-currency"
import { useUser } from "@/hooks/use-user"
import { safeReduce, ensureArray } from "@/lib/array-utils"
import { filterDataByMonth } from "@/lib/date-utils"
import { IncomeFormDebug } from "@/components/income/income-form-debug"

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
  const [incomes, setIncomes] = useState<Income[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedMonth, setSelectedMonth] = useState("all")

  const fetchIncomes = async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`http://localhost:8282/api/income/${userId}`)
      if (response.ok) {
        const data = await response.json()
        const incomeArray = ensureArray(data)
        setIncomes(incomeArray)
      }
    } catch (error) {
      console.error("Error fetching incomes:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIncomes()
  }, [userId])

  const handleIncomeAdded = () => {
    fetchIncomes() // Refresh the data
  }

  const handleIncomeDeleted = () => {
    fetchIncomes() // Refresh the data
  }

  const handleIncomeUpdated = () => {
    fetchIncomes() // Refresh the data
  }

  // Filter data by selected month
  const filteredIncomes = filterDataByMonth(incomes, selectedMonth)

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

  return (
    <div className="flex-1 space-y-4 bg-green-50/30 dark:bg-green-950/10">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-green-700 dark:text-green-400">Income</h2>
        <div className="flex items-center gap-2">
          <MonthFilter selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
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
            Income Sources
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
                  Total Income {selectedMonth !== "all" && "(Filtered)"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">{formatAmount(totalIncome)}</div>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {selectedMonth === "all" ? "All time" : "Selected month"}
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 border-green-200/50 dark:border-green-800/50">
              <CardHeader>
                <CardTitle className="text-green-800 dark:text-green-200">Income Trends</CardTitle>
                <CardDescription className="text-green-600 dark:text-green-400">Your income over time</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <IncomeChart incomes={filteredIncomes} />
              </CardContent>
            </Card>
            <Card className="col-span-3 border-green-200/50 dark:border-green-800/50">
              <CardHeader>
                <CardTitle className="text-green-800 dark:text-green-200">Income Sources</CardTitle>
                <CardDescription className="text-green-600 dark:text-green-400">
                  Breakdown of your income by source
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(incomeBySource).map(([source, amount]) => {
                    const percentage = totalIncome > 0 ? (amount / totalIncome) * 100 : 0
                    return (
                      <div key={source} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-green-800 dark:text-green-200 capitalize">
                            {source}
                          </span>
                          <span className="text-sm font-medium text-green-800 dark:text-green-200">
                            {formatAmount(amount)}
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-green-100/50 dark:bg-green-900/30">
                          <div className="h-full rounded-full bg-green-500" style={{ width: `${percentage}%` }} />
                        </div>
                        <p className="text-xs text-green-600 dark:text-green-400 text-right">
                          {percentage.toFixed(1)}%
                        </p>
                      </div>
                    )
                  })}
                  {Object.keys(incomeBySource).length === 0 && (
                    <p className="text-sm text-green-600 dark:text-green-400 text-center py-4">
                      No income data available for selected period
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="sources" className="space-y-4">
          <Card className="border-green-200/50 dark:border-green-800/50">
            <CardHeader>
              <CardTitle className="text-green-800 dark:text-green-200">Income Sources</CardTitle>
              <CardDescription className="text-green-600 dark:text-green-400">
                Manage and view all your income sources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <IncomeTable
                incomes={filteredIncomes}
                onIncomeDeleted={handleIncomeDeleted}
                onIncomeUpdated={handleIncomeUpdated}
              />
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
              <IncomeFormDebug onIncomeAdded={handleIncomeAdded} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
