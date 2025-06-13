"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ComparisonMonthPickerProps {
  selectedMonth: string
  onMonthChange: (month: string) => void
  className?: string
}

export function ComparisonMonthPicker({ selectedMonth, onMonthChange, className }: ComparisonMonthPickerProps) {
  const [date, setDate] = useState<Date | undefined>(undefined)

  // Initialize date from selectedMonth when component mounts or when selectedMonth changes
  useEffect(() => {
    if (selectedMonth && selectedMonth !== "all-time") {
      const [year, month] = selectedMonth.split("-")
      const newDate = new Date(Number.parseInt(year), Number.parseInt(month) - 1)
      setDate(newDate)
    } else {
      setDate(new Date())
    }
  }, [selectedMonth])

  // Handle date change from calendar
  const handleSelect = (newDate: Date | undefined) => {
    if (!newDate) return

    setDate(newDate)
    const formattedMonth = format(newDate, "yyyy-MM")
    onMonthChange(formattedMonth)

    // Log for debugging
    console.log("Comparison month changed to:", formattedMonth)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-[200px] justify-start text-left font-normal", !date && "text-muted-foreground", className)}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "MMMM yyyy") : "Select month"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
          disabled={(date) => date > new Date() || date < new Date(2020, 0, 1)}
        />
      </PopoverContent>
    </Popover>
  )
}
