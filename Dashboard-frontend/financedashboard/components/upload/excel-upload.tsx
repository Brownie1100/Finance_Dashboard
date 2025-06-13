"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { useUser } from "@/hooks/use-user"

interface ExcelUploadProps {
  type: "income" | "expense"
  onSuccess: () => void
}

interface ExcelRow {
  date: string
  category: string
  amount: number
  description?: string
}

export function ExcelUpload({ type, onSuccess }: ExcelUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { userId } = useUser()

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const parseExcelFile = async (file: File): Promise<ExcelRow[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)

          // Import xlsx dynamically
          const XLSX = await import("xlsx")
          const workbook = XLSX.read(data, { type: "array" })

          // Get first worksheet
          const worksheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[worksheetName]

          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]

          // Skip header row and process data
          const rows: ExcelRow[] = []

          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i]
            if (row.length >= 3 && row[0] && row[1] && row[2]) {
              // Parse date
              let date: string
              if (typeof row[0] === "number") {
                // Excel date serial number
                const excelDate = new Date((row[0] - 25569) * 86400 * 1000)
                date = excelDate.toISOString().split("T")[0]
              } else {
                // String date
                const parsedDate = new Date(row[0])
                if (isNaN(parsedDate.getTime())) {
                  throw new Error(`Invalid date in row ${i + 1}: ${row[0]}`)
                }
                date = parsedDate.toISOString().split("T")[0]
              }

              // Parse amount
              const amount = Number(row[2])
              if (isNaN(amount) || amount <= 0) {
                throw new Error(`Invalid amount in row ${i + 1}: ${row[2]}`)
              }

              rows.push({
                date,
                category: String(row[1]).toLowerCase(),
                amount,
                description: row[3] ? String(row[3]) : "",
              })
            }
          }

          if (rows.length === 0) {
            throw new Error("No valid data found in the file")
          }

          resolve(rows)
        } catch (error) {
          reject(error)
        }
      }

      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.readAsArrayBuffer(file)
    })
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]

    if (!validTypes.includes(file.type) && !file.name.match(/\.(xls|xlsx)$/i)) {
      toast({
        title: "Invalid file type",
        description: "Please upload an Excel file (.xls or .xlsx)",
        variant: "destructive",
      })
      return
    }

    if (!userId) {
      toast({
        title: "Error",
        description: "User not logged in",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Parse Excel file
      const rows = await parseExcelFile(file)

      // Convert to API format (array of objects)
      const apiData = rows.map((row) => ({
        userId: userId,
        category: row.category,
        amount: row.amount,
        date: row.date,
        description: row.description || "",
      }))

      // Send to API
      const response = await fetch(`http://localhost:8282/api/${type}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      })

      if (response.ok) {
        toast({
          title: "Upload successful",
          description: `${rows.length} ${type} records have been imported.`,
        })
        onSuccess()

        // Clear file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      } else {
        const errorData = await response.text()
        console.error("API Error:", errorData)
        throw new Error("Failed to upload data")
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to process the file",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xls,.xlsx"
        onChange={handleFileChange}
        className="hidden"
        title="Upload Excel file"
      />
      <Button onClick={handleFileSelect} disabled={isUploading} variant="outline" size="sm" className="gap-2">
        {isUploading ? (
          <>
            <FileSpreadsheet className="h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            Upload Excel
          </>
        )}
      </Button>
    </>
  )
}
