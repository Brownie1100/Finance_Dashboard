import { PiggyBank } from "lucide-react"

import { Progress } from "@/components/ui/progress"

const savingsGoals = [
  {
    id: "1",
    name: "Emergency Fund",
    current: 5000,
    target: 10000,
    progress: 50,
  },
  {
    id: "2",
    name: "Vacation",
    current: 2500,
    target: 3000,
    progress: 83.33,
  },
  {
    id: "3",
    name: "New Car",
    current: 7500,
    target: 20000,
    progress: 37.5,
  },
]

export function SavingsProgress() {
  return (
    <div className="space-y-6">
      {savingsGoals.map((goal) => (
        <div key={goal.id} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PiggyBank className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{goal.name}</span>
            </div>
            <div className="text-sm font-medium">
              ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
            </div>
          </div>
          <Progress value={goal.progress} className="h-2" />
          <p className="text-xs text-muted-foreground text-right">{goal.progress.toFixed(0)}% complete</p>
        </div>
      ))}
    </div>
  )
}
