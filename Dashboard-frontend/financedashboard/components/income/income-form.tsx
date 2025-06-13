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
import { createIncome } from "@/lib/api"

const formSchema = z.object({
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  date: z.date({
    required_error: "A date is required",
  }),
  category: z.string({
    required_error: "Please select an income source",
  }),
  description: z.string().optional(),
})

interface IncomeFormProps {
  onIncomeAdded: () => void
}

export function IncomeForm({ onIncomeAdded }: IncomeFormProps) {
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
      // Send as array with single object
      const requestData = [
        {
          userId: userId,
          category: values.category,
          amount: Number(values.amount),
          date: values.date.toISOString().split("T")[0],
          description: values.description ?? "",
        },
      ]

      await createIncome(userId, requestData)

      toast({
        title: "Income added successfully",
        description: `${formatAmount(Number(values.amount))} from ${values.category.replace(/-/g, " ")} has been recorded.`,
        className:
          "bg-green-50 border-green-200 text-green-800 dark:bg-green-950/50 dark:border-green-800/50 dark:text-green-300",
      })

      form.reset({
        amount: "",
        date: new Date(),
        description: "",
        category: undefined,
      })

      onIncomeAdded()
    } catch (error) {
      console.error("Error adding income:", error)
      toast({
        title: "Error",
        description: "Failed to add income. Please try again.",
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
                <FormLabel className="text-green-800">Amount ({getCurrencySymbol()})</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {getCurrencySymbol()}
                    </span>
                    <Input
                      placeholder="0.00"
                      {...field}
                      className="border-green-200/50 focus-visible:ring-green-500 pl-8"
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
                <FormLabel className="text-green-800">Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal border-green-200/50 focus-visible:ring-green-500",
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
              <FormLabel className="text-green-800">Source</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border-green-200/50 focus-visible:ring-green-500">
                    <SelectValue placeholder="Select income source" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="salary">Salary</SelectItem>
                  <SelectItem value="fd-rd-sip-return">FD/RD/SIP return</SelectItem>
                  <SelectItem value="investments-return">Investments return</SelectItem>
                  <SelectItem value="other-incomes">Other incomes</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription className="text-green-600">Select the source of your income</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-green-800">Description (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Add details about this income"
                  {...field}
                  className="border-green-200/50 focus-visible:ring-green-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
          {isSubmitting ? "Adding..." : "Add Income"}
        </Button>
      </form>
    </Form>
  )
}
