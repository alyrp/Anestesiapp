"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, FileText, Calendar, Settings, FileOutput, Filter } from "lucide-react"
import { obtenerCuestionarios } from "@/actions/cuestionario-actions"
import { useToastContext } from "@/components/ui/toast-provider"

export default function DashboardMedicoPage() {
  const router = useRouter()
  const [cuestionarios, setCuestionarios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filtro, setFiltro] = useState("pendientes")
  const { toast } = useToastContext()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await obtenerCuestionarios()

        if (result.success) {
          setCuestionarios(result.cuestionarios || [])
        } else {
          setError(result.error || "No se pudieron cargar los cuestionarios")
          toast({
            title: "Error",
            description: "No se pudieron cargar los cuestionarios",
            variant: "destructive",
          })
        }
      } catch (err) {
        setError("Ocurrió un error al cargar los datos")
        toast({
          title: "Error",
          description: "Ocurrió un error al cargar los datos",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("es-ES")
    } catch (error) {
      return "Fecha inválida"
    }
  }

  // Filtrar cuestionarios según la pestaña seleccionada
  const cuestionariosFiltrados = cuestionarios.filter((c) => {
    if (filtro === "pendientes") return !c.revisado
    if (filtro === "revisados") return c.revisado
    return true // "todos"
  })

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Panel izquierdo */}
      <div className="w-1/3 p-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Médico</h1>
          <p className="text-muted-foreground">Gestione las evaluaciones preoperatorias de sus pacientes</p>
        </div>

        <div className="mt-8 space-y-4">
          <div className="relative">
            <Input type="search" placeholder="Buscar paciente..." className="pl-10" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtrar
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Calendario
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuración
            </Button>
            <Button className="flex items-center gap-2">
              <FileOutput className="h-4 w-4" />
              Generar informe
            </Button>
          </div>
        </div>
      </div>

      {/* Panel derecho - Tabla de pacientes */}
      <div className="w-2/3 p-6">
        <Card className="border rounded-lg shadow-sm">
          <div className="p-4">
            <Tabs defaultValue="pendientes" onValueChange={setFiltro}>
              <TabsList className="mb-4">
                <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
                <TabsTrigger value="revisados">Revisados</TabsTrigger>
                <TabsTrigger value="todos">Todos</TabsTrigger>
              </TabsList>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Paciente</TableHead>
                      <TableHead>Edad</TableHead>
                      <TableHead>Procedimiento</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          <div className="flex justify-center items-center">
                            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
                            <span className="ml-2">Cargando...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : error ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-red-500">
                          {error}
                        </TableCell>
                      </TableRow>
                    ) : cuestionariosFiltrados.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                          No se encontraron pacientes que coincidan con los criterios de búsqueda
                        </TableCell>
                      </TableRow>
                    ) : (
                      cuestionariosFiltrados.map((cuestionario) => {
                        // Calcular edad a partir de la fecha de nacimiento
                        const edad = cuestionario.datos?.personal?.fechaNacimiento
                          ? Math.floor(
                              (new Date().getTime() - new Date(cuestionario.datos.personal.fechaNacimiento).getTime()) /
                                31557600000,
                            )
                          : "N/A"

                        return (
                          <TableRow key={cuestionario.id}>
                            <TableCell className="font-medium">{cuestionario.nombrePaciente}</TableCell>
                            <TableCell>{edad}</TableCell>
                            <TableCell>{"Cirugía general"}</TableCell>
                            <TableCell>{formatDate(cuestionario.fechaEnvio)}</TableCell>
                            <TableCell>
                              {cuestionario.revisado ? (
                                <Badge variant="outline" className="bg-green-50">
                                  Revisado
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-yellow-50">
                                  Pendiente
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => router.push(`/dashboard-medico/paciente/${cuestionario.id}`)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => router.push(`/dashboard-medico/paciente/${cuestionario.id}/informe`)}
                                >
                                  <FileText className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                <div>
                  Mostrando {cuestionariosFiltrados.length} de {cuestionarios.length} pacientes
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Anterior
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Siguiente
                  </Button>
                </div>
              </div>
            </Tabs>
          </div>
        </Card>
      </div>
    </div>
  )
}

