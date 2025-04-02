// el médico puede gestionar las evaluaciones preoperatorias de sus pacientes


"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, Filter, FileText, AlertTriangle, CheckCircle, Clock, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Datos de ejemplo para pacientes
const pacientes = [
  {
    id: 1,
    nombre: "María García López",
    edad: 45,
    revisado: false,
  },
  {
    id: 2,
    nombre: "Juan Martínez Ruiz",
    edad: 67,
    revisado: true,
  },
  {
    id: 3,
    nombre: "Ana Sánchez Pérez",
    edad: 32,
    revisado: false,
  },
  {
    id: 4,
    nombre: "Carlos Rodríguez Gómez",
    edad: 58,
    revisado: true,
  },
  {
    id: 5,
    nombre: "Laura Fernández Díaz",
    edad: 41,
    revisado: false,
  },
  {
    id: 6,
    nombre: "Miguel Álvarez Moreno",
    edad: 72,
    revisado: false,
  },
  {
    id: 7,
    nombre: "Sofía Jiménez Navarro",
    edad: 29,
    revisado: true,
  },
  {
    id: 8,
    nombre: "Pablo Gutiérrez Ortega",
    edad: 63,
    revisado: false,
  },
]

export default function DashboardMedicoPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("pendientes")

  // Filtrar pacientes según la pestaña activa y el término de búsqueda
  const filteredPacientes = pacientes.filter((paciente) => {
    const matchesSearch =
      paciente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paciente.procedimiento.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "pendientes") {
      return matchesSearch && !paciente.revisado
    } else if (activeTab === "revisados") {
      return matchesSearch && paciente.revisado
    } else {
      return matchesSearch
    }
  })

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Médico</h1>
          <p className="text-muted-foreground">Gestione las evaluaciones preoperatorias de sus pacientes</p>
        </div>

        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="flex items-center gap-4">
            <div className=" w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar paciente..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtrar
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Todos los pacientes</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Esta semana</DropdownMenuItem>
                <DropdownMenuItem>Próxima semana</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-9">
              <Calendar className="mr-2 h-4 w-4" />
              Calendario
            </Button>
            <Button size="sm" className="h-9">
              <FileText className="mr-2 h-4 w-4" />
              Generar informe
            </Button>
          </div>
        </div>

        <Card className="w-full">
          <CardHeader className="p-4">
            <Tabs defaultValue="pendientes" value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
                <TabsTrigger value="revisados">Revisados</TabsTrigger>
                <TabsTrigger value="todos">Todos</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Edad</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPacientes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No se encontraron pacientes que coincidan con los criterios de búsqueda
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPacientes.map((paciente) => (
                    <TableRow key={paciente.id}>
                      <TableCell className="font-medium">{paciente.nombre}</TableCell>
                      <TableCell>{paciente.edad} años</TableCell>

                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Ver detalles
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-muted-foreground">
              Mostrando {filteredPacientes.length} de {pacientes.length} pacientes
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Anterior
              </Button>
              <Button variant="outline" size="sm">
                Siguiente
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

