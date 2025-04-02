"use client"

import * as React from "react"
import medicamentosData from "@/data/medicamentos.json"

interface MedicamentosAutocompleteProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function MedicamentosAutocomplete({
  value,
  onChange,
  placeholder = "Nombre del medicamento",
  className = "",
}: MedicamentosAutocompleteProps) {
  const [showSuggestions, setShowSuggestions] = React.useState(false)
  const [suggestions, setSuggestions] = React.useState<string[]>([])
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Asegurarnos de que medicamentosData es un array
  const medicamentos = React.useMemo(() => {
    if (Array.isArray(medicamentosData)) {
      return medicamentosData
    } else {
      // Si por alguna razón no es un array, convertirlo
      console.warn("medicamentos.json no es un array, intentando convertir")
      return Object.values(medicamentosData)
    }
  }, [])

  // Filtrar sugerencias cuando cambia el valor de entrada
  React.useEffect(() => {
    if (value.length > 1) {
      const filtered = medicamentos
        .filter((med) => typeof med === "string" && med.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5)

      setSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [value, medicamentos])

  // Manejar clic fuera del componente
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={inputRef}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        onFocus={() => {
          if (value.length > 1 && suggestions.length > 0) {
            setShowSuggestions(true)
          }
        }}
      />

      {showSuggestions && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
          <ul className="py-1">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => {
                  onChange(suggestion)
                  setShowSuggestions(false)
                }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

