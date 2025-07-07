"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { RenewableEnergyData } from "../types/energy"

interface EnergyCalculatorProps {
  data: RenewableEnergyData[]
}

export default function EnergyCalculator({ data }: EnergyCalculatorProps) {
  const [consumption, setConsumption] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedYear, setSelectedYear] = useState("")
  const [result, setResult] = useState<{
    renewablePercentage: number
    renewableConsumption: number
    totalRenewableProduction: number
    breakdown: { source: string; percentage: number; consumption: number }[]
  } | null>(null)

  // Obtener países y años únicos
  const countries = useMemo(() => {
    return [...new Set(data.map((item) => item.country))].sort()
  }, [data])

  const years = useMemo(() => {
    return [...new Set(data.map((item) => item.year))].sort((a, b) => b - a)
  }, [data])

  const calculateRenewablePercentage = () => {
    if (!consumption || !selectedCountry || !selectedYear) {
      return
    }

    const consumptionValue = Number.parseFloat(consumption)
    if (isNaN(consumptionValue) || consumptionValue <= 0) {
      return
    }

    // Encontrar datos para el país y año seleccionados
    const countryData = data.find(
      (item) => item.country === selectedCountry && item.year === Number.parseInt(selectedYear),
    )

    if (!countryData) {
      return
    }

    // Calcular la producción total de energía renovable
    const renewableSources = [
      { name: "Eólica", value: countryData["wind-generation"], share: countryData["share-electricity-wind"] },
      { name: "Solar", value: countryData["solar-energy-consumption"], share: countryData["share-electricity-solar"] },
      {
        name: "Hidroeléctrica",
        value: countryData["hydropower-consumption"],
        share: countryData["share-electricity-hydro"],
      },
      { name: "Biocombustibles", value: countryData["biofuel-production"], share: 0 },
      { name: "Geotérmica", value: countryData["installed-geothermal-capacity"], share: 0 },
    ]

    const totalRenewableProduction = renewableSources.reduce((sum, source) => sum + source.value, 0)
    const renewablePercentage = countryData["share-electricity-renewables"]
    const renewableConsumption = (consumptionValue * renewablePercentage) / 100

    // Calcular desglose por fuente
    const breakdown = renewableSources
      .map((source) => ({
        source: source.name,
        percentage: source.share || (source.value / totalRenewableProduction) * renewablePercentage,
        consumption:
          (consumptionValue * (source.share || (source.value / totalRenewableProduction) * renewablePercentage)) / 100,
      }))
      .filter((item) => item.percentage > 0)

    setResult({
      renewablePercentage,
      renewableConsumption,
      totalRenewableProduction,
      breakdown,
    })
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="text-6xl mb-4">🧮</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Calculadora no disponible</h3>
          <p className="text-gray-500">Carga datos desde la pestaña "Cargar Datos" para usar la calculadora</p>
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
                <li>• El cálculo se basa en el mix energético nacional</li>
                <li>• Obtienes el desglose por fuente renovable</li>
              </ul>

              <div className="mt-4 p-3 bg-white rounded border-l-4 border-blue-500">
                <p className="text-xs text-gray-600">
                  <strong>Nota:</strong> Los cálculos son estimaciones basadas en datos históricos del mix energético
                  nacional. El consumo real puede variar según la región y proveedor.
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
                        <span className="font-bold text-gray-700">
                          {(Number.parseFloat(consumption) - result.renewableConsumption).toFixed(1)} kWh
                        </span>
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

              {/* Desglose por fuente */}
              <Card>
                <CardHeader>
                  <CardTitle>Desglose por Fuente Renovable</CardTitle>
                  <CardDescription>Distribución de tu consumo renovable por tipo de fuente</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.breakdown.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-4 h-4 rounded-full ${
                              item.source === "Solar"
                                ? "bg-yellow-500"
                                : item.source === "Eólica"
                                  ? "bg-blue-500"
                                  : item.source === "Hidroeléctrica"
                                    ? "bg-cyan-500"
                                    : item.source === "Biocombustibles"
                                      ? "bg-green-600"
                                      : "bg-orange-500"
                            }`}
                          ></div>
                          <span className="font-medium">{item.source}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{item.consumption.toFixed(1)} kWh</div>
                          <div className="text-sm text-gray-600">{item.percentage.toFixed(1)}%</div>
                        </div>
                      </div>
                    ))}
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
