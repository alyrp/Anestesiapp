
// muestra los resultados de la evaluación preoperatoria generada por IA
// da recomendaciones, instrucciones y opciones para gestionar el consentimiento informado
// y la preparación para la cirugía



"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle, FileText, Calendar, Download, Printer } from "lucide-react"

// Simulación de la evaluación de la IA
const evaluarPaciente = () => {
  // En un sistema real, esto sería una llamada a un endpoint que procesa los datos con IA
  // Para este ejemplo, generamos un resultado aleatorio
  const resultados = [
    {
      nivel: "alto",
      recomendacion: "Consulta con anestesista requerida",
      motivo: "Múltiples condiciones médicas y medicamentos que requieren evaluación especializada",
      instrucciones:
        "Por favor, programe una cita con el departamento de anestesiología lo antes posible. Traiga todos sus medicamentos actuales y resultados de pruebas recientes.",
      fechaConsulta: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días después
    },
    {
      nivel: "medio",
      recomendacion: "Evaluación por enfermería",
      motivo: "Algunas condiciones médicas que requieren evaluación, pero no necesariamente por un anestesista",
      instrucciones:
        "Por favor, programe una cita con enfermería para evaluación preoperatoria. No es necesario suspender sus medicamentos habituales a menos que se indique específicamente.",
      fechaConsulta: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 días después
    },
    {
      nivel: "bajo",
      recomendacion: "No se requiere consulta previa",
      motivo: "No se detectaron condiciones de riesgo significativas",
      instrucciones:
        "No es necesaria una consulta previa. Siga las instrucciones generales para la preparación de su cirugía. Suspenda la ingesta de alimentos sólidos 8 horas antes y líquidos claros 2 horas antes del procedimiento.",
      fechaConsulta: null,
    },
  ]

  // Seleccionar un resultado aleatorio para la demostración
  return resultados[Math.floor(Math.random() * resultados.length)]
}

export default function ResultadosPage() {
  const [resultado, setResultado] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("resultado")

  useEffect(() => {
    // Simular tiempo de procesamiento
    const timer = setTimeout(() => {
      setResultado(evaluarPaciente())
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const getAlertVariant = () => {
    if (!resultado) return "outline"

    switch (resultado.nivel) {
      case "alto":
        return "destructive"
      case "medio":
        return "default"
      case "bajo":
        return "success"
      default:
        return "outline"
    }
  }

  const getAlertIcon = () => {
    if (!resultado) return null

    switch (resultado.nivel) {
      case "alto":
        return <AlertTriangle className="h-5 w-5" />
      case "medio":
        return <AlertTriangle className="h-5 w-5" />
      case "bajo":
        return <CheckCircle className="h-5 w-5" />
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Resultados de la Evaluación Preoperatoria</CardTitle>
            <CardDescription>
              Basado en la información proporcionada, nuestro sistema ha generado las siguientes recomendaciones
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!resultado ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                <p className="mt-4 text-sm text-muted-foreground">Analizando su información médica...</p>
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="resultado">Resultado</TabsTrigger>
                  <TabsTrigger value="consentimiento">Consentimiento</TabsTrigger>
                  <TabsTrigger value="instrucciones">Instrucciones</TabsTrigger>
                </TabsList>

                <TabsContent value="resultado" className="py-4">
                  <Alert variant={getAlertVariant()} className="mb-6">
                    <div className="flex items-center gap-2">
                      {getAlertIcon()}
                      <AlertTitle>{resultado.recomendacion}</AlertTitle>
                    </div>
                    <AlertDescription>{resultado.motivo}</AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Detalles de la evaluación</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Esta evaluación se ha realizado basándose en la información que ha proporcionado. Es importante
                        que consulte con su médico si tiene alguna duda.
                      </p>
                    </div>

                    {resultado.fechaConsulta && (
                      <div className="flex items-start gap-2 border p-4 rounded-md">
                        <Calendar className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-medium">Fecha recomendada para consulta</h4>
                          <p className="text-sm">
                            {resultado.fechaConsulta.toLocaleDateString("es-ES", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                          <Button variant="link" className="p-0 h-auto text-sm mt-1">
                            Solicitar cambio de fecha
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="border p-4 rounded-md">
                      <h4 className="font-medium mb-2">Próximos pasos</h4>
                      <ol className="list-decimal list-inside space-y-2 text-sm">
                        {resultado.nivel === "alto" && (
                          <>
                            <li>Programe una cita con el departamento de anestesiología</li>
                            <li>Traiga todos sus medicamentos actuales a la consulta</li>
                            <li>Traiga resultados de pruebas médicas recientes si los tiene</li>
                            <li>No suspenda ningún medicamento sin consultar con su médico</li>
                          </>
                        )}

                        {resultado.nivel === "medio" && (
                          <>
                            <li>Programe una cita con enfermería para evaluación preoperatoria</li>
                            <li>Prepare una lista de sus medicamentos actuales</li>
                            <li>
                              No es necesario suspender sus medicamentos habituales a menos que se indique
                              específicamente
                            </li>
                          </>
                        )}

                        {resultado.nivel === "bajo" && (
                          <>
                            <li>No es necesaria una consulta previa</li>
                            <li>Siga las instrucciones generales para la preparación de su cirugía</li>
                            <li>Suspenda la ingesta de alimentos sólidos 8 horas antes del procedimiento</li>
                            <li>Puede beber líquidos claros hasta 2 horas antes del procedimiento</li>
                          </>
                        )}
                      </ol>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="consentimiento" className="py-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Consentimiento Informado</h3>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Printer className="h-4 w-4 mr-2" />
                          Imprimir
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Descargar PDF
                        </Button>
                      </div>
                    </div>

                    <div className="border rounded-md p-6 space-y-4">
                      <div className="text-center mb-6">
                        <h2 className="text-xl font-bold">CONSENTIMIENTO INFORMADO PARA ANESTESIA</h2>
                        <p className="text-sm text-muted-foreground">Hospital Universitario</p>
                      </div>

                      <p className="text-sm">
                        Yo, ________________________________, con DNI ________________, declaro que he sido informado/a
                        por el Dr./Dra. ________________ sobre el procedimiento anestésico que se me va a realizar para
                        mi intervención quirúrgica.
                      </p>

                      <p className="text-sm">
                        Entiendo que la anestesia es un procedimiento médico necesario para poder realizar la
                        intervención quirúrgica sin dolor y que existen diferentes tipos de anestesia (general,
                        regional, local) con sus respectivos riesgos y beneficios.
                      </p>

                      <p className="text-sm">
                        He sido informado/a de los riesgos generales de la anestesia, que incluyen, pero no se limitan
                        a: reacciones alérgicas, problemas cardíacos, respiratorios, daño a dientes, labios o lengua,
                        náuseas, vómitos, dolor de garganta, ronquera, dolor muscular, lesiones nerviosas, cefalea y, en
                        casos extremadamente raros, muerte o estado vegetativo.
                      </p>

                      <p className="text-sm">
                        También entiendo que pueden existir riesgos específicos relacionados con mi estado de salud
                        particular que han sido discutidos conmigo.
                      </p>

                      <p className="text-sm">
                        Autorizo al equipo médico a realizar las técnicas anestésicas que consideren más adecuadas según
                        mi estado de salud y el tipo de intervención, así como a aplicar las medidas necesarias en caso
                        de complicaciones.
                      </p>

                      <p className="text-sm">
                        He podido hacer preguntas y todas ellas han sido respondidas satisfactoriamente. Comprendo que
                        puedo revocar este consentimiento en cualquier momento antes de la intervención.
                      </p>

                      <div className="grid grid-cols-2 gap-4 mt-8">
                        <div>
                          <p className="text-sm">Firma del paciente:</p>
                          <div className="h-16 border-b mt-8"></div>
                        </div>
                        <div>
                          <p className="text-sm">Firma del médico:</p>
                          <div className="h-16 border-b mt-8"></div>
                        </div>
                      </div>

                      <p className="text-sm text-center mt-4">Fecha: _____ / _____ / _____</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="instrucciones" className="py-4">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium">Instrucciones Preoperatorias</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Siga estas instrucciones cuidadosamente para prepararse para su procedimiento quirúrgico.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="border p-4 rounded-md">
                        <h4 className="font-medium">Ayuno</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                          <li>No coma alimentos sólidos durante las 8 horas previas a la cirugía</li>
                          <li>Puede beber líquidos claros (agua, té sin leche, zumos sin pulpa) hasta 2 horas antes</li>
                          <li>No consuma alcohol 24 horas antes del procedimiento</li>
                        </ul>
                      </div>

                      <div className="border p-4 rounded-md">
                        <h4 className="font-medium">Medicamentos</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                          <li>Tome sus medicamentos habituales según lo indicado por su médico</li>
                          <li>Si toma anticoagulantes, siga las instrucciones específicas que le han dado</li>
                          <li>
                            Informe al equipo médico de todos los medicamentos, suplementos y remedios naturales que
                            esté tomando
                          </li>
                        </ul>
                      </div>

                      <div className="border p-4 rounded-md">
                        <h4 className="font-medium">El día de la cirugía</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                          <li>Dúchese la mañana de la cirugía</li>
                          <li>No use maquillaje, esmalte de uñas, lentes de contacto, joyas ni piercings</li>
                          <li>Use ropa cómoda y holgada</li>
                          <li>Traiga su documentación, tarjeta sanitaria y lista de medicamentos</li>
                          <li>Venga acompañado por un adulto responsable que pueda llevarlo a casa</li>
                        </ul>
                      </div>

                      <div className="border p-4 rounded-md">
                        <h4 className="font-medium">Después de la cirugía</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                          <li>No conduzca ni opere maquinaria durante al menos 24 horas</li>
                          <li>No tome decisiones importantes bajo los efectos de la anestesia</li>
                          <li>Siga las instrucciones específicas para su recuperación que le dará su cirujano</li>
                          <li>
                            Contacte inmediatamente con su médico si experimenta fiebre, dolor intenso, sangrado o
                            dificultad respiratoria
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => window.history.back()}>
              Volver
            </Button>

            <div className="flex gap-2">
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Guardar resultados
              </Button>
              <Button>
                <Calendar className="h-4 w-4 mr-2" />
                {resultado && resultado.fechaConsulta ? "Confirmar cita" : "Finalizar"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

