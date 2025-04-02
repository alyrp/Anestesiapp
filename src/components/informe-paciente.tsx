"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Printer, Edit } from "lucide-react"
import { TratamientoMedicoForm } from "@/components/tratamiento-medico-form"
import { type Cuestionario, formatDate, generatePDF } from "@/services/report-service"
import { calcularASA, getDescripcionASA, calcularIMC } from "@/services/asa-service"
import { useToastContext } from "@/components/ui/toast-provider"

interface InformePacienteProps {
  cuestionario: Cuestionario
  onTratamientoSaved?: () => void
}

export function InformePaciente({ cuestionario, onTratamientoSaved }: InformePacienteProps) {
  const informeRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState("informe")
  const [editandoTratamiento, setEditandoTratamiento] = useState(false)
  const { toast } = useToastContext()

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = async () => {
    try {
      if (!informeRef.current) return

      await generatePDF("informe-paciente", `Informe_${cuestionario.nombrePaciente?.replace(/\s+/g, "_")}`)

      toast({
        title: "PDF generado",
        description: "El informe se ha descargado correctamente",
        variant: "default",
      })
    } catch (error) {
      console.error("Error al generar PDF:", error)
      toast({
        title: "Error",
        description: "Error al generar el PDF. Por favor, inténtelo de nuevo.",
        variant: "destructive",
      })
    }
  }

  // Calcular edad a partir de la fecha de nacimiento
  const calcularEdad = () => {
    if (!cuestionario.datos?.personal?.fechaNacimiento) return "No disponible"

    const fechaNacimiento = new Date(cuestionario.datos.personal.fechaNacimiento)
    const hoy = new Date()
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear()
    const mes = hoy.getMonth() - fechaNacimiento.getMonth()

    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--
    }

    return edad
  }

  // Calcular IMC
  const imc = calcularIMC(cuestionario.datos?.personal?.peso, cuestionario.datos?.personal?.talla)

  // Calcular clasificación ASA
  const clasificacionASA = calcularASA(cuestionario.datos)

  // Obtener clase funcional (nivel de actividad)
  const obtenerClaseFuncional = () => {
    const actividades = cuestionario.datos?.personal?.actividadesFisicas || []

    if (
      actividades.includes("correr_rapido") ||
      actividades.includes("esqui_baloncesto") ||
      actividades.includes("nadar_rapido")
    ) {
      return "Clase I (Excelente)"
    } else if (
      actividades.includes("trotar") ||
      actividades.includes("saltar_cuerda") ||
      actividades.includes("golf")
    ) {
      return "Clase II (Buena)"
    } else if (actividades.includes("subir_escaleras_bailar") || actividades.includes("jardineria")) {
      return "Clase III (Moderada)"
    } else if (actividades.includes("caminar_manzanas") || actividades.includes("bajar_escaleras")) {
      return "Clase IV (Limitada)"
    } else {
      return "Clase V (Muy limitada)"
    }
  }

  const handleTratamientoSaved = () => {
    setEditandoTratamiento(false)
    if (onTratamientoSaved) {
      onTratamientoSaved()
    }
  }

  return (
    <div className="print:bg-white print:p-0">
      <div className="flex justify-end gap-2 mb-4 print:hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="informe">Informe</TabsTrigger>
            <TabsTrigger value="tratamiento">Tratamiento</TabsTrigger>
          </TabsList>
        </Tabs>

        <Button variant="outline" onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Imprimir
        </Button>
        <Button variant="outline" onClick={handleDownloadPDF}>
          <Download className="mr-2 h-4 w-4" />
          Descargar PDF
        </Button>
      </div>

      <TabsContent value="informe" className="mt-0">
        <div id="informe-paciente" ref={informeRef} className="bg-white p-8 rounded-lg shadow-md print:shadow-none">
          <div className="flex flex-col space-y-6">
            {/* Encabezado */}
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h1 className="text-2xl font-bold">Informe Preoperatorio</h1>
                <p className="text-sm text-muted-foreground">Fecha: {new Date().toLocaleDateString("es-ES")}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">ID: {cuestionario.id}</p>
                <p className="text-sm">Fecha envío: {formatDate(cuestionario.fechaEnvio)}</p>
              </div>
            </div>

            {/* Datos personales */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Datos Personales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="grid grid-cols-2">
                      <span className="text-sm font-medium">Nombre completo:</span>
                      <span className="text-sm">{cuestionario.nombrePaciente}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-sm font-medium">DNI/NIE:</span>
                      <span className="text-sm">{cuestionario.datos?.personal?.dni || "No especificado"}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-sm font-medium">Edad:</span>
                      <span className="text-sm">{calcularEdad()} años</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-sm font-medium">Género:</span>
                      <span className="text-sm">{cuestionario.datos?.personal?.genero || "No especificado"}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2">
                      <span className="text-sm font-medium">Peso:</span>
                      <span className="text-sm">{cuestionario.datos?.personal?.peso || "No especificado"} kg</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-sm font-medium">Altura:</span>
                      <span className="text-sm">{cuestionario.datos?.personal?.talla || "No especificado"} cm</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-sm font-medium">IMC:</span>
                      <span className="text-sm">{imc.toFixed(1)} kg/m²</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-sm font-medium">Teléfono:</span>
                      <span className="text-sm">{cuestionario.datos?.personal?.telefono || "No especificado"}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Clasificación ASA */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Clasificación ASA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 border rounded-md bg-blue-50">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">{clasificacionASA}</span>
                    <span className="text-sm">- {getDescripcionASA(clasificacionASA)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información clínica relevante */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Información Clínica Relevante</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Alergias:</h3>
                    <p className="text-sm p-2 border rounded-md">
                      {cuestionario.datos?.historial?.alergias || "No se han reportado alergias"}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Clase Funcional:</h3>
                    <p className="text-sm p-2 border rounded-md">{obtenerClaseFuncional()}</p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Tóxicos:</h3>
                    <div className="space-y-2 p-2 border rounded-md">
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
                        <span className="text-sm font-medium">Alcohol:</span>
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
                      <div className="grid grid-cols-2">
                        <span className="text-sm font-medium">Drogas:</span>
                        <span className="text-sm">{cuestionario.datos?.historial?.drogas === "si" ? "Sí" : "No"}</span>
                      </div>
                      {cuestionario.datos?.historial?.drogas === "si" && (
                        <div className="grid grid-cols-2">
                          <span className="text-sm font-medium">Detalles:</span>
                          <span className="text-sm">
                            {cuestionario.datos.historial?.detalles_drogas || "No especificado"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Dispositivos médicos:</h3>
                    <div className="space-y-2 p-2 border rounded-md">
                      <div className="grid grid-cols-2">
                        <span className="text-sm font-medium">Marcapasos:</span>
                        <span className="text-sm">
                          {cuestionario.datos?.historial?.marcapasos === "si" ? "Sí" : "No"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-sm font-medium">CPAP:</span>
                        <span className="text-sm">{cuestionario.datos?.historial?.cpap === "si" ? "Sí" : "No"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Problemas de sangrado:</h3>
                    <div className="p-2 border rounded-md">
                      <p className="text-sm font-medium">
                        {cuestionario.datos?.historial?.sangrado === "si" ? "Sí" : "No"}
                      </p>
                      {cuestionario.datos?.historial?.sangrado === "si" && (
                        <p className="text-sm mt-2">
                          {cuestionario.datos.historial?.detalles_sangrado || "No se proporcionaron detalles"}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Otros:</h3>
                    <div className="p-2 border rounded-md">
                      <p className="text-sm">
                        {cuestionario.datos?.historial?.otros_problemas || "No se han reportado otros problemas"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tratamiento */}
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Tratamiento</CardTitle>
                <Button variant="ghost" size="sm" className="print:hidden" onClick={() => setActiveTab("tratamiento")}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </CardHeader>
              <CardContent>
                <div className="p-4 border rounded-md">
                  {cuestionario.datos?.medico?.tratamiento ? (
                    <p className="whitespace-pre-line">{cuestionario.datos.medico.tratamiento}</p>
                  ) : (
                    <p className="text-muted-foreground italic">No se ha especificado tratamiento</p>
                  )}
                </div>

                {cuestionario.datos?.medico?.observaciones && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Observaciones adicionales:</h3>
                    <div className="p-4 border rounded-md">
                      <p className="whitespace-pre-line">{cuestionario.datos.medico.observaciones}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Firma */}
            <div className="mt-8 pt-8 border-t">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">Fecha: {new Date().toLocaleDateString("es-ES")}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">Firma del médico:</p>
                  <div className="h-16 mt-2 border-b border-dashed border-gray-400 w-48"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="tratamiento" className="mt-0">
        <TratamientoMedicoForm
          pacienteId={cuestionario.id || ""}
          tratamientoInicial={cuestionario.datos?.medico?.tratamiento}
          observacionesIniciales={cuestionario.datos?.medico?.observaciones}
          onSave={handleTratamientoSaved}
        />
      </TabsContent>
    </div>
  )
}

