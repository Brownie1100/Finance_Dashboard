"use client"
import { useEffect, useState } from "react"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SavingsChart } from "@/components/savings/savings-chart"
import { SavingsOverview } from "@/components/savings/savings-overview"
import { SavingsForm } from "@/components/savings/savings-form"
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

interface Savings {
  id: number
  category: string
  amount: number
  date: string
  description?: string
}

export default function SavingsPage() {
  const { userId } = useUser()
  const [incomes, setIncomes] = useState<Income[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [savings, setSavings] = useState<Savings[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  const fetchFinancialData = async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)

      // Fetch income, expense, and savings data
      const [incomeResponse, expenseResponse, savingsResponse] = await Promise.all([
        fetch(`http://localhost:8282/api/income/${userId}`),
        fetch(`http://localhost:8282/api/expense/${userId}`),
        fetch(`http://localhost:8282/api/savings/${userId}`),
      ])

      if (incomeResponse.ok) {
        const incomeData = await incomeResponse.json()
        setIncomes(ensureArray(incomeData))
      }

      if (expenseResponse.ok) {
        const expenseData = await expenseResponse.json()
        setExpenses(ensureArray(expenseData))
      }

      if (savingsResponse.ok) {
        const savingsData = await savingsResponse.json()
        setSavings(ensureArray(savingsData))
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
  const totalSavings = safeReduce(savings, (sum, saving) => saving.amount, 0)
  const calculatedSavings = totalIncome - totalExpenses

  return (
    <div className="flex-1 space-y-4 bg-red-50/30 dark:bg-red-950/10">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-red-700 dark:text-red-400">Savings</h2>
        <Button className="bg-red-600 hover:bg-red-700" onClick={() => setActiveTab("add")}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Savings
        </Button>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-red-100/50 dark:bg-red-900/30 text-red-900 dark:text-red-100">
          <TabsTrigger value="overview" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Overview
          </TabsTrigger>
          <TabsTrigger value="analysis" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Analysis
          </TabsTrigger>
          <TabsTrigger value="add" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Add Savings
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <SavingsOverview totalIncome={totalIncome} totalExpenses={totalExpenses} totalSavings={calculatedSavings} />
          <div className="grid gap-4 md:grid-cols-1">
            <Card className="border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="text-red-800 dark:text-red-200">Savings Growth</CardTitle>
                <CardDescription className="text-red-600 dark:text-red-400">
                  Your savings growth over time (Income - Expenses)
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <SavingsChart incomes={incomes} expenses={expenses} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analysis" className="space-y-4">
          <Card className="border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="text-red-800 dark:text-red-200">Savings Analysis</CardTitle>
              <CardDescription className="text-red-600 dark:text-red-400">
                Detailed analysis of your savings patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-red-800 dark:text-red-200">Savings Rate</h3>
                    <div className="text-3xl font-bold text-red-700 dark:text-red-300">
                      {totalIncome > 0 ? ((calculatedSavings / totalIncome) * 100).toFixed(1) : 0}%
                    </div>
                    <p className="text-sm text-red-600 dark:text-red-400">Of total income saved</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-red-800 dark:text-red-200">Monthly Trend</h3>
                    <div className={`text-3xl font-bold ${calculatedSavings >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {calculatedSavings >= 0 ? "↗" : "↘"}
                    </div>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {calculatedSavings >= 0 ? "Positive savings" : "Spending more than earning"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-red-800 dark:text-red-200">Recommendations</h3>
                  <div className="space-y-3">
                    {calculatedSavings < 0 && (
                      <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-lg">
                        <p className="text-sm text-red-800 dark:text-red-200">
                          ⚠️ You're spending more than you earn. Consider reducing expenses or increasing income.
                        </p>
                      </div>
                    )}
                    {calculatedSavings >= 0 && calculatedSavings < totalIncome * 0.1 && (
                      <div className="p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          💡 Your savings rate is below 10%. Consider setting aside more for future goals.
                        </p>
                      </div>
                    )}
                    {calculatedSavings >= totalIncome * 0.2 && (
                      <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
                        <p className="text-sm text-green-800 dark:text-green-200">
                          ✅ Great job! You're saving over 20% of your income.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="add" className="space-y-4">
          <Card className="border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="text-red-800 dark:text-red-200">Add Savings Entry</CardTitle>
              <CardDescription className="text-red-600 dark:text-red-400">
                Record a new savings transaction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SavingsForm onSuccess={fetchFinancialData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
