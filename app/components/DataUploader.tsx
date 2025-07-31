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
          text: `Archivo "${file?.name}" cargado exitosamente: ${data.length} registros procesados correctamente`,
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
    <div className="space-y-4 md:space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-lg md:text-xl">
            <span className="text-xl md:text-2xl">📁</span>
            <span>Datasets de Energía Renovable</span>
          </CardTitle>
          <CardDescription className="text-sm md:text-base">
            Selecciona uno de los conjuntos de datos reales para comenzar el análisis, estos archivos se mostraran en el apartado Tabla de Datos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          {/* Lista de archivos predefinidos - COMPLETAMENTE RESPONSIVA */}
          <div className="space-y-3 md:space-y-4">
            {predefinedFiles.map((file) => (
              <Card
                key={file.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${
                  selectedFile === file.id ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-green-300"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => !isLoading && loadPredefinedFile(file.id)}
              >
                <CardContent className="p-3 md:p-4">
                  {/* Layout móvil optimizado */}
                  <div className="space-y-3">
                    {/* Header con icono y título */}
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center bg-blue-100 text-blue-600">
                          {file.id === "latam-renewable-production" ? (
                            <span className="text-lg md:text-xl">✅</span>
                          ) : (
                            <span className="text-lg md:text-xl">📊</span>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 leading-tight">{file.name}</h3>
                        {/* Indicador especial para calculadora */}
                        {file.id === "latam-renewable-production" && (
                          <Badge className="text-xs bg-green-100 text-green-800 mt-1">Para Calculadora</Badge>
                        )}
                      </div>
                      {/* Checkbox de selección */}
                      <div className="flex-shrink-0">
                        {selectedFile === file.id ? (
                          <div className="w-5 h-5 md:w-6 md:h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        ) : (
                          <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-gray-300 rounded-full"></div>
                        )}
                      </div>
                    </div>

                    {/* Descripción */}
                    <p className="text-xs md:text-sm text-gray-600 leading-relaxed pl-13 md:pl-15">
                      {file.description}
                    </p>

                    {/* Metadatos en grid responsivo */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pl-13 md:pl-15">
                      <div className="flex items-center space-x-1">
                        <Badge variant="outline" className="text-[10px] md:text-xs px-1.5 py-0.5">
                          {file.type}
                        </Badge>
                      </div>
                      <div className="text-[10px] md:text-xs text-gray-500">{file.size}</div>
                      <div className="text-[10px] md:text-xs text-gray-500 col-span-2 md:col-span-1">
                        {file.records.toLocaleString()} registros
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <p className="text-[10px] md:text-xs text-gray-500 truncate">
                          <strong>Campos:</strong> {file.schema.slice(0, 2).join(", ")}
                          {file.schema.length > 2 && "..."}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Loading state con progreso - RESPONSIVO */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-6 md:py-8 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 md:h-6 md:w-6 border-b-2 border-green-500"></div>
                <span className="text-sm md:text-base text-gray-600">Cargando y procesando datos...</span>
              </div>
              <div className="w-full max-w-xs md:max-w-md">
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

          {/* Message - RESPONSIVO */}
          {message && (
            <Alert className={message.type === "success" ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}>
              <AlertDescription
                className={`text-sm md:text-base ${message.type === "success" ? "text-green-700" : "text-red-700"}`}
              >
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          {/* Información de los datasets - COMPLETAMENTE RESPONSIVA */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base md:text-lg text-blue-800 flex items-center space-x-2">
                <span>📋</span>
                <span>Información de los Datasets</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              {/* Alerta principal */}
              <div className="bg-green-100 border-l-4 border-green-500 p-3 rounded">
                <p className="font-semibold text-green-800 text-sm md:text-base mb-1">✅ Para la Calculadora:</p>
                <p className="text-green-700 text-xs md:text-sm leading-relaxed">
                  Solo el dataset <strong>"Producción Renovable América Latina"</strong> funciona con la calculadora
                  porque es el único que contiene porcentajes reales del mix energético nacional.
                </p>
              </div>

              

              {/* Descripciones detalladas - Colapsables en móvil */}
              <div className="space-y-2 md:space-y-3">
                <details className="group">
                  <summary className="cursor-pointer text-sm md:text-base font-semibold text-blue-800 hover:text-blue-900">
                    📊 Ver detalles de cada dataset
                  </summary>
                  <div className="mt-2 space-y-2 md:space-y-3 pl-4">
                    <div className="text-xs md:text-sm">
                      <strong className="text-gray-800">Producción Solar LATAM:</strong>
                      <p className="text-gray-600 mt-1">
                        Datos de producción solar en TWh por país y año. No contiene porcentajes del mix energético.
                      </p>
                    </div>

                    <div className="text-xs md:text-sm">
                      <strong className="text-green-800">✅ Producción Renovable LATAM:</strong>
                      <p className="text-green-700 mt-1">
                        <strong>ÚNICO dataset compatible con la calculadora.</strong> Contiene producción real de
                        múltiples fuentes renovables y puede calcular porcentajes precisos del mix energético nacional.
                      </p>
                    </div>

                    <div className="text-xs md:text-sm">
                      <strong className="text-gray-800">Producción Eólica LATAM:</strong>
                      <p className="text-gray-600 mt-1">
                        Datos de producción eólica en TWh por país y año. No contiene porcentajes del mix energético.
                      </p>
                    </div>

                    <div className="text-xs md:text-sm">
                      <strong className="text-gray-800">Producción Hidroeléctrica LATAM:</strong>
                      <p className="text-gray-600 mt-1">
                        Datos de producción hidroeléctrica en TWh por país y año. No contiene porcentajes del mix
                        energético.
                      </p>
                    </div>

                    <div className="text-xs md:text-sm">
                      <strong className="text-gray-800">Producción Total Renovable LATAM:</strong>
                      <p className="text-gray-600 mt-1">
                        Datos de producción total renovable en TWh (suma de todas las fuentes). No contiene porcentajes.
                      </p>
                    </div>
                  </div>
                </details>
              </div>

              {/* Recomendación final */}
              <div className="mt-3 md:mt-4 p-2 md:p-3 bg-white rounded border-l-4 border-blue-500">
                <p className="text-xs md:text-sm text-gray-600">
                  <strong>Recomendación:</strong> Para usar todas las funciones del dashboard incluyendo la calculadora,
                  utiliza el dataset <strong>"Producción Renovable América Latina"</strong> que es el más completo y el
                  único que permite cálculos precisos de porcentajes renovables.
                </p>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}
