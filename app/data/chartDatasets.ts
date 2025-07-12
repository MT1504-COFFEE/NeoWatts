import type { ChartDataFile, ModernRenewableConsumptionData } from "../types/energy"

// Archivos específicos para cada gráfico del dashboard
export const chartDataFiles: ChartDataFile[] = [
  {
    id: "bar-chart-renewable-consumption",
    name: "Consumo Moderno de Energía Renovable LATAM",
    description: "Producción de energía renovable por fuente (Biomasa, Solar, Eólica, Hidráulica)",
    chartType: "bar",
    type: "CSV",
    size: "2.1 MB",
    records: 7800,
    url: "/data/modern_renewable_energy_consumption_latam.csv",
    schema: [
      "Entity",
      "Code",
      "Year",
      "Geo Biomass Other - TWh",
      "Solar Generation - TWh",
      "Wind Generation - TWh",
      "Hydro Generation - TWh",
    ],
  },
  // Archivos para el gráfico de torta
  {
    id: "pie-chart-hydropower",
    name: "Consumo Hidroeléctrico LATAM",
    description: "Electricidad generada por fuente hidroeléctrica",
    chartType: "pie",
    type: "CSV",
    size: "1.5 MB",
    records: 6500,
    url: "/data/hydropower_consumption_latam.csv",
    schema: ["Entity", "Code", "Year", "Electricity from hydro (TWh)"],
  },
  {
    id: "pie-chart-wind",
    name: "Generación Eólica LATAM",
    description: "Electricidad generada por fuente eólica",
    chartType: "pie",
    type: "CSV",
    size: "1.2 MB",
    records: 5800,
    url: "/data/wind_generation_latam.csv",
    schema: ["Entity", "Code", "Year", "Electricity from wind (TWh)"],
  },
  {
    id: "pie-chart-biofuel",
    name: "Producción de Biocombustibles LATAM",
    description: "Producción total de biocombustibles",
    chartType: "pie",
    type: "CSV",
    size: "0.8 MB",
    records: 4200,
    url: "/data/biofuel_production_latam.csv",
    schema: ["Entity", "Code", "Year", "Biofuels Production - TWh - Total"],
  },
  {
    id: "pie-chart-solar",
    name: "Consumo Solar LATAM",
    description: "Electricidad generada por fuente solar",
    chartType: "pie",
    type: "CSV",
    size: "1.1 MB",
    records: 5200,
    url: "/data/solar_energy_consumption_latam.csv",
    schema: ["Entity", "Code", "Year", "Electricity from solar (TWh)"],
  },
  {
    id: "pie-chart-geothermal",
    name: "Capacidad Geotérmica LATAM",
    description: "Capacidad instalada geotérmica",
    chartType: "pie",
    type: "CSV",
    size: "0.6 MB",
    records: 3100,
    url: "/data/installed_geothermal_capacity_latam.csv",
    schema: ["Entity", "Code", "Year", "Geothermal Capacity"],
  },
  // Archivos para el gráfico de líneas - NUEVOS
  {
    id: "line-chart-wind-capacity",
    name: "Capacidad Eólica Acumulada LATAM",
    description: "Capacidad instalada acumulada de energía eólica en gigawatts",
    chartType: "line",
    type: "CSV",
    size: "1.8 MB",
    records: 6200,
    url: "/data/cumulative_installed_wind_energy_capacity_gigawatts_latam.csv",
    schema: ["Entity", "Code", "Year", "Wind Capacity"],
  },
  {
    id: "line-chart-solar-capacity",
    name: "Capacidad Solar PV LATAM",
    description: "Capacidad instalada de paneles solares fotovoltaicos",
    chartType: "line",
    type: "CSV",
    size: "1.4 MB",
    records: 5400,
    url: "/data/installed_solar_PV_capacity_latam.csv",
    schema: ["Entity", "Code", "Year", "Solar Capacity"],
  },
  {
    id: "line-chart-geothermal-capacity",
    name: "Capacidad Geotérmica LATAM v2",
    description: "Capacidad instalada geotérmica actualizada",
    chartType: "line",
    type: "CSV",
    size: "0.9 MB",
    records: 3800,
    url: "/data/installed_geothermal_capacity_2_latam.csv",
    schema: ["Entity", "Code", "Year", "Geothermal Capacity"],
  },
]

// Función para parsear CSV específico para gráficos
export function parseChartCSV(csvText: string): any[] {
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

        // Convertir números - PERMITIR TODOS LOS VALORES INCLUYENDO CEROS
        if (!isNaN(Number(value)) && value !== "") {
          obj[header] = Number(value)
        } else {
          obj[header] = value
        }
      })

      return obj
    })
    .filter((row) => row.Entity && row.Year) // Solo filtrar filas completamente vacías
}

// Función para procesar datos del gráfico de barras
export function processBarChartData(data: ModernRenewableConsumptionData[]) {
  // Agrupar por año y calcular promedios
  const yearlyData = data.reduce(
    (acc, item) => {
      if (!acc[item.Year]) {
        acc[item.Year] = {
          year: item.Year,
          biomass: 0,
          solar: 0,
          wind: 0,
          hydro: 0,
          count: 0,
        }
      }

      const biomass = Number.parseFloat(item["Geo Biomass Other - TWh"]) || 0
      const solar = Number.parseFloat(item["Solar Generation - TWh"]) || 0
      const wind = Number.parseFloat(item["Wind Generation - TWh"]) || 0
      const hydro = Number.parseFloat(item["Hydro Generation - TWh"]) || 0

      acc[item.Year].biomass += biomass
      acc[item.Year].solar += solar
      acc[item.Year].wind += wind
      acc[item.Year].hydro += hydro
      acc[item.Year].count += 1

      return acc
    },
    {} as Record<number, any>,
  )

  // MOSTRAR TODOS LOS AÑOS, NO SOLO LOS ÚLTIMOS 10
  return Object.values(yearlyData)
    .map((item: any) => ({
      year: item.year,
      "Biomasa y Otros": Number((item.biomass / item.count).toFixed(2)),
      Solar: Number((item.solar / item.count).toFixed(2)),
      Eólica: Number((item.wind / item.count).toFixed(2)),
      Hidroeléctrica: Number((item.hydro / item.count).toFixed(2)),
    }))
    .sort((a, b) => a.year - b.year) // TODOS LOS AÑOS DESDE 1965
}

// Función para procesar datos del gráfico de torta - COMPLETAMENTE CORREGIDA
export async function processPieChartData() {
  try {
    console.log("🔄 Iniciando carga de archivos para gráfico de torta...")

    // Cargar todos los archivos del gráfico de torta
    const [hydropowerData, windData, biofuelData, solarData, geothermalData] = await Promise.all([
      loadSingleChartFile("pie-chart-hydropower"),
      loadSingleChartFile("pie-chart-wind"),
      loadSingleChartFile("pie-chart-biofuel"),
      loadSingleChartFile("pie-chart-solar"),
      loadSingleChartFile("pie-chart-geothermal"),
    ])

    console.log("📊 Datos cargados:", {
      hydropower: hydropowerData.length,
      wind: windData.length,
      biofuel: biofuelData.length,
      solar: solarData.length,
      geothermal: geothermalData.length,
    })

    // Obtener el año más reciente disponible
    const allYears = [
      ...hydropowerData.map((d: any) => d.Year).filter((y) => !isNaN(y)),
      ...windData.map((d: any) => d.Year).filter((y) => !isNaN(y)),
      ...biofuelData.map((d: any) => d.Year).filter((y) => !isNaN(y)),
      ...solarData.map((d: any) => d.Year).filter((y) => !isNaN(y)),
      ...geothermalData.map((d: any) => d.Year).filter((y) => !isNaN(y)),
    ]
    const latestYear = Math.max(...allYears)

    console.log("📅 Año más reciente encontrado:", latestYear)

    // Filtrar datos del año más reciente
    const latestHydro = hydropowerData.filter((d: any) => d.Year === latestYear)
    const latestWind = windData.filter((d: any) => d.Year === latestYear)
    const latestBiofuel = biofuelData.filter((d: any) => d.Year === latestYear)
    const latestSolar = solarData.filter((d: any) => d.Year === latestYear)
    const latestGeothermal = geothermalData.filter((d: any) => d.Year === latestYear)

    console.log("🔍 Datos filtrados por año:", {
      hydro: latestHydro.length,
      wind: latestWind.length,
      biofuel: latestBiofuel.length,
      solar: latestSolar.length,
      geothermal: latestGeothermal.length,
    })

    // Calcular totales por fuente - CORREGIDO COMPLETAMENTE
    const hydroTotal = latestHydro.reduce((sum: number, item: any) => {
      const value = Number.parseFloat(item["Electricity from hydro (TWh)"]) || 0
      return sum + value
    }, 0)

    const windTotal = latestWind.reduce((sum: number, item: any) => {
      const value = Number.parseFloat(item["Electricity from wind (TWh)"]) || 0
      return sum + value
    }, 0)

    const biofuelTotal = latestBiofuel.reduce((sum: number, item: any) => {
      const value = Number.parseFloat(item["Biofuels Production - TWh - Total"]) || 0
      return sum + value
    }, 0)

    const solarTotal = latestSolar.reduce((sum: number, item: any) => {
      const value = Number.parseFloat(item["Electricity from solar (TWh)"]) || 0
      return sum + value
    }, 0)

    const geothermalTotal = latestGeothermal.reduce((sum: number, item: any) => {
      const value = Number.parseFloat(item["Geothermal Capacity"]) || 0
      return sum + value
    }, 0)

    // Convertir capacidad geotérmica a TWh
    const geothermalTWh = geothermalTotal * 0.0076

    console.log("💡 Totales calculados:", {
      hydro: hydroTotal,
      wind: windTotal,
      biofuel: biofuelTotal,
      solar: solarTotal,
      geothermalMW: geothermalTotal,
      geothermalTWh: geothermalTWh,
    })

    const total = hydroTotal + windTotal + biofuelTotal + solarTotal + geothermalTWh

    console.log("🔢 Total general:", total)

    // Si el total es muy pequeño, usar valores absolutos en lugar de porcentajes
    const useAbsoluteValues = total < 1

    // Crear datos para el gráfico de torta
    const pieData = [
      {
        name: "Hidroeléctrica",
        value: useAbsoluteValues ? hydroTotal : Number(((hydroTotal / total) * 100).toFixed(1)),
        absolute: Number(hydroTotal.toFixed(2)),
        color: "#06B6D4",
      },
      {
        name: "Eólica",
        value: useAbsoluteValues ? windTotal : Number(((windTotal / total) * 100).toFixed(1)),
        absolute: Number(windTotal.toFixed(2)),
        color: "#3B82F6",
      },
      {
        name: "Solar",
        value: useAbsoluteValues ? solarTotal : Number(((solarTotal / total) * 100).toFixed(1)),
        absolute: Number(solarTotal.toFixed(2)),
        color: "#F59E0B",
      },
      {
        name: "Biocombustibles",
        value: useAbsoluteValues ? biofuelTotal : Number(((biofuelTotal / total) * 100).toFixed(1)),
        absolute: Number(biofuelTotal.toFixed(2)),
        color: "#10B981",
      },
      {
        name: "Geotérmica",
        value: useAbsoluteValues ? geothermalTWh : Number(((geothermalTWh / total) * 100).toFixed(1)),
        absolute: Number(geothermalTWh.toFixed(2)),
        color: "#EF4444",
      },
    ]

    console.log("📊 Datos finales del gráfico:", pieData)

    return {
      data: pieData,
      year: latestYear,
      total: Number(total.toFixed(2)),
      useAbsoluteValues,
    }
  } catch (error) {
    console.error("❌ Error procesando datos del gráfico de torta:", error)
    throw error
  }
}

// Función para procesar datos del gráfico de líneas - NUEVA
export async function processLineChartData() {
  try {
    console.log("📈 Iniciando carga de archivos para gráfico de líneas...")

    // Cargar todos los archivos del gráfico de líneas
    const [windCapacityData, solarCapacityData, geothermalCapacityData] = await Promise.all([
      loadSingleChartFile("line-chart-wind-capacity"),
      loadSingleChartFile("line-chart-solar-capacity"),
      loadSingleChartFile("line-chart-geothermal-capacity"),
    ])

    console.log("📊 Datos de capacidad cargados:", {
      windCapacity: windCapacityData.length,
      solarCapacity: solarCapacityData.length,
      geothermalCapacity: geothermalCapacityData.length,
    })

    // Obtener todos los años disponibles
    const allYears = [
      ...windCapacityData.map((d: any) => d.Year).filter((y) => !isNaN(y)),
      ...solarCapacityData.map((d: any) => d.Year).filter((y) => !isNaN(y)),
      ...geothermalCapacityData.map((d: any) => d.Year).filter((y) => !isNaN(y)),
    ]
    const uniqueYears = [...new Set(allYears)].sort((a, b) => a - b)

    console.log("📅 Años disponibles:", {
      total: uniqueYears.length,
      range: `${Math.min(...uniqueYears)} - ${Math.max(...uniqueYears)}`,
      years: uniqueYears.slice(0, 10), // Mostrar primeros 10 años
    })

    // Procesar datos por año
    const lineData = uniqueYears.map((year) => {
      // Filtrar datos por año
      const windYear = windCapacityData.filter((d: any) => d.Year === year)
      const solarYear = solarCapacityData.filter((d: any) => d.Year === year)
      const geothermalYear = geothermalCapacityData.filter((d: any) => d.Year === year)

      // Calcular totales por fuente para ese año
      const windTotal = windYear.reduce((sum: number, item: any) => {
        // Los datos de viento están en watts, convertir a gigawatts
        const value = Number.parseFloat(item["Wind Capacity"]) || 0
        return sum + value / 1000000000 // Convertir watts a gigawatts
      }, 0)

      const solarTotal = solarYear.reduce((sum: number, item: any) => {
        // Los datos solares ya están en MW, convertir a GW
        const value = Number.parseFloat(item["Solar Capacity"]) || 0
        return sum + value / 1000 // Convertir MW a GW
      }, 0)

      const geothermalTotal = geothermalYear.reduce((sum: number, item: any) => {
        // Los datos geotérmicos están en MW, convertir a GW
        const value = Number.parseFloat(item["Geothermal Capacity"]) || 0
        return sum + value / 1000 // Convertir MW a GW
      }, 0)

      return {
        year: year,
        "Capacidad Eólica (GW)": Number(windTotal.toFixed(2)),
        "Capacidad Solar (GW)": Number(solarTotal.toFixed(2)),
        "Capacidad Geotérmica (GW)": Number(geothermalTotal.toFixed(2)),
      }
    })

    console.log("📈 Datos procesados del gráfico de líneas:", {
      totalYears: lineData.length,
      sampleData: lineData.slice(-5), // Últimos 5 años como muestra
    })

    return lineData
  } catch (error) {
    console.error("❌ Error procesando datos del gráfico de líneas:", error)
    throw error
  }
}

// Función auxiliar para cargar un archivo individual
async function loadSingleChartFile(fileId: string): Promise<any[]> {
  const file = chartDataFiles.find((f) => f.id === fileId)
  if (!file) {
    throw new Error(`Archivo ${fileId} no encontrado`)
  }

  console.log(`📁 Cargando archivo: ${file.name}`)

  const response = await fetch(file.url)
  if (!response.ok) {
    throw new Error(`Error al cargar ${file.name}: ${response.status}`)
  }

  const csvText = await response.text()
  const data = parseChartCSV(csvText)

  console.log(`✅ Archivo ${file.name} cargado: ${data.length} registros`)

  return data
}

// Función para cargar datos específicos de gráficos
export async function loadChartData(fileId: string): Promise<any[]> {
  const file = chartDataFiles.find((f) => f.id === fileId)
  if (!file) {
    throw new Error("Archivo de gráfico no encontrado")
  }

  try {
    const response = await fetch(file.url)
    if (!response.ok) {
      throw new Error(`Error al cargar archivo: ${response.status}`)
    }

    const csvText = await response.text()
    const rawData = parseChartCSV(csvText)

    // Procesar según el tipo de gráfico
    if (fileId === "bar-chart-renewable-consumption") {
      return processBarChartData(rawData as ModernRenewableConsumptionData[])
    }

    return rawData
  } catch (error) {
    console.error("Error cargando datos del gráfico:", error)
    throw error
  }
}

// Función especial para cargar datos del gráfico de torta
export async function loadPieChartData(): Promise<any> {
  return await processPieChartData()
}

// Función especial para cargar datos del gráfico de líneas
export async function loadLineChartData(): Promise<any[]> {
  return await processLineChartData()
}
