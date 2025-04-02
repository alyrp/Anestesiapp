"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { InformePaciente } from "@/components/informe-paciente"
import { obtenerCuestionarioPorId } from "@/actions/cuestionario-actions"

export default function InformePacientePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [cuestionario, setCuestionario] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Obteniendo cuestionario con ID:", params.id)
        const result = await obtenerCuestionarioPorId(params.id)
        console.log("Resultado:", result)

        if (result.success && result.cuestionario) {
          setCuestionario(result.cuestionario)
        } else {
          setError(result.error || "No se pudo cargar la información del paciente")
        }
      } catch (err) {
        console.error("Error al cargar datos:", err)
        setError("Ocurrió un error al cargar los datos")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="mt-4 text-sm text-muted-foreground">Cargando información del paciente...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Error</h1>
        </div>
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  if (!cuestionario) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Paciente no encontrado</h1>
        </div>
        <p className="text-muted-foreground">No se encontró la información solicitada</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Informe del Paciente</h1>
      </div>

      <InformePaciente cuestionario={cuestionario} />
    </div>
  )
}

