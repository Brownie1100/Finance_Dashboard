"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface UserContextType {
  userId: string | null
  setUserId: (id: string | null) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null)

  return <UserContext.Provider value={{ userId, setUserId }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
