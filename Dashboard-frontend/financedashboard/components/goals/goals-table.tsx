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
import { useCurrency } from "@/hooks/use-currency"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { updateGoal, deleteGoals } from "@/lib/api"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Goal {
  id: number
  userId: number
  category: string
  type: "Savings" | "Budget"
  amount: number
  startDate: string
  endDate: string
  description?: string
}

interface GoalsTableProps {
  goals: Goal[]
  onRefresh: () => void
}

export function GoalsTable({ goals, onRefresh }: GoalsTableProps) {
  const { formatAmount } = useCurrency()
  const [selectedGoals, setSelectedGoals] = useState<number[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [editingGoal, setEditingGoal] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({
    category: "",
    type: "Savings" as "Savings" | "Budget",
    amount: "",
    startDate: new Date(),
    endDate: new Date(),
    description: "",
  })

  const handleSelectGoal = (goalId: number, checked: boolean) => {
    if (checked) {
      setSelectedGoals([...selectedGoals, goalId])
    } else {
      setSelectedGoals(selectedGoals.filter((id) => id !== goalId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedGoals(goals.map((goal) => goal.id))
    } else {
      setSelectedGoals([])
    }
  }

  const startEdit = (goal: Goal) => {
    setEditingGoal(goal.id)
    setEditForm({
      category: goal.category,
      type: goal.type,
      amount: goal.amount.toString(),
      startDate: new Date(goal.startDate),
      endDate: new Date(goal.endDate),
      description: goal.description || "",
    })
  }

  const cancelEdit = () => {
    setEditingGoal(null)
    setEditForm({
      category: "",
      type: "Savings",
      amount: "",
      startDate: new Date(),
      endDate: new Date(),
      description: "",
    })
  }

  const saveEdit = async (id: number) => {
    try {
      const updateData = {
        category: editForm.category,
        type: editForm.type,
        amount: Number(editForm.amount),
        startDate: editForm.startDate.toISOString().split("T")[0],
        endDate: editForm.endDate.toISOString().split("T")[0],
        description: editForm.description,
      }

      await updateGoal(id, updateData)
      toast({
        title: "Goal updated successfully",
        description: "The goal has been updated.",
        className:
          "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/50 dark:border-blue-800/50 dark:text-blue-300",
      })
      setEditingGoal(null)
      onRefresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update goal. Please try again.",
        variant: "destructive",
      })
    }
  }

  const updateSelectedGoals = () => {
    if (selectedGoals.length === 1) {
      const goal = goals.find((g) => g.id === selectedGoals[0])
      if (goal) {
        startEdit(goal)
      }
    } else if (selectedGoals.length > 1) {
      toast({
        title: "Multiple selection",
        description: "Please select only one goal to edit.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "No selection",
        description: "Please select a goal to edit.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (!selectedGoal) return

    setIsDeleting(true)
    try {
      await deleteGoals([selectedGoal.id])
      toast({
        title: "Goal deleted",
        description: `${selectedGoal.category} goal has been deleted successfully.`,
        className:
          "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/50 dark:border-blue-800/50 dark:text-blue-300",
      })
      onRefresh()
    } catch (error) {
      console.error("Error deleting goal:", error)
      toast({
        title: "Error",
        description: "Failed to delete the goal. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  const deleteSelectedGoals = async () => {
    if (selectedGoals.length === 0) return

    try {
      await deleteGoals(selectedGoals)
      toast({
        title: "Goals deleted",
        description: `${selectedGoals.length} goals have been deleted successfully.`,
        className:
          "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/50 dark:border-blue-800/50 dark:text-blue-300",
      })
      setSelectedGoals([])
      onRefresh()
    } catch (error) {
      console.error("Error deleting goals:", error)
      toast({
        title: "Error",
        description: "Failed to delete some goals. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button onClick={updateSelectedGoals} disabled={selectedGoals.length !== 1} size="sm" variant="outline">
          <Edit className="h-4 w-4 mr-2" />
          Edit Selected
        </Button>
        <Button onClick={deleteSelectedGoals} disabled={selectedGoals.length === 0} size="sm" variant="destructive">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Selected ({selectedGoals.length})
        </Button>
        <span className="text-sm text-muted-foreground">
          {selectedGoals.length} of {goals.length} selected
        </span>
      </div>

      <div className="rounded-md border border-blue-200/50">
        <Table>
          <TableHeader className="bg-blue-50/50">
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedGoals.length === goals.length && goals.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="text-blue-800">Type</TableHead>
              <TableHead className="text-blue-800">Name/Category</TableHead>
              <TableHead className="text-blue-800">Amount</TableHead>
              <TableHead className="text-blue-800">Start Date</TableHead>
              <TableHead className="text-blue-800">End Date</TableHead>
              <TableHead className="text-blue-800 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {goals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-blue-600 dark:text-blue-400">
                  No goals created yet
                </TableCell>
              </TableRow>
            ) : (
              goals.map((goal) => (
                <TableRow key={goal.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedGoals.includes(goal.id)}
                      onCheckedChange={(checked) => handleSelectGoal(goal.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    {editingGoal === goal.id ? (
                      <Select
                        value={editForm.type}
                        onValueChange={(value: "Savings" | "Budget") => setEditForm({ ...editForm, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Savings">Savings</SelectItem>
                          <SelectItem value="Budget">Budget</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          goal.type === "Savings"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                        }`}
                      >
                        {goal.type}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingGoal === goal.id ? (
                      <Input
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        placeholder="Category name"
                        className="w-full"
                      />
                    ) : (
                      <span className="font-medium">{goal.category}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingGoal === goal.id ? (
                      <Input
                        type="number"
                        value={editForm.amount}
                        onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                        className="w-full"
                      />
                    ) : (
                      formatAmount(goal.amount)
                    )}
                  </TableCell>
                  <TableCell>
                    {editingGoal === goal.id ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !editForm.startDate && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {editForm.startDate ? editForm.startDate.toLocaleDateString() : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={editForm.startDate}
                            onSelect={(date) => date && setEditForm({ ...editForm, startDate: date })}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    ) : (
                      formatDate(goal.startDate)
                    )}
                  </TableCell>
                  <TableCell>
                    {editingGoal === goal.id ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !editForm.endDate && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {editForm.endDate ? editForm.endDate.toLocaleDateString() : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={editForm.endDate}
                            onSelect={(date) => date && setEditForm({ ...editForm, endDate: date })}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    ) : (
                      formatDate(goal.endDate)
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingGoal === goal.id ? (
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" onClick={() => saveEdit(goal.id)}>
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
                          <DropdownMenuItem onClick={() => startEdit(goal)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setSelectedGoal(goal)
                              setDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
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

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Goal</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the "{selectedGoal?.category}" goal? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
