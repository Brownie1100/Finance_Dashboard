"use client"

import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface DownloadMonthPickerProps {
  value: string
  onChange: (month: string) => void
}

export function DownloadMonthPicker({ value, onChange }: DownloadMonthPickerProps) {
  const [open, setOpen] = useState(false)

  // Use either value or selectedMonth prop
  const currentMonth = value || "all-time"

  const [viewYear, setViewYear] = useState(() => {
    if (currentMonth === "all-time") return new Date().getFullYear()
    if (currentMonth) {
      const [yearPart] = currentMonth.split("-")
      return Number.parseInt(yearPart)
    }
    return new Date().getFullYear()
  })

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const handleMonthSelect = (monthIndex: number) => {
    const monthStr = (monthIndex + 1).toString().padStart(2, "0")
    const newMonth = `${viewYear}-${monthStr}`
    onChange(newMonth)
    setOpen(false)
  }

  const handleAllTimeSelect = () => {
    onChange("all-time")
    setOpen(false)
  }

  const formatSelectedDate = () => {
    if (currentMonth === "all-time") return "All Time"
    if (!currentMonth) return "Select period"
    const [yearPart, monthPart] = currentMonth.split("-")
    const monthIndex = Number.parseInt(monthPart) - 1
    return `${months[monthIndex]} ${yearPart}`
  }

  const isMonthSelected = (monthIndex: number) => {
    if (currentMonth === "all-time") return false
    if (!currentMonth) return false
    const [yearPart, monthPart] = currentMonth.split("-")
    return Number.parseInt(yearPart) === viewYear && Number.parseInt(monthPart) === monthIndex + 1
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("justify-start text-left font-normal w-[200px]", !currentMonth && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span>{formatSelectedDate()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="end">
        <div className="space-y-4">
          {/* All Time Button */}
          <Button
            variant={currentMonth === "all-time" ? "default" : "outline"}
            className="w-full"
            onClick={handleAllTimeSelect}
          >
            All Time
          </Button>

          {/* Year Navigation */}
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={() => setViewYear(viewYear - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="font-semibold">{viewYear}</div>
            <Button variant="outline" size="sm" onClick={() => setViewYear(viewYear + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Month Grid */}
          <div className="grid grid-cols-3 gap-2">
            {months.map((month, index) => (
              <Button
                key={month}
                variant={isMonthSelected(index) ? "default" : "outline"}
                size="sm"
                className="h-9"
                onClick={() => handleMonthSelect(index)}
              >
                {month}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
