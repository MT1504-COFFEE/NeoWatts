"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts"
import type { RenewableEnergyData } from "../types/energy"

interface DashboardProps {
  data: RenewableEnergyData[]
}

// Función para parsear CSV
function parseCSV(csvText: string): any[] {
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

// Función para procesar datos del gráfico de barras con filtros
function processBarChartData(data: any[], selectedCountry = "all", selectedYear = "all") {
  // Filtrar por país y año si se especifica
  let filteredData = data
  if (selectedCountry !== "all") {
    filteredData = filteredData.filter((item) => item.Entity === selectedCountry)
  }
  if (selectedYear !== "all") {
    filteredData = filteredData.filter((item) => item.Year === Number.parseInt(selectedYear))
  }

  const yearlyData = filteredData.reduce(
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

  return Object.values(yearlyData)
    .map((item: any) => ({
      year: item.year,
      "Biomasa y Otros": Number((item.biomass / item.count).toFixed(2)),
      Solar: Number((item.solar / item.count).toFixed(2)),
      Eólica: Number((item.wind / item.count).toFixed(2)),
      Hidroeléctrica: Number((item.hydro / item.count).toFixed(2)),
    }))
    .sort((a, b) => a.year - b.year)
}

// CORREGIDO: Función para procesar datos del gráfico de torta - LIMPIA Y PRECISA
function processPieChartDataFromMainFile(data: any[], selectedCountry = "all", selectedYear = "all") {
  try {
    console.log("🥧 Procesando datos de torta desde archivo principal...")
    console.log("📊 Total de registros en archivo:", data.length)

    // Filtrar por país y año si se especifica
    let filteredData = data
    if (selectedCountry !== "all") {
      filteredData = filteredData.filter((item) => item.Entity === selectedCountry)
      console.log(`🔍 Filtrado por país ${selectedCountry}: ${filteredData.length} registros`)
    }

    // Determinar el año a usar
    let targetYear: number
    if (selectedYear !== "all") {
      targetYear = Number.parseInt(selectedYear)
      filteredData = filteredData.filter((item) => item.Year === targetYear)
    } else {
      // Usar el año más reciente disponible
      const availableYears = filteredData.map((item) => item.Year).filter((y) => !isNaN(y))
      targetYear = Math.max(...availableYears)
      filteredData = filteredData.filter((item) => item.Year === targetYear)
    }

    console.log(`📅 Usando año ${targetYear}: ${filteredData.length} registros`)

    if (filteredData.length === 0) {
      console.log("⚠️ No hay datos disponibles para los filtros seleccionados")
      return {
        data: [],
        year: targetYear,
        total: 0,
        message: `No hay datos disponibles para ${selectedCountry !== "all" ? selectedCountry : "la región"} en ${selectedYear !== "all" ? selectedYear : "el año más reciente"}`,
      }
    }

    // Calcular totales por fuente de energía - SUMANDO TODOS LOS REGISTROS
    const totals = filteredData.reduce(
      (acc, item) => {
        const biomass = Number.parseFloat(item["Geo Biomass Other - TWh"]) || 0
        const solar = Number.parseFloat(item["Solar Generation - TWh"]) || 0
        const wind = Number.parseFloat(item["Wind Generation - TWh"]) || 0
        const hydro = Number.parseFloat(item["Hydro Generation - TWh"]) || 0

        acc.biomass += biomass
        acc.solar += solar
        acc.wind += wind
        acc.hydro += hydro

        return acc
      },
      { biomass: 0, solar: 0, wind: 0, hydro: 0 },
    )

    console.log("📊 Totales calculados:", totals)

    const total = totals.biomass + totals.solar + totals.wind + totals.hydro

    if (total === 0 || total < 0.001) {
      console.log("⚠️ Total de energía renovable es 0 o muy pequeño")
      return {
        data: [],
        year: targetYear,
        total: 0,
        message: "No hay producción significativa de energía renovable registrada para los filtros seleccionados",
      }
    }

    // Crear datos para el gráfico de torta con UMBRAL MÍNIMO
    const rawPieData = [
      {
        name: "Hidroeléctrica",
        value: Number(((totals.hydro / total) * 100).toFixed(1)),
        absolute: Number(totals.hydro.toFixed(2)),
        color: "#06B6D4",
      },
      {
        name: "Eólica",
        value: Number(((totals.wind / total) * 100).toFixed(1)),
        absolute: Number(totals.wind.toFixed(2)),
        color: "#3B82F6",
      },
      {
        name: "Solar",
        value: Number(((totals.solar / total) * 100).toFixed(1)),
        absolute: Number(totals.solar.toFixed(2)),
        color: "#F59E0B",
      },
      {
        name: "Biomasa y Otros",
        value: Number(((totals.biomass / total) * 100).toFixed(1)),
        absolute: Number(totals.biomass.toFixed(2)),
        color: "#10B981",
      },
    ]

    console.log("📊 Datos brutos del gráfico:", rawPieData)

    // FILTRADO INTELIGENTE: Solo mostrar fuentes significativas
    const significantData = rawPieData.filter((item) => {
      // Mostrar si tiene más del 2% O más de 1 TWh
      return item.value >= 2.0 || item.absolute >= 1.0
    })

    console.log("🔍 Datos significativos:", significantData)

    // Si solo hay una fuente significativa, mostrar solo esa
    let finalData = significantData

    // Verificar si hay una fuente dominante (>95%)
    const dominantSource = rawPieData.find((item) => item.value >= 95)
    if (dominantSource) {
      console.log("👑 Fuente dominante detectada:", dominantSource.name, dominantSource.value + "%")
      finalData = [dominantSource]
    }
    // Si hay muy pocas fuentes significativas, mostrar solo las más importantes
    else if (significantData.length <= 2) {
      finalData = significantData
    }
    // Si hay muchas fuentes pequeñas, agrupar las menores
    else if (significantData.length > 4) {
      const sortedData = significantData.sort((a, b) => b.value - a.value)
      const mainSources = sortedData.slice(0, 3)
      const otherSources = sortedData.slice(3)

      if (otherSources.length > 0) {
        const otherTotal = otherSources.reduce((sum, item) => sum + item.value, 0)
        const otherAbsolute = otherSources.reduce((sum, item) => sum + item.absolute, 0)

        finalData = [
          ...mainSources,
          {
            name: "Otras Fuentes",
            value: Number(otherTotal.toFixed(1)),
            absolute: Number(otherAbsolute.toFixed(2)),
            color: "#6B7280",
          },
        ]
      } else {
        finalData = mainSources
      }
    }

    console.log("🎯 Datos finales del gráfico de torta:", finalData)

    return {
      data: finalData,
      year: targetYear,
      total: Number(total.toFixed(2)),
      message: null,
    }
  } catch (error) {
    console.error("❌ Error procesando datos del gráfico de torta:", error)
    return {
      data: [],
      year: 2022,
      total: 0,
      message: "Error al procesar los datos del gráfico de torta",
    }
  }
}

// Función para procesar datos del gráfico de líneas con filtros
async function processLineChartData(selectedCountry = "all", selectedYear = "all") {
  try {
    const [windCapacityData, solarCapacityData, geothermalCapacityData] = await Promise.all([
      fetch("/data/cumulative_installed_wind_energy_capacity_gigawatts_latam.csv")
        .then((r) => r.text())
        .then(parseCSV),
      fetch("/data/installed_solar_PV_capacity_latam.csv")
        .then((r) => r.text())
        .then(parseCSV),
      fetch("/data/installed_geothermal_capacity_2_latam.csv")
        .then((r) => r.text())
        .then(parseCSV),
    ])

    // Aplicar filtros
    let filteredWind = windCapacityData
    let filteredSolar = solarCapacityData
    let filteredGeothermal = geothermalCapacityData

    if (selectedCountry !== "all") {
      filteredWind = filteredWind.filter((d: any) => d.Entity === selectedCountry)
      filteredSolar = filteredSolar.filter((d: any) => d.Entity === selectedCountry)
      filteredGeothermal = filteredGeothermal.filter((d: any) => d.Entity === selectedCountry)
    }

    // Obtener años únicos
    const allYears = [
      ...filteredWind.map((d: any) => d.Year).filter((y) => !isNaN(y) && y > 1990),
      ...filteredSolar.map((d: any) => d.Year).filter((y) => !isNaN(y) && y > 1990),
      ...filteredGeothermal.map((d: any) => d.Year).filter((y) => !isNaN(y) && y > 1990),
    ]
    let uniqueYears = [...new Set(allYears)].sort((a, b) => a - b)

    // Filtrar por año específico si se selecciona
    if (selectedYear !== "all") {
      uniqueYears = uniqueYears.filter((year) => year === Number.parseInt(selectedYear))
    }

    // Procesar datos por año
    const lineData = uniqueYears.map((year) => {
      const windYear = filteredWind.filter((d: any) => d.Year === year)
      const solarYear = filteredSolar.filter((d: any) => d.Year === year)
      const geothermalYear = filteredGeothermal.filter((d: any) => d.Year === year)

      const windTotal = windYear.reduce((sum: number, item: any) => {
        const value = Number.parseFloat(
          item["Wind Capacity"] ||
            item["Cumulative installed wind energy capacity"] ||
            item["Cumulative installed wind energy capacity (MW)"] ||
            0,
        )
        return sum + value / 1000
      }, 0)

      const solarTotal = solarYear.reduce((sum: number, item: any) => {
        const value = Number.parseFloat(
          item["Solar Capacity"] ||
            item["Installed solar PV capacity"] ||
            item["Installed solar PV capacity (MW)"] ||
            0,
        )
        return sum + value / 1000
      }, 0)

      const geothermalTotal = geothermalYear.reduce((sum: number, item: any) => {
        const value = Number.parseFloat(
          item["Geothermal Capacity"] ||
            item["Installed geothermal capacity"] ||
            item["Installed geothermal capacity (MW)"] ||
            0,
        )
        return sum + value / 1000
      }, 0)

      return {
        year: year,
        "Capacidad Eólica (GW)": Number(windTotal.toFixed(2)),
        "Capacidad Solar (GW)": Number(solarTotal.toFixed(2)),
        "Capacidad Geotérmica (GW)": Number(geothermalTotal.toFixed(2)),
      }
    })

    return lineData.filter(
      (d) => d["Capacidad Eólica (GW)"] > 0 || d["Capacidad Solar (GW)"] > 0 || d["Capacidad Geotérmica (GW)"] > 0,
    )
  } catch (error) {
    console.error("Error procesando datos del gráfico de líneas:", error)
    return []
  }
}

// Función para procesar datos del gráfico de área con filtros
async function processAreaChartData(selectedCountry = "all", selectedYear = "all") {
  try {
    const response = await fetch("/data/modern_renewable_energy_consumption_latam.csv")
    if (!response.ok) {
      throw new Error(`Error al cargar archivo: ${response.status}`)
    }

    const csvText = await response.text()
    let rawData = parseCSV(csvText)

    // Aplicar filtros
    if (selectedCountry !== "all") {
      rawData = rawData.filter((item) => item.Entity === selectedCountry)
    }
    if (selectedYear !== "all") {
      rawData = rawData.filter((item) => item.Year === Number.parseInt(selectedYear))
    }

    // Agrupar por año y calcular totales
    const yearlyData = rawData.reduce(
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

    return Object.values(yearlyData)
      .map((item: any) => ({
        year: item.year,
        "Biomasa y Otros": Number((item.biomass / item.count).toFixed(2)),
        Solar: Number((item.solar / item.count).toFixed(2)),
        Eólica: Number((item.wind / item.count).toFixed(2)),
        Hidroeléctrica: Number((item.hydro / item.count).toFixed(2)),
        "Total Renovable": Number(((item.biomass + item.solar + item.wind + item.hydro) / item.count).toFixed(2)),
      }))
      .sort((a, b) => a.year - b.year)
  } catch (error) {
    console.error("Error procesando datos del gráfico de área:", error)
    return []
  }
}

export default function Dashboard({ data }: DashboardProps) {
  const [chartData, setChartData] = useState<{
    barChart: any[]
    pieChart: { data: any[]; year: number; total: number; message?: string | null } | null
    lineChart: any[]
    areaChart: any[]
    rawBarData: any[]
  }>({
    barChart: [],
    pieChart: null,
    lineChart: [],
    areaChart: [],
    rawBarData: [],
  })

  const [loading, setLoading] = useState(true)

  // Estados para filtros
  const [barFilters, setBarFilters] = useState({ country: "all", year: "all" })
  const [pieFilters, setPieFilters] = useState({ country: "all", year: "all" })
  const [lineFilters, setLineFilters] = useState({ country: "all", year: "all" })
  const [areaFilters, setAreaFilters] = useState({ country: "all", year: "all" })

  // Obtener países y años únicos de los datos cargados
  const { countries, years } = useMemo(() => {
    if (!chartData.rawBarData.length) return { countries: [], years: [] }

    const uniqueCountries = [...new Set(chartData.rawBarData.map((item: any) => item.Entity))].sort()
    const uniqueYears = [...new Set(chartData.rawBarData.map((item: any) => item.Year))].sort((a, b) => b - a)

    return {
      countries: uniqueCountries,
      years: uniqueYears,
    }
  }, [chartData.rawBarData])

  useEffect(() => {
    const loadAllData = async () => {
      try {
        // Cargar datos del gráfico de barras
        const barResponse = await fetch("/data/modern_renewable_energy_consumption_latam.csv")
        const barCsvText = await barResponse.text()
        const barRawData = parseCSV(barCsvText)
        const barData = processBarChartData(barRawData)

        // CORREGIDO: Usar el mismo archivo para el gráfico de torta
        const pieData = processPieChartDataFromMainFile(barRawData)

        // Cargar datos del gráfico de líneas
        const lineData = await processLineChartData()

        // Cargar datos del gráfico de área
        const areaData = await processAreaChartData()

        setChartData({
          barChart: barData,
          pieChart: pieData,
          lineChart: lineData,
          areaChart: areaData,
          rawBarData: barRawData,
        })
      } catch (error) {
        console.error("Error cargando datos:", error)
      } finally {
        setLoading(false)
      }
    }

    loadAllData()
  }, [])

  // Actualizar gráficos cuando cambien los filtros
  useEffect(() => {
    if (chartData.rawBarData.length > 0) {
      const newBarData = processBarChartData(chartData.rawBarData, barFilters.country, barFilters.year)
      setChartData((prev) => ({ ...prev, barChart: newBarData }))
    }
  }, [barFilters, chartData.rawBarData])

  useEffect(() => {
    if (chartData.rawBarData.length > 0) {
      const newPieData = processPieChartDataFromMainFile(chartData.rawBarData, pieFilters.country, pieFilters.year)
      setChartData((prev) => ({ ...prev, pieChart: newPieData }))
    }
  }, [pieFilters, chartData.rawBarData])

  useEffect(() => {
    const updateLineChart = async () => {
      const newLineData = await processLineChartData(lineFilters.country, lineFilters.year)
      setChartData((prev) => ({ ...prev, lineChart: newLineData }))
    }
    updateLineChart()
  }, [lineFilters])

  useEffect(() => {
    const updateAreaChart = async () => {
      const newAreaData = await processAreaChartData(areaFilters.country, areaFilters.year)
      setChartData((prev) => ({ ...prev, areaChart: newAreaData }))
    }
    updateAreaChart()
  }, [areaFilters])

  if (loading) {
    return (
      <div className="space-y-8">
        <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">📊 Dashboard de Energía Renovable</CardTitle>
            <CardDescription className="text-green-100">
              Cargando datos históricos desde 1965 hasta 2022 - América Latina
            </CardDescription>
          </CardHeader>
        </Card>
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-500 mx-auto"></div>
            <h3 className="text-xl font-semibold text-gray-700">Cargando Dashboard</h3>
            <p className="text-gray-600">Procesando datos de energía renovable...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header del Dashboard */}
      <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">📊 Dashboard de Energía Renovable</CardTitle>
          <CardDescription className="text-green-100">
            Datos históricos completos desde 1965 hasta 2022 - América Latina
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Grid de 4 Gráficos - Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
        {/* Gráfico de Barras - Top Left */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base md:text-lg">📊 Producción de Energía Renovable por Fuente</CardTitle>
            <CardDescription className="text-sm">
              Evolución histórica completa desde 1965 - Biomasa, Solar, Eólica, Hidráulica (TWh)
            </CardDescription>
            {/* Filtros para Gráfico de Barras - Responsive */}
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Select
                value={barFilters.country}
                onValueChange={(value) => setBarFilters((prev) => ({ ...prev, country: value }))}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="País" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los países</SelectItem>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={barFilters.year}
                onValueChange={(value) => setBarFilters((prev) => ({ ...prev, year: value }))}
              >
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Año" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los años</SelectItem>
                  {years.slice(0, 20).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBarFilters({ country: "all", year: "all" })}
                className="w-full sm:w-auto"
              >
                Limpiar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-green-50 p-2 md:p-3 rounded text-center">
                <p className="text-xs md:text-sm text-green-700">
                  <strong>Período:</strong> {Math.min(...chartData.barChart.map((d) => d.year))} -{" "}
                  {Math.max(...chartData.barChart.map((d) => d.year))} | <strong>Total años:</strong>{" "}
                  {chartData.barChart.length}
                </p>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData.barChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip
                    formatter={(value, name) => [`${value} TWh`, name]}
                    labelFormatter={(label) => `Año: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="Biomasa y Otros" fill="#10B981" />
                  <Bar dataKey="Solar" fill="#F59E0B" />
                  <Bar dataKey="Eólica" fill="#3B82F6" />
                  <Bar dataKey="Hidroeléctrica" fill="#06B6D4" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de Torta - Top Right - COMPLETAMENTE CORREGIDO */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base md:text-lg">🥧 Participación de Energías Renovables</CardTitle>
            <CardDescription className="text-sm">Distribución por fuente - Solo fuentes significativas</CardDescription>
            {/* Filtros para Gráfico de Torta */}
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Select
                value={pieFilters.country}
                onValueChange={(value) => setPieFilters((prev) => ({ ...prev, country: value }))}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="País" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los países</SelectItem>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={pieFilters.year}
                onValueChange={(value) => setPieFilters((prev) => ({ ...prev, year: value }))}
              >
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Año" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Año más reciente</SelectItem>
                  {years.slice(0, 20).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPieFilters({ country: "all", year: "all" })}
                className="w-full sm:w-auto"
              >
                Limpiar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {chartData.pieChart && (
              <div className="space-y-4">
                {chartData.pieChart.message ? (
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded text-center">
                    <p className="text-yellow-800 font-medium">⚠️ {chartData.pieChart.message}</p>
                  </div>
                ) : chartData.pieChart.data.length === 0 ? (
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded text-center">
                    <p className="text-gray-600">📊 No hay datos suficientes para mostrar el gráfico</p>
                  </div>
                ) : (
                  <>
                    <div className="bg-blue-50 p-3 rounded text-center">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-bold text-blue-600">{chartData.pieChart.year}</div>
                          <div className="text-blue-700">Año de Datos</div>
                        </div>
                        <div>
                          <div className="font-bold text-blue-600">{chartData.pieChart.total} TWh</div>
                          <div className="text-blue-700">Total Renovable</div>
                        </div>
                      </div>
                      {chartData.pieChart.data.length === 1 && (
                        <div className="mt-2 text-xs text-blue-600">
                          ✨ Fuente dominante: {chartData.pieChart.data[0].name}
                        </div>
                      )}
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={chartData.pieChart.data}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {chartData.pieChart.data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name, props) => [
                            `${value}% (${props.payload.absolute} TWh)`,
                            "Participación",
                          ]}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gráfico de Líneas - Bottom Left */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base md:text-lg">📈 Tendencia en la Capacidad Instalada</CardTitle>
            <CardDescription className="text-sm">
              Evolución histórica completa de capacidad: Eólica, Solar PV y Geotérmica (Gigawatts)
            </CardDescription>
            {/* Filtros para Gráfico de Líneas */}
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Select
                value={lineFilters.country}
                onValueChange={(value) => setLineFilters((prev) => ({ ...prev, country: value }))}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="País" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los países</SelectItem>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={lineFilters.year}
                onValueChange={(value) => setLineFilters((prev) => ({ ...prev, year: value }))}
              >
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Año" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los años</SelectItem>
                  {years.slice(0, 20).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLineFilters({ country: "all", year: "all" })}
                className="w-full sm:w-auto"
              >
                Limpiar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-purple-50 p-2 md:p-3 rounded text-center">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-bold text-purple-600">
                      {chartData.lineChart.length > 0
                        ? `${Math.min(...chartData.lineChart.map((d) => d.year))} - ${Math.max(...chartData.lineChart.map((d) => d.year))}`
                        : "N/A"}
                    </div>
                    <div className="text-purple-700">Período Completo</div>
                  </div>
                  <div>
                    <div className="font-bold text-purple-600">{chartData.lineChart.length}</div>
                    <div className="text-purple-700">Años de Datos</div>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData.lineChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip
                    formatter={(value, name) => [`${value} GW`, name]}
                    labelFormatter={(label) => `Año: ${label}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Capacidad Eólica (GW)"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Capacidad Solar (GW)"
                    stroke="#F59E0B"
                    strokeWidth={3}
                    dot={{ fill: "#F59E0B", strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Capacidad Geotérmica (GW)"
                    stroke="#EF4444"
                    strokeWidth={3}
                    dot={{ fill: "#EF4444", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de Área - Bottom Right */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base md:text-lg">📊 Producción Moderna de Energía Renovable</CardTitle>
            <CardDescription className="text-sm">
              Evolución histórica completa por fuente: Biomasa, Solar, Eólica e Hidroeléctrica (TWh)
            </CardDescription>
            {/* Filtros para Gráfico de Área */}
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Select
                value={areaFilters.country}
                onValueChange={(value) => setAreaFilters((prev) => ({ ...prev, country: value }))}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="País" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los países</SelectItem>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={areaFilters.year}
                onValueChange={(value) => setAreaFilters((prev) => ({ ...prev, year: value }))}
              >
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Año" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los años</SelectItem>
                  {years.slice(0, 20).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAreaFilters({ country: "all", year: "all" })}
                className="w-full sm:w-auto"
              >
                Limpiar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-orange-50 p-2 md:p-3 rounded text-center">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-bold text-orange-600">
                      {chartData.areaChart.length > 0
                        ? `${Math.min(...chartData.areaChart.map((d) => d.year))} - ${Math.max(...chartData.areaChart.map((d) => d.year))}`
                        : "N/A"}
                    </div>
                    <div className="text-orange-700">Período Completo</div>
                  </div>
                  <div>
                    <div className="font-bold text-orange-600">
                      {chartData.areaChart.length > 0
                        ? chartData.areaChart.reduce((sum, d) => sum + d["Total Renovable"], 0).toFixed(1)
                        : "0"}
                    </div>
                    <div className="text-orange-700">TWh Total</div>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={chartData.areaChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip
                    formatter={(value, name) => [`${value} TWh`, name]}
                    labelFormatter={(label) => `Año: ${label}`}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="Biomasa y Otros"
                    stackId="1"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.8}
                  />
                  <Area type="monotone" dataKey="Solar" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.8} />
                  <Area
                    type="monotone"
                    dataKey="Eólica"
                    stackId="1"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.8}
                  />
                  <Area
                    type="monotone"
                    dataKey="Hidroeléctrica"
                    stackId="1"
                    stroke="#06B6D4"
                    fill="#06B6D4"
                    fillOpacity={0.8}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
