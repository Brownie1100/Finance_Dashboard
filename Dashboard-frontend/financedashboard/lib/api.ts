// Centralized API functions
const API_BASE_URL = "http://localhost:8282/api"

// Generic API call function with error handling
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    console.log(`Making API call to: ${API_BASE_URL}${endpoint}`, options)
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      console.warn(`API call failed: ${endpoint}`, response.status)
      throw new Error(`API call failed: ${response.status}`)
    }

    // Check if response has content before trying to parse JSON
    const contentLength = response.headers.get("content-length")
    const contentType = response.headers.get("content-type")

    // If content-length is 0 or no content-type, return empty response
    if (contentLength === "0" || !contentType?.includes("application/json")) {
      return {} as T
    }

    // Try to parse JSON, but handle empty responses gracefully
    try {
      const data = await response.json()
      return data
    } catch (jsonError) {
      // If JSON parsing fails (empty body), return empty object
      console.log("Response body is empty or not JSON, returning empty object")
      return {} as T
    }
  } catch (error) {
    console.warn(`API call error: ${endpoint}`, error)
    throw error
  }
}

// Income API functions
export async function fetchIncomes(userId: string) {
  return apiCall(`/income/${userId}`)
}

export async function createIncome(userId: string, incomeData: any) {
  return apiCall(`/income`, {
    method: "POST",
    body: JSON.stringify(incomeData),
  })
}

export async function updateIncome(incomeId: number, incomeData: any) {
  return apiCall(`/income/${incomeId}`, {
    method: "PUT",
    body: JSON.stringify(incomeData),
  })
}

export async function deleteIncomes(ids: number[]) {
  return apiCall(`/income`, {
    method: "DELETE",
    body: JSON.stringify(ids),
  })
}

// Expense API functions
export async function fetchExpenses(userId: string) {
  return apiCall(`/expense/${userId}`)
}

export async function createExpense(userId: string, expenseData: any) {
  return apiCall(`/expense`, {
    method: "POST",
    body: JSON.stringify(expenseData),
  })
}

export async function updateExpense(expenseId: number, expenseData: any) {
  return apiCall(`/expense/${expenseId}`, {
    method: "PUT",
    body: JSON.stringify(expenseData),
  })
}

export async function deleteExpenses(ids: number[]) {
  return apiCall(`/expense`, {
    method: "DELETE",
    body: JSON.stringify(ids),
  })
}

// Goals API functions
export async function fetchGoals(userId: string) {
  return apiCall(`/goal/${userId}`)
}

export async function fetchSavingsGoals(userId: string) {
  return apiCall(`/goal/${userId}`)
}

export async function createGoal(userId: string, goalData: any) {
  return apiCall(`/goal`, {
    method: "POST",
    body: JSON.stringify(goalData),
  })
}

export async function updateGoal(goalId: number, goalData: any) {
  return apiCall(`/goal/${goalId}`, {
    method: "PUT",
    body: JSON.stringify(goalData),
  })
}

export async function deleteGoals(ids: number[]) {
  return apiCall(`/goal`, {
    method: "DELETE",
    body: JSON.stringify(ids),
  })
}

// Budget API functions
export async function fetchBudgets(userId: string) {
  return apiCall(`/budget/${userId}`)
}

export async function createBudget(userId: string, budgetData: any) {
  return apiCall(`/budget`, {
    method: "POST",
    body: JSON.stringify(budgetData),
  })
}

export async function updateBudget(budgetId: number, budgetData: any) {
  return apiCall(`/budget/${budgetId}`, {
    method: "PUT",
    body: JSON.stringify(budgetData),
  })
}

export async function deleteBudgets(ids: number[]) {
  return apiCall(`/budget`, {
    method: "DELETE",
    body: JSON.stringify(ids),
  })
}
