"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { RenewableEnergyData } from "../types/energy"

interface DataUploaderProps {
  onDataLoad: (data: RenewableEnergyData[]) => void
}

export default function DataUploader({ onDataLoad }: DataUploaderProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Datos de ejemplo para demostración
  const generateSampleData = useCallback((): RenewableEnergyData[] => {
    const countries = ["España", "Alemania", "Estados Unidos", "China", "Brasil"]
    const data: RenewableEnergyData[] = []

    for (let year = 2018; year <= 2022; year++) {
      countries.forEach((country) => {
        data.push({
          year,
          country,
          "wind-generation": Math.random() * 100 + 50,
          "solar-energy-consumption": Math.random() * 80 + 30,
          "hydropower-consumption": Math.random() * 120 + 60,
          "biofuel-production": Math.random() * 40 + 10,
          "installed-geothermal-capacity": Math.random() * 20 + 5,
          "share-electricity-renewables": Math.random() * 60 + 20,
          "share-electricity-wind": Math.random() * 25 + 5,
          "share-electricity-solar": Math.random() * 15 + 3,
          "share-electricity-hydro": Math.random() * 30 + 10,
          "cumulative-installed-wind-energy-capacity-gigawatts": Math.random() * 200 + 100,
          "installed-solar-PV-capacity": Math.random() * 150 + 75,
          "modern-renewable-energy-consumption": Math.random() * 300 + 150,
          "conventional-energy-consumption": Math.random() * 500 + 250,
        })
      })
    }

    return data
  }, [])

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      setIsLoading(true)
      setMessage(null)

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string
          let parsedData: RenewableEnergyData[]

          if (file.type === "application/json") {
            parsedData = JSON.parse(content)
          } else {
            // Simulamos parsing de CSV - en producción usarías papaparse
            const lines = content.split("\n")
            const headers = lines[0].split(",")
            parsedData = lines
              .slice(1)
              .map((line) => {
                const values = line.split(",")
                const obj: any = {}
                headers.forEach((header, index) => {
                  obj[header.trim()] = isNaN(Number(values[index])) ? values[index] : Number(values[index])
                })
                return obj
              })
              .filter((item) => item.year) // Filtrar filas vacías
          }

          onDataLoad(parsedData)
          setMessage({ type: "success", text: `Datos cargados exitosamente: ${parsedData.length} registros` })
        } catch (error) {
          setMessage({ type: "error", text: "Error al procesar el archivo. Verifica el formato." })
        } finally {
          setIsLoading(false)
        }
      }

      reader.readAsText(file)
    },
    [onDataLoad],
  )

  const loadSampleData = useCallback(() => {
    setIsLoading(true)
    setMessage(null)

    // Simular carga asíncrona
    setTimeout(() => {
      const sampleData = generateSampleData()
      onDataLoad(sampleData)
      setMessage({ type: "success", text: `Datos de ejemplo cargados: ${sampleData.length} registros` })
      setIsLoading(false)
    }, 1000)
  }, [generateSampleData, onDataLoad])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>📁</span>
            <span>Cargar Datos de Energía Renovable</span>
          </CardTitle>
          <CardDescription>
            Sube un archivo CSV o JSON con datos históricos de energía renovable (1965-2022)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors">
            <div className="space-y-4">
              <div className="text-4xl">📊</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Arrastra tu archivo aquí</h3>
                <p className="text-gray-500">o haz clic para seleccionar</p>
              </div>
              <input
                type="file"
                accept=".csv,.json"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                disabled={isLoading}
              />
              <label htmlFor="file-upload">
                <Button asChild disabled={isLoading}>
                  <span className="cursor-pointer">{isLoading ? "Procesando..." : "Seleccionar Archivo"}</span>
                </Button>
              </label>
            </div>
          </div>

          {/* Sample Data */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">¿No tienes datos? Prueba con nuestro conjunto de ejemplo</p>
            <Button
              variant="outline"
              onClick={loadSampleData}
              disabled={isLoading}
              className="border-green-500 text-green-600 hover:bg-green-50"
            >
              {isLoading ? "Cargando..." : "Cargar Datos de Ejemplo"}
            </Button>
          </div>

          {/* Message */}
          {message && (
            <Alert className={message.type === "success" ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}>
              <AlertDescription className={message.type === "success" ? "text-green-700" : "text-red-700"}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          {/* Format Info */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg text-blue-800">Formato de Datos Esperado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-blue-700 space-y-2">
                <p>
                  <strong>Campos requeridos:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>year (año)</li>
                  <li>country (país)</li>
                  <li>wind-generation (generación eólica)</li>
                  <li>solar-energy-consumption (consumo energía solar)</li>
                  <li>hydropower-consumption (consumo hidroeléctrico)</li>
                  <li>share-electricity-renewables (% electricidad renovable)</li>
                  <li>installed-solar-PV-capacity (capacidad solar instalada)</li>
                </ul>
                <p className="mt-3">
                  <strong>Formatos soportados:</strong> CSV, JSON
                </p>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}
