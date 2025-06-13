"use client"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface YearPickerProps {
  selectedYear: number
  onChange: (year: number) => void
}

export function YearPicker({ selectedYear, onChange }: YearPickerProps) {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i)

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onChange(selectedYear - 1)}>
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous year</span>
      </Button>
      <select
        value={selectedYear}
        onChange={(e) => onChange(Number.parseInt(e.target.value))}
        className="h-8 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onChange(selectedYear + 1)}>
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next year</span>
      </Button>
    </div>
  )
}
