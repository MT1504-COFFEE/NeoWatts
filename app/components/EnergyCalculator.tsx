"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { loadCSVFile } from "../data/datasets"
import type { RenewableEnergyData } from "../types/energy"

interface EnergyCalculatorProps {
  data?: RenewableEnergyData[] // Opcional, ya no se usa
}

export default function EnergyCalculator({ data }: EnergyCalculatorProps) {
  // Estado interno para los datos de la calculadora
  const [calculatorData, setCalculatorData] = useState<RenewableEnergyData[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  // Estados del formulario
  const [consumption, setConsumption] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedYear, setSelectedYear] = useState("")
  const [result, setResult] = useState<{
    renewablePercentage: number
    renewableConsumption: number
    conventionalConsumption: number
    totalConsumption: number
  } | null>(null)

  // Cargar automáticamente el dataset compatible al montar el componente
  useEffect(() => {
    const loadCalculatorData = async () => {
      try {
        setIsLoadingData(true)
        setLoadError(null)

        // Cargar automáticamente el único dataset compatible
        const data = await loadCSVFile("latam-renewable-production")

        // Filtrar solo datos que tienen porcentaje renovable calculable
        const validData = data.filter((item) => item["share-electricity-renewables"] !== -1)

        setCalculatorData(validData)

        if (validData.length === 0) {
          setLoadError("No se encontraron datos válidos en el dataset")
        }
      } catch (error) {
        console.error("Error cargando datos de la calculadora:", error)
        setLoadError("Error al cargar los datos de la calculadora")
      } finally {
        setIsLoadingData(false)
      }
    }

    loadCalculatorData()
  }, [])

  // Obtener países y años únicos de los datos cargados automáticamente
  const { countries, years } = useMemo(() => {
    if (calculatorData.length === 0) return { countries: [], years: [] }

    const uniqueCountries = [...new Set(calculatorData.map((item) => item.country))].sort()
    const uniqueYears = [...new Set(calculatorData.map((item) => item.year))].sort((a, b) => b - a)

    return {
      countries: uniqueCountries,
      years: uniqueYears,
    }
  }, [calculatorData])

  const calculateRenewablePercentage = () => {
    if (!consumption || !selectedCountry || !selectedYear) {
      return
    }

    const consumptionValue = Number.parseFloat(consumption)
    if (isNaN(consumptionValue) || consumptionValue <= 0) {
      return
    }

    // Encontrar datos para el país y año seleccionados
    const countryData = calculatorData.find(
      (item) =>
        item.country === selectedCountry &&
        item.year === Number.parseInt(selectedYear) &&
        item["share-electricity-renewables"] !== -1,
    )

    if (!countryData) {
      return
    }

    const renewablePercentage = countryData["share-electricity-renewables"]
    const renewableConsumption = (consumptionValue * renewablePercentage) / 100
    const conventionalConsumption = consumptionValue - renewableConsumption

    setResult({
      renewablePercentage,
      renewableConsumption,
      conventionalConsumption,
      totalConsumption: consumptionValue,
    })
  }

  // Estado de carga inicial
  if (isLoadingData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>🧮</span>
            <span>Calculadora de Energía Renovable</span>
          </CardTitle>
          <CardDescription>
            Cargando datos automáticamente del dataset "Producción Renovable América Latina"
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-500"></div>
            <h3 className="text-lg font-semibold text-gray-700">Cargando Calculadora</h3>
            <p className="text-gray-600">Preparando datos de energía renovable...</p>
            <div className="bg-blue-50 p-3 rounded-lg max-w-md">
              <p className="text-xs text-blue-700">
                ✨ <strong>Carga automática:</strong> La calculadora usa automáticamente el dataset más completo con
                porcentajes reales del mix energético de América Latina.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Error al cargar datos
  if (loadError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>🧮</span>
            <span>Calculadora de Energía Renovable</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-semibold text-red-600 mb-2">Error al cargar datos</h3>
          <p className="text-red-700 mb-4">{loadError}</p>
          <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700">
            Reintentar
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Sin datos válidos
  if (calculatorData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>🧮</span>
            <span>Calculadora de Energía Renovable</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Sin datos disponibles</h3>
          <p className="text-gray-500">No se encontraron datos válidos para la calculadora</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>🧮</span>
            <span>Calculadora de Energía Renovable</span>
          </CardTitle>
          <CardDescription>
            Calcula qué porcentaje de tu consumo eléctrico proviene de fuentes renovables
          </CardDescription>
          {/* Indicador de datos cargados */}
          <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-green-600">✅</span>
              <span className="text-sm text-green-800">
                <strong>Datos cargados:</strong> {calculatorData.length.toLocaleString()} registros del dataset
                "Producción Renovable América Latina" ({countries.length} países, {years.length} años)
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Formulario */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="consumption">Consumo Eléctrico Mensual (kWh)</Label>
                <Input
                  id="consumption"
                  type="number"
                  placeholder="Ej: 350"
                  value={consumption}
                  onChange={(e) => setConsumption(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="country">País</Label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecciona un país" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="year">Año</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecciona un año" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={calculateRenewablePercentage}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!consumption || !selectedCountry || !selectedYear}
              >
                Calcular Energía Renovable
              </Button>
            </div>

            {/* Información adicional */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-blue-800 mb-3">💡 ¿Cómo funciona?</h3>
              <ul className="text-sm text-blue-700 space-y-2">
                <li>• Ingresa tu consumo eléctrico mensual en kWh</li>
                <li>• Selecciona tu país y el año de referencia</li>
                <li>• El cálculo se basa en el mix energético nacional real</li>
                <li>• Obtienes el porcentaje total de energía renovable</li>
              </ul>

              <div className="mt-4 p-3 bg-white rounded border-l-4 border-blue-500">
                <p className="text-xs text-gray-600">
                  <strong>Datos automáticos:</strong> La calculadora usa automáticamente el dataset más completo con
                  datos reales del mix energético de {countries.length} países latinoamericanos desde{" "}
                  {Math.min(...years)} hasta {Math.max(...years)}.
                </p>
              </div>
            </div>
          </div>

          {/* Resultados */}
          {result && (
            <div className="space-y-6">
              <Alert className="border-green-500 bg-green-50">
                <AlertDescription className="text-green-700">
                  ✅ Cálculo completado para {selectedCountry} en {selectedYear}
                </AlertDescription>
              </Alert>

              {/* Resultado principal */}
              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="text-2xl text-green-700">
                    {result.renewablePercentage.toFixed(1)}% Renovable
                  </CardTitle>
                  <CardDescription>De tu consumo de {consumption} kWh/mes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-green-100 rounded">
                        <span className="font-medium">Energía Renovable:</span>
                        <span className="font-bold text-green-700">{result.renewableConsumption.toFixed(1)} kWh</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-100 rounded">
                        <span className="font-medium">Energía Convencional:</span>
                        <span className="font-bold text-gray-700">{result.conventionalConsumption.toFixed(1)} kWh</span>
                      </div>
                    </div>

                    {/* Gráfico de barras simple */}
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Distribución de tu consumo:</div>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <div className="w-16 text-xs">Renovable</div>
                          <div className="flex-1 bg-gray-200 rounded-full h-4 mx-2">
                            <div
                              className="bg-green-500 h-4 rounded-full transition-all duration-500"
                              style={{ width: `${result.renewablePercentage}%` }}
                            ></div>
                          </div>
                          <div className="w-12 text-xs text-right">{result.renewablePercentage.toFixed(1)}%</div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-16 text-xs">Convencional</div>
                          <div className="flex-1 bg-gray-200 rounded-full h-4 mx-2">
                            <div
                              className="bg-gray-500 h-4 rounded-full transition-all duration-500"
                              style={{ width: `${100 - result.renewablePercentage}%` }}
                            ></div>
                          </div>
                          <div className="w-12 text-xs text-right">
                            {(100 - result.renewablePercentage).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Información adicional sobre el mix energético */}
              <Card>
                <CardHeader>
                  <CardTitle>Información del Mix Energético</CardTitle>
                  <CardDescription>
                    Datos del mix energético nacional para {selectedCountry} en {selectedYear}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-semibold text-blue-800">País:</div>
                        <div className="text-blue-700">{selectedCountry}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-blue-800">Año de referencia:</div>
                        <div className="text-blue-700">{selectedYear}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-blue-800">% Renovable nacional:</div>
                        <div className="text-blue-700">{result.renewablePercentage.toFixed(1)}%</div>
                      </div>
                      <div>
                        <div className="font-semibold text-blue-800">% Convencional nacional:</div>
                        <div className="text-blue-700">{(100 - result.renewablePercentage).toFixed(1)}%</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
