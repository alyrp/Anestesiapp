// Función para calcular la clasificación ASA
export const calcularASA = (datos: any): string => {
  if (!datos) return "No determinado"

  // Extraer datos relevantes
  const imc = calcularIMC(datos.personal?.peso, datos.personal?.talla)
  const tomaMedicamentos = datos.medicamentos?.toma_medicamentos === "si"
  const actividadFisica = obtenerNivelActividad(datos.personal?.actividadesFisicas)

  // Aplicar reglas de clasificación ASA
  if (!tomaMedicamentos && actividadFisica >= 7 && imc < 30) {
    return "ASA I"
  } else if (actividadFisica >= 5 && !(tomaMedicamentos && actividadFisica <= 5)) {
    return "ASA II"
  } else if (tomaMedicamentos && actividadFisica <= 5) {
    return "ASA III"
  } else {
    return "ASA IV"
  }
}

// Función para calcular el IMC
export const calcularIMC = (peso?: string, talla?: string): number => {
  if (!peso || !talla) return 0

  const pesoNum = Number.parseFloat(peso)
  const tallaMetros = Number.parseFloat(talla) / 100 // Convertir cm a metros

  if (pesoNum <= 0 || tallaMetros <= 0) return 0

  return pesoNum / (tallaMetros * tallaMetros)
}

// Función para obtener el nivel de actividad física
export const obtenerNivelActividad = (actividades?: string[]): number => {
  if (!actividades || actividades.length === 0) return 0

  // Mapear actividades a niveles numéricos
  const nivelesActividad: Record<string, number> = {
    comer_vestirse: 1,
    bajar_escaleras: 2,
    caminar_manzanas: 3,
    jardineria: 4,
    subir_escaleras_bailar: 5,
    golf: 6,
    trotar: 7,
    saltar_cuerda: 8,
    nadar_rapido: 9,
    esqui_baloncesto: 10,
    correr_rapido: 11,
  }

  // Encontrar la actividad de mayor nivel
  let nivelMaximo = 0
  actividades.forEach((actividad) => {
    const nivel = nivelesActividad[actividad] || 0
    if (nivel > nivelMaximo) {
      nivelMaximo = nivel
    }
  })

  return nivelMaximo
}

// Función para obtener descripción textual de la clasificación ASA
export const getDescripcionASA = (asa: string): string => {
  switch (asa) {
    case "ASA I":
      return "Paciente sano"
    case "ASA II":
      return "Paciente con enfermedad sistémica leve"
    case "ASA III":
      return "Paciente con enfermedad sistémica grave"
    case "ASA IV":
      return "Paciente con enfermedad sistémica grave que es una amenaza constante para la vida"
    default:
      return "No determinado"
  }
}

