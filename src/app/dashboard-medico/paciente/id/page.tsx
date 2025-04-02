"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowLeft, Calendar, FileText, AlertTriangle, CheckCircle, Clock, Download, Printer } from "lucide-react"
import { marcarCuestionarioRevisado, obtenerCuestionarioPorId } from "@/actions/cuestionario-actions"

// Definir la interfaz para el tipo de cuestionario
interface Cuestionario {
  id?: string
  pacienteId?: string
  revisado: boolean
  nombrePaciente?: string
  email?: string
  fechaEnvio?: string
  estado?: string
  datos?: {
    personal?: {
      nombre?: string
      apellidos?: string
      dni?: string
      fechaNacimiento?: string
      genero?: string
      telefono?: string
      email?: string
      procedimiento?: string
      fechaProcedimiento?: string
      estadoEmocional?: string
    }
    historial?: {
      condiciones?: string[]
      alergias?: string
      cirugias_previas?: string
      complicaciones_anestesia?: string
      detalles_complicaciones?: string
      fumador?: string
      alcohol?: string
    }
    medicamentos?: {
      toma_medicamentos?: string
      medicamentos?: Array<{
        nombre: string
        dosis: string
        frecuencia: string
      }>
      anticoagulantes?: string
      detalles_anticoagulantes?: string
      suplementos?: string
    }
  }
}

export default function DetallePacientePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [cuestionario, setCuestionario] = useState<Cuestionario | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("datos")

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener el cuestionario por ID directamente
        const result = await obtenerCuestionarioPorId(params.id)

        if (result.success) {
          if (result.cuestionario) {
            setCuestionario(result.cuestionario)
          }
        } else {
          setError(result.error || "No se pudo cargar la información del paciente")
        }
      } catch (err) {
        setError("Ocurrió un error al cargar los datos")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  // Función para marcar el cuestionario como revisado
  const handleMarcarRevisado = async () => {
    try {
      const result = await marcarCuestionarioRevisado(params.id, true)

      if (result.success) {
        setCuestionario((prev) => {
          if (!prev) return null
          return {
            ...prev,
            revisado: true,
          }
        })
      } else {
        alert(result.error || "No se pudo marcar como revisado")
      }
    } catch (err) {
      alert("Ocurrió un error al actualizar el estado")
    }
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "alto":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Alto riesgo
          </Badge>
        )
      case "medio":
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Riesgo medio
          </Badge>
        )
      case "bajo":
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Bajo riesgo
          </Badge>
        )
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  // Función para mostrar el estado emocional en texto legible
  const getEstadoEmocionalTexto = (estado?: string) => {
    switch (estado) {
      case "tranquilo":
        return "Bien, tranquilo y confiado"
      case "algo_nervioso":
        return "Algo nervioso cuando lo pienso, pero tranquilo el resto del tiempo"
      case "muy_nervioso":
        return "Muy nervioso. Me cuesta no pensar en otra cosa"
      default:
        return "No especificado"
    }
  }

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
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Error</CardTitle>
            <CardDescription>No se pudo cargar la información del paciente</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{error}</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => router.push("/dashboard-medico")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (!cuestionario) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Paciente no encontrado</CardTitle>
            <CardDescription>No se encontró la información solicitada</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              El paciente que busca no existe o no tiene permisos para acceder a esta información.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => router.push("/dashboard-medico")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => router.push("/dashboard-medico")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">{cuestionario.nombrePaciente}</h1>
            {cuestionario.estado && getEstadoBadge(cuestionario.estado)}
            {cuestionario.revisado && (
              <Badge variant="outline" className="ml-2">
                Revisado
              </Badge>
            )}
          </div>

          <div className="flex gap-2">
            {!cuestionario.revisado && (
              <Button variant="outline" onClick={handleMarcarRevisado}>
                Marcar como revisado
              </Button>
            )}
            <Button>
              <Calendar className="mr-2 h-4 w-4" />
              Programar consulta
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="datos">Datos personales</TabsTrigger>
                <TabsTrigger value="historial">Historial médico</TabsTrigger>
                <TabsTrigger value="medicamentos">Medicamentos</TabsTrigger>
                <TabsTrigger value="evaluacion">Evaluación</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <TabsContent value="datos" className="mt-0">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Información personal</h3>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2">
                        <span className="text-sm font-medium">Nombre completo:</span>
                        <span className="text-sm">{cuestionario.nombrePaciente}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-sm font-medium">Email:</span>
                        <span className="text-sm">{cuestionario.email}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-sm font-medium">DNI/NIE:</span>
                        <span className="text-sm">{cuestionario.datos?.personal?.dni || "No especificado"}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-sm font-medium">Fecha de nacimiento:</span>
                        <span className="text-sm">
                          {cuestionario.datos?.personal?.fechaNacimiento
                            ? new Date(cuestionario.datos.personal.fechaNacimiento).toLocaleDateString("es-ES")
                            : "No especificada"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-sm font-medium">Género:</span>
                        <span className="text-sm">{cuestionario.datos?.personal?.genero || "No especificado"}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-sm font-medium">Teléfono:</span>
                        <span className="text-sm">{cuestionario.datos?.personal?.telefono || "No especificado"}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Estado emocional</h3>
                    <div className="space-y-2">
                      <div className="grid grid-cols-1">
                        <span className="text-sm font-medium">
                          ¿CÓMO SE ENCUENTRA EN RELACIÓN CON SU PRÓXIMA INTERVENCIÓN?
                        </span>
                        <span className="text-sm mt-2">
                          {getEstadoEmocionalTexto(cuestionario.datos?.personal?.estadoEmocional)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="historial" className="mt-0">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Condiciones médicas</h3>
                  {cuestionario.datos?.historial?.condiciones && cuestionario.datos.historial.condiciones.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {cuestionario.datos.historial.condiciones.map((condicion: string) => (
                        <div key={condicion} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span className="text-sm">{condicion.replace("_", " ")}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No se han reportado condiciones médicas</p>
                  )}
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Alergias</h3>
                    <p className="text-sm">
                      {cuestionario.datos?.historial?.alergias || "No se han reportado alergias"}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Cirugías previas</h3>
                    <p className="text-sm">
                      {cuestionario.datos?.historial?.cirugias_previas || "No se han reportado cirugías previas"}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Complicaciones con anestesia</h3>
                    <p className="text-sm font-medium">
                      {cuestionario.datos?.historial?.complicaciones_anestesia === "si" ? "Sí" : "No"}
                    </p>
                    {cuestionario.datos?.historial?.complicaciones_anestesia === "si" && (
                      <p className="text-sm mt-2">
                        {cuestionario.datos.historial?.detalles_complicaciones || "No se proporcionaron detalles"}
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Hábitos</h3>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2">
                        <span className="text-sm font-medium">Fumador:</span>
                        <span className="text-sm">
                          {cuestionario.datos?.historial?.fumador === "si"
                            ? "Sí"
                            : cuestionario.datos?.historial?.fumador === "ex_fumador"
                              ? "Ex-fumador"
                              : "No"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-sm font-medium">Consumo de alcohol:</span>
                        <span className="text-sm">
                          {cuestionario.datos?.historial?.alcohol === "nunca"
                            ? "Nunca"
                            : cuestionario.datos?.historial?.alcohol === "ocasional"
                              ? "Ocasional"
                              : cuestionario.datos?.historial?.alcohol === "regular"
                                ? "Regular"
                                : "Diario"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="medicamentos" className="mt-0">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Medicamentos actuales</h3>
                  {cuestionario.datos?.medicamentos?.toma_medicamentos === "si" &&
                  cuestionario.datos.medicamentos?.medicamentos &&
                  cuestionario.datos.medicamentos.medicamentos.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2">
                      {cuestionario.datos.medicamentos.medicamentos.map((med: any, index: number) => (
                        <div key={index} className="flex items-start p-2 border rounded-md">
                          <div>
                            <p className="font-medium">{med.nombre}</p>
                            <p className="text-sm text-muted-foreground">
                              {med.dosis} - {med.frecuencia}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No toma medicamentos regularmente</p>
                  )}
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Anticoagulantes</h3>
                    <p className="text-sm font-medium">
                      {cuestionario.datos?.medicamentos?.anticoagulantes === "si" ? "Sí" : "No"}
                    </p>
                    {cuestionario.datos?.medicamentos?.anticoagulantes === "si" && (
                      <p className="text-sm mt-2">
                        {cuestionario.datos.medicamentos?.detalles_anticoagulantes || "No se proporcionaron detalles"}
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Suplementos y vitaminas</h3>
                    <p className="text-sm">
                      {cuestionario.datos?.medicamentos?.suplementos || "No toma suplementos o vitaminas"}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="evaluacion" className="mt-0">
              <div className="space-y-6">
                <Alert variant={cuestionario.estado === "alto" ? "destructive" : "default"}>
                  <div className="flex items-center gap-2">
                    {cuestionario.estado === "alto" ? (
                      <AlertTriangle className="h-5 w-5" />
                    ) : cuestionario.estado === "medio" ? (
                      <Clock className="h-5 w-5" />
                    ) : (
                      <CheckCircle className="h-5 w-5" />
                    )}
                    <AlertTitle>
                      {cuestionario.estado === "alto"
                        ? "Consulta con anestesista requerida"
                        : cuestionario.estado === "medio"
                          ? "Evaluación por enfermería"
                          : "No se requiere consulta previa"}
                    </AlertTitle>
                  </div>
                  <AlertDescription>
                    {cuestionario.estado === "alto"
                      ? "Múltiples condiciones médicas y medicamentos que requieren evaluación especializada"
                      : cuestionario.estado === "medio"
                        ? "Algunas condiciones médicas que requieren evaluación, pero no necesariamente por un anestesista"
                        : "No se detectaron condiciones de riesgo significativas"}
                  </AlertDescription>
                </Alert>

                <div>
                  <h3 className="text-lg font-medium mb-2">Factores de riesgo identificados</h3>
                  <div className="space-y-2">
                    {cuestionario.estado === "alto" && (
                      <>
                        {cuestionario.datos?.historial?.condiciones?.includes("enfermedad_cardiaca") && (
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                            <div>
                              <p className="font-medium">Enfermedad cardíaca</p>
                              <p className="text-sm text-muted-foreground">
                                Requiere evaluación detallada por anestesista
                              </p>
                            </div>
                          </div>
                        )}

                        {cuestionario.datos?.historial?.complicaciones_anestesia === "si" && (
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                            <div>
                              <p className="font-medium">Complicaciones previas con anestesia</p>
                              <p className="text-sm text-muted-foreground">
                                {cuestionario.datos.historial?.detalles_complicaciones ||
                                  "Requiere evaluación detallada"}
                              </p>
                            </div>
                          </div>
                        )}

                        {cuestionario.datos?.medicamentos?.anticoagulantes === "si" && (
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                            <div>
                              <p className="font-medium">Uso de anticoagulantes</p>
                              <p className="text-sm text-muted-foreground">
                                Requiere ajuste de medicación previo a la cirugía
                              </p>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {cuestionario.estado === "medio" && (
                      <>
                        {cuestionario.datos?.historial?.condiciones?.includes("hipertension") && (
                          <div className="flex items-start gap-2">
                            <Clock className="h-4 w-4 text-primary mt-0.5" />
                            <div>
                              <p className="font-medium">Hipertensión</p>
                              <p className="text-sm text-muted-foreground">Requiere control previo a la cirugía</p>
                            </div>
                          </div>
                        )}

                        {cuestionario.datos?.historial?.condiciones?.includes("diabetes") && (
                          <div className="flex items-start gap-2">
                            <Clock className="h-4 w-4 text-primary mt-0.5" />
                            <div>
                              <p className="font-medium">Diabetes</p>
                              <p className="text-sm text-muted-foreground">
                                Requiere control de glucemia previo a la cirugía
                              </p>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {cuestionario.estado === "bajo" && (
                      <p className="text-sm text-muted-foreground">
                        No se identificaron factores de riesgo significativos
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/dashboard-medico/paciente/${params.id}/informe`)}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Generar informe
                  </Button>

                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Printer className="mr-2 h-4 w-4" />
                      Imprimir
                    </Button>
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Descargar PDF
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

