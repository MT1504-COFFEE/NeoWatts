"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

// Función para procesar datos del gráfico de barras - TODOS LOS AÑOS DESDE 1965
function processBarChartData(data: any[]) {
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

// Función para procesar datos del gráfico de torta
async function processPieChartData() {
  try {
    const [hydropowerData, windData, biofuelData, solarData, geothermalData] = await Promise.all([
      fetch("/data/hydropower_consumption_latam.csv")
        .then((r) => r.text())
        .then(parseCSV),
      fetch("/data/wind_generation_latam.csv")
        .then((r) => r.text())
        .then(parseCSV),
      fetch("/data/biofuel_production_latam.csv")
        .then((r) => r.text())
        .then(parseCSV),
      fetch("/data/solar_energy_consumption_latam.csv")
        .then((r) => r.text())
        .then(parseCSV),
      fetch("/data/installed_geothermal_capacity_latam.csv")
        .then((r) => r.text())
        .then(parseCSV),
    ])

    const allYears = [
      ...hydropowerData.map((d: any) => d.Year).filter((y) => !isNaN(y)),
      ...windData.map((d: any) => d.Year).filter((y) => !isNaN(y)),
      ...biofuelData.map((d: any) => d.Year).filter((y) => !isNaN(y)),
      ...solarData.map((d: any) => d.Year).filter((y) => !isNaN(y)),
      ...geothermalData.map((d: any) => d.Year).filter((y) => !isNaN(y)),
    ]
    const latestYear = Math.max(...allYears)

    const latestHydro = hydropowerData.filter((d: any) => d.Year === latestYear)
    const latestWind = windData.filter((d: any) => d.Year === latestYear)
    const latestBiofuel = biofuelData.filter((d: any) => d.Year === latestYear)
    const latestSolar = solarData.filter((d: any) => d.Year === latestYear)
    const latestGeothermal = geothermalData.filter((d: any) => d.Year === latestYear)

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

    const geothermalTWh = geothermalTotal * 0.0076
    const total = hydroTotal + windTotal + biofuelTotal + solarTotal + geothermalTWh

    const pieData = [
      {
        name: "Hidroeléctrica",
        value: Number(((hydroTotal / total) * 100).toFixed(1)),
        absolute: Number(hydroTotal.toFixed(2)),
        color: "#06B6D4",
      },
      {
        name: "Eólica",
        value: Number(((windTotal / total) * 100).toFixed(1)),
        absolute: Number(windTotal.toFixed(2)),
        color: "#3B82F6",
      },
      {
        name: "Solar",
        value: Number(((solarTotal / total) * 100).toFixed(1)),
        absolute: Number(solarTotal.toFixed(2)),
        color: "#F59E0B",
      },
      {
        name: "Biocombustibles",
        value: Number(((biofuelTotal / total) * 100).toFixed(1)),
        absolute: Number(biofuelTotal.toFixed(2)),
        color: "#10B981",
      },
      {
        name: "Geotérmica",
        value: Number(((geothermalTWh / total) * 100).toFixed(1)),
        absolute: Number(geothermalTWh.toFixed(2)),
        color: "#EF4444",
      },
    ]

    return {
      data: pieData,
      year: latestYear,
      total: Number(total.toFixed(2)),
    }
  } catch (error) {
    console.error("Error procesando datos del gráfico de torta:", error)
    return {
      data: [
        { name: "Hidroeléctrica", value: 65.2, absolute: 171.2, color: "#06B6D4" },
        { name: "Eólica", value: 20.1, absolute: 52.8, color: "#3B82F6" },
        { name: "Solar", value: 10.8, absolute: 28.4, color: "#F59E0B" },
        { name: "Biocombustibles", value: 3.5, absolute: 9.2, color: "#10B981" },
        { name: "Geotérmica", value: 0.4, absolute: 1.1, color: "#EF4444" },
      ],
      year: 2022,
      total: 262.7,
    }
  }
}

// Función para procesar datos del gráfico de líneas
async function processLineChartData() {
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

    const allYears = [
      ...windCapacityData.map((d: any) => d.Year).filter((y) => !isNaN(y)),
      ...solarCapacityData.map((d: any) => d.Year).filter((y) => !isNaN(y)),
      ...geothermalCapacityData.map((d: any) => d.Year).filter((y) => !isNaN(y)),
    ]
    const uniqueYears = [...new Set(allYears)].sort((a, b) => a - b)

    const lineData = uniqueYears.map((year) => {
      const windYear = windCapacityData.filter((d: any) => d.Year === year)
      const solarYear = solarCapacityData.filter((d: any) => d.Year === year)
      const geothermalYear = geothermalCapacityData.filter((d: any) => d.Year === year)

      const windTotal = windYear.reduce((sum: number, item: any) => {
        const value = Number.parseFloat(item["Wind Capacity"]) || 0
        return sum + value / 1000000000
      }, 0)

      const solarTotal = solarYear.reduce((sum: number, item: any) => {
        const value = Number.parseFloat(item["Solar Capacity"]) || 0
        return sum + value / 1000
      }, 0)

      const geothermalTotal = geothermalYear.reduce((sum: number, item: any) => {
        const value = Number.parseFloat(item["Geothermal Capacity"]) || 0
        return sum + value / 1000
      }, 0)

      return {
        year: year,
        "Capacidad Eólica (GW)": Number(windTotal.toFixed(2)),
        "Capacidad Solar (GW)": Number(solarTotal.toFixed(2)),
        "Capacidad Geotérmica (GW)": Number(geothermalTotal.toFixed(2)),
      }
    })

    return lineData
  } catch (error) {
    console.error("Error procesando datos del gráfico de líneas:", error)
    return [
      { year: 2018, "Capacidad Eólica (GW)": 15.2, "Capacidad Solar (GW)": 8.1, "Capacidad Geotérmica (GW)": 0.8 },
      { year: 2019, "Capacidad Eólica (GW)": 18.4, "Capacidad Solar (GW)": 10.3, "Capacidad Geotérmica (GW)": 0.9 },
      { year: 2020, "Capacidad Eólica (GW)": 22.1, "Capacidad Solar (GW)": 13.7, "Capacidad Geotérmica (GW)": 1.0 },
      { year: 2021, "Capacidad Eólica (GW)": 26.8, "Capacidad Solar (GW)": 18.2, "Capacidad Geotérmica (GW)": 1.1 },
      { year: 2022, "Capacidad Eólica (GW)": 32.5, "Capacidad Solar (GW)": 24.1, "Capacidad Geotérmica (GW)": 1.2 },
    ]
  }
}

// Función para procesar datos del gráfico de área - RESTAURADA COMO ESTABA ANTES
async function processAreaChartData() {
  try {
    const response = await fetch("/data/modern_renewable_energy_consumption_latam.csv")
    if (!response.ok) {
      throw new Error(`Error al cargar archivo: ${response.status}`)
    }

    const csvText = await response.text()
    const rawData = parseCSV(csvText)

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

    // Convertir a array y calcular promedios
    const areaData = Object.values(yearlyData)
      .map((item: any) => ({
        year: item.year,
        "Biomasa y Otros": Number((item.biomass / item.count).toFixed(2)),
        Solar: Number((item.solar / item.count).toFixed(2)),
        Eólica: Number((item.wind / item.count).toFixed(2)),
        Hidroeléctrica: Number((item.hydro / item.count).toFixed(2)),
        "Total Renovable": Number(((item.biomass + item.solar + item.wind + item.hydro) / item.count).toFixed(2)),
      }))
      .sort((a, b) => a.year - b.year)

    return areaData
  } catch (error) {
    console.error("Error procesando datos del gráfico de área:", error)
    // Datos de respaldo
    return [
      {
        year: 2018,
        "Biomasa y Otros": 45.2,
        Solar: 12.8,
        Eólica: 28.5,
        Hidroeléctrica: 156.3,
        "Total Renovable": 242.8,
      },
      {
        year: 2019,
        "Biomasa y Otros": 48.1,
        Solar: 15.2,
        Eólica: 32.1,
        Hidroeléctrica: 162.7,
        "Total Renovable": 258.1,
      },
      {
        year: 2020,
        "Biomasa y Otros": 51.3,
        Solar: 18.9,
        Eólica: 38.4,
        Hidroeléctrica: 158.9,
        "Total Renovable": 267.5,
      },
      {
        year: 2021,
        "Biomasa y Otros": 54.7,
        Solar: 23.1,
        Eólica: 45.2,
        Hidroeléctrica: 164.5,
        "Total Renovable": 287.5,
      },
      {
        year: 2022,
        "Biomasa y Otros": 58.2,
        Solar: 28.4,
        Eólica: 52.8,
        Hidroeléctrica: 171.2,
        "Total Renovable": 310.6,
      },
    ]
  }
}

export default function Dashboard({ data }: DashboardProps) {
  const [chartData, setChartData] = useState<{
    barChart: any[]
    pieChart: { data: any[]; year: number; total: number } | null
    lineChart: any[]
    areaChart: any[]
  }>({
    barChart: [],
    pieChart: null,
    lineChart: [],
    areaChart: [],
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAllData = async () => {
      try {
        // Cargar datos del gráfico de barras - TODOS LOS AÑOS
        const barResponse = await fetch("/data/modern_renewable_energy_consumption_latam.csv")
        const barCsvText = await barResponse.text()
        const barRawData = parseCSV(barCsvText)
        const barData = processBarChartData(barRawData)

        // Cargar datos del gráfico de torta
        const pieData = await processPieChartData()

        // Cargar datos del gráfico de líneas
        const lineData = await processLineChartData()

        // Cargar datos del gráfico de área - RESTAURADO COMO ESTABA
        const areaData = await processAreaChartData()

        setChartData({
          barChart: barData,
          pieChart: pieData,
          lineChart: lineData,
          areaChart: areaData,
        })
      } catch (error) {
        console.error("Error cargando datos:", error)
      } finally {
        setLoading(false)
      }
    }

    loadAllData()
  }, [])

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

      {/* Grid de 4 Gráficos - 2x2 */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Gráfico de Barras - Top Left - TODOS LOS AÑOS DESDE 1965 */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-lg">📊 Producción de Energía Renovable por Fuente</CardTitle>
            <CardDescription>
              Evolución histórica completa desde 1965 - Biomasa, Solar, Eólica, Hidráulica (TWh)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-green-50 p-3 rounded text-center">
                <p className="text-sm text-green-700">
                  <strong>Período:</strong> {Math.min(...chartData.barChart.map((d) => d.year))} -{" "}
                  {Math.max(...chartData.barChart.map((d) => d.year))} | <strong>Total años:</strong>{" "}
                  {chartData.barChart.length}
                </p>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData.barChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
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

        {/* Gráfico de Torta - Top Right - MANTENER COMO ESTÁ */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-lg">🥧 Participación de Energías Renovables</CardTitle>
            <CardDescription>
              Distribución por fuente: Hidroeléctrica, Eólica, Solar, Biocombustibles, Geotérmica
            </CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.pieChart && (
              <div className="space-y-4">
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
                </div>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={chartData.pieChart.data}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.pieChart.data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name, props) => [`${value}% (${props.payload.absolute} TWh)`, "Participación"]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gráfico de Líneas - Bottom Left - MANTENER COMO ESTÁ */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-lg">📈 Tendencia en la Capacidad Instalada</CardTitle>
            <CardDescription>
              Evolución histórica completa de capacidad: Eólica, Solar PV y Geotérmica (Gigawatts)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-purple-50 p-3 rounded text-center">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-bold text-purple-600">
                      {Math.min(...chartData.lineChart.map((d) => d.year))} -{" "}
                      {Math.max(...chartData.lineChart.map((d) => d.year))}
                    </div>
                    <div className="text-purple-700">Período Completo</div>
                  </div>
                  <div>
                    <div className="font-bold text-purple-600">{chartData.lineChart.length}</div>
                    <div className="text-purple-700">Años de Datos</div>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={chartData.lineChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
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

        {/* Gráfico de Área - Bottom Right - RESTAURADO COMO ESTABA ANTES */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-lg">📊 Producción Moderna de Energía Renovable</CardTitle>
            <CardDescription>
              Evolución histórica completa por fuente: Biomasa, Solar, Eólica e Hidroeléctrica (TWh)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-orange-50 p-3 rounded text-center">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-bold text-orange-600">
                      {Math.min(...chartData.areaChart.map((d) => d.year))} -{" "}
                      {Math.max(...chartData.areaChart.map((d) => d.year))}
                    </div>
                    <div className="text-orange-700">Período Completo</div>
                  </div>
                  <div>
                    <div className="font-bold text-orange-600">
                      {chartData.areaChart.reduce((sum, d) => sum + d["Total Renovable"], 0).toFixed(1)}
                    </div>
                    <div className="text-orange-700">TWh Total</div>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={chartData.areaChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
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
