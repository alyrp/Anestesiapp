"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function HomePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("paciente")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handlePacienteLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulamos un inicio de sesión
    setTimeout(() => {
      router.push("/formulario")
      setLoading(false)
    }, 1000)
  }

  const handleMedicoLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulamos un inicio de sesión
    setTimeout(() => {
      router.push("/dashboard-medico")
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Evaluación Preoperatoria</CardTitle>
            <CardDescription>Acceda al sistema según su perfil</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="paciente">Paciente</TabsTrigger>
                <TabsTrigger value="medico">Médico</TabsTrigger>
              </TabsList>

              <TabsContent value="paciente">
                <form onSubmit={handlePacienteLogin} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-paciente">Email</Label>
                    <Input
                      id="email-paciente"
                      type="email"
                      placeholder="su.email@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password-paciente">Contraseña</Label>
                      <a href="#" className="text-xs text-blue-500 hover:underline">
                        ¿Olvidó su contraseña?
                      </a>
                    </div>
                    <Input
                      id="password-paciente"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="medico">
                <form onSubmit={handleMedicoLogin} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-medico">Email</Label>
                    <Input
                      id="email-medico"
                      type="email"
                      placeholder="medico@hospital.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password-medico">Contraseña</Label>
                      <a href="#" className="text-xs text-blue-500 hover:underline">
                        ¿Olvidó su contraseña?
                      </a>
                    </div>
                    <Input
                      id="password-medico"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              ¿No tiene una cuenta?{" "}
              <a href="#" className="text-blue-500 hover:underline">
                Regístrese aquí
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

