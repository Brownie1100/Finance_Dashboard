"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCurrency } from "@/hooks/use-currency"
import { useUser } from "@/hooks/use-user"
import { createGoal } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  category: z.string({
    required_error: "Please select a budget category",
  }),
  notes: z.string().optional(),
})

interface GoalsBudgetFormProps {
  onSuccess: () => void
}

export function GoalsBudgetForm({ onSuccess }: GoalsBudgetFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { getCurrencySymbol, formatAmount } = useCurrency()
  const { userId } = useUser()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      notes: "",
    },
  })

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
      // Calculate end of current month
      const today = new Date()
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

      const goalData = {
        userId: userId,
        category: values.category,
        type: "Budget",
        amount: Number(values.amount),
        startDate: today.toISOString().split("T")[0],
        endDate: endOfMonth.toISOString().split("T")[0],
        description: values.notes || "",
      }

      await createGoal(userId, goalData)

      toast({
        title: "Budget goal created successfully",
        description: `${formatAmount(Number(values.amount))} allocated for ${values.category}.`,
      })

      form.reset()
      onSuccess()
    } catch (error) {
      console.error("Error creating budget goal:", error)
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
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-blue-800">Budget Amount ({getCurrencySymbol()})</FormLabel>
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
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-blue-800">Budget Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border-blue-200/50 focus-visible:ring-blue-500">
                    <SelectValue placeholder="Select budget category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="foods-and-drinks">Foods and Drinks</SelectItem>
                  <SelectItem value="rent">Rent</SelectItem>
                  <SelectItem value="electricity">Electricity</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="fd-rd-sip-insurance-other-plans">FD/RD/SIP Insurance/Other plans</SelectItem>
                  <SelectItem value="investments">Investments</SelectItem>
                  <SelectItem value="daily-essentials">Daily essentials</SelectItem>
                  <SelectItem value="clothes">Clothes</SelectItem>
                  <SelectItem value="haircut">Haircut</SelectItem>
                  <SelectItem value="other-expenditures">Other Expenditures</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription className="text-blue-600">
                Select the category for this budget allocation
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-blue-800">Notes (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Add notes about this budget"
                  {...field}
                  className="border-blue-200/50 focus-visible:ring-blue-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
          {isSubmitting ? "Creating..." : "Create Monthly Budget Goal"}
        </Button>
      </form>
    </Form>
  )
}
