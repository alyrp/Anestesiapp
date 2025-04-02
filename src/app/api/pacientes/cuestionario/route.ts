// app/api/pacientes/cuestionario/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
// O importa tu cliente de base de datos preferido

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Conectar a la base de datos
    const { db } = await connectToDatabase()
    
    // Guardar los datos en la colección de cuestionarios
    const result = await db.collection('cuestionarios').insertOne({
      ...data,
      fechaCreacion: new Date(),
      revisado: false
    })
    
    return NextResponse.json({ 
      success: true, 
      id: result.insertedId 
    })
  } catch (error) {
    console.error('Error al guardar el cuestionario:', error)
    return NextResponse.json(
      { success: false, error: 'Error al guardar el cuestionario' },
      { status: 500 }
    )
  }
}