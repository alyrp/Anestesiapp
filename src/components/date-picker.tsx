"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface YearDatePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  yearRange?: { start: number; end: number }
  placeholder?: string
}

export function YearDatePicker({ 
  date, 
  setDate, 
  yearRange = { start: 1900, end: new Date().getFullYear() },
  placeholder = "Seleccionar fecha" 
}: YearDatePickerProps) {
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    date ? date.getFullYear() : undefined
  )
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(
    date ? date.getMonth() : undefined
  )

  // Generar array de años para el selector
  const years = Array.from(
    { length: yearRange.end - yearRange.start + 1 },
    (_, i) => yearRange.end - i
  )

  // Nombres de los meses en español
  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ]

  // Actualizar año y mes seleccionados cuando cambia la fecha
  useEffect(() => {
    if (date) {
      setSelectedYear(date.getFullYear())
      setSelectedMonth(date.getMonth())
    }
  }, [date])

  // Manejar cambio de año
  const handleYearChange = (year: string) => {
    const numYear = parseInt(year)
    setSelectedYear(numYear)
    
    if (selectedMonth !== undefined) {
      const newDate = date ? new Date(date) : new Date()
      newDate.setFullYear(numYear)
      newDate.setMonth(selectedMonth)
      setDate(newDate)
    }
  }

  // Manejar cambio de mes
  const handleMonthChange = (month: string) => {
    const numMonth = parseInt(month)
    setSelectedMonth(numMonth)
    
    if (selectedYear !== undefined) {
      const newDate = date ? new Date(date) : new Date()
      newDate.setFullYear(selectedYear)
      newDate.setMonth(numMonth)
      setDate(newDate)
    }
  }

  // Manejar entrada directa de año
  const handleYearInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputYear = parseInt(e.target.value)
    if (!isNaN(inputYear) && inputYear >= yearRange.start && inputYear <= yearRange.end) {
      setSelectedYear(inputYear)
      
      if (selectedMonth !== undefined) {
        const newDate = date ? new Date(date) : new Date()
        newDate.setFullYear(inputYear)
        newDate.setMonth(selectedMonth)
        setDate(newDate)
      }
    }
  }

  return (
    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP", { locale: es }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 border-b">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-sm">Seleccionar fecha</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {/* Selector de mes */}
            <Select
              value={selectedMonth?.toString()}
              onValueChange={handleMonthChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Mes" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Entrada directa de año */}
            <div className="relative">
              <Input
                type="number"
                min={yearRange.start}
                max={yearRange.end}
                value={selectedYear || ""}
                onChange={handleYearInput}
                placeholder="Año"
                className="w-full"
              />
            </div>
          </div>
        </div>
        
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => {
            setDate(newDate)
            if (newDate) {
              setSelectedYear(newDate.getFullYear())
              setSelectedMonth(newDate.getMonth())
            }
            setCalendarOpen(false)
          }}
          initialFocus
          locale={es}
          month={selectedMonth !== undefined && selectedYear !== undefined 
            ? new Date(selectedYear, selectedMonth) 
            : undefined}
          onMonthChange={(newMonth) => {
            setSelectedMonth(newMonth.getMonth())
            setSelectedYear(newMonth.getFullYear())
          }}
        />
      </PopoverContent>
    </Popover>
  )
}