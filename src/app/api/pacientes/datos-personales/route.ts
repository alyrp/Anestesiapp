import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    nombre: "Juan Pérez",
    edad: 30,
    estado_emocional: "tranquilo",
  })
}

export async function POST(request: Request) {
  const body = await request.json()
  console.log("Datos guardados:", body) // Simula el guardado en base de datos
  return NextResponse.json({ message: "Estado emocional actualizado" })
}