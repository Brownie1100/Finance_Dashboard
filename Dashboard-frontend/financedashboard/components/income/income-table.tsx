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
import { deleteIncomes, updateIncome } from "@/lib/api"

interface Income {
  id: number
  category: string
  amount: number
  date: string
  description?: string
}

interface IncomeTableProps {
  incomes: Income[]
  onIncomeDeleted: () => void
  onIncomeUpdated: () => void
}

export function IncomeTable({ incomes, onIncomeDeleted, onIncomeUpdated }: IncomeTableProps) {
  const { formatAmount } = useCurrency()
  const [selectedIncomes, setSelectedIncomes] = useState<number[]>([])
  const [editingIncome, setEditingIncome] = useState<number | null>(null)
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

  const handleSelectIncome = (incomeId: number, checked: boolean) => {
    if (checked) {
      setSelectedIncomes([...selectedIncomes, incomeId])
    } else {
      setSelectedIncomes(selectedIncomes.filter((id) => id !== incomeId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIncomes(incomes.map((income) => income.id))
    } else {
      setSelectedIncomes([])
    }
  }

  const deleteSelectedIncomes = async () => {
    if (selectedIncomes.length === 0) {
      toast({
        title: "No selection",
        description: "Please select at least one income to delete.",
        variant: "destructive",
      })
      return
    }

    try {
      await deleteIncomes(selectedIncomes)
      toast({
        title: "Incomes deleted successfully",
        description: `${selectedIncomes.length} income(s) have been removed.`,
        className:
          "bg-green-50 border-green-200 text-green-800 dark:bg-green-950/50 dark:border-green-800/50 dark:text-green-300",
      })
      setSelectedIncomes([])
      onIncomeDeleted()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete incomes. Please try again.",
        variant: "destructive",
      })
    }
  }

  const startEdit = (income: Income) => {
    setEditingIncome(income.id)
    setEditForm({
      category: income.category || "salary", // Provide default value
      amount: income.amount.toString(),
      date: new Date(income.date),
      description: income.description || "",
    })
  }

  const cancelEdit = () => {
    setEditingIncome(null)
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

      await updateIncome(id, updateData)
      toast({
        title: "Income updated successfully",
        description: "The income record has been updated.",
        className:
          "bg-green-50 border-green-200 text-green-800 dark:bg-green-950/50 dark:border-green-800/50 dark:text-green-300",
      })
      setEditingIncome(null)
      onIncomeUpdated()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update income. Please try again.",
        variant: "destructive",
      })
    }
  }

  const updateSelectedIncomes = () => {
    if (selectedIncomes.length === 1) {
      const income = incomes.find((i) => i.id === selectedIncomes[0])
      if (income) {
        startEdit(income)
      }
    } else if (selectedIncomes.length > 1) {
      toast({
        title: "Multiple selection",
        description: "Please select only one income to edit.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "No selection",
        description: "Please select an income to edit.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button onClick={updateSelectedIncomes} disabled={selectedIncomes.length !== 1} size="sm" variant="outline">
          <Edit className="h-4 w-4 mr-2" />
          Edit Selected
        </Button>
        <Button
          onClick={deleteSelectedIncomes}
          disabled={selectedIncomes.length === 0}
          size="sm"
          variant="outline"
          className="text-red-600 hover:bg-red-100"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Selected
        </Button>
        <span className="text-sm text-muted-foreground">
          {selectedIncomes.length} of {incomes.length} selected
        </span>
      </div>

      <div className="rounded-md border border-green-200/50">
        <Table>
          <TableHeader className="bg-green-50/50">
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedIncomes.length === incomes.length && incomes.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="text-green-800">Date</TableHead>
              <TableHead className="text-green-800">Source</TableHead>
              <TableHead className="text-green-800">Amount</TableHead>
              <TableHead className="text-green-800">Description</TableHead>
              <TableHead className="text-green-800 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incomes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-green-600 dark:text-green-400">
                  No income data available
                </TableCell>
              </TableRow>
            ) : (
              incomes.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIncomes.includes(item.id)}
                      onCheckedChange={(checked) => handleSelectIncome(item.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    {editingIncome === item.id ? (
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
                    {editingIncome === item.id ? (
                      <Select
                        value={editForm.category}
                        onValueChange={(value) => setEditForm({ ...editForm, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="salary">Salary</SelectItem>
                          <SelectItem value="fd-rd-sip-return">FD/RD/SIP return</SelectItem>
                          <SelectItem value="investments-return">Investments return</SelectItem>
                          <SelectItem value="other-incomes">Other incomes</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="capitalize">{item.category.replace(/-/g, " ")}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingIncome === item.id ? (
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
                    {editingIncome === item.id ? (
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
                    {editingIncome === item.id ? (
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
                                await deleteIncomes([item.id])
                                toast({
                                  title: "Income deleted successfully",
                                  description: "The income record has been removed.",
                                  className:
                                    "bg-green-50 border-green-200 text-green-800 dark:bg-green-950/50 dark:border-green-800/50 dark:text-green-300",
                                })
                                onIncomeDeleted()
                              } catch (error) {
                                toast({
                                  title: "Error",
                                  description: "Failed to delete income. Please try again.",
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
