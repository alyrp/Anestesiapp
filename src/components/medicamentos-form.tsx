"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Plus, Trash2 } from "lucide-react"
import { MedicamentosAutocomplete } from "@/components/medicamentos-autocomplete"
import { Label } from "@/components/ui/label"

const medicamentoSchema = z.object({
  nombre: z.string().min(1, { message: "El nombre del medicamento es requerido" }),
})

const formSchema = z.object({
  toma_medicamentos: z.enum(["si", "no"]),
  medicamentos: z.array(medicamentoSchema).optional(),
  reaccion_adversa: z.enum(["si", "no"]),
  medicamento_adverso: z.string().optional(),
  tipo_reaccion: z.enum(["alergia", "efecto_secundario"]).optional(),
  detalle_efecto_secundario: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>
type Medicamento = z.infer<typeof medicamentoSchema>

interface MedicamentosFormProps {
  onSaveData?: (data: FormValues) => void
  initialData?: any
}

export function MedicamentosForm({ onSaveData = () => {}, initialData = {} }: MedicamentosFormProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([])
  const [currentMedicamento, setCurrentMedicamento] = useState<Medicamento>({
    nombre: "",
  })

  // Inicializar el formulario con valores por defecto
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      toma_medicamentos: "no",
      medicamentos: [],
      reaccion_adversa: "no",
      medicamento_adverso: "",
      tipo_reaccion: undefined,
      detalle_efecto_secundario: "",
      ...initialData,
    },
  })

  // Observar cambios en reaccion_adversa para resetear campos dependientes
  const reaccionAdversa = form.watch("reaccion_adversa")
  const tipoReaccion = form.watch("tipo_reaccion")

  useEffect(() => {
    if (reaccionAdversa === "no") {
      form.setValue("medicamento_adverso", "")
      form.setValue("tipo_reaccion", undefined)
      form.setValue("detalle_efecto_secundario", "")
    }
  }, [reaccionAdversa, form])

  useEffect(() => {
    if (tipoReaccion !== "efecto_secundario") {
      form.setValue("detalle_efecto_secundario", "")
    }
  }, [tipoReaccion, form])

  // Cargar datos iniciales solo una vez al montar el componente
  useEffect(() => {
    setIsMounted(true)

    // Cargar medicamentos iniciales si existen
    if (initialData?.medicamentos && Array.isArray(initialData.medicamentos)) {
      setMedicamentos(initialData.medicamentos)
    }
  }, []) // Solo se ejecuta una vez al montar

  // Función para manejar el envío del formulario
  const onSubmit = (data: FormValues) => {
    const formData = {
      ...data,
      medicamentos: medicamentos,
    }

    if (typeof onSaveData === "function") {
      onSaveData(formData)
    }
  }

  const handleAddMedicamento = () => {
    if (currentMedicamento.nombre) {
      setMedicamentos((prev) => [...prev, { ...currentMedicamento }])
      setCurrentMedicamento({
        nombre: "",
      })
    }
  }

  const handleRemoveMedicamento = (index: number) => {
    setMedicamentos((prev) => {
      const updated = [...prev]
      updated.splice(index, 1)
      return updated
    })
  }

  if (!isMounted) {
    return null
  }

  // Determinar si mostrar secciones adicionales basado en los valores actuales del formulario
  const showMedicamentos = form.watch("toma_medicamentos") === "si"

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        <FormField
          control={form.control}
          name="toma_medicamentos"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>¿Toma algún medicamento regularmente?</FormLabel>
              <FormControl>
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-3 space-y-0">
                    <input
                      type="radio"
                      id="toma_medicamentos_si"
                      value="si"
                      checked={field.value === "si"}
                      onChange={() => field.onChange("si")}
                      className="h-4 w-4 rounded-full border border-primary text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    />
                    <label htmlFor="toma_medicamentos_si" className="font-normal text-sm">
                      Sí
                    </label>
                  </div>
                  <div className="flex items-center space-x-3 space-y-0">
                    <input
                      type="radio"
                      id="toma_medicamentos_no"
                      value="no"
                      checked={field.value === "no"}
                      onChange={() => field.onChange("no")}
                      className="h-4 w-4 rounded-full border border-primary text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    />
                    <label htmlFor="toma_medicamentos_no" className="font-normal text-sm">
                      No
                    </label>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {showMedicamentos && (
          <div className="space-y-4 border p-4 rounded-md">
            <h3 className="font-medium">Lista de Medicamentos</h3>

            {medicamentos.length > 0 && (
              <div className="space-y-2">
                {medicamentos.map((med, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                    <div>
                      <p className="font-medium">{med.nombre}</p>
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveMedicamento(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              <div className="w-full">
                <div className="mb-2 text-sm font-medium">Nombre del medicamento</div>
                <MedicamentosAutocomplete
                  value={currentMedicamento.nombre}
                  onChange={(value) =>
                    setCurrentMedicamento({
                      ...currentMedicamento,
                      nombre: value,
                    })
                  }
                  placeholder="Nombre del medicamento"
                  className="w-full"
                />
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddMedicamento}
              disabled={!currentMedicamento.nombre}
            >
              <Plus className="h-4 w-4 mr-2" />
              Añadir medicamento
            </Button>
          </div>
        )}

        
        {/* Nueva sección para reacciones adversas a medicamentos */}
        <FormField
          control={form.control}
          name="reaccion_adversa"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="font-medium">¿ALGUNA VEZ LE HA SENTADO MAL ALGÚN MEDICAMENTO?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-row space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="reaccion_adversa_no" />
                    <Label htmlFor="reaccion_adversa_no">NO</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="si" id="reaccion_adversa_si" />
                    <Label htmlFor="reaccion_adversa_si">SÍ</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {reaccionAdversa === "si" && (
          <div className="space-y-4 ml-6">
            <FormField
              control={form.control}
              name="medicamento_adverso"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>¿Qué medicamento?</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del medicamento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tipo_reaccion"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>¿Qué le ocurrió?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-3"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="alergia" id="tipo_reaccion_alergia" />
                        <Label htmlFor="tipo_reaccion_alergia">Reacción alérgica</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="efecto_secundario" id="tipo_reaccion_efecto" />
                        <Label htmlFor="tipo_reaccion_efecto">Efecto secundario</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {tipoReaccion === "efecto_secundario" && (
              <FormField
                control={form.control}
                name="detalle_efecto_secundario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Describa el efecto secundario</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describa qué efecto secundario experimentó"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        )}

        <Button type="button" onClick={form.handleSubmit(onSubmit)}>
          Guardar
        </Button>
      </form>
    </Form>
  )
}

