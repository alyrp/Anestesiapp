import * as fs from "fs";
import * as path from "path";

// Ruta absoluta al JSON
const filePath = path.join(__dirname, "data", "medicamentos.json");

// Leer el archivo JSON
const rawData = fs.readFileSync(filePath, "utf-8");

// Convertir a objeto
const medicamentosObj = JSON.parse(rawData);

// Transformar en un array de strings
const medicamentosArray: string[] = Object.values(medicamentosObj);

console.log(medicamentosArray);