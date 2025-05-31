"use client"

import { useState } from "react"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Edit, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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

  const handleDelete = async () => {
    if (!selectedGoal) return

    setIsDeleting(true)
    try {
      const response = await fetch(`http://localhost:8282/api/goal/${selectedGoal.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Goal deleted",
          description: `${selectedGoal.category} goal has been deleted successfully.`,
        })
        onRefresh()
      } else {
        toast({
          title: "Error",
          description: "Failed to delete the goal. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting goal:", error)
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

  const deleteSelectedGoals = async () => {
    if (selectedGoals.length === 0) return

    try {
      const deletePromises = selectedGoals.map((goalId) =>
        fetch(`http://localhost:8282/api/goal/${goalId}`, {
          method: "DELETE",
        }),
      )

      await Promise.all(deletePromises)

      toast({
        title: "Goals deleted",
        description: `${selectedGoals.length} goals have been deleted successfully.`,
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
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        goal.type === "Savings"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                      }`}
                    >
                      {goal.type}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{goal.category}</TableCell>
                  <TableCell>{formatAmount(goal.amount)}</TableCell>
                  <TableCell>{formatDate(goal.startDate)}</TableCell>
                  <TableCell>{formatDate(goal.endDate)}</TableCell>
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
