import { toast } from "@/components/ui/use-toast"
import type { ToastProps } from "@/components/ui/toast"

// Simple toast function that works with both object and separate parameters
export function showIncomeToast(
  titleOrOptions: string | ToastProps,
  description?: string,
  variant: "default" | "destructive" = "default",
) {
  if (typeof titleOrOptions === "string") {
    return toast({
      title: titleOrOptions,
      description,
      variant,
      className:
        variant === "destructive"
          ? "bg-red-50 border-red-200 text-red-800 dark:bg-red-950/50 dark:border-red-800/50 dark:text-red-300"
          : "bg-green-50 border-green-200 text-green-800 dark:bg-green-950/50 dark:border-green-800/50 dark:text-green-300",
    })
  } else {
    return toast(titleOrOptions)
  }
}

export function showExpenseToast(
  titleOrOptions: string | ToastProps,
  description?: string,
  variant: "default" | "destructive" = "default",
) {
  if (typeof titleOrOptions === "string") {
    return toast({
      title: titleOrOptions,
      description,
      variant,
      className:
        variant === "destructive"
          ? "bg-red-50 border-red-200 text-red-800 dark:bg-red-950/50 dark:border-red-800/50 dark:text-red-300"
          : "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950/50 dark:border-yellow-800/50 dark:text-yellow-300",
    })
  } else {
    return toast(titleOrOptions)
  }
}

export function showGoalToast(
  titleOrOptions: string | ToastProps,
  description?: string,
  variant: "default" | "destructive" = "default",
) {
  if (typeof titleOrOptions === "string") {
    return toast({
      title: titleOrOptions,
      description,
      variant,
      className:
        variant === "destructive"
          ? "bg-red-50 border-red-200 text-red-800 dark:bg-red-950/50 dark:border-red-800/50 dark:text-red-300"
          : "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/50 dark:border-blue-800/50 dark:text-blue-300",
    })
  } else {
    return toast(titleOrOptions)
  }
}

export function showSuccessToast() {
  // Deprecated - use toast() directly
}

export function showErrorToast() {
  // Deprecated - use toast() directly
}

export function showInfoToast() {
  // Deprecated - use toast() directly
}

export function showWarningToast() {
  // Deprecated - use toast() directly
}
