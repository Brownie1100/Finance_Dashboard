import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { CurrencyProvider } from "@/hooks/use-currency"
import { UserProvider } from "@/hooks/use-user"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Finance Dashboard",
  description: "Personal finance management dashboard",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <UserProvider>
            <CurrencyProvider>
              <div className="min-h-screen bg-background">{children}</div>
              <Toaster />
            </CurrencyProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
