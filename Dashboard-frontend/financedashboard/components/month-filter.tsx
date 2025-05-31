"use client"

import { CalendarIcon, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface MonthFilterProps {
  selectedMonth: string
  onMonthChange: (month: string) => void
}

const months = [
  { value: "all", label: "All Months" },
  { value: "2024-01", label: "January 2024" },
  { value: "2024-02", label: "February 2024" },
  { value: "2024-03", label: "March 2024" },
  { value: "2024-04", label: "April 2024" },
  { value: "2024-05", label: "May 2024" },
  { value: "2024-06", label: "June 2024" },
  { value: "2024-07", label: "July 2024" },
  { value: "2024-08", label: "August 2024" },
  { value: "2024-09", label: "September 2024" },
  { value: "2024-10", label: "October 2024" },
  { value: "2024-11", label: "November 2024" },
  { value: "2024-12", label: "December 2024" },
]

export function MonthFilter({ selectedMonth, onMonthChange }: MonthFilterProps) {
  const currentMonth = months.find((month) => month.value === selectedMonth) || months[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <CalendarIcon className="h-4 w-4" />
          <span className="hidden sm:inline">{currentMonth.label}</span>
          <span className="sm:hidden">Month</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {months.map((month) => (
          <DropdownMenuItem
            key={month.value}
            onClick={() => onMonthChange(month.value)}
            className={selectedMonth === month.value ? "bg-accent" : ""}
          >
            {month.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
