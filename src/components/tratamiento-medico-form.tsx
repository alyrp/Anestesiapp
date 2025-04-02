"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { actualizarTratamientoMedico } from "@/actions/cuestionario-actions"
import { useToastContext } from "@/components/ui/toast-provider"

interface TratamientoMedicoFormProps {
  pacienteId: string
  tratamientoInicial?: string
  observacionesIniciales?: string
  onSave?: () => void
}

export function TratamientoMedicoForm({
  pacienteId,
  tratamientoInicial = "",
  observacionesIniciales = "",
  onSave,
}: TratamientoMedicoFormProps) {
  const [tratamiento, setTratamiento] = useState(tratamientoInicial)
  const [observaciones, setObservaciones] = useState(observacionesIniciales)
  const [loading, setLoading] = useState(false)
  const { toast } = useToastContext()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      const result = await actualizarTratamientoMedico(pacienteId, tratamiento, observaciones)

      if (result.success) {
        toast({
          title: "Guardado correctamente",
          description: "El tratamiento médico ha sido actualizado",
          variant: "default",
        })

        if (onSave) {
          onSave()
        }
      } else {
        toast({
          title: "Error",
          description: result.error || "No se pudo guardar el tratamiento",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al guardar el tratamiento:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar el tratamiento",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tratamiento Médico</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tratamiento">Tratamiento recomendado</Label>
            <Textarea
              id="tratamiento"
              placeholder="Introduzca el tratamiento recomendado para el paciente"
              value={tratamiento}
              onChange={(e) => setTratamiento(e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observaciones">Observaciones adicionales</Label>
            <Textarea
              id="observaciones"
              placeholder="Observaciones adicionales (opcional)"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar tratamiento"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

