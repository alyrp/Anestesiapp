"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { YearDatePicker } from "@/components/year-date-picker"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

// Lista de actividades físicas para usar en el formulario
const actividadesFisicas = [
  { id: "comer_vestirse", label: "Comer, vestirme y trabajar con un ordenador" },
  { id: "bajar_escaleras", label: "Bajar escaleras, caminar por casa o cocinar." },
  { id: "caminar_manzanas", label: "Caminar una o dos manzanas en llano" },
  { id: "jardineria", label: "Practicar jardinería en casa y rastrillar las hojas" },
  { id: "subir_escaleras_bailar", label: "Subir un tramo de escaleras y bailar." },
  { id: "golf", label: "Jugar al golf." },
  { id: "trotar", label: "Subir escaleras con rapidez o trotar lentamente." },
  { id: "saltar_cuerda", label: "Saltar la cuerda o practicar ciclismo con moderación" },
  { id: "nadar_rapido", label: "Nadar rápidamente o correr con energía." },
  { id: "esqui_baloncesto", label: "Practicar esquí de fondo o jugar al baloncesto en todo el campo." },
  { id: "correr_rapido", label: "Correr rápido distancias de moderadas a grandes." },
]

const formSchema = z.object({
  nombre: z.string().min(2, { message: "El nombre es requerido" }),
  apellidos: z.string().min(2, { message: "Los apellidos son requeridos" }),
  fechaNacimiento: z.date({ required_error: "La fecha de nacimiento es requerida" }),
  genero: z.string({ required_error: "El género es requerido" }),
  dni: z.string().min(9, { message: "El DNI/NIE debe tener al menos 9 caracteres" }),
  telefono: z.string().min(9, { message: "El teléfono debe tener al menos 9 dígitos" }),
  email: z.string().email({ message: "Introduzca un email válido" }),
  estadoEmocional: z.enum(["tranquilo", "algo_nervioso", "muy_nervioso"], {
    required_error: "Por favor seleccione una opción",
  }),
  // Cambiamos a un array de strings para permitir selección múltiple
  actividadesFisicas: z.array(z.string()).min(1, {
    message: "Seleccione al menos una actividad física",
  }),
  peso: z.string().min(1, { message: "El peso es requerido" }),
  talla: z.string().min(1, { message: "La talla es requerida" }),
})

type FormValues = z.infer<typeof formSchema>

interface DatosPersonalesFormProps {
  onSubmit: (values: FormValues) => void
  initialData?: Partial<FormValues>
}

export function DatosPersonalesForm({ onSubmit, initialData = {} }: DatosPersonalesFormProps) {
  const [isMounted, setIsMounted] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      apellidos: "",
      dni: "",
      telefono: "",
      email: "",
      estadoEmocional: undefined,
      actividadesFisicas: [],
      peso: "",
      talla: "",
      ...initialData,
    },
  })

  useEffect(() => {
    setIsMounted(true)

    // Cargar datos iniciales si existen
    if (initialData && Object.keys(initialData).length > 0) {
      // Convertir strings de fecha a objetos Date si es necesario
      const formattedData = { ...initialData }
      if (initialData.fechaNacimiento && typeof initialData.fechaNacimiento === "string") {
        formattedData.fechaNacimiento = new Date(initialData.fechaNacimiento)
      }

      Object.keys(formattedData).forEach((key) => {
        form.setValue(key as any, formattedData[key as keyof typeof formattedData])
      })
    }
  }, [form, initialData])

  function onSubmitHandler(values: FormValues) {
    if (typeof onSubmit === "function") {
      onSubmit(values)
    } else {
      console.error("Error: onSubmit no es una función")
    }
  }

  if (!isMounted) {
    return null
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="apellidos"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellidos</FormLabel>
                <FormControl>
                  <Input placeholder="Apellidos" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fechaNacimiento"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de nacimiento</FormLabel>
                <YearDatePicker
                  date={field.value}
                  setDate={field.onChange}
                  yearRange={{ start: 1920, end: new Date().getFullYear() }}
                  placeholder="Seleccione fecha de nacimiento"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="genero"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Género</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione género" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="femenino">Femenino</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                    <SelectItem value="prefiero-no-decir">Prefiero no decir</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dni"
            render={({ field }) => (
              <FormItem>
                <FormLabel>DNI/NIE</FormLabel>
                <FormControl>
                  <Input placeholder="DNI/NIE" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="telefono"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input placeholder="Teléfono" type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="correo@ejemplo.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="estadoEmocional"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="font-medium">¿CÓMO SE ENCUENTRA EN RELACIÓN CON SU PRÓXIMA INTERVENCIÓN?</FormLabel>
              <div className="text-sm text-muted-foreground mb-2">
                (Marque la opción que mejor se ajusta a su estado actual)
              </div>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-3"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="tranquilo" id="estado_tranquilo" />
                    <Label htmlFor="estado_tranquilo" className="text-sm">
                      Bien, tranquilo y confiado.
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="algo_nervioso" id="estado_algo_nervioso" />
                    <Label htmlFor="estado_algo_nervioso" className="text-sm">
                      Algo nervioso cuando lo pienso, pero tranquilo el resto del tiempo.
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="muy_nervioso" id="estado_muy_nervioso" />
                    <Label htmlFor="estado_muy_nervioso" className="text-sm">
                      Muy nervioso. Me cuesta no pensar en otra cosa.
                    </Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="actividadesFisicas"
          render={() => (
            <FormItem className="space-y-3">
              <FormLabel className="font-medium">
                ¿QUÉ ACTIVIDAD ES CAPAZ DE REALIZAR USTED EN SU VIDA COTIDIANA?
              </FormLabel>
              <div className="text-sm text-muted-foreground mb-2">
                (Marque todas las opciones que se ajustan a su mejor estado de salud)
              </div>
              <div className="space-y-3">
                {actividadesFisicas.map((actividad) => (
                  <FormField
                    key={actividad.id}
                    control={form.control}
                    name="actividadesFisicas"
                    render={({ field }) => {
                      return (
                        <FormItem key={actividad.id} className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(actividad.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, actividad.id])
                                  : field.onChange(field.value?.filter((value) => value !== actividad.id))
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">{actividad.label}</FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="peso"
            render={({ field }) => (
              <FormItem>
                <FormLabel>¿CUÁNTO PESA? (kg)</FormLabel>
                <FormControl>
                  <Input placeholder="Peso en kg" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="talla"
            render={({ field }) => (
              <FormItem>
                <FormLabel>¿CUÁNTO MIDE? (cm)</FormLabel>
                <FormControl>
                  <Input placeholder="Talla en cm" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit">Guardar</Button>
      </form>
    </Form>
  )
}

