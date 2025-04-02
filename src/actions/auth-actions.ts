"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import bcrypt from "bcryptjs"

export async function loginPaciente(formData: { email: string; password: string }) {
  try {
    console.log("Intentando conectar a MongoDB...")
    await dbConnect()
    console.log("Conexión exitosa a MongoDB")

    // Buscar el usuario por email
    console.log("Buscando usuario con email:", formData.email)
    const user = await User.findOne({ email: formData.email }).select("+password")

    if (!user) {
      console.log("Usuario no encontrado")
      return { success: false, error: "Email o contraseña incorrectos" }
    }

    console.log("Usuario encontrado:", user.email)

    // Verificar la contraseña
    console.log("Verificando contraseña...")
    const isMatch = await bcrypt.compare(formData.password, user.password)

    console.log("¿Contraseña correcta?", isMatch)

    if (!isMatch) {
      return { success: false, error: "Email o contraseña incorrectos" }
    }

    // Verificar el rol
    console.log("Rol del usuario:", user.role)
    if (user.role !== "paciente") {
      return { success: false, error: "Esta cuenta no es de paciente" }
    }

    // Establecer una cookie de sesión
    const session = {
      id: user._id.toString(),
      nombre: user.nombre,
      apellidos: user.apellidos,
      email: user.email,
      role: user.role,
    }

    console.log("Estableciendo cookie de sesión:", session)

    const cookieStore = await cookies()
    cookieStore.set("session", JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 semana
      path: "/",
    })

    return { success: true }
  } catch (error) {
    console.error("Error en login:", error)
    return { success: false, error: `Error al iniciar sesión: ${error instanceof Error ? error.message : "Error desconocido"}` }
  }
}

export async function loginMedico(formData: { username: string; password: string }) {
  try {
    await dbConnect()

    // Buscar el médico por email o nombre de usuario
    const user = await User.findOne({
      $or: [
        { email: formData.username },
        { nombre: { $regex: new RegExp(formData.username, "i") } },
      ],
      role: "medico",
    }).select("+password")

    if (!user) {
      return { success: false, error: "Usuario o contraseña incorrectos" }
    }

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(formData.password, user.password)

    if (!isMatch) {
      return { success: false, error: "Usuario o contraseña incorrectos" }
    }

    // Establecer una cookie de sesión
    const session = {
      id: user._id.toString(),
      nombre: user.nombre,
      apellidos: user.apellidos,
      email: user.email,
      especialidad: user.especialidad,
      role: user.role,
    }

    const cookieStore = await cookies()
    cookieStore.set("session", JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 semana
      path: "/",
    })

    return { success: true }
  } catch (error) {
    console.error("Error en login médico:", error)
    return { success: false, error: "Error al iniciar sesión" }
  }
}

export async function registrarPaciente(formData: {
  nombre: string
  apellidos: string
  email: string
  password: string
  dni: string
}) {
  try {
    await dbConnect()

    // Verificar si el email ya está registrado
    const existingUser = await User.findOne({ email: formData.email })

    if (existingUser) {
      return { success: false, error: "Este email ya está registrado" }
    }

    // Crear el nuevo usuario
    await User.create({
      nombre: formData.nombre,
      apellidos: formData.apellidos,
      email: formData.email,
      password: formData.password, // El hash se hace automáticamente en el modelo
      dni: formData.dni,
      role: "paciente",
    })

    return { success: true }
  } catch (error) {
    console.error("Error en registro:", error)
    return { success: false, error: "Error al registrar el usuario" }
  }
}

export async function logout() {
  (await cookies()).delete("session")
  redirect("/")
}

export async function getSession() {
  const session = (await cookies()).get("session")?.value

  if (!session) {
    return null
  }

  return JSON.parse(session)
}

export async function requireAuth(role?: "paciente" | "medico") {
  const session = await getSession()

  if (!session) {
    redirect("/login-paciente")
  }

  if (role && session.role !== role) {
    if (role === "paciente") {
      redirect("/login-paciente")
    } else {
      redirect("/login-medico")
    }
  }

  return session
}