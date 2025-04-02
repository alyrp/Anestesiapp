"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

// Lista de posibles problemas con anestesias anteriores
const opcionesProblemasAnestesia = [
  { id: "via_venosa", label: "Para canalizar la vía venosa" },
  { id: "nauseas_vomitos", label: "Náuseas y vómitos al despertar" },
  { id: "dolor", label: "Mucho dolor" },
  { id: "sueno_prolongado", label: "Sueño prolongado" },
  { id: "dificultad_orinar", label: "Dificultad para orinar" },
]

const formSchema = z.object({
  primera_operacion: z.enum(["si", "no"], {
    required_error: "Por favor seleccione una opción",
  }),
  problemas_anestesia: z
    .enum(["si", "no"], {
      required_error: "Por favor seleccione una opción",
    })
    .optional(),
  tipos_problemas: z.array(z.string()).optional(),
  otros_problemas: z.string().optional(),
  // Nuevos campos
  marcapasos: z.enum(["si", "no"], {
    required_error: "Por favor seleccione una opción",
  }),
  cpap: z.enum(["si", "no"], {
    required_error: "Por favor seleccione una opción",
  }),
  sangrado: z.enum(["si", "no"], {
    required_error: "Por favor seleccione una opción",
  }),
  detalles_sangrado: z.string().optional(),
  fumador: z.enum(["si", "no", "ex_fumador"], {
    required_error: "Por favor seleccione una opción",
  }),
  alcohol: z.enum(["nunca", "ocasional", "regular", "diario"], {
    required_error: "Por favor seleccione una opción",
  }),
  drogas: z.enum(["si", "no"], {
    required_error: "Por favor seleccione una opción",
  }),
  detalles_drogas: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface HistorialMedicoFormProps {
  onSubmit: (values: FormValues) => void
  initialData?: Partial<FormValues>
}

export function HistorialMedicoForm({ onSubmit, initialData = {} }: HistorialMedicoFormProps) {
  const [isMounted, setIsMounted] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      primera_operacion: undefined,
      problemas_anestesia: undefined,
      tipos_problemas: [],
      otros_problemas: "",
      marcapasos: undefined,
      cpap: undefined,
      sangrado: undefined,
      detalles_sangrado: "",
      fumador: undefined,
      alcohol: undefined,
      drogas: undefined,
      detalles_drogas: "",
      ...initialData,
    },
  })

  // Observar cambios en primera_operacion para resetear campos dependientes
  const primeraOperacion = form.watch("primera_operacion")
  const tieneProblemasAnestesia = form.watch("problemas_anestesia")
  const tieneSangrado = form.watch("sangrado")
  const usaDrogas = form.watch("drogas")

  useEffect(() => {
    if (primeraOperacion === "si") {
      form.setValue("problemas_anestesia", undefined)
      form.setValue("tipos_problemas", [])
      form.setValue("otros_problemas", "")
    }
  }, [primeraOperacion, form])

  useEffect(() => {
    if (tieneProblemasAnestesia === "no") {
      form.setValue("tipos_problemas", [])
      form.setValue("otros_problemas", "")
    }
  }, [tieneProblemasAnestesia, form])

  useEffect(() => {
    if (tieneSangrado === "no") {
      form.setValue("detalles_sangrado", "")
    }
  }, [tieneSangrado, form])

  useEffect(() => {
    if (usaDrogas === "no") {
      form.setValue("detalles_drogas", "")
    }
  }, [usaDrogas, form])

  useEffect(() => {
    setIsMounted(true)

    // Cargar datos iniciales si existen
    if (initialData && Object.keys(initialData).length > 0) {
      Object.keys(initialData).forEach((key) => {
        form.setValue(key as any, initialData[key as keyof typeof initialData])
      })
    }
  }, [form, initialData])

  function onSubmitHandler(values: FormValues) {
    onSubmit(values)
  }

  if (!isMounted) {
    return null
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-8">
        <FormField
          control={form.control}
          name="primera_operacion"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="font-medium">¿ES LA PRIMERA VEZ QUE SE OPERA DE ALGO?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-row space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="si" id="primera_operacion_si" />
                    <Label htmlFor="primera_operacion_si">SÍ</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="primera_operacion_no" />
                    <Label htmlFor="primera_operacion_no">NO</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {primeraOperacion === "no" && (
          <FormField
            control={form.control}
            name="problemas_anestesia"
            render={({ field }) => (
              <FormItem className="space-y-3 ml-6">
                <FormLabel>¿Tuvo algún problema con las anestesias anteriores?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-row space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="problemas_anestesia_no" />
                      <Label htmlFor="problemas_anestesia_no">NO</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="si" id="problemas_anestesia_si" />
                      <Label htmlFor="problemas_anestesia_si">SÍ</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {primeraOperacion === "no" && tieneProblemasAnestesia === "si" && (
          <div className="ml-12 space-y-4">
            <FormField
              control={form.control}
              name="tipos_problemas"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Seleccione los problemas que experimentó:</FormLabel>
                  </div>
                  <div className="space-y-2">
                    {opcionesProblemasAnestesia.map((problema) => (
                      <FormField
                        key={problema.id}
                        control={form.control}
                        name="tipos_problemas"
                        render={({ field }) => {
                          return (
                            <FormItem key={problema.id} className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(problema.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), problema.id])
                                      : field.onChange(field.value?.filter((value) => value !== problema.id))
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{problema.label}</FormLabel>
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

            <FormField
              control={form.control}
              name="otros_problemas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OTROS PROBLEMAS</FormLabel>
                  <FormDescription>Si experimentó otros problemas no listados arriba, descríbalos aquí</FormDescription>
                  <FormControl>
                    <Textarea
                      placeholder="Describa otros problemas que haya tenido con anestesias anteriores"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Nuevos campos */}
        <div className="space-y-6 border p-4 rounded-md">
          <h3 className="font-medium text-lg">Dispositivos médicos y condiciones especiales</h3>

          <FormField
            control={form.control}
            name="marcapasos"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>¿Utiliza marcapasos?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-row space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="marcapasos_no" />
                      <Label htmlFor="marcapasos_no">NO</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="si" id="marcapasos_si" />
                      <Label htmlFor="marcapasos_si">SÍ</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cpap"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>¿Utiliza CPAP para dormir?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-row space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="cpap_no" />
                      <Label htmlFor="cpap_no">NO</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="si" id="cpap_si" />
                      <Label htmlFor="cpap_si">SÍ</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sangrado"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>
                  ¿Tiene problemas de sangrado (al lavarse los dientes, menstruación abundante o hematomas frecuentes)?
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-row space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="sangrado_no" />
                      <Label htmlFor="sangrado_no">NO</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="si" id="sangrado_si" />
                      <Label htmlFor="sangrado_si">SÍ</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {tieneSangrado === "si" && (
            <FormField
              control={form.control}
              name="detalles_sangrado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detalles sobre problemas de sangrado</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describa sus problemas de sangrado" className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="space-y-6 border p-4 rounded-md">
          <h3 className="font-medium text-lg">Hábitos</h3>

          <FormField
            control={form.control}
            name="fumador"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>¿Es fumador?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-row space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="fumador_no" />
                      <Label htmlFor="fumador_no">NO</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="si" id="fumador_si" />
                      <Label htmlFor="fumador_si">SÍ</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ex_fumador" id="fumador_ex" />
                      <Label htmlFor="fumador_ex">EX-FUMADOR</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="alcohol"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Consumo de alcohol</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-row space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="nunca" id="alcohol_nunca" />
                      <Label htmlFor="alcohol_nunca">NUNCA</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ocasional" id="alcohol_ocasional" />
                      <Label htmlFor="alcohol_ocasional">OCASIONAL</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="regular" id="alcohol_regular" />
                      <Label htmlFor="alcohol_regular">REGULAR</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="diario" id="alcohol_diario" />
                      <Label htmlFor="alcohol_diario">DIARIO</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="drogas"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>¿Consume drogas?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-row space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="drogas_no" />
                      <Label htmlFor="drogas_no">NO</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="si" id="drogas_si" />
                      <Label htmlFor="drogas_si">SÍ</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {usaDrogas === "si" && (
            <FormField
              control={form.control}
              name="detalles_drogas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detalles sobre consumo de drogas</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describa qué drogas consume y con qué frecuencia"
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

        <Button type="submit">Guardar</Button>
      </form>
    </Form>
  )
}

