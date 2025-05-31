// Utility functions for date filtering
export function filterDataByMonth<T extends { date: string }>(data: T[], selectedMonth: string): T[] {
  if (selectedMonth === "all") {
    return data
  }

  return data.filter((item) => {
    const itemDate = new Date(item.date)
    const itemMonth = `${itemDate.getFullYear()}-${String(itemDate.getMonth() + 1).padStart(2, "0")}`
    return itemMonth === selectedMonth
  })
}

export function getCurrentMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
}
