"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, CreditCard, DollarSign, Home, Menu, PiggyBank, PieChart, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const routes = [
  {
    label: "Dashboard",
    icon: Home,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Income",
    icon: DollarSign,
    href: "/income",
    color: "text-emerald-500",
  },
  {
    label: "Expenses",
    icon: CreditCard,
    href: "/expenses",
    color: "text-amber-500",
  },
  {
    label: "Budget",
    icon: PieChart,
    href: "/budget",
    color: "text-rose-500",
  },
  {
    label: "Savings",
    icon: PiggyBank,
    href: "/savings",
    color: "text-rose-500",
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="fixed left-4 top-4 z-40 md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <div className="flex h-full flex-col bg-white">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div className="flex items-center gap-2 font-semibold">
                <BarChart3 className="h-6 w-6" />
                <span>FinTrack</span>
              </div>
              <Button variant="outline" size="icon" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid items-start px-2 text-sm font-medium">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                      pathname === route.href ? "bg-muted text-primary" : "text-muted-foreground",
                    )}
                  >
                    <route.icon className={cn("h-4 w-4", route.color)} />
                    {route.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <div className="hidden border-r bg-gray-100/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <BarChart3 className="h-6 w-6" />
              <span>FinTrack</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    pathname === route.href ? "bg-muted text-primary" : "text-muted-foreground",
                  )}
                >
                  <route.icon className={cn("h-4 w-4", route.color)} />
                  {route.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}
