const fs = require("fs")
const path = require("path")
const xlsx = require("xlsx")

// 1. Crear la carpeta "data" si no existe
const dataFolder = path.join(__dirname, "../data")
if (!fs.existsSync(dataFolder)) {
  fs.mkdirSync(dataFolder, { recursive: true })
}

// 2. Cargar el archivo Excel
const archivoExcel = path.join(__dirname, "Medicamentos.xlsx")
const columnaMedicamentos = "Medicamentos"

try {
  const workbook = xlsx.readFile(archivoExcel)
  const sheetName = workbook.SheetNames[0] // Tomar la primera hoja
  const sheet = workbook.Sheets[sheetName]

  // 3. Convertir la hoja en JSON
  const data = xlsx.utils.sheet_to_json(sheet)

  // Verificar que la columna exista
  if (!data[0] || !(columnaMedicamentos in data[0])) {
    throw new Error(`La columna "${columnaMedicamentos}" no existe en el archivo.`)
  }

  // Extraer los medicamentos únicos como un array
  const medicamentos = [...new Set(data.map((row) => row[columnaMedicamentos]))]

  // 4. Guardar en un archivo JSON dentro de "data/"
  const filePath = path.join(dataFolder, "medicamentos.json")
  fs.writeFileSync(filePath, JSON.stringify(medicamentos, null, 2), "utf-8")

  console.log("Archivo 'medicamentos.json' creado correctamente en la carpeta 'data/'.")
  console.log(`Se han procesado ${medicamentos.length} medicamentos únicos.`)
} catch (error) {
  console.error("Error al procesar el archivo Excel:", error.message)
}

