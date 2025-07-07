"use client"

import { useMemo } from "react"
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

const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6", "#F97316"]

export default function Dashboard({ data }: DashboardProps) {
  // Procesar datos para gráfico de barras - Producción por fuente
  const barChartData = useMemo(() => {
    const yearlyData = data.reduce(
      (acc, item) => {
        if (!acc[item.year]) {
          acc[item.year] = {
            year: item.year,
            wind: 0,
            solar: 0,
            hydro: 0,
            biofuel: 0,
            geothermal: 0,
            count: 0,
          }
        }

        acc[item.year].wind += item["wind-generation"]
        acc[item.year].solar += item["solar-energy-consumption"]
        acc[item.year].hydro += item["hydropower-consumption"]
        acc[item.year].biofuel += item["biofuel-production"]
        acc[item.year].geothermal += item["installed-geothermal-capacity"]
        acc[item.year].count += 1

        return acc
      },
      {} as Record<number, any>,
    )

    return Object.values(yearlyData)
      .map((item: any) => ({
        year: item.year,
        Eólica: (item.wind / item.count).toFixed(1),
        Solar: (item.solar / item.count).toFixed(1),
        Hidroeléctrica: (item.hydro / item.count).toFixed(1),
        Biocombustibles: (item.biofuel / item.count).toFixed(1),
        Geotérmica: (item.geothermal / item.count).toFixed(1),
      }))
      .sort((a, b) => a.year - b.year)
  }, [data])

  // Procesar datos para gráfico de torta - Participación de renovables
  const pieChartData = useMemo(() => {
    if (data.length === 0) return []

    const latestYear = Math.max(...data.map((item) => item.year))
    const latestData = data.filter((item) => item.year === latestYear)

    const averages = latestData.reduce(
      (acc, item) => {
        acc.wind += item["share-electricity-wind"]
        acc.solar += item["share-electricity-solar"]
        acc.hydro += item["share-electricity-hydro"]
        acc.other += Math.max(
          0,
          item["share-electricity-renewables"] -
            item["share-electricity-wind"] -
            item["share-electricity-solar"] -
            item["share-electricity-hydro"],
        )
        return acc
      },
      { wind: 0, solar: 0, hydro: 0, other: 0 },
    )

    const count = latestData.length
    return [
      { name: "Eólica", value: (averages.wind / count).toFixed(1), color: "#3B82F6" },
      { name: "Solar", value: (averages.solar / count).toFixed(1), color: "#F59E0B" },
      { name: "Hidroeléctrica", value: (averages.hydro / count).toFixed(1), color: "#10B981" },
      { name: "Otras Renovables", value: (averages.other / count).toFixed(1), color: "#8B5CF6" },
    ].filter((item) => Number.parseFloat(item.value) > 0)
  }, [data])

  // Procesar datos para gráfico de líneas - Tendencia de capacidad instalada
  const lineChartData = useMemo(() => {
    const yearlyData = data.reduce(
      (acc, item) => {
        if (!acc[item.year]) {
          acc[item.year] = {
            year: item.year,
            windCapacity: 0,
            solarCapacity: 0,
            geothermalCapacity: 0,
            count: 0,
          }
        }

        acc[item.year].windCapacity += item["cumulative-installed-wind-energy-capacity-gigawatts"]
        acc[item.year].solarCapacity += item["installed-solar-PV-capacity"]
        acc[item.year].geothermalCapacity += item["installed-geothermal-capacity"]
        acc[item.year].count += 1

        return acc
      },
      {} as Record<number, any>,
    )

    return Object.values(yearlyData)
      .map((item: any) => ({
        year: item.year,
        "Capacidad Eólica (GW)": (item.windCapacity / item.count).toFixed(1),
        "Capacidad Solar (GW)": (item.solarCapacity / item.count).toFixed(1),
        "Capacidad Geotérmica (GW)": (item.geothermalCapacity / item.count).toFixed(1),
      }))
      .sort((a, b) => a.year - b.year)
  }, [data])

  // Procesar datos para gráfico de área - Renovable vs Convencional
  const areaChartData = useMemo(() => {
    const yearlyData = data.reduce(
      (acc, item) => {
        if (!acc[item.year]) {
          acc[item.year] = {
            year: item.year,
            renewable: 0,
            conventional: 0,
            count: 0,
          }
        }

        acc[item.year].renewable += item["modern-renewable-energy-consumption"]
        acc[item.year].conventional += item["conventional-energy-consumption"]
        acc[item.year].count += 1

        return acc
      },
      {} as Record<number, any>,
    )

    return Object.values(yearlyData)
      .map((item: any) => ({
        year: item.year,
        "Energía Renovable": (item.renewable / item.count).toFixed(1),
        "Energía Convencional": (item.conventional / item.count).toFixed(1),
      }))
      .sort((a, b) => a.year - b.year)
  }, [data])

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Dashboard no disponible</h3>
          <p className="text-gray-500">Carga datos desde la pestaña "Cargar Datos" para ver las visualizaciones</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header del Dashboard */}
      <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">📊 Dashboard de Energía Renovable</CardTitle>
          <CardDescription className="text-green-100">
            Análisis visual de {data.length} registros históricos de energía renovable
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Gráfico de Barras - Producción por Fuente */}
      <Card>
        <CardHeader>
          <CardTitle>Producción de Energía por Fuente</CardTitle>
          <CardDescription>Evolución anual de la producción promedio por tipo de fuente renovable</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [`${value} TWh`, name]}
                labelFormatter={(label) => `Año: ${label}`}
              />
              <Legend />
              <Bar dataKey="Eólica" fill="#3B82F6" />
              <Bar dataKey="Solar" fill="#F59E0B" />
              <Bar dataKey="Hidroeléctrica" fill="#10B981" />
              <Bar dataKey="Biocombustibles" fill="#EF4444" />
              <Bar dataKey="Geotérmica" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Torta - Participación de Renovables */}
      <Card>
        <CardHeader>
          <CardTitle>Participación de Energías Renovables</CardTitle>
          <CardDescription>Distribución porcentual de fuentes renovables en la generación eléctrica</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, "Participación"]} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Líneas - Tendencia de Capacidad Instalada */}
      <Card>
        <CardHeader>
          <CardTitle>Tendencia de Capacidad Instalada</CardTitle>
          <CardDescription>Evolución de la capacidad instalada por fuente renovable en Gigawatts</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip formatter={(value, name) => [`${value} GW`, name]} labelFormatter={(label) => `Año: ${label}`} />
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
                stroke="#8B5CF6"
                strokeWidth={3}
                dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Área - Renovable vs Convencional */}
      <Card>
        <CardHeader>
          <CardTitle>Comparación Energía Renovable vs Convencional</CardTitle>
          <CardDescription>
            Evolución del consumo de energía renovable comparado con energía convencional
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={areaChartData}>
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
                dataKey="Energía Renovable"
                stackId="1"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="Energía Convencional"
                stackId="1"
                stroke="#EF4444"
                fill="#EF4444"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Estadísticas Resumen */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Registros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{data.length}</div>
            <p className="text-xs text-gray-500">Datos históricos</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Países</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {[...new Set(data.map((item) => item.country))].length}
            </div>
            <p className="text-xs text-gray-500">Analizados</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Años Cubiertos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {Math.max(...data.map((item) => item.year)) - Math.min(...data.map((item) => item.year)) + 1}
            </div>
            <p className="text-xs text-gray-500">
              {Math.min(...data.map((item) => item.year))} - {Math.max(...data.map((item) => item.year))}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Promedio Renovable</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {(data.reduce((sum, item) => sum + item["share-electricity-renewables"], 0) / data.length).toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500">Participación global</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
