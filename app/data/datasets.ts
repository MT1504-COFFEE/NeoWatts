import type { DatasetFile, RenewableEnergyData, SolarShareData, LatamRenewableData } from "../types/energy"

// Definición de archivos CSV para cargar datos (mantener los existentes)
export const predefinedFiles: DatasetFile[] = [
  {
    id: "solar-share-latam",
    name: "Participación Solar en América Latina",
    description: "Porcentaje de energía solar en el mix energético de países latinoamericanos",
    type: "CSV",
    size: "1.2 MB",
    records: 8500,
    url: "/data/solar_share_energy_latam.csv",
    schema: ["Entity", "Code", "Year", "Solar (% equivalent primary energy)"],
  },
  {
    id: "latam-renewable-production",
    name: "Producción Renovable América Latina",
    description: "Producción de electricidad renovable por fuente en países latinoamericanos",
    type: "CSV",
    size: "2.8 MB",
    records: 8200,
    url: "/data/latam_modern_renewable_prod.csv",
    schema: [
      "Entity",
      "Code",
      "Year",
      "Electricity from wind (TWh)",
      "Electricity from hydro (TWh)",
      "Electricity from solar (TWh)",
      "Other renewables including bioenergy (TWh)",
    ],
  },
]

// Función para parsear CSV
export function parseCSV(csvText: string): any[] {
  const lines = csvText.trim().split("\n")
  const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

  return lines
    .slice(1)
    .map((line) => {
      const values: string[] = []
      let current = ""
      let inQuotes = false

      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === "," && !inQuotes) {
          values.push(current.trim())
          current = ""
        } else {
          current += char
        }
      }
      values.push(current.trim())

      const obj: any = {}
      headers.forEach((header, index) => {
        const value = values[index]?.replace(/"/g, "") || ""

        // Convertir números
        if (!isNaN(Number(value)) && value !== "") {
          obj[header] = Number(value)
        } else {
          obj[header] = value
        }
      })

      return obj
    })
    .filter((row) => row.Entity && row.Year) // Filtrar filas vacías
}

// Función para convertir datos de solar share a formato estándar
export function convertSolarShareData(data: SolarShareData[]): RenewableEnergyData[] {
  return data.map((item) => ({
    year: item.Year,
    country: item.Entity,
    "wind-generation": 0,
    "solar-energy-consumption": item["Solar (% equivalent primary energy)"] * 100 || 0,
    "hydropower-consumption": 0,
    "biofuel-production": 0,
    "installed-geothermal-capacity": 0,
    "share-electricity-renewables": item["Solar (% equivalent primary energy)"] * 100 || 0,
    "share-electricity-wind": 0,
    "share-electricity-solar": item["Solar (% equivalent primary energy)"] * 100 || 0,
    "share-electricity-hydro": 0,
    "cumulative-installed-wind-energy-capacity-gigawatts": 0,
    "installed-solar-PV-capacity": 0,
    "modern-renewable-energy-consumption": item["Solar (% equivalent primary energy)"] * 100 || 0,
    "conventional-energy-consumption": 100 - (item["Solar (% equivalent primary energy)"] * 100 || 0),
  }))
}

// Función para convertir datos de producción renovable LATAM a formato estándar
export function convertLatamRenewableData(data: LatamRenewableData[]): RenewableEnergyData[] {
  return data.map((item) => {
    const wind = Number.parseFloat(item["Electricity from wind (TWh)"]) || 0
    const hydro = Number.parseFloat(item["Electricity from hydro (TWh)"]) || 0
    const solar = Number.parseFloat(item["Electricity from solar (TWh)"]) || 0
    const other = Number.parseFloat(item["Other renewables including bioenergy (TWh)"]) || 0

    const totalRenewable = wind + hydro + solar + other
    const estimatedTotal = totalRenewable > 0 ? totalRenewable * 2.5 : 100 // Estimación del total

    return {
      year: item.Year,
      country: item.Entity,
      "wind-generation": wind,
      "solar-energy-consumption": solar,
      "hydropower-consumption": hydro,
      "biofuel-production": other,
      "installed-geothermal-capacity": 0,
      "share-electricity-renewables": totalRenewable > 0 ? (totalRenewable / estimatedTotal) * 100 : 0,
      "share-electricity-wind": wind > 0 ? (wind / estimatedTotal) * 100 : 0,
      "share-electricity-solar": solar > 0 ? (solar / estimatedTotal) * 100 : 0,
      "share-electricity-hydro": hydro > 0 ? (hydro / estimatedTotal) * 100 : 0,
      "cumulative-installed-wind-energy-capacity-gigawatts": wind * 0.3, // Estimación
      "installed-solar-PV-capacity": solar * 0.2, // Estimación
      "modern-renewable-energy-consumption": totalRenewable,
      "conventional-energy-consumption": Math.max(0, estimatedTotal - totalRenewable),
    }
  })
}

// Función para cargar y procesar archivo CSV
export async function loadCSVFile(fileId: string): Promise<RenewableEnergyData[]> {
  const file = predefinedFiles.find((f) => f.id === fileId)
  if (!file) {
    throw new Error("Archivo no encontrado")
  }

  try {
    const response = await fetch(file.url)
    if (!response.ok) {
      throw new Error(`Error al cargar archivo: ${response.status}`)
    }

    const csvText = await response.text()
    const rawData = parseCSV(csvText)

    // Convertir según el tipo de archivo
    if (fileId === "solar-share-latam") {
      return convertSolarShareData(rawData as SolarShareData[])
    } else if (fileId === "latam-renewable-production") {
      return convertLatamRenewableData(rawData as LatamRenewableData[])
    }

    return []
  } catch (error) {
    console.error("Error cargando archivo CSV:", error)
    throw error
  }
}
