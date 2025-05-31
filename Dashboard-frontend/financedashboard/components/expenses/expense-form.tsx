"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { useCurrency } from "@/hooks/use-currency"
import { useUser } from "@/hooks/use-user"

const formSchema = z.object({
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  date: z.date({
    required_error: "A date is required",
  }),
  category: z.string({
    required_error: "Please select an expense category",
  }),
  description: z.string().optional(),
})

interface ExpenseFormProps {
  onExpenseAdded: () => void
}

export function ExpenseForm({ onExpenseAdded }: ExpenseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { getCurrencySymbol, formatAmount } = useCurrency()
  const { userId } = useUser()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      date: new Date(),
      description: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!userId) {
      toast({
        title: "Error",
        description: "User not logged in",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`http://localhost:8282/api/expense`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          category: values.category,
          amount: Number(values.amount),
          date: values.date.toISOString().split("T")[0], // Format as YYYY-MM-DD
          description: values.description ?? "",
        }),
      })

      if (response.ok) {
        toast({
          title: "Expense added successfully",
          description: `${formatAmount(Number(values.amount))} for ${values.category} has been recorded.`,
        })
        form.reset({
          amount: "",
          date: new Date(),
          description: "",
          category: undefined,
        })
        onExpenseAdded() // Refresh the parent component
      } else {
        const errorData = await response.text()
        console.error("API Error:", errorData)
        throw new Error("Failed to add expense")
      }
    } catch (error) {
      console.error("Error adding expense:", error)
      toast({
        title: "Error",
        description: "Failed to add expense. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-yellow-800">Amount ({getCurrencySymbol()})</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {getCurrencySymbol()}
                    </span>
                    <Input
                      placeholder="0.00"
                      {...field}
                      className="border-yellow-200/50 focus-visible:ring-yellow-500 pl-8"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-yellow-800">Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal border-yellow-200/50 focus-visible:ring-yellow-500",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? field.value.toLocaleDateString() : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-yellow-800">Expense Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border-yellow-200/50 focus-visible:ring-yellow-500">
                    <SelectValue placeholder="Select expense category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="housing">Housing</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="transportation">Transportation</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription className="text-yellow-600">Select the category of your expense</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-yellow-800">Description (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Add details about this expense"
                  {...field}
                  className="border-yellow-200/50 focus-visible:ring-yellow-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="bg-yellow-600 hover:bg-yellow-700">
          {isSubmitting ? "Adding..." : "Add Expense"}
        </Button>
      </form>
    </Form>
  )
}
