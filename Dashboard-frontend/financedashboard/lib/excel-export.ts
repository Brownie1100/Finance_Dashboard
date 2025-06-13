import * as XLSX from "xlsx"

interface ExportData {
  date: string
  category: string
  amount: number
  description?: string
}

export function exportToExcel(data: ExportData[], filename: string): void {
  // Create a worksheet
  const ws = XLSX.utils.json_to_sheet(data)

  // Create a workbook
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Data")

  // Generate Excel file and trigger download
  XLSX.writeFile(wb, `${filename}.xlsx`)
}

export function formatDataForExport(incomes: any[] = [], expenses: any[] = [], goals: any[] = []): ExportData[] {
  const formattedIncomes = incomes.map((income) => ({
    date: income.date,
    category: income.category,
    amount: income.amount,
    description: income.description || "",
    type: "Income",
  }))

  const formattedExpenses = expenses.map((expense) => ({
    date: expense.date,
    category: expense.category,
    amount: expense.amount,
    description: expense.description || "",
    type: "Expense",
  }))

  const formattedGoals = goals.map((goal) => ({
    date: goal.startDate,
    category: goal.category,
    amount: goal.amount,
    description: goal.description || "",
    type: goal.type,
  }))

  return [...formattedIncomes, ...formattedExpenses, ...formattedGoals]
}
