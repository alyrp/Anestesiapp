"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DatosPersonalesForm } from "@/components/datos-personales-form"
import { HistorialMedicoForm } from "@/components/historial-medico-form"
import { MedicamentosForm } from "@/components/medicamentos-form"
import { ConsentimientoInformado } from "@/components/consentimiento-informado"
import { guardarCuestionario } from "@/actions/cuestionario-actions"
import { useToastContext } from "@/components/ui/toast-provider"

// Definir la interfaz para el estado del formulario
interface FormData {
  personal: Record<string, any>
  historial: Record<string, any>
  medicamentos: Record<string, any>
}

export default function FormularioPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("datos-personales")
  const [formData, setFormData] = useState<FormData>({
    personal: {},
    historial: {},
    medicamentos: {},
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToastContext()

  const handleDatosPersonales = (data: any) => {
    setFormData((prev: FormData) => ({
      ...prev,
      personal: data,
    }))
    setActiveTab("historial-medico")
    toast({
      title: "Datos personales guardados",
      description: "Ahora complete su historial médico",
      variant: "default",
    })
  }

  const handleHistorialMedico = (data: any) => {
    setFormData((prev: FormData) => ({
      ...prev,
      historial: data,
    }))
    setActiveTab("medicamentos")
    toast({
      title: "Historial médico guardado",
      description: "Ahora complete la información sobre medicamentos",
      variant: "default",
    })
  }

  const handleMedicamentos = async (data: any) => {
    setFormData((prev: FormData) => ({
      ...prev,
      medicamentos: data,
    }))
    setActiveTab("consentimiento")
    toast({
      title: "Información de medicamentos guardada",
      description: "Por favor, revise y acepte el consentimiento informado",
      variant: "default",
    })
  }

  const handleConsentimientoAceptado = async () => {
    try {
      setLoading(true)

      // Guardar en la base de datos
      const result = await guardarCuestionario("paciente_temp", formData)

      if (result.success) {
        toast({
          title: "Cuestionario enviado correctamente",
          description: "Gracias por completar la evaluación preoperatoria",
          variant: "default",
        })
        router.push("/formulario/confirmacion")
      } else {
        toast({
          title: "Error",
          description: result.error || "Error al guardar el cuestionario",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al procesar el formulario:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al procesar el formulario",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleConsentimientoRechazado = () => {
    toast({
      title: "Consentimiento rechazado",
      description: "No se puede continuar sin aceptar el consentimiento informado",
      variant: "destructive",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Evaluación Preoperatoria</CardTitle>
          <CardDescription>Complete el siguiente cuestionario para su evaluación preoperatoria</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="datos-personales">Datos Personales</TabsTrigger>
              <TabsTrigger value="historial-medico">Historial Médico</TabsTrigger>
              <TabsTrigger value="medicamentos">Medicamentos</TabsTrigger>
              <TabsTrigger value="consentimiento">Consentimiento</TabsTrigger>
            </TabsList>

            <TabsContent value="datos-personales">
              <DatosPersonalesForm onSubmit={handleDatosPersonales} initialData={formData.personal} />
            </TabsContent>

            <TabsContent value="historial-medico">
              <HistorialMedicoForm onSubmit={handleHistorialMedico} initialData={formData.historial} />
            </TabsContent>

            <TabsContent value="medicamentos">
              <MedicamentosForm onSaveData={handleMedicamentos} initialData={formData.medicamentos} />
            </TabsContent>

            <TabsContent value="consentimiento">
              <div className="py-4">
                <ConsentimientoInformado
                  onAccept={handleConsentimientoAceptado}
                  onReject={handleConsentimientoRechazado}
                  pacienteNombre={formData.personal.nombre || ""}
                  pacienteApellidos={formData.personal.apellidos || ""}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

