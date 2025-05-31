// Utility function to ensure we always work with arrays
export function ensureArray<T>(data: T | T[]): T[] {
  if (!data) return []
  return Array.isArray(data) ? data : [data]
}

// Safe reduce function that handles both arrays and single objects
export function safeReduce<T, R>(data: T | T[], reducer: (acc: R, current: T) => R, initialValue: R): R {
  const arrayData = ensureArray(data)
  return arrayData.reduce(reducer, initialValue)
}
