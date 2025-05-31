import type React from "react"
import type { Metadata } from "next"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Header } from "@/components/header"

export const metadata: Metadata = {
  title: "Finance Dashboard",
  description: "Manage your finances with ease",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="flex-1 p-4 pt-6 md:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
