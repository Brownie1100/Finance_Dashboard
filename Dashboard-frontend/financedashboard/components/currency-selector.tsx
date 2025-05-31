"use client"
import { Check, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useCurrency } from "@/hooks/use-currency"

const currencies = [
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "PHP", symbol: "₱", name: "Philippine Peso" },
]

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrency()

  const currentCurrency = currencies.find((c) => c.code === currency) || currencies[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <span className="text-lg">{currentCurrency.symbol}</span>
          <span className="text-sm">{currentCurrency.code}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {currencies.map((curr) => (
          <DropdownMenuItem
            key={curr.code}
            onClick={() => setCurrency(curr.code)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{curr.symbol}</span>
              <span>{curr.name}</span>
            </div>
            {currency === curr.code && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
