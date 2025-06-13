"use client"

import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Header } from "@/components/header"
import { MonthSelectionProvider } from "@/hooks/use-month-selection"
import { Toaster } from "@/components/ui/toaster"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MonthSelectionProvider>
      <SidebarProvider defaultOpen={false}>
        <div className="flex min-h-screen w-full bg-background">
          <AppSidebar />
          <div className="flex-1 flex flex-col bg-background">
            <Header />
            <main className="flex-1 p-6 bg-background">{children}</main>
          </div>
        </div>
        <Toaster />
      </SidebarProvider>
    </MonthSelectionProvider>
  )
}
