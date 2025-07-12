import type {
  DatasetFile,
  RenewableEnergyData,
  SolarShareData,
  LatamRenewableData,
  WindShareData,
  HydroShareData,
  RenewableShareData,
} from "../types/energy"

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
  {
    id: "wind-share-latam",
    name: "Participación Eólica en América Latina",
    description: "Porcentaje de energía eólica en el mix energético de países latinoamericanos",
    type: "CSV",
    size: "1.0 MB",
    records: 5800,
    url: "/data/wind_share_energy_latam.csv",
    schema: ["Entity", "Code", "Year", "Wind (% equivalent primary energy)"],
  },
  {
    id: "hydro-share-latam",
    name: "Participación Hidroeléctrica en América Latina",
    description: "Porcentaje de energía hidroeléctrica en el mix energético de países latinoamericanos",
    type: "CSV",
    size: "1.5 MB",
    records: 6500,
    url: "/data/hydro_share_energy_latam.csv",
    schema: ["Entity", "Code", "Year", "Hydro (% equivalent primary energy)"],
  },
  {
    id: "renewable-share-latam",
    name: "Participación Total Renovable en América Latina",
    description: "Porcentaje total de energía renovable en el mix energético de países latinoamericanos",
    type: "CSV",
    size: "1.8 MB",
    records: 7200,
    url: "/data/renewable_share_energy_latam.csv",
    schema: ["Entity", "Code", "Year", "Renewables (% equivalent primary energy)"],
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
  return data.map((item) => {
    // Los datos YA vienen como porcentaje correcto (0-100%)
    const solarShare = item["Solar (% equivalent primary energy)"] || 0

    return {
      year: item.Year,
      country: item.Entity,
      "wind-generation": 0,
      "solar-energy-consumption": solarShare, // Usar el porcentaje directamente como estimación
      "hydropower-consumption": 0,
      "biofuel-production": 0,
      "installed-geothermal-capacity": 0,
      "share-electricity-renewables": solarShare, // Porcentaje tal como viene
      "share-electricity-wind": 0,
      "share-electricity-solar": solarShare, // Porcentaje tal como viene
      "share-electricity-hydro": 0,
      "cumulative-installed-wind-energy-capacity-gigawatts": 0,
      "installed-solar-PV-capacity": 0,
      "modern-renewable-energy-consumption": solarShare,
      "conventional-energy-consumption": Math.max(0, 100 - solarShare),
    }
  })
}

// Función para convertir datos de producción renovable LATAM a formato estándar
export function convertLatamRenewableData(data: LatamRenewableData[]): RenewableEnergyData[] {
  return data.map((item) => {
    const wind = Number.parseFloat(item["Electricity from wind (TWh)"]) || 0
    const hydro = Number.parseFloat(item["Electricity from hydro (TWh)"]) || 0
    const solar = Number.parseFloat(item["Electricity from solar (TWh)"]) || 0
    const other = Number.parseFloat(item["Other renewables including bioenergy (TWh)"]) || 0

    const totalRenewable = wind + hydro + solar + other

    // Estimación más realista del total de electricidad por país y año
    let estimatedTotal = 100 // Valor por defecto

    if (totalRenewable > 0) {
      const country = item.Entity.toLowerCase()
      const year = item.Year

      // Países con alta participación renovable (principalmente hidro)
      if (country.includes("costa rica") || country.includes("uruguay") || country.includes("paraguay")) {
        estimatedTotal = totalRenewable / 0.8 // ~80% renovable
      }
      // Países con participación media-alta renovable
      else if (country.includes("colombia") || country.includes("ecuador") || country.includes("venezuela")) {
        estimatedTotal = totalRenewable / 0.6 // ~60% renovable
      }
      // Países con participación media renovable
      else if (country.includes("chile") || country.includes("peru") || country.includes("bolivia")) {
        estimatedTotal = totalRenewable / 0.4 // ~40% renovable
      }
      // Países con participación baja-media renovable
      else if (country.includes("brazil") || country.includes("argentina") || country.includes("mexico")) {
        estimatedTotal = totalRenewable / 0.3 // ~30% renovable
      }
      // Otros países
      else {
        estimatedTotal = totalRenewable / 0.25 // ~25% renovable
      }

      // Ajuste temporal: años más recientes tienden a tener más renovables
      if (year >= 2015) {
        estimatedTotal = estimatedTotal * 0.9 // Incrementar participación renovable
      } else if (year >= 2010) {
        estimatedTotal = estimatedTotal * 0.95
      }
    }

    // Calcular porcentajes con límites realistas
    const renewablePercentage = totalRenewable > 0 ? Math.min(95, (totalRenewable / estimatedTotal) * 100) : 0
    const windPercentage = wind > 0 ? Math.min(50, (wind / estimatedTotal) * 100) : 0
    const solarPercentage = solar > 0 ? Math.min(30, (solar / estimatedTotal) * 100) : 0
    const hydroPercentage = hydro > 0 ? Math.min(90, (hydro / estimatedTotal) * 100) : 0

    return {
      year: item.Year,
      country: item.Entity,
      "wind-generation": wind,
      "solar-energy-consumption": solar,
      "hydropower-consumption": hydro,
      "biofuel-production": other,
      "installed-geothermal-capacity": 0,
      "share-electricity-renewables": Number(renewablePercentage.toFixed(1)),
      "share-electricity-wind": Number(windPercentage.toFixed(1)),
      "share-electricity-solar": Number(solarPercentage.toFixed(1)),
      "share-electricity-hydro": Number(hydroPercentage.toFixed(1)),
      "cumulative-installed-wind-energy-capacity-gigawatts": wind * 0.3, // Estimación
      "installed-solar-PV-capacity": solar * 0.2, // Estimación
      "modern-renewable-energy-consumption": totalRenewable,
      "conventional-energy-consumption": Math.max(0, estimatedTotal - totalRenewable),
    }
  })
}

// Función para convertir datos de wind share a formato estándar
export function convertWindShareData(data: WindShareData[]): RenewableEnergyData[] {
  return data.map((item) => {
    // Los datos YA vienen como porcentaje correcto (0-100%)
    const windShare = item["Wind (% equivalent primary energy)"] || 0

    return {
      year: item.Year,
      country: item.Entity,
      "wind-generation": windShare, // Usar el porcentaje directamente como estimación
      "solar-energy-consumption": 0,
      "hydropower-consumption": 0,
      "biofuel-production": 0,
      "installed-geothermal-capacity": 0,
      "share-electricity-renewables": windShare, // Porcentaje tal como viene
      "share-electricity-wind": windShare, // Porcentaje tal como viene
      "share-electricity-solar": 0,
      "share-electricity-hydro": 0,
      "cumulative-installed-wind-energy-capacity-gigawatts": windShare * 0.1,
      "installed-solar-PV-capacity": 0,
      "modern-renewable-energy-consumption": windShare,
      "conventional-energy-consumption": Math.max(0, 100 - windShare),
    }
  })
}

// Función para convertir datos de hydro share a formato estándar
export function convertHydroShareData(data: HydroShareData[]): RenewableEnergyData[] {
  return data.map((item) => {
    // Los datos YA vienen como porcentaje correcto (0-100%)
    const hydroShare = item["Hydro (% equivalent primary energy)"] || 0

    return {
      year: item.Year,
      country: item.Entity,
      "wind-generation": 0,
      "solar-energy-consumption": 0,
      "hydropower-consumption": hydroShare, // Usar el porcentaje directamente como estimación
      "biofuel-production": 0,
      "installed-geothermal-capacity": 0,
      "share-electricity-renewables": hydroShare, // Porcentaje tal como viene
      "share-electricity-wind": 0,
      "share-electricity-solar": 0,
      "share-electricity-hydro": hydroShare, // Porcentaje tal como viene
      "cumulative-installed-wind-energy-capacity-gigawatts": 0,
      "installed-solar-PV-capacity": 0,
      "modern-renewable-energy-consumption": hydroShare,
      "conventional-energy-consumption": Math.max(0, 100 - hydroShare),
    }
  })
}

// Función para convertir datos de renewable share a formato estándar
export function convertRenewableShareData(data: RenewableShareData[]): RenewableEnergyData[] {
  return data.map((item) => {
    // Los datos YA vienen como porcentaje correcto (0-100%)
    const renewableShare = item["Renewables (% equivalent primary energy)"] || 0

    // Distribución típica en LATAM: 70% hidro, 15% eólica, 10% solar, 5% otros
    const estimatedHydroShare = renewableShare * 0.7
    const estimatedWindShare = renewableShare * 0.15
    const estimatedSolarShare = renewableShare * 0.1
    const estimatedOtherShare = renewableShare * 0.05

    return {
      year: item.Year,
      country: item.Entity,
      "wind-generation": estimatedWindShare,
      "solar-energy-consumption": estimatedSolarShare,
      "hydropower-consumption": estimatedHydroShare,
      "biofuel-production": estimatedOtherShare,
      "installed-geothermal-capacity": 0,
      "share-electricity-renewables": renewableShare, // Porcentaje tal como viene
      "share-electricity-wind": Number(estimatedWindShare.toFixed(1)),
      "share-electricity-solar": Number(estimatedSolarShare.toFixed(1)),
      "share-electricity-hydro": Number(estimatedHydroShare.toFixed(1)),
      "cumulative-installed-wind-energy-capacity-gigawatts": estimatedWindShare * 0.1,
      "installed-solar-PV-capacity": estimatedSolarShare * 0.1,
      "modern-renewable-energy-consumption": renewableShare,
      "conventional-energy-consumption": Math.max(0, 100 - renewableShare),
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
    } else if (fileId === "wind-share-latam") {
      return convertWindShareData(rawData as WindShareData[])
    } else if (fileId === "hydro-share-latam") {
      return convertHydroShareData(rawData as HydroShareData[])
    } else if (fileId === "renewable-share-latam") {
      return convertRenewableShareData(rawData as RenewableShareData[])
    }

    return []
  } catch (error) {
    console.error("Error cargando archivo CSV:", error)
    throw error
  }
}
