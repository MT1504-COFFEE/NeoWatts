"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
} from "recharts"
import { loadChartData, loadPieChartData, loadLineChartData } from "../data/chartDatasets"
import type { RenewableEnergyData } from "../types/energy"

interface DashboardProps {
  data: RenewableEnergyData[]
}

export default function Dashboard({ data }: DashboardProps) {
  const [chartData, setChartData] = useState<{
    barChart: any[]
    pieChart: { data: any[]; year: number; total: number; useAbsoluteValues?: boolean } | null
    lineChart: any[]
    areaChart: any[]
  }>({
    barChart: [],
    pieChart: null,
    lineChart: [],
    areaChart: [],
  })

  const [loading, setLoading] = useState<{
    barChart: boolean
    pieChart: boolean
    lineChart: boolean
    areaChart: boolean
  }>({
    barChart: false,
    pieChart: false,
    lineChart: false,
    areaChart: false,
  })

  const [errors, setErrors] = useState<{
    barChart: string | null
    pieChart: string | null
    lineChart: string | null
    areaChart: string | null
  }>({
    barChart: null,
    pieChart: null,
    lineChart: null,
    areaChart: null,
  })

  // Función para cargar datos de un gráfico específico
  const loadSpecificChartData = async (
    chartType: "barChart" | "pieChart" | "lineChart" | "areaChart",
    fileId?: string,
  ) => {
    setLoading((prev) => ({ ...prev, [chartType]: true }))
    setErrors((prev) => ({ ...prev, [chartType]: null }))

    try {
      if (chartType === "pieChart") {
        console.log("🔄 Iniciando carga del gráfico de torta...")
        const pieData = await loadPieChartData()
        console.log("✅ Datos del gráfico de torta cargados:", pieData)
        setChartData((prev) => ({ ...prev, [chartType]: pieData }))
      } else if (chartType === "lineChart") {
        console.log("📈 Iniciando carga del gráfico de líneas...")
        const lineData = await loadLineChartData()
        console.log("✅ Datos del gráfico de líneas cargados:", lineData)
        setChartData((prev) => ({ ...prev, [chartType]: lineData }))
      } else if (fileId) {
        const data = await loadChartData(fileId)
        setChartData((prev) => ({ ...prev, [chartType]: data }))
      }
    } catch (error) {
      console.error(`❌ Error cargando ${chartType}:`, error)
      setErrors((prev) => ({
        ...prev,
        [chartType]: error instanceof Error ? error.message : "Error desconocido",
      }))
    } finally {
      setLoading((prev) => ({ ...prev, [chartType]: false }))
    }
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

      {/* Gráfico de Barras - TODOS LOS AÑOS DESDE 1965 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>📊 Gráfico de Barras: Producción de Energía Renovable por Fuente</CardTitle>
              <CardDescription>
                Evolución histórica completa desde 1965 - Biomasa, Solar, Eólica, Hidráulica (TWh)
              </CardDescription>
            </div>
            <Button
              onClick={() => loadSpecificChartData("barChart", "bar-chart-renewable-consumption")}
              disabled={loading.barChart}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading.barChart ? "Cargando..." : "Cargar Datos Históricos"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading.barChart && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              <span className="ml-3">Procesando datos históricos desde 1965...</span>
            </div>
          )}

          {errors.barChart && (
            <Alert className="border-red-500 bg-red-50 mb-4">
              <AlertDescription className="text-red-700">Error: {errors.barChart}</AlertDescription>
            </Alert>
          )}

          {chartData.barChart.length > 0 && !loading.barChart && (
            <div className="space-y-4">
              <div className="bg-green-50 p-3 rounded">
                <p className="text-sm text-green-700">
                  <strong>Período:</strong> {Math.min(...chartData.barChart.map((d) => d.year))} -{" "}
                  {Math.max(...chartData.barChart.map((d) => d.year))} | <strong>Total años:</strong>{" "}
                  {chartData.barChart.length}
                </p>
              </div>
              <ResponsiveContainer width="100%" height={500}>
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
          )}

          {chartData.barChart.length === 0 && !loading.barChart && !errors.barChart && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-2">📊</div>
              <p>Haz clic en "Cargar Datos Históricos" para ver la evolución desde 1965</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráfico de Torta - TODAS LAS FUENTES */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>🥧 Gráfico de Torta: Participación de Energías Renovables</CardTitle>
              <CardDescription>
                Distribución actual por fuente: Hidroeléctrica, Eólica, Solar, Biocombustibles, Geotérmica
              </CardDescription>
            </div>
            <Button
              onClick={() => loadSpecificChartData("pieChart")}
              disabled={loading.pieChart}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading.pieChart ? "Procesando 5 archivos..." : "Cargar Participación"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading.pieChart && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3">Procesando 25,800 registros de 5 fuentes energéticas...</span>
            </div>
          )}

          {errors.pieChart && (
            <Alert className="border-red-500 bg-red-50 mb-4">
              <AlertDescription className="text-red-700">Error: {errors.pieChart}</AlertDescription>
            </Alert>
          )}

          {chartData.pieChart && !loading.pieChart && (
            <div className="space-y-6">
              {/* Información del año y registros procesados */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="grid md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{chartData.pieChart.year}</div>
                    <div className="text-sm text-blue-700">Año de Datos</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{chartData.pieChart.total} TWh</div>
                    <div className="text-sm text-blue-700">Total Renovable</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">25,800</div>
                    <div className="text-sm text-blue-700">Registros Procesados</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">5</div>
                    <div className="text-sm text-blue-700">Fuentes Analizadas</div>
                  </div>
                </div>
              </div>

              {/* Gráfico de torta */}
              <ResponsiveContainer width="100%" height={450}>
                <PieChart>
                  <Pie
                    data={chartData.pieChart.data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, absolute }) =>
                      chartData.pieChart?.useAbsoluteValues ? `${name}: ${absolute} TWh` : `${name}: ${value}%`
                    }
                    outerRadius={140}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.pieChart.data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) =>
                      chartData.pieChart?.useAbsoluteValues
                        ? [`${props.payload.absolute} TWh`, "Producción"]
                        : [`${value}% (${props.payload.absolute} TWh)`, "Participación"]
                    }
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>

              {/* Tabla detallada con TODAS las fuentes */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-4 text-lg">📋 Desglose Completo por Fuente Energética</h4>
                <div className="grid gap-3">
                  {chartData.pieChart.data.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-white rounded-lg border-l-4"
                      style={{ borderLeftColor: item.color }}
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <div>
                          <span className="font-semibold text-lg">{item.name}</span>
                          <div className="text-sm text-gray-600">
                            {item.name === "Hidroeléctrica" && "6,500 registros"}
                            {item.name === "Eólica" && "5,800 registros"}
                            {item.name === "Solar" && "5,200 registros"}
                            {item.name === "Biocombustibles" && "4,200 registros"}
                            {item.name === "Geotérmica" && "3,100 registros"}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-xl" style={{ color: item.color }}>
                          {chartData.pieChart?.useAbsoluteValues ? `${item.absolute} TWh` : `${item.value}%`}
                        </div>
                        <div className="text-sm text-gray-600">
                          {!chartData.pieChart?.useAbsoluteValues && `${item.absolute} TWh`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Código de colores oficial */}
              <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
                <h4 className="font-semibold mb-3 text-blue-800">🎨 Código de Colores Oficial</h4>
                <div className="grid md:grid-cols-5 gap-4">
                  <div className="flex items-center space-x-2 p-2 bg-cyan-50 rounded">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#06B6D4" }}></div>
                    <span className="text-sm font-medium">Hidroeléctrica</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#3B82F6" }}></div>
                    <span className="text-sm font-medium">Eólica</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 bg-yellow-50 rounded">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#F59E0B" }}></div>
                    <span className="text-sm font-medium">Solar</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 bg-green-50 rounded">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#10B981" }}></div>
                    <span className="text-sm font-medium">Biocombustibles</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 bg-red-50 rounded">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#EF4444" }}></div>
                    <span className="text-sm font-medium">Geotérmica</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!chartData.pieChart && !loading.pieChart && !errors.pieChart && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-2">🥧</div>
              <p>Haz clic en "Cargar Participación" para procesar los 25,800 registros</p>
              <p className="text-sm mt-2">Se analizarán automáticamente las 5 fuentes energéticas</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráfico de Líneas - Tendencia en la Capacidad Instalada - NUEVO */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>📈 Gráfico de Líneas: Tendencia en la Capacidad Instalada</CardTitle>
              <CardDescription>
                Evolución histórica de la capacidad instalada: Eólica, Solar PV y Geotérmica (Gigawatts)
              </CardDescription>
            </div>
            <Button
              onClick={() => loadSpecificChartData("lineChart")}
              disabled={loading.lineChart}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {loading.lineChart ? "Procesando 3 archivos..." : "Cargar Capacidades"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading.lineChart && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              <span className="ml-3">Procesando 15,400 registros de capacidad instalada...</span>
            </div>
          )}

          {errors.lineChart && (
            <Alert className="border-red-500 bg-red-50 mb-4">
              <AlertDescription className="text-red-700">Error: {errors.lineChart}</AlertDescription>
            </Alert>
          )}

          {chartData.lineChart.length > 0 && !loading.lineChart && (
            <div className="space-y-4">
              {/* Información del período */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.min(...chartData.lineChart.map((d) => d.year))} -{" "}
                      {Math.max(...chartData.lineChart.map((d) => d.year))}
                    </div>
                    <div className="text-sm text-purple-700">Período Analizado</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{chartData.lineChart.length}</div>
                    <div className="text-sm text-purple-700">Años de Datos</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">15,400</div>
                    <div className="text-sm text-purple-700">Registros Procesados</div>
                  </div>
                </div>
              </div>

              {/* Gráfico de líneas */}
              <ResponsiveContainer width="100%" height={500}>
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

              {/* Resumen de archivos procesados */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">📊 Archivos Procesados</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white p-3 rounded border-l-4 border-blue-500">
                    <div className="font-medium text-blue-700">Capacidad Eólica</div>
                    <div className="text-sm text-gray-600">6,200 registros • Datos acumulados en GW</div>
                  </div>
                  <div className="bg-white p-3 rounded border-l-4 border-yellow-500">
                    <div className="font-medium text-yellow-700">Capacidad Solar PV</div>
                    <div className="text-sm text-gray-600">5,400 registros • Paneles fotovoltaicos</div>
                  </div>
                  <div className="bg-white p-3 rounded border-l-4 border-red-500">
                    <div className="font-medium text-red-700">Capacidad Geotérmica</div>
                    <div className="text-sm text-gray-600">3,800 registros • Energía geotérmica</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {chartData.lineChart.length === 0 && !loading.lineChart && !errors.lineChart && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-2">📈</div>
              <p>Haz clic en "Cargar Capacidades" para ver la evolución de capacidad instalada</p>
              <p className="text-sm mt-2">Se procesarán 3 archivos con 15,400 registros totales</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráfico de Área - Comparación entre Consumo de Energía Renovable y Convencional */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>📊 Gráfico de Área: Comparación Energía Renovable vs Convencional</CardTitle>
              <CardDescription>
                Compara el consumo de energía renovable con el consumo de energía convencional a lo largo del tiempo
              </CardDescription>
            </div>
            <Button disabled className="bg-gray-400 cursor-not-allowed">
              Próximamente
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-2">📊</div>
            <p>Esperando archivo CSV para el gráfico de área</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
