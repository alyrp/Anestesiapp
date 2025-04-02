import * as fs from "fs";
import * as path from "path";

const filePath = path.join(__dirname, "medicamentos.json");

const rawData = fs.readFileSync(filePath, "utf-8");
const medicamentosObj = JSON.parse(rawData);
const medicamentosArray: string[] = Object.values(medicamentosObj);

export default medicamentosArray;