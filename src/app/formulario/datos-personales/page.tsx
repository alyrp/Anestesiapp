"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DatosPersonalesForm } from "@/components/datos-personales-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function DatosPersonalesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true)
      console.log("Datos personales enviados:", values)

      // Aquí normalmente guardarías los datos en la base de datos
      // Por ahora, solo simulamos un retraso
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirigir a la siguiente página o mostrar un mensaje de éxito
      alert("Datos guardados correctamente")
      // router.push("/formulario/historial-medico")
    } catch (error) {
      console.error("Error al guardar datos:", error)
      alert("Error al guardar los datos. Por favor, inténtelo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Datos Personales</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
          <CardDescription>
            Por favor, complete la siguiente información para continuar con el proceso de evaluación preoperatoria.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DatosPersonalesForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  )
}

