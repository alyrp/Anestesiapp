// components/estado-emocional-form.tsx
"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const formSchema = z.object({
  estado_emocional: z.enum(["tranquilo", "algo_nervioso", "muy_nervioso"], {
    required_error: "Por favor seleccione una opción",
  }),
})

type FormValues = z.infer<typeof formSchema>

interface EstadoEmocionalFormProps {
  onSaveData?: (data: FormValues) => void
  initialData?: Partial<FormValues>
}

export function EstadoEmocionalForm({ onSaveData = () => {}, initialData = {} }: EstadoEmocionalFormProps) {
  const [isMounted, setIsMounted] = useState(false)

  // Inicializar el formulario con valores por defecto
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      estado_emocional: initialData.estado_emocional || undefined,
    },
  })

  // Cargar datos iniciales solo una vez al montar el componente
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Función para manejar el envío del formulario
  const onSubmit = (data: FormValues) => {
    if (typeof onSaveData === 'function') {
      onSaveData(data)
    }
  }

  if (!isMounted) {
    return null
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        <FormField
          control={form.control}
          name="estado_emocional"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="font-medium text-base">
                ¿CÓMO SE ENCUENTRA EN RELACIÓN CON SU PRÓXIMA INTERVENCIÓN?
              </FormLabel>
              <div className="text-sm text-muted-foreground mb-2">
                (Marque la opción que mejor se ajusta a su estado actual)
              </div>
              <FormControl>
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="estado_tranquilo"
                      value="tranquilo"
                      checked={field.value === "tranquilo"}
                      onChange={() => field.onChange("tranquilo")}
                      className="h-4 w-4 rounded-full border border-primary text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    />
                    <label htmlFor="estado_tranquilo" className="text-sm">
                      Bien, tranquilo y confiado.
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="estado_algo_nervioso"
                      value="algo_nervioso"
                      checked={field.value === "algo_nervioso"}
                      onChange={() => field.onChange("algo_nervioso")}
                      className="h-4 w-4 rounded-full border border-primary text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    />
                    <label htmlFor="estado_algo_nervioso" className="text-sm">
                      Algo nervioso cuando lo pienso, pero tranquilo el resto del tiempo.
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="estado_muy_nervioso"
                      value="muy_nervioso"
                      checked={field.value === "muy_nervioso"}
                      onChange={() => field.onChange("muy_nervioso")}
                      className="h-4 w-4 rounded-full border border-primary text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    />
                    <label htmlFor="estado_muy_nervioso" className="text-sm">
                      Muy nervioso. Me cuesta no pensar en otra cosa.
                    </label>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          Guardar
        </Button>
      </form>
    </Form>
  )
}