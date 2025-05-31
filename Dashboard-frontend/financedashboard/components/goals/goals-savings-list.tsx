"use client"

import { useState } from "react"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"

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

interface GoalsSavingsListProps {
  goals: Goal[]
  availableSavings: number
  showActions?: boolean
  onRefresh: () => void
}

export function GoalsSavingsList({ goals, availableSavings, showActions = false, onRefresh }: GoalsSavingsListProps) {
  const { formatAmount } = useCurrency()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Calculate total goal amount
  const totalGoalAmount = goals.reduce((sum, goal) => sum + goal.amount, 0)

  // Calculate progress for each goal based on time elapsed
  const calculateProgress = (goal: Goal) => {
    const startDate = new Date(goal.startDate)
    const endDate = new Date(goal.endDate)
    const today = new Date()

    // If goal is in the future, progress is 0
    if (today < startDate) return 0

    // If goal is in the past, progress is 100%
    if (today > endDate) return 100

    // Calculate progress based on time elapsed
    const totalDuration = endDate.getTime() - startDate.getTime()
    const elapsedDuration = today.getTime() - startDate.getTime()
    return Math.min(100, Math.round((elapsedDuration / totalDuration) * 100))
  }

  // Calculate amount saved based on progress
  const calculateAmountSaved = (goal: Goal) => {
    const progress = calculateProgress(goal)
    return (progress / 100) * goal.amount
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
          title: "Savings goal deleted",
          description: `${selectedGoal.category} goal has been deleted successfully.`,
        })
        onRefresh()
      } else {
        toast({
          title: "Error",
          description: "Failed to delete the savings goal. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting savings goal:", error)
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

  if (goals.length === 0) {
    return (
      <div className="text-center py-8 text-blue-600">
        <p>No savings goals created yet</p>
        <p className="text-sm mt-2">Create a savings goal to start tracking your progress</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {goals.map((goal) => {
        const progress = calculateProgress(goal)
        const amountSaved = calculateAmountSaved(goal)
        const remaining = goal.amount - amountSaved
        const endDate = new Date(goal.endDate)

        return (
          <div key={goal.id} className="border border-blue-200 rounded-lg p-4 bg-white dark:bg-blue-950/20">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium text-blue-800 dark:text-blue-200">{goal.category}</h3>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Target: {formatAmount(goal.amount)} by {format(endDate, "MMM d, yyyy")}
                </p>
              </div>
              {showActions && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <DotsHorizontalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => {
                        setSelectedGoal(goal)
                        setDeleteDialogOpen(true)
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-blue-600 dark:text-blue-400">
                  {formatAmount(amountSaved)} saved ({progress}%)
                </span>
                <span className="text-blue-600 dark:text-blue-400">{formatAmount(remaining)} to go</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {goal.description && <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">{goal.description}</p>}
          </div>
        )
      })}

      {totalGoalAmount > availableSavings && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-md mt-4">
          <p className="text-amber-700">
            <strong>Note:</strong> Your total savings goals ({formatAmount(totalGoalAmount)}) exceed your current
            monthly savings ({formatAmount(availableSavings)}). Consider adjusting your goals or increasing your
            savings.
          </p>
        </div>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Savings Goal</DialogTitle>
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
