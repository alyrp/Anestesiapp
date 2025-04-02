import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/preop-evaluation"

if (!MONGODB_URI) {
  throw new Error("Por favor, define la variable de entorno MONGODB_URI")
}

// Variable para almacenar el estado de la conexión
let isConnected = false

/**
 * Función para conectar a MongoDB
 */
export async function dbConnect() {
  if (isConnected) {
    console.log("=> Usando conexión existente a MongoDB")
    return
  }

  try {
    const db = await mongoose.connect(MONGODB_URI)
    isConnected = !!db.connections[0].readyState
    console.log("=> Conexión a MongoDB establecida correctamente")
  } catch (error) {
    console.error("Error al conectar con MongoDB:", error)
    throw error
  }
}

export default dbConnect

