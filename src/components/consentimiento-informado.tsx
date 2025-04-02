"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface ConsentimientoInformadoProps {
  onAccept: () => void
  onReject: () => void
  pacienteNombre?: string
  pacienteApellidos?: string
}

export function ConsentimientoInformado({
  onAccept,
  onReject,
  pacienteNombre = "",
  pacienteApellidos = "",
}: ConsentimientoInformadoProps) {
  const [aceptado, setAceptado] = useState(false)
  const [doctorNombre, setDoctorNombre] = useState("")
  const [doctorColegiado, setDoctorColegiado] = useState("")
  const [procedimiento, setProcedimiento] = useState("")
  const [anestesia, setAnestesia] = useState("")
  const [riesgos, setRiesgos] = useState("")
  const [dni, setDni] = useState("")
  const [edad, setEdad] = useState("")
  const [domicilio, setDomicilio] = useState("")
  const [lugar, setLugar] = useState("")
  const [representante, setRepresentante] = useState({
    nombre: "",
    dni: "",
    edad: "",
    domicilio: "",
  })
  const [mostrarRepresentante, setMostrarRepresentante] = useState(false)
  const [mostrarRenuncia, setMostrarRenuncia] = useState(false)
  const [personaDesignada, setPersonaDesignada] = useState({
    nombre: "",
    dni: "",
    edad: "",
    domicilio: "",
  })
  const [designarPersona, setDesignarPersona] = useState(false)

  const fecha = new Date().toLocaleDateString("es-ES")
  const nombreCompleto = `${pacienteNombre} ${pacienteApellidos}`.trim()

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="border-b">
        <CardTitle className="text-2xl font-bold">CONSENTIMIENTO INFORMADO DE ANESTESIA</CardTitle>
        <CardDescription>Por favor, lea atentamente este documento antes de firmar el consentimiento</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Información sobre la anestesia */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg">INFORMACIÓN SOBRE LA ANESTESIA</h3>
          <p className="text-sm">
            La anestesia es un procedimiento médico que permite realizar intervenciones quirúrgicas o pruebas
            diagnósticas sin dolor. El médico anestesiólogo es el especialista encargado de su cuidado durante todo el
            proceso, controlando sus funciones vitales y adaptando el procedimiento anestésico a sus necesidades
            específicas.
          </p>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="tipos-anestesia">
              <AccordionTrigger className="text-base font-medium">Tipos de anestesia</AccordionTrigger>
              <AccordionContent className="text-sm space-y-2">
                <p>
                  <strong>Anestesia general:</strong> Produce un estado reversible de inconsciencia, analgesia,
                  relajación muscular y pérdida de reflejos. Se administra por vía intravenosa y/o inhalatoria.
                </p>
                <p>
                  <strong>Anestesia regional:</strong> Bloquea la sensibilidad y, en ocasiones, la movilidad de una
                  parte del cuerpo mediante la inyección de anestésicos locales cerca de los nervios que la inervan.
                  Incluye:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Anestesia raquídea o intradural:</strong> Inyección de anestésico local en el líquido
                    cefalorraquídeo.
                  </li>
                  <li>
                    <strong>Anestesia epidural:</strong> Inyección de anestésico local en el espacio epidural.
                  </li>
                  <li>
                    <strong>Bloqueos nerviosos periféricos:</strong> Inyección de anestésico local cerca de nervios o
                    plexos nerviosos específicos.
                  </li>
                </ul>
                <p>
                  <strong>Anestesia combinada:</strong> Utilización simultánea de diferentes técnicas anestésicas.
                </p>
                <p>
                  <strong>Sedación:</strong> Administración de fármacos para disminuir el nivel de consciencia,
                  manteniendo la respiración espontánea y los reflejos protectores.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="riesgos-generales">
              <AccordionTrigger className="text-base font-medium">Riesgos generales de la anestesia</AccordionTrigger>
              <AccordionContent className="text-sm space-y-2">
                <p>
                  Toda intervención anestésica, tanto por la propia técnica como por la situación vital de cada
                  paciente, lleva implícitas una serie de complicaciones comunes y potencialmente serias que podrían
                  requerir tratamientos complementarios, tanto médicos como quirúrgicos.
                </p>
                <p>Las complicaciones pueden ser:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Reacciones alérgicas a medicamentos, que pueden llegar a ser graves (anafilaxia).</li>
                  <li>
                    Lesiones dentales, oculares, nerviosas o de otras zonas por la posición durante la intervención.
                  </li>
                  <li>Dificultad o imposibilidad para la intubación traqueal.</li>
                  <li>Náuseas y vómitos postoperatorios.</li>
                  <li>Aspiración de contenido gástrico.</li>
                  <li>Hipotermia (disminución de la temperatura corporal).</li>
                  <li>Trombosis venosa profunda y embolia pulmonar.</li>
                  <li>
                    Complicaciones cardiovasculares: alteraciones del ritmo cardíaco, hipotensión, hipertensión, infarto
                    de miocardio, etc.
                  </li>
                  <li>Complicaciones respiratorias: broncoespasmo, neumonía, atelectasia, etc.</li>
                  <li>Complicaciones neurológicas: convulsiones, coma, etc.</li>
                  <li>Complicaciones renales y hepáticas.</li>
                  <li>En casos excepcionales, complicaciones graves pueden conducir a la muerte.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="riesgos-especificos">
              <AccordionTrigger className="text-base font-medium">
                Riesgos específicos según el tipo de anestesia
              </AccordionTrigger>
              <AccordionContent className="text-sm space-y-2">
                <p>
                  <strong>Anestesia general:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Lesiones en la boca, faringe, laringe o tráquea durante la intubación.</li>
                  <li>Ronquera y dolor de garganta.</li>
                  <li>Despertar intraoperatorio (muy infrecuente).</li>
                  <li>Daño cerebral (extremadamente raro).</li>
                </ul>

                <p>
                  <strong>Anestesia regional (raquídea, epidural, bloqueos nerviosos):</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Cefalea post-punción dural.</li>
                  <li>Dolor de espalda.</li>
                  <li>Retención urinaria.</li>
                  <li>Hematoma epidural o espinal.</li>
                  <li>Infección en el sitio de punción, meningitis o absceso epidural.</li>
                  <li>Lesión nerviosa temporal o permanente.</li>
                  <li>Toxicidad por anestésicos locales.</li>
                  <li>Bloqueo incompleto o fallido que requiera complementar con anestesia general.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="factores-riesgo">
              <AccordionTrigger className="text-base font-medium">Factores que aumentan el riesgo</AccordionTrigger>
              <AccordionContent className="text-sm space-y-2">
                <p>Existen factores que pueden aumentar la frecuencia o gravedad de las complicaciones:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Edad avanzada.</li>
                  <li>Obesidad.</li>
                  <li>Enfermedades previas: cardíacas, pulmonares, hepáticas, renales, diabetes, hipertensión, etc.</li>
                  <li>Tabaquismo.</li>
                  <li>Alcoholismo.</li>
                  <li>Drogadicción.</li>
                  <li>Medicación habitual: anticoagulantes, antiagregantes, etc.</li>
                  <li>Intervenciones quirúrgicas previas.</li>
                  <li>Alergias conocidas.</li>
                  <li>Cirugía urgente.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="alternativas">
              <AccordionTrigger className="text-base font-medium">Alternativas a la anestesia</AccordionTrigger>
              <AccordionContent className="text-sm">
                <p>
                  Las alternativas dependen del tipo de intervención y de su estado físico. El anestesiólogo le
                  informará de las opciones disponibles para su caso particular y le recomendará la más adecuada.
                </p>
                <p>
                  En algunos casos, no existe alternativa a la anestesia para poder realizar el procedimiento quirúrgico
                  o diagnóstico previsto.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="paciente-nombre">Como paciente D/Dña:</Label>
              <Input id="paciente-nombre" value={nombreCompleto} readOnly className="mt-1" />
            </div>
            <div>
              <Label htmlFor="paciente-dni">Con DNI:</Label>
              <Input
                id="paciente-dni"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                placeholder="Introduzca su DNI"
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="paciente-edad">de años de edad:</Label>
              <Input
                id="paciente-edad"
                type="text"
                value={edad}
                onChange={(e) => setEdad(e.target.value)}
                placeholder="Edad"
                className="mt-1"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="paciente-domicilio">con domicilio en:</Label>
              <Input
                id="paciente-domicilio"
                value={domicilio}
                onChange={(e) => setDomicilio(e.target.value)}
                placeholder="Domicilio"
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-4">
            <Checkbox
              id="mostrar-representante"
              checked={mostrarRepresentante}
              onCheckedChange={(checked) => setMostrarRepresentante(checked as boolean)}
            />
            <Label htmlFor="mostrar-representante">
              Actúo como representante legal, familiar o persona vinculada al paciente
            </Label>
          </div>

          {mostrarRepresentante && (
            <div className="border p-4 rounded-md space-y-4 mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="representante-nombre">D/Dña:</Label>
                  <Input
                    id="representante-nombre"
                    value={representante.nombre}
                    onChange={(e) => setRepresentante({ ...representante, nombre: e.target.value })}
                    placeholder="Nombre del representante"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="representante-dni">Con DNI:</Label>
                  <Input
                    id="representante-dni"
                    value={representante.dni}
                    onChange={(e) => setRepresentante({ ...representante, dni: e.target.value })}
                    placeholder="DNI del representante"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="representante-edad">de años de edad:</Label>
                  <Input
                    id="representante-edad"
                    type="text"
                    value={representante.edad}
                    onChange={(e) => setRepresentante({ ...representante, edad: e.target.value })}
                    placeholder="Edad"
                    className="mt-1"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="representante-domicilio">con domicilio en:</Label>
                  <Input
                    id="representante-domicilio"
                    value={representante.domicilio}
                    onChange={(e) => setRepresentante({ ...representante, domicilio: e.target.value })}
                    placeholder="Domicilio"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="font-bold text-lg">DECLARO:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="doctor-nombre">Que el Dr/Dra:</Label>
              <Input
                id="doctor-nombre"
                value={doctorNombre}
                onChange={(e) => setDoctorNombre(e.target.value)}
                placeholder="Nombre del médico"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="doctor-colegiado">con nº de colegiado:</Label>
              <Input
                id="doctor-colegiado"
                value={doctorColegiado}
                onChange={(e) => setDoctorColegiado(e.target.value)}
                placeholder="Número de colegiado"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="procedimiento">
              Me ha explicado que es conveniente/necesario, en mi situación concreta, para poder efectuar un
              procedimiento/intervención de:
            </Label>
            <Input
              id="procedimiento"
              value={procedimiento}
              onChange={(e) => setProcedimiento(e.target.value)}
              placeholder="Describa el procedimiento"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="anestesia">la realización de un procedimiento anestésico consistente en:</Label>
            <Input
              id="anestesia"
              value={anestesia}
              onChange={(e) => setAnestesia(e.target.value)}
              placeholder="Tipo de anestesia"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="riesgos">Y que me ha explicado que mis riesgos específicos personalizados son:</Label>
            <Textarea
              id="riesgos"
              value={riesgos}
              onChange={(e) => setRiesgos(e.target.value)}
              placeholder="Riesgos específicos"
              className="mt-1"
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="font-bold text-lg">Y DADO QUE:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              He recibido información escrita sobre las diferentes técnicas anestésicas, incluyendo su descripción,
              objetivos, riesgos generales y alternativas razonables, con la suficiente antelación.
            </li>
            <li>
              Esta información ha sido ampliada de forma oral, incluyendo la valoración de mis riesgos específicos y
              circunstancias personales.
            </li>
            <li>
              He podido hacer las preguntas necesarias y he entendido las explicaciones del equipo médico sobre las
              indicaciones, ventajas, riesgos y alternativas al procedimiento anestésico propuesto.
            </li>
            <li>
              Se que puedo retirar este consentimiento en cualquier momento, sin tener que dar explicaciones,
              comunicando esta decisión al equipo médico. Así mismo, se que la firma de este documento no supone
              renunciar a posibles reclamaciones futuras.
            </li>
          </ul>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="font-bold text-lg">AUTORIZO:</h3>
          <p>De forma libre, consciente y voluntaria, que se me realice el procedimiento anestésico propuesto.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Label htmlFor="lugar">En:</Label>
              <Input
                id="lugar"
                value={lugar}
                onChange={(e) => setLugar(e.target.value)}
                placeholder="Lugar"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="fecha">Fecha:</Label>
              <Input id="fecha" value={fecha} readOnly className="mt-1" />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="font-bold text-lg">REVOCACIÓN DE CONSENTIMIENTO:</h3>
          <p>
            De forma libre, consciente y voluntaria, REVOCO EL CONSENTIMIENTO OTORGADO ANTERIORMENTE CON FECHA {fecha},
            y firmado en este mismo documento.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Label htmlFor="lugar-revocacion">En:</Label>
              <Input id="lugar-revocacion" placeholder="Lugar" disabled className="mt-1" />
            </div>
            <div>
              <Label htmlFor="fecha-revocacion">Fecha:</Label>
              <Input id="fecha-revocacion" placeholder="Fecha" disabled className="mt-1" />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="mostrar-renuncia"
              checked={mostrarRenuncia}
              onCheckedChange={(checked) => setMostrarRenuncia(checked as boolean)}
            />
            <Label htmlFor="mostrar-renuncia">Deseo renunciar a recibir información</Label>
          </div>

          {mostrarRenuncia && (
            <div className="border p-4 rounded-md space-y-4 mt-2">
              <h3 className="font-bold text-lg">RENUNCIA A RECIBIR INFORMACIÓN:</h3>
              <p>
                De forma libre, consciente y voluntaria, MANIFIESTO MI VOLUNTAD DE NO RECIBIR INFORMACIÓN RESPECTO AL
                PROCEDIMIENTO ANESTÉSICO, del cual firmo el correspondiente consentimiento informado.
              </p>
              <p>
                Se que puedo solicitar la información pertinente en cualquier momento previo a la realización del
                procedimiento, así como revocar el consentimiento otorgado.
              </p>
              <p>Se que puedo delegar la recepción en otra persona designada por mí, y:</p>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="no-designar"
                  checked={!designarPersona}
                  onCheckedChange={(checked) => setDesignarPersona(!(checked as boolean))}
                />
                <Label htmlFor="no-designar">No designo a otra persona para que reciba la información</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="designar"
                  checked={designarPersona}
                  onCheckedChange={(checked) => setDesignarPersona(checked as boolean)}
                />
                <Label htmlFor="designar">Designo para que reciba la información a:</Label>
              </div>

              {designarPersona && (
                <div className="space-y-4 mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="designada-nombre">D/Dña:</Label>
                      <Input
                        id="designada-nombre"
                        value={personaDesignada.nombre}
                        onChange={(e) => setPersonaDesignada({ ...personaDesignada, nombre: e.target.value })}
                        placeholder="Nombre"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="designada-dni">Con DNI:</Label>
                      <Input
                        id="designada-dni"
                        value={personaDesignada.dni}
                        onChange={(e) => setPersonaDesignada({ ...personaDesignada, dni: e.target.value })}
                        placeholder="DNI"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="designada-edad">de años de edad:</Label>
                      <Input
                        id="designada-edad"
                        type="text"
                        value={personaDesignada.edad}
                        onChange={(e) => setPersonaDesignada({ ...personaDesignada, edad: e.target.value })}
                        placeholder="Edad"
                        className="mt-1"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="designada-domicilio">con domicilio en:</Label>
                      <Input
                        id="designada-domicilio"
                        value={personaDesignada.domicilio}
                        onChange={(e) => setPersonaDesignada({ ...personaDesignada, domicilio: e.target.value })}
                        placeholder="Domicilio"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-start space-x-2 mt-6">
          <Checkbox id="aceptar" checked={aceptado} onCheckedChange={(checked) => setAceptado(checked as boolean)} />
          <Label htmlFor="aceptar" className="text-sm">
            Declaro que he leído y comprendido la información proporcionada sobre el procedimiento anestésico, sus
            riesgos y alternativas. Autorizo de forma libre, consciente y voluntaria, que se me realice el procedimiento
            anestésico propuesto.
          </Label>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2 border-t pt-4">
        <Button variant="outline" onClick={onReject}>
          Rechazar
        </Button>
        <Button onClick={onAccept} disabled={!aceptado}>
          Aceptar y continuar
        </Button>
      </CardFooter>
    </Card>
  )
}

