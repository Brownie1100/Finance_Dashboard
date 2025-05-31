"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"
import { useCurrency } from "@/hooks/use-currency"
import { useUser } from "@/hooks/use-user"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  targetAmount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Target amount must be a positive number",
  }),
  targetDate: z.date({
    required_error: "Target date is required.",
  }),
  notes: z.string().optional(),
})

interface GoalsSavingsFormProps {
  availableSavings: number
  onSuccess: () => void
}

export function GoalsSavingsForm({ availableSavings, onSuccess }: GoalsSavingsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { getCurrencySymbol, formatAmount } = useCurrency()
  const { userId } = useUser()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      targetAmount: "",
      notes: "",
    },
  })

  const targetAmount = form.watch("targetAmount")
  const targetDate = form.watch("targetDate")

  // Calculate monthly contribution
  const calculateMonthlyContribution = () => {
    if (!targetAmount || !targetDate) return 0

    const amount = Number(targetAmount)
    if (isNaN(amount) || amount <= 0) return 0

    const today = new Date()
    const months = (targetDate.getFullYear() - today.getFullYear()) * 12 + (targetDate.getMonth() - today.getMonth())

    return months > 0 ? amount / months : amount
  }

  const monthlyContribution = calculateMonthlyContribution()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!userId) {
      toast({
        title: "Error",
        description: "User ID is missing. Please log in again.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const today = new Date()

      const response = await fetch("http://localhost:8282/api/goal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          category: values.name,
          type: "Savings",
          amount: Number(values.targetAmount),
          startDate: today.toISOString().split("T")[0],
          endDate: values.targetDate.toISOString().split("T")[0],
          description: values.notes || "",
        }),
      })

      if (response.ok) {
        toast({
          title: "Savings goal created successfully",
          description: `${values.name} goal has been created with a target of ${formatAmount(Number(values.targetAmount))}.`,
        })
        form.reset()
        onSuccess()
      } else {
        const errorData = await response.json().catch(() => null)
        toast({
          title: "Failed to create savings goal",
          description: errorData?.message || "An error occurred while creating the goal.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating savings goal:", error)
      toast({
        title: "Error",
        description: "Failed to connect to the server. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-blue-800">Goal Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., New Car, Vacation, Emergency Fund"
                  {...field}
                  className="border-blue-200/50 focus-visible:ring-blue-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="targetAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-blue-800">Target Amount ({getCurrencySymbol()})</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {getCurrencySymbol()}
                  </span>
                  <Input
                    placeholder="0.00"
                    {...field}
                    className="border-blue-200/50 focus-visible:ring-blue-500 pl-8"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="targetDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-blue-800">Target Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal border-blue-200/50 focus-visible:ring-blue-500",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription className="text-blue-600">When do you want to achieve this goal?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {monthlyContribution > 0 && (
          <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">Monthly Contribution</h4>
            <p className="text-blue-700">
              To reach your goal of {formatAmount(Number(targetAmount))} by{" "}
              {targetDate ? format(targetDate, "MMMM yyyy") : "your target date"}, you'll need to save approximately{" "}
              <strong>{formatAmount(monthlyContribution)}</strong> per month.
            </p>
            {monthlyContribution > availableSavings && (
              <p className="mt-2 text-amber-600">
                <strong>Note:</strong> This is {formatAmount(monthlyContribution - availableSavings)} more than your
                current monthly savings. You may need to increase your income or reduce expenses.
              </p>
            )}
          </div>
        )}

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-blue-800">Notes (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Add notes about this goal"
                  {...field}
                  className="border-blue-200/50 focus-visible:ring-blue-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
          {isSubmitting ? "Creating..." : "Create Savings Goal"}
        </Button>
      </form>
    </Form>
  )
}
