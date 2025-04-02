"use server"

import dbConnect from "@/lib/mongodb"
import Paciente from "@/models/Paciente"

// Ejemplo de cómo obtener todos los cuestionarios
export const obtenerCuestionarios = async () => {
  try {
    await dbConnect()
    const cuestionarios = await Paciente.find({}).sort({ fechaEnvio: -1 })

    return {
      success: true,
      cuestionarios: JSON.parse(JSON.stringify(cuestionarios)),
    }
  } catch (error: any) {
    console.error("Error al obtener los cuestionarios:", error)
    return {
      success: false,
      error: "Error al obtener los cuestionarios",
    }
  }
}

// Función para obtener un cuestionario por ID
export const obtenerCuestionarioPorId = async (id: string) => {
  try {
    await dbConnect()
    const cuestionario = await Paciente.findById(id)

    if (cuestionario) {
      return {
        success: true,
        cuestionario: JSON.parse(JSON.stringify(cuestionario)),
      }
    } else {
      return {
        success: false,
        error: "Cuestionario no encontrado",
      }
    }
  } catch (error: any) {
    console.error("Error al obtener el cuestionario:", error)
    return {
      success: false,
      error: "Error al obtener el cuestionario",
    }
  }
}

// Función para marcar un cuestionario como revisado
export const marcarCuestionarioRevisado = async (id: string, revisado: boolean) => {
  try {
    await dbConnect()
    const cuestionario = await Paciente.findByIdAndUpdate(id, { revisado }, { new: true })

    if (cuestionario) {
      return {
        success: true,
        message: "Estado revisado actualizado correctamente",
      }
    } else {
      return {
        success: false,
        error: "Cuestionario no encontrado",
      }
    }
  } catch (error: any) {
    console.error("Error al marcar el cuestionario como revisado:", error)
    return {
      success: false,
      error: "Error al marcar el cuestionario como revisado",
    }
  }
}

// Función para guardar un cuestionario
export const guardarCuestionario = async (pacienteId: string, datos: any) => {
  try {
    await dbConnect()

    // Crear un nuevo paciente con los datos del cuestionario
    const nuevoPaciente = new Paciente({
      nombrePaciente: `${datos.personal.nombre} ${datos.personal.apellidos}`,
      email: datos.personal.email,
      revisado: false,
      fechaEnvio: new Date(),
      datos: {
        personal: datos.personal,
        historial: datos.historial,
        medicamentos: datos.medicamentos,
        medico: {
          tratamiento: "",
          observaciones: "",
        },
      },
    })

    await nuevoPaciente.save()

    return {
      success: true,
      cuestionarioId: nuevoPaciente._id,
      message: "Cuestionario guardado correctamente",
    }
  } catch (error: any) {
    console.error("Error al guardar el cuestionario:", error)
    return {
      success: false,
      error: error.message || "Error al guardar el cuestionario",
    }
  }
}

// Función para actualizar el tratamiento médico
export const actualizarTratamientoMedico = async (id: string, tratamiento: string, observaciones = "") => {
  try {
    await dbConnect()
    const cuestionario = await Paciente.findByIdAndUpdate(
      id,
      {
        "datos.medico.tratamiento": tratamiento,
        "datos.medico.observaciones": observaciones,
      },
      { new: true },
    )

    if (cuestionario) {
      return {
        success: true,
        message: "Tratamiento médico actualizado correctamente",
      }
    } else {
      return {
        success: false,
        error: "Cuestionario no encontrado",
      }
    }
  } catch (error: any) {
    console.error("Error al actualizar el tratamiento médico:", error)
    return {
      success: false,
      error: "Error al actualizar el tratamiento médico",
    }
  }
}

