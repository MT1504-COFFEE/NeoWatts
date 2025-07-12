import type {
  DatasetFile,
  RenewableEnergyData,
  SolarShareData,
  LatamRenewableData,
  WindShareData,
  HydroShareData,
  RenewableShareData,
} from "../types/energy"

// Definición de archivos CSV (sin cambios respecto a la versión anterior)
export const predefinedFiles: DatasetFile[] = [
  {
    id: "solar-share-latam",
    name: "Participación Solar en América Latina",
    description: "Porcentaje de energía solar en el mix energético de países latinoamericanos.",
    type: "CSV",
    size: "1.2 MB",
    records: 8500,
    url: "/data/solar_share_energy_latam.csv",
    schema: ["Entity", "Code", "Year", "Solar (% equivalent primary energy)"],
  },
  {
    id: "wind-share-latam",
    name: "Participación Eólica en América Latina",
    description: "Porcentaje de energía eólica en el mix energético de países latinoamericanos.",
    type: "CSV",
    size: "10.6 KB",
    records: 456,
    url: "/data/wind_share_energy_latam.csv",
    schema: ["Entity", "Code", "Year", "Wind (% equivalent primary energy)"],
  },
  {
    id: "hydro-share-latam",
    name: "Participación Hidroeléctrica en América Latina",
    description: "Porcentaje de energía hidroeléctrica en el mix energético de países latinoamericanos.",
    type: "CSV",
    size: "12.3 KB",
    records: 456,
    url: "/data/hydro_share_energy_latam.csv",
    schema: ["Entity", "Code", "Year", "Hydro (% equivalent primary energy)"],
  },
  {
    id: "renewable-share-latam",
    name: "Participación Renovable en América Latina",
    description: "Porcentaje total de energías renovables en el mix energético de países latinoamericanos.",
    type: "CSV",
    size: "12.3 KB",
    records: 456,
    url: "/data/renewable_share_energy_latam.csv",
    schema: ["Entity", "Code", "Year", "Renewables (% equivalent primary energy)"],
  },
  {
    id: "latam-renewable-production",
    name: "Producción Renovable América Latina",
    description: "Producción de electricidad renovable por fuente en países latinoamericanos.",
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

// Función para parsear CSV (sin cambios)
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
        if (!isNaN(Number(value)) && value !== "") {
          obj[header] = Number(value)
        } else {
          obj[header] = value
        }
      })

      return obj
    })
    .filter((row) => row.Entity && row.Year)
}


// --- FUNCIONES DE CONVERSIÓN CORREGIDAS ---
// Estas funciones ahora crean objetos completos para evitar el error .toFixed()

const createEmptyGenerationData = () => ({
  "wind-generation": 0,
  "solar-energy-consumption": 0,
  "hydropower-consumption": 0,
  "biofuel-production": 0,
  "installed-geothermal-capacity": 0,
  "cumulative-installed-wind-energy-capacity-gigawatts": 0,
  "installed-solar-PV-capacity": 0,
  "modern-renewable-energy-consumption": 0,
  "conventional-energy-consumption": 0,
})

export function convertSolarShareData(data: SolarShareData[]): RenewableEnergyData[] {
  return data.map((item) => {
    const share = Number.parseFloat(String(item["Solar (% equivalent primary energy)"])) || 0
    return {
      year: item.Year,
      country: item.Entity,
      ...createEmptyGenerationData(), // <- Importante: Rellena con ceros los campos de generación
      "share-electricity-renewables": share, // Asumimos que la participación total es la de la fuente
      "share-electricity-wind": 0,
      "share-electricity-solar": share,
      "share-electricity-hydro": 0,
    }
  })
}

export function convertWindShareData(data: WindShareData[]): RenewableEnergyData[] {
  return data.map((item) => {
    const share = Number.parseFloat(String(item["Wind (% equivalent primary energy)"])) || 0
    return {
      year: item.Year,
      country: item.Entity,
      ...createEmptyGenerationData(),
      "share-electricity-renewables": share,
      "share-electricity-wind": share,
      "share-electricity-solar": 0,
      "share-electricity-hydro": 0,
    }
  })
}

export function convertHydroShareData(data: HydroShareData[]): RenewableEnergyData[] {
  return data.map((item) => {
    const share = Number.parseFloat(String(item["Hydro (% equivalent primary energy)"])) || 0
    return {
      year: item.Year,
      country: item.Entity,
      ...createEmptyGenerationData(),
      "share-electricity-renewables": share,
      "share-electricity-wind": 0,
      "share-electricity-solar": 0,
      "share-electricity-hydro": share,
    }
  })
}

export function convertRenewableShareData(data: RenewableShareData[]): RenewableEnergyData[] {
  return data.map((item) => {
    const share = Number.parseFloat(String(item["Renewables (% equivalent primary energy)"])) || 0
    return {
      year: item.Year,
      country: item.Entity,
      ...createEmptyGenerationData(),
      "share-electricity-renewables": share,
      "share-electricity-wind": 0, // No podemos desglosarlo desde este archivo
      "share-electricity-solar": 0,
      "share-electricity-hydro": 0,
    }
  })
}

// Esta función ya estaba correcta porque llenaba todos los campos necesarios.
export function convertLatamRenewableData(data: LatamRenewableData[]): RenewableEnergyData[] {
  return data.map((item) => {
    const wind = Number.parseFloat(item["Electricity from wind (TWh)"]) || 0
    const hydro = Number.parseFloat(item["Electricity from hydro (TWh)"]) || 0
    const solar = Number.parseFloat(item["Electricity from solar (TWh)"]) || 0
    const other = Number.parseFloat(item["Other renewables including bioenergy (TWh)"]) || 0
    const totalRenewable = wind + hydro + solar + other
    const estimatedTotal = totalRenewable > 0 ? totalRenewable * 1.5 : 1 // Estimación más conservadora
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
      "cumulative-installed-wind-energy-capacity-gigawatts": wind * 0.3,
      "installed-solar-PV-capacity": solar * 0.2,
      "modern-renewable-energy-consumption": totalRenewable,
      "conventional-energy-consumption": Math.max(0, estimatedTotal - totalRenewable),
    }
  })
}

// --- CARGADOR PRINCIPAL DE ARCHIVOS ---

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

    if (fileId === "solar-share-latam") {
      return convertSolarShareData(rawData as SolarShareData[])
    } else if (fileId === "wind-share-latam") {
      return convertWindShareData(rawData as WindShareData[])
    } else if (fileId === "hydro-share-latam") {
      return convertHydroShareData(rawData as HydroShareData[])
    } else if (fileId === "renewable-share-latam") {
      return convertRenewableShareData(rawData as RenewableShareData[])
    } else if (fileId === "latam-renewable-production") {
      return convertLatamRenewableData(rawData as LatamRenewableData[])
    }

    return []
  } catch (error) {
    console.error("Error cargando archivo CSV:", error)
    throw error
  }
}