"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { predefinedFiles, loadCSVFile } from "../data/datasets"
import type { RenewableEnergyData } from "../types/energy"

interface DataUploaderProps {
  onDataLoad: (data: RenewableEnergyData[]) => void
}

export default function DataUploader({ onDataLoad }: DataUploaderProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [loadingProgress, setLoadingProgress] = useState(0)

  const loadPredefinedFile = useCallback(
    async (fileId: string) => {
      setIsLoading(true)
      setMessage(null)
      setSelectedFile(fileId)
      setLoadingProgress(0)

      try {
        // Simular progreso de carga
        const progressInterval = setInterval(() => {
          setLoadingProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval)
              return 90
            }
            return prev + 10
          })
        }, 200)

        const data = await loadCSVFile(fileId)

        clearInterval(progressInterval)
        setLoadingProgress(100)

        const file = predefinedFiles.find((f) => f.id === fileId)
        onDataLoad(data)

        setMessage({
          type: "success",
          text: `Archivo "${file?.name}" cargado exitosamente: ${data.length} registros procesados`,
        })
      } catch (error) {
        setMessage({
          type: "error",
          text: `Error al cargar el archivo: ${error instanceof Error ? error.message : "Error desconocido"}`,
        })
      } finally {
        setIsLoading(false)
        setLoadingProgress(0)
      }
    },
    [onDataLoad],
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>📁</span>
            <span>Datasets de Energía Renovable</span>
          </CardTitle>
          <CardDescription>Selecciona uno de los conjuntos de datos reales para comenzar el análisis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Lista de archivos predefinidos */}
          <div className="grid gap-4">
            {predefinedFiles.map((file) => (
              <Card
                key={file.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${
                  selectedFile === file.id ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-green-300"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => !isLoading && loadPredefinedFile(file.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-100 text-blue-600">
                          📊
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{file.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{file.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {file.type}
                          </Badge>
                          <span className="text-xs text-gray-500">{file.size}</span>
                          <span className="text-xs text-gray-500">{file.records.toLocaleString()} registros</span>
                        </div>
                        {/* Schema preview */}
                        <div className="mt-2">
                          <p className="text-xs text-gray-500">
                            <strong>Campos:</strong> {file.schema.slice(0, 3).join(", ")}
                            {file.schema.length > 3 && "..."}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {selectedFile === file.id ? (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Loading state con progreso */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
                <span className="text-gray-600">Cargando y procesando datos...</span>
              </div>
              {/* Barra de progreso */}
              <div className="w-full max-w-md">
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${loadingProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1 text-center">{loadingProgress}% completado</p>
              </div>
            </div>
          )}

          {/* Message */}
          {message && (
            <Alert className={message.type === "success" ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}>
              <AlertDescription className={message.type === "success" ? "text-green-700" : "text-red-700"}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          {/* Información de los datasets */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg text-blue-800">📋 Información de los Datasets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-blue-700 space-y-3">
                <div>
                  <strong>Participación Solar LATAM:</strong>
                  <p>
                    Datos históricos del porcentaje de energía solar en el mix energético de países latinoamericanos.
                    Incluye más de 8,500 registros con datos desde 1965 hasta 2022.
                  </p>
                </div>
                <div>
                  <strong>Producción Renovable LATAM:</strong>
                  <p>
                    Producción de electricidad por fuente renovable (eólica, hidroeléctrica, solar, bioenergía) en
                    países de América Latina. Más de 8,200 registros históricos.
                  </p>
                </div>
                <div className="mt-4 p-3 bg-white rounded border-l-4 border-blue-500">
                  <p className="text-xs text-gray-600">
                    <strong>Nota:</strong> Los datos se procesan automáticamente y se convierten al formato estándar
                    para su análisis en la calculadora y dashboard.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}
