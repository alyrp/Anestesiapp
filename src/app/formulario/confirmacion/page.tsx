"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function ConfirmacionPage() {
  const router = useRouter()

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold">Cuestionario Enviado Correctamente</CardTitle>
            <CardDescription className="text-lg">Gracias por completar la evaluación preoperatoria</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-muted-foreground">
                Su información ha sido registrada y será revisada por el equipo médico. Si es necesario, nos pondremos
                en contacto con usted para solicitar información adicional.
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Próximos pasos</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm text-blue-700">
                <li>El equipo médico revisará su información.</li>
                <li>Recibirá instrucciones específicas para su procedimiento.</li>
                <li>Si tiene alguna pregunta, contacte con su médico o el servicio de anestesiología.</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button size="lg" onClick={() => router.push("/")}>
              Volver al inicio
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

