"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { exportToExcel, formatDataForExport } from "@/lib/excel-export"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DownloadMonthPicker } from "@/components/download-month-picker"

interface DownloadDataProps {
  incomes: any[]
  expenses: any[]
  goals: any[]
}

export function DownloadData({ incomes, expenses, goals }: DownloadDataProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState("")

  const handleDownload = () => {
    if (!selectedMonth || selectedMonth === "all-time") {
      // For all-time, export all data without filtering
      const exportData = formatDataForExport(incomes, expenses, goals)

      if (exportData.length === 0) {
        toast({
          title: "No data available",
          description: "There is no data available.",
          variant: "destructive",
        })
        return
      }

      exportToExcel(exportData, `financial-data-all-time`)

      toast({
        title: "Download started",
        description: "All financial data is being downloaded.",
      })

      setDialogOpen(false)
      return
    }

    // Filter data by selected month
    const [year, month] = selectedMonth.split("-")
    const filteredIncomes = incomes.filter((income) => {
      const incomeDate = new Date(income.date)
      return incomeDate.getFullYear() === Number.parseInt(year) && incomeDate.getMonth() + 1 === Number.parseInt(month)
    })

    const filteredExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date)
      return (
        expenseDate.getFullYear() === Number.parseInt(year) && expenseDate.getMonth() + 1 === Number.parseInt(month)
      )
    })

    const filteredGoals = goals.filter((goal) => {
      const goalDate = new Date(goal.startDate)
      return goalDate.getFullYear() === Number.parseInt(year) && goalDate.getMonth() + 1 === Number.parseInt(month)
    })

    // Format and export data
    const exportData = formatDataForExport(filteredIncomes, filteredExpenses, filteredGoals)

    if (exportData.length === 0) {
      toast({
        title: "No data available",
        description: "There is no data available for the selected month.",
        variant: "destructive",
      })
      return
    }

    const monthName = new Date(`${year}-${month}-01`).toLocaleString("default", { month: "long" })
    exportToExcel(exportData, `financial-data-${monthName}-${year}`)

    toast({
      title: "Download started",
      description: `Financial data for ${monthName} ${year} is being downloaded.`,
    })

    setDialogOpen(false)
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)}>
        <Download className="mr-2 h-4 w-4" />
        Download
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Download Financial Data</DialogTitle>
            <DialogDescription>
              Select a month and year to download your financial data in Excel format.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <label className="block text-sm font-medium mb-2">Select Month and Year</label>
            <DownloadMonthPicker value={selectedMonth} onChange={setSelectedMonth} />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDownload}>Download</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
