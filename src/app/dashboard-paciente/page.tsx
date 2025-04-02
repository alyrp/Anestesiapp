// app/dashboard-paciente/datos-personales/page.tsx
"use client"

import { useState } from 'react'
import { DatosPersonalesForm } from '@/components/datos-personales-form'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'

export default function DatosPersonalesPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleSubmit = async (data: any) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/pacientes/cuestionario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      const result = await response.json()
      
      if (result.success) {
        toast({
          title: "Cuestionario enviado",
          description: "Sus datos han sido guardados correctamente.",
        })
        
        // Redirigir al paciente a la siguiente sección o a una página de confirmación
        router.push('/dashboard-paciente/confirmacion')
      } else {
        throw new Error(result.error || 'Error al enviar el cuestionario')
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "No se pudo enviar el cuestionario. Por favor, inténtelo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Datos Personales</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <DatosPersonalesForm onSubmit={handleSubmit} />
      </div>
    </div>
  )
}