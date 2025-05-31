"use client"

import { useState } from "react"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { CalendarIcon, Edit, Save, X } from "lucide-react"

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

  const deleteExpense = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8282/api/expense/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Expense deleted successfully",
          description: "The expense record has been removed.",
        })
        onExpenseDeleted()
      } else {
        throw new Error("Failed to delete expense")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete expense. Please try again.",
        variant: "destructive",
      })
    }
  }

  const startEdit = (expense: Expense) => {
    setEditingExpense(expense.id)
    setEditForm({
      category: expense.category,
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
      const response = await fetch(`http://localhost:8282/api/expense/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: editForm.category,
          amount: Number(editForm.amount),
          date: editForm.date.toISOString().split("T")[0],
          description: editForm.description,
        }),
      })

      if (response.ok) {
        toast({
          title: "Expense updated successfully",
          description: "The expense record has been updated.",
        })
        setEditingExpense(null)
        onExpenseUpdated()
      } else {
        throw new Error("Failed to update expense")
      }
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
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="housing">Housing</SelectItem>
                          <SelectItem value="food">Food</SelectItem>
                          <SelectItem value="transportation">Transportation</SelectItem>
                          <SelectItem value="utilities">Utilities</SelectItem>
                          <SelectItem value="entertainment">Entertainment</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="capitalize">{item.category}</span>
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
                          <DropdownMenuItem className="text-red-600" onClick={() => deleteExpense(item.id)}>
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
