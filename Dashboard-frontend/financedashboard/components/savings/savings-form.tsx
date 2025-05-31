"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { useCurrency } from "@/hooks/use-currency"
import { useUser } from "@/hooks/use-user"

const formSchema = z.object({
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  category: z.string({
    required_error: "Please select a savings category",
  }),
  description: z.string().optional(),
})

interface SavingsFormProps {
  onSuccess: () => void
}

export function SavingsForm({ onSuccess }: SavingsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { getCurrencySymbol, formatAmount } = useCurrency()
  const { userId } = useUser()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      description: "",
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
      const response = await fetch("http://localhost:8282/api/savings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          category: values.category,
          amount: Number(values.amount),
          date: new Date().toISOString().split("T")[0],
          description: values.description ?? "",
        }),
      })

      if (response.ok) {
        toast({
          title: "Savings entry created successfully",
          description: `${formatAmount(Number(values.amount))} saved in ${values.category}.`,
        })
        form.reset()
        onSuccess()
      } else {
        const errorData = await response.json().catch(() => null)
        toast({
          title: "Failed to create savings entry",
          description: errorData?.message || "An error occurred while creating the entry.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating savings entry:", error)
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
              <FormLabel className="text-red-800">Savings Amount ({getCurrencySymbol()})</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {getCurrencySymbol()}
                  </span>
                  <Input placeholder="0.00" {...field} className="border-red-200/50 focus-visible:ring-red-500 pl-8" />
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
              <FormLabel className="text-red-800">Savings Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border-red-200/50 focus-visible:ring-red-500">
                    <SelectValue placeholder="Select savings category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Emergency Fund">Emergency Fund</SelectItem>
                  <SelectItem value="Vacation">Vacation</SelectItem>
                  <SelectItem value="Investment">Investment</SelectItem>
                  <SelectItem value="Retirement">Retirement</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-red-800">Description (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Add notes about this savings"
                  {...field}
                  className="border-red-200/50 focus-visible:ring-red-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="bg-red-600 hover:bg-red-700">
          {isSubmitting ? "Adding..." : "Add Savings Entry"}
        </Button>
      </form>
    </Form>
  )
}
