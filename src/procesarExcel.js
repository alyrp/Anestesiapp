const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");

// 1. Crear la carpeta "data" si no existe
const dataFolder = path.join(__dirname, "data");
if (!fs.existsSync(dataFolder)) {
  fs.mkdirSync(dataFolder);
}

// 2. Cargar el archivo Excel
const archivoExcel = "Medicamentos.xlsx"; 
const columnaMedicamentos = "Medicamentos"; 

try {
  const workbook = xlsx.readFile(archivoExcel);
  const sheetName = workbook.SheetNames[0]; // Tomar la primera hoja
  const sheet = workbook.Sheets[sheetName];

  // 3. Convertir la hoja en JSON
  const data = xlsx.utils.sheet_to_json(sheet);

  // Verificar que la columna exista
  if (!data[0] || !(columnaMedicamentos in data[0])) {
    throw new Error(`La columna "${columnaMedicamentos}" no existe en el archivo.`);
  }

  // Extraer los medicamentos únicos
  const medicamentos = [...new Set(data.map(row => row[columnaMedicamentos]))];

  // Crear un diccionario con índice como clave
  const medicamentosDict = medicamentos.reduce((acc, med, index) => {
    acc[index] = med;
    return acc;
  }, {});

  // 4. Guardar en un archivo JSON dentro de "data/"
  const filePath = path.join(dataFolder, "medicamentos.json");
  fs.writeFileSync(filePath, JSON.stringify(medicamentosDict, null, 2), "utf-8");

  console.log("Archivo 'medicamentos.json' creado correctamente en la carpeta 'data/'.");
} catch (error) {
  console.error("Error al procesar el archivo Excel:", error.message);
}