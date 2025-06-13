"use client"

import { useState } from "react"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { CalendarIcon, Edit, Save, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { useCurrency } from "@/hooks/use-currency"
import { cn } from "@/lib/utils"
import { deleteExpenses, updateExpense } from "@/lib/api"

interface Expense {
  id: number
  category: string
  amount: number
  date: string
  description?: string
}

interface ExpenseTableProps {
  expenses: Expense[]
  onExpenseDeleted: () => void
  onExpenseUpdated: () => void
}

export function ExpenseTable({ expenses, onExpenseDeleted, onExpenseUpdated }: ExpenseTableProps) {
  const { formatAmount } = useCurrency()
  const [selectedExpenses, setSelectedExpenses] = useState<number[]>([])
  const [editingExpense, setEditingExpense] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({
    category: "",
    amount: "",
    date: new Date(),
    description: "",
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  const handleSelectExpense = (expenseId: number, checked: boolean) => {
    if (checked) {
      setSelectedExpenses([...selectedExpenses, expenseId])
    } else {
      setSelectedExpenses(selectedExpenses.filter((id) => id !== expenseId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedExpenses(expenses.map((expense) => expense.id))
    } else {
      setSelectedExpenses([])
    }
  }

  const deleteSelectedExpenses = async () => {
    if (selectedExpenses.length === 0) {
      toast({
        title: "No selection",
        description: "Please select at least one expense to delete.",
        variant: "destructive",
      })
      return
    }

    try {
      await deleteExpenses(selectedExpenses)
      toast({
        title: "Expenses deleted successfully",
        description: `${selectedExpenses.length} expense(s) have been removed.`,
        className:
          "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950/50 dark:border-yellow-800/50 dark:text-yellow-300",
      })
      setSelectedExpenses([])
      onExpenseDeleted()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete expenses. Please try again.",
        variant: "destructive",
      })
    }
  }

  const startEdit = (expense: Expense) => {
    setEditingExpense(expense.id)
    setEditForm({
      category: expense.category || "foods-and-drinks", // Provide default value
      amount: expense.amount.toString(),
      date: new Date(expense.date),
      description: expense.description || "",
    })
  }

  const cancelEdit = () => {
    setEditingExpense(null)
    setEditForm({
      category: "",
      amount: "",
      date: new Date(),
      description: "",
    })
  }

  const saveEdit = async (id: number) => {
    try {
      const updateData = {
        category: editForm.category,
        amount: Number(editForm.amount),
        date: editForm.date.toISOString().split("T")[0],
        description: editForm.description,
      }

      await updateExpense(id, updateData)
      toast({
        title: "Expense updated successfully",
        description: "The expense record has been updated.",
        className:
          "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950/50 dark:border-yellow-800/50 dark:text-yellow-300",
      })
      setEditingExpense(null)
      onExpenseUpdated()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update expense. Please try again.",
        variant: "destructive",
      })
    }
  }

  const updateSelectedExpenses = () => {
    if (selectedExpenses.length === 1) {
      const expense = expenses.find((e) => e.id === selectedExpenses[0])
      if (expense) {
        startEdit(expense)
      }
    } else if (selectedExpenses.length > 1) {
      toast({
        title: "Multiple selection",
        description: "Please select only one expense to edit.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "No selection",
        description: "Please select an expense to edit.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button onClick={updateSelectedExpenses} disabled={selectedExpenses.length !== 1} size="sm" variant="outline">
          <Edit className="h-4 w-4 mr-2" />
          Edit Selected
        </Button>
        <Button
          onClick={deleteSelectedExpenses}
          disabled={selectedExpenses.length === 0}
          size="sm"
          variant="outline"
          className="text-red-600 hover:bg-red-100"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Selected
        </Button>
        <span className="text-sm text-muted-foreground">
          {selectedExpenses.length} of {expenses.length} selected
        </span>
      </div>

      <div className="rounded-md border border-yellow-200/50">
        <Table>
          <TableHeader className="bg-yellow-50/50">
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedExpenses.length === expenses.length && expenses.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="text-yellow-800">Date</TableHead>
              <TableHead className="text-yellow-800">Category</TableHead>
              <TableHead className="text-yellow-800">Amount</TableHead>
              <TableHead className="text-yellow-800">Description</TableHead>
              <TableHead className="text-yellow-800 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-yellow-600 dark:text-yellow-400">
                  No expense data available
                </TableCell>
              </TableRow>
            ) : (
              expenses.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedExpenses.includes(item.id)}
                      onCheckedChange={(checked) => handleSelectExpense(item.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    {editingExpense === item.id ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !editForm.date && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {editForm.date ? editForm.date.toLocaleDateString() : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={editForm.date}
                            onSelect={(date) => date && setEditForm({ ...editForm, date })}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    ) : (
                      formatDate(item.date)
                    )}
                  </TableCell>
                  <TableCell>
                    {editingExpense === item.id ? (
                      <Select
                        value={editForm.category}
                        onValueChange={(value) => setEditForm({ ...editForm, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="foods-and-drinks">Foods and Drinks</SelectItem>
                          <SelectItem value="rent">Rent</SelectItem>
                          <SelectItem value="electricity">Electricity</SelectItem>
                          <SelectItem value="travel">Travel</SelectItem>
                          <SelectItem value="fd-rd-sip-insurance-other-plans">
                            FD/RD/SIP Insurance/Other plans
                          </SelectItem>
                          <SelectItem value="investments">Investments</SelectItem>
                          <SelectItem value="daily-essentials">Daily essentials</SelectItem>
                          <SelectItem value="clothes">Clothes</SelectItem>
                          <SelectItem value="haircut">Haircut</SelectItem>
                          <SelectItem value="other-expenditures">Other Expenditures</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="capitalize">{item.category.replace(/-/g, " ")}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingExpense === item.id ? (
                      <Input
                        type="number"
                        value={editForm.amount}
                        onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                        className="w-full"
                      />
                    ) : (
                      formatAmount(item.amount)
                    )}
                  </TableCell>
                  <TableCell>
                    {editingExpense === item.id ? (
                      <Input
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        placeholder="Description"
                        className="w-full"
                      />
                    ) : (
                      item.description || "-"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingExpense === item.id ? (
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" onClick={() => saveEdit(item.id)}>
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <DotsHorizontalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => startEdit(item)}>Edit</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={async () => {
                              try {
                                await deleteExpenses([item.id])
                                toast({
                                  title: "Expense deleted successfully",
                                  description: "The expense record has been removed.",
                                  className:
                                    "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950/50 dark:border-yellow-800/50 dark:text-yellow-300",
                                })
                                onExpenseDeleted()
                              } catch (error) {
                                toast({
                                  title: "Error",
                                  description: "Failed to delete expense. Please try again.",
                                  variant: "destructive",
                                })
                              }
                            }}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
