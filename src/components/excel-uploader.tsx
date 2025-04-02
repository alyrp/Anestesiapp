"use client"

import { useState } from "react"
import * as XLSX from "xlsx"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ExcelUploaderProps {
  onDataLoaded: (data: string[]) => void
  columnName?: string
}

export function ExcelUploader({ 
  onDataLoaded, 
  columnName = "Medicamento" 
}: ExcelUploaderProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError(null)
    setFileName(file.name)

    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)
      
      // Obtener la primera hoja
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      
      // Convertir a JSON
      const jsonData = XLSX.utils.sheet_to_json<any>(worksheet)
      
      // Buscar la columna especificada o usar la primera columna
      if (jsonData.length === 0) {
        throw new Error("El archivo Excel no contiene datos")
      }
      
      let medicamentos: string[] = []
      
      // Verificar si existe la columna especificada
      if (columnName in jsonData[0]) {
        // Extraer los valores de la columna especificada
        medicamentos = jsonData
          .map(row => row[columnName])
          .filter(Boolean) // Eliminar valores nulos o vacíos
      } else {
        // Si no se encuentra la columna especificada, usar la primera columna
        const firstColumnName = Object.keys(jsonData[0])[0]
        medicamentos = jsonData
          .map(row => row[firstColumnName])
          .filter(Boolean)
      }
      
      // Eliminar duplicados y ordenar
      const uniqueMedicamentos = [...new Set(medicamentos)].sort()
      
      onDataLoaded(uniqueMedicamentos)
      
      console.log(`Cargados ${uniqueMedicamentos.length} medicamentos desde ${file.name}`)
    } catch (err) {
      console.error("Error al procesar el archivo Excel:", err)
      setError("Error al procesar el archivo Excel. Asegúrate de que el formato es correcto.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          disabled={loading}
          className="max-w-xs"
        />
        {loading && (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        )}
      </div>
      
      {fileName && !error && (
        <p className="text-sm text-muted-foreground">
          Archivo cargado: {fileName}
        </p>
      )}
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}