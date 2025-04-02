"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatosPersonalesForm } from "@/components/datos-personales-form"
import { HistorialMedicoForm } from "@/components/historial-medico-form"
import { MedicamentosForm } from "@/components/medicamentos-form"
import { Progress } from "@/components/ui/progress"
import { getSession } from "@/actions/auth-actions"
import { guardarCuestionario } from "@/actions/cuestionario-actions"

export default function CuestionarioPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("personal")
  const [progress, setProgress] = useState(0)
  const [formData, setFormData] = useState({
    personal: {},
    historial: {},
    medicamentos: {},
  })

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession()
      if (!session || session.role !== "paciente") {
        router.push("/login-paciente")
      } else {
        // Pre-rellenar datos personales si tenemos información del usuario
        if (session.nombre && session.apellidos) {
          setFormData((prev) => ({
            ...prev,
            personal: {
              ...prev.personal,
              nombre: session.nombre,
              apellidos: session.apellidos,
              email: session.email,
            },
          }))
        }
      }
    }

    checkSession()
  }, [router])

  const updateFormData = (section: string, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: data,
    }))
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)

    // Actualizar progreso
    if (value === "personal") setProgress(0)
    else if (value === "historial") setProgress(33)
    else if (value === "medicamentos") setProgress(66)
  }

  const handleNext = () => {
    if (activeTab === "personal") {
      setActiveTab("historial")
      setProgress(33)
    } else if (activeTab === "historial") {
      setActiveTab("medicamentos")
      setProgress(66)
    }
  }

  const handleSubmit = async () => {
    setProgress(100)

    try {
      // Guardar los datos del cuestionario
      const result = await guardarCuestionario(formData)

      if (result.success) {
        // Redirigir a la página de resultados con el ID del cuestionario
        router.push(`/resultados?id=${result.cuestionarioId}`)
      } else {
        // Manejar error
        console.error("Error al guardar el cuestionario:", result.error)
        alert("Ocurrió un error al procesar su cuestionario. Por favor, inténtelo de nuevo.")
        setProgress(66) // Volver al estado anterior
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Ocurrió un error al procesar su cuestionario. Por favor, inténtelo de nuevo.")
      setProgress(66) // Volver al estado anterior
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Cuestionario de salud Preoperatorio</CardTitle>
            <CardDescription>Complete toda la información requerida para su evaluación preoperatoria</CardDescription>
            <Progress value={progress} className="h-2 mt-2" />
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Datos Personales</TabsTrigger>
                <TabsTrigger value="historial">Historial Médico</TabsTrigger>
                <TabsTrigger value="medicamentos">Medicamentos</TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <DatosPersonalesForm
                  onSaveData={(data) => updateFormData("personal", data)}
                  initialData={formData.personal}
                />
              </TabsContent>

              <TabsContent value="historial">
                <HistorialMedicoForm
                  onSaveData={(data) => updateFormData("historial", data)}
                  initialData={formData.historial}
                />
              </TabsContent>

              <TabsContent value="medicamentos">
                <MedicamentosForm
                  onSaveData={(data) => updateFormData("medicamentos", data)}
                  initialData={formData.medicamentos}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/")} disabled={progress === 100}>
              Cancelar
            </Button>

            {activeTab !== "medicamentos" ? (
              <Button onClick={handleNext} disabled={progress === 100}>
                Siguiente
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={progress === 100}>
                Enviar
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

