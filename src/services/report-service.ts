// @ts-ignore
import jsPDF from "jspdf";
import html2canvas from "html2canvas"

// Tipo para los datos del cuestionario
export interface Cuestionario {
  id?: string
  pacienteId?: string
  revisado: boolean
  nombrePaciente?: string
  email?: string
  fechaEnvio?: string
  estado?: string
  datos?: {
    personal?: {
      nombre?: string
      apellidos?: string
      dni?: string
      fechaNacimiento?: string
      genero?: string
      telefono?: string
      email?: string
      procedimiento?: string
      fechaProcedimiento?: string
      estadoEmocional?: string
      actividadesFisicas?: string[]
      peso?: string
      talla?: string
    }
    historial?: {
      condiciones?: string[]
      alergias?: string
      cirugias_previas?: string
      complicaciones_anestesia?: string
      detalles_complicaciones?: string
      fumador?: string
      alcohol?: string
      primera_operacion?: string
      problemas_anestesia?: string
      tipos_problemas?: string[]
      marcapasos?: string
      sangrado?: string
      detalles_sangrado?: string
      drogas?: string
      detalles_drogas?: string
      cpap?: string
      detalles_cpap?: string
      problemas_cpap?: string
      detalles_problemas_cpap?: string 
      otros_problemas?: string
    }
    medicamentos?: {
      toma_medicamentos?: string
      medicamentos?: Array<{
        nombre: string
      }>
  
    }
    medico?: {
      tratamiento?: string
      observaciones?: string
    }
  }

// Función para generar un PDF a partir de un elemento HTML
export const generatePDF = async (elementId: string, fileName: string): Promise<void> => {
  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error(`Element with id ${elementId} not found`)
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    })

    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    const imgWidth = 210 // A4 width in mm
    const pageHeight = 297 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    // Si el contenido es más largo que una página, añadir más páginas
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    pdf.save(`${fileName}.pdf`)
  } catch (error) {
    console.error("Error generating PDF:", error)
    throw error
  }
}

// Función para formatear la fecha
export const formatDate = (dateString?: string): string => {
  if (!dateString) return "No especificada"

  try {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  } catch (error) {
    return "Fecha inválida"
  }
}

// Función para obtener texto legible del estado emocional
export const getEstadoEmocionalTexto = (estado?: string): string => {
  switch (estado) {
    case "tranquilo":
      return "Bien, tranquilo y confiado"
    case "algo_nervioso":
      return "Algo nervioso cuando lo pienso, pero tranquilo el resto del tiempo"
    case "muy_nervioso":
      return "Muy nervioso. Me cuesta no pensar en otra cosa"
    default:
      return "No especificado"
  }
}

// Función para obtener texto legible de las condiciones médicas
export const formatCondicionMedica = (condicion: string): string => {
  const condicionesMap: Record<string, string> = {
    hipertension: "Hipertensión",
    diabetes: "Diabetes",
    enfermedad_cardiaca: "Enfermedad cardíaca",
    enfermedad_pulmonar: "Enfermedad pulmonar",
    enfermedad_renal: "Enfermedad renal",
    enfermedad_hepatica: "Enfermedad hepática",
    cancer: "Cáncer",
    enfermedad_neurologica: "Enfermedad neurológica",
    enfermedad_autoinmune: "Enfermedad autoinmune",
  }

  return condicionesMap[condicion] || condicion.replace(/_/g, " ")
}

