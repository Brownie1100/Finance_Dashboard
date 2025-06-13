"use client"

import { useState } from "react"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Trash2, Edit } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useCurrency } from "@/hooks/use-currency"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

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

interface Expense {
  id: number
  category: string
  amount: number
  date: string
  description?: string
}

interface GoalsBudgetTableProps {
  goals: Goal[]
  expenses: Expense[]
  onRefresh: () => void
}

export function GoalsBudgetTable({ goals, expenses, onRefresh }: GoalsBudgetTableProps) {
  const { formatAmount } = useCurrency()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedGoals, setSelectedGoals] = useState<number[]>([])

  // Calculate spent amount for each category
  const getSpentAmount = (category: string) => {
    return expenses.filter((expense) => expense.category === category).reduce((sum, expense) => sum + expense.amount, 0)
  }

  const handleDelete = async () => {
    if (!selectedGoal) return

    setIsDeleting(true)
    try {
      const response = await fetch(`http://localhost:8282/api/goal/${selectedGoal.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Budget goal deleted",
          description: `${selectedGoal.category} budget goal has been deleted successfully.`,
        })
        onRefresh()
      } else {
        toast({
          title: "Error",
          description: "Failed to delete the budget goal. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting budget goal:", error)
      toast({
        title: "Error",
        description: "Failed to connect to the server. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allGoalIds = goals.map((goal) => goal.id)
      setSelectedGoals(allGoalIds)
    } else {
      setSelectedGoals([])
    }
  }

  const handleSelectGoal = (goalId: number, checked: boolean) => {
    if (checked) {
      setSelectedGoals([...selectedGoals, goalId])
    } else {
      setSelectedGoals(selectedGoals.filter((id) => id !== goalId))
    }
  }

  return (
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
            <TableHead className="text-blue-800">Category</TableHead>
            <TableHead className="text-blue-800">Allocated</TableHead>
            <TableHead className="text-blue-800">Spent</TableHead>
            <TableHead className="text-blue-800">Remaining</TableHead>
            <TableHead className="text-blue-800">Progress</TableHead>
            <TableHead className="text-blue-800 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {goals.map((goal) => {
            const spent = getSpentAmount(goal.category)
            const remaining = goal.amount - spent
            const progress = goal.amount > 0 ? (spent / goal.amount) * 100 : 0

            return (
              <TableRow key={goal.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedGoals.includes(goal.id)}
                    onCheckedChange={(checked) => handleSelectGoal(goal.id, checked as boolean)}
                  />
                </TableCell>
                <TableCell className="font-medium">{goal.category}</TableCell>
                <TableCell>{formatAmount(goal.amount)}</TableCell>
                <TableCell>{formatAmount(spent)}</TableCell>
                <TableCell>{formatAmount(remaining)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={progress} className="h-2" />
                    <span className="text-xs text-blue-600">{progress.toFixed(0)}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <DotsHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
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
                </TableCell>
              </TableRow>
            )
          })}

          {goals.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4 text-blue-600">
                No budget goals created yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Budget Goal</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the "{selectedGoal?.category}" budget goal? This action cannot be undone.
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
