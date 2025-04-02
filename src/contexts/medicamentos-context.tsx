"use client"

import { createContext, useContext, useState, useEffect } from "react"

type MedicamentosContextType = {
  medicamentos: string[]
  setMedicamentos: (medicamentos: string[]) => void
  isLoaded: boolean
}

const MedicamentosContext = createContext<MedicamentosContextType | undefined>(undefined)

export function MedicamentosProvider({ children }: { children: React.ReactNode }) {
  const [medicamentos, setMedicamentos] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Intentar cargar medicamentos desde localStorage al inicio
  useEffect(() => {
    const storedMedicamentos = localStorage.getItem("medicamentos")
    if (storedMedicamentos) {
      try {
        const parsedMedicamentos = JSON.parse(storedMedicamentos)
        if (Array.isArray(parsedMedicamentos)) {
          setMedicamentos(parsedMedicamentos)
          setIsLoaded(true)
        }
      } catch (error) {
        console.error("Error al cargar medicamentos desde localStorage:", error)
      }
    }
  }, [])

  // Guardar medicamentos en localStorage cuando cambien
  useEffect(() => {
    if (medicamentos.length > 0) {
      localStorage.setItem("medicamentos", JSON.stringify(medicamentos))
      setIsLoaded(true)
    }
  }, [medicamentos])

  return (
    <MedicamentosContext.Provider value={{ medicamentos, setMedicamentos, isLoaded }}>
      {children}
    </MedicamentosContext.Provider>
  )
}

export function useMedicamentos() {
  const context = useContext(MedicamentosContext)
  if (context === undefined) {
    throw new Error("useMedicamentos debe ser usado dentro de un MedicamentosProvider")
  }
  return context
}