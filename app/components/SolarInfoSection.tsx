"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SolarInfoSection() {
  const [downloadStatus, setDownloadStatus] = useState<"idle" | "downloading" | "success" | "error">("idle")

  const benefits = [
    { title: "Energía Limpia", description: "No produce emisiones de CO2 durante su operación", icon: "🌱" },
    { title: "Renovable", description: "Fuente inagotable de energía del sol", icon: "♻️" },
    { title: "Bajo Mantenimiento", description: "Costos operativos mínimos una vez instalada", icon: "🔧" },
    { title: "Escalable", description: "Desde instalaciones residenciales hasta plantas industriales", icon: "📈" },
  ]

  const comparisons = [
    { source: "Solar", efficiency: "20-22%", cost: "Bajo", emissions: "0 kg CO2/MWh", color: "bg-yellow-500" },
    { source: "Eólica", efficiency: "35-45%", cost: "Bajo", emissions: "11 kg CO2/MWh", color: "bg-blue-500" },
    { source: "Hidráulica", efficiency: "80-90%", cost: "Medio", emissions: "24 kg CO2/MWh", color: "bg-cyan-500" },
    { source: "Geotérmica", efficiency: "10-20%", cost: "Medio", emissions: "5 kg CO2/MWh", color: "bg-red-500" },
    { source: "Biomasa", efficiency: "20-25%", cost: "Alto", emissions: "120 kg CO2/MWh", color: "bg-green-500" },
  ]

  const energyBanners = [
    {
      key: "solar",
      title: "Energía Solar",
      description: "La fuente de energía más abundante del planeta",
      icon: "☀️",
      gradient: "from-yellow-400 via-orange-500 to-red-500",
      details: [
        "El Sol proporciona 10,000 veces más energía de la que consume la humanidad",
        "Crecimiento anual del 20% en capacidad instalada",
        "Presente en más de 100 países",
        "Reducción de costos del 90% en la última década",
      ],
      mainDescription:
        "La energía solar es la energía obtenida mediante la captación de la luz y el calor emitidos por el Sol. Esta energía se puede aprovechar mediante tecnologías como paneles fotovoltaicos y colectores solares térmicos.",
    },
    {
      key: "wind",
      title: "Energía Eólica",
      description: "Aprovechando el poder del viento para un futuro limpio",
      icon: "🌬️",
      gradient: "from-blue-400 via-cyan-500 to-blue-600",
      details: [
        "Una de las fuentes de energía renovable de más rápido crecimiento",
        "Reduce significativamente las emisiones de gases de efecto invernadero",
        "Las turbinas modernas son cada vez más eficientes y silenciosas",
        "Ideal para zonas costeras y llanuras con vientos constantes",
      ],
      mainDescription:
        "La energía eólica se genera a partir de la fuerza del viento, que mueve las palas de los aerogeneradores para producir electricidad. Es una fuente de energía limpia y sostenible, con un impacto ambiental mínimo.",
    },
    {
      key: "hydro",
      title: "Energía Hidroeléctrica",
      description: "El poder del agua en movimiento para generar electricidad",
      icon: "💧",
      gradient: "from-cyan-400 via-blue-500 to-indigo-600",
      details: [
        "Fuente de energía renovable más utilizada a nivel mundial",
        "Proporciona una generación de energía constante y predecible",
        "Contribuye al control de inundaciones y suministro de agua",
        "Grandes proyectos pueden tener impactos ambientales y sociales",
      ],
      mainDescription:
        "La energía hidroeléctrica utiliza la fuerza del agua que cae o fluye para hacer girar turbinas conectadas a generadores. Es una fuente de energía renovable madura y confiable, fundamental en el mix energético de muchos países.",
    },
    {
      key: "geothermal",
      title: "Energía Geotérmica",
      description: "Calor de la Tierra para energía sostenible",
      icon: "🌋",
      gradient: "from-red-400 via-orange-500 to-red-600",
      details: [
        "Aprovecha el calor interno de la Tierra",
        "Fuente de energía base, disponible 24/7",
        "Bajas emisiones de carbono durante la operación",
        "Requiere ubicaciones geográficas específicas con actividad geotérmica",
      ],
      mainDescription:
        "La energía geotérmica es el calor que se genera y almacena en el interior de la Tierra. Se utiliza para generar electricidad o para calefacción y refrigeración directa, siendo una fuente de energía constante e independiente de las condiciones climáticas.",
    },
    {
      key: "biofuel",
      title: "Bioenergía",
      description: "Energía de la biomasa para un futuro más verde",
      icon: "🌿",
      gradient: "from-green-400 via-lime-500 to-green-600",
      details: [
        "Producida a partir de materia orgánica (biomasa)",
        "Puede ser utilizada para electricidad, calor o combustibles líquidos",
        "Contribuye a la gestión de residuos y reducción de la dependencia de fósiles",
        "La sostenibilidad depende de las prácticas de cultivo y recolección",
      ],
      mainDescription:
        "La bioenergía se obtiene de la biomasa, que incluye residuos agrícolas, forestales, cultivos energéticos y desechos orgánicos. Se puede convertir en electricidad, calor o biocombustibles, ofreciendo una alternativa renovable a los combustibles fósiles.",
    },
  ]

  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)
  const autoplayIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const resetAutoplay = useCallback(() => {
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current)
    }
    autoplayIntervalRef.current = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % energyBanners.length)
    }, 10000)
  }, [energyBanners.length])

  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const isDragging = useRef(false)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    isDragging.current = false
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) {
      const deltaX = Math.abs(e.touches[0].clientX - touchStartX.current)
      const deltaY = Math.abs(e.touches[0].clientY - touchStartY.current)

      // Si el movimiento horizontal es mayor que el vertical, es un swipe horizontal
      if (deltaX > deltaY && deltaX > 10) {
        isDragging.current = true
        // Prevenir el scroll de la página
        e.preventDefault()
      }
    } else {
      // Prevenir el scroll mientras se hace swipe
      e.preventDefault()
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging.current) return

    const touchEndX = e.changedTouches[0].clientX
    const deltaX = touchEndX - touchStartX.current
    const swipeThreshold = 50 // Minimum swipe distance in pixels

    if (Math.abs(deltaX) > swipeThreshold) {
      if (deltaX > 0) {
        // Swiped right (previous banner)
        setCurrentBannerIndex((prevIndex) => (prevIndex - 1 + energyBanners.length) % energyBanners.length)
      } else {
        // Swiped left (next banner)
        setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % energyBanners.length)
      }
      resetAutoplay()
    }

    isDragging.current = false
  }

  // For trackpad/mouse drag simulation
  const handleMouseDown = (e: React.MouseEvent) => {
    touchStartX.current = e.clientX
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    const mouseEndX = e.clientX
    const deltaX = mouseEndX - touchStartX.current
    const dragThreshold = 50 // Minimum drag distance in pixels

    if (deltaX > dragThreshold) {
      setCurrentBannerIndex((prevIndex) => (prevIndex - 1 + energyBanners.length) % energyBanners.length)
      resetAutoplay()
    } else if (deltaX < -dragThreshold) {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % energyBanners.length)
      resetAutoplay()
    }
  }

  useEffect(() => {
    resetAutoplay()

    // Keyboard navigation
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        setCurrentBannerIndex((prevIndex) => (prevIndex - 1 + energyBanners.length) % energyBanners.length)
        resetAutoplay() // Reset autoplay on manual interaction
      } else if (event.key === "ArrowRight") {
        setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % energyBanners.length)
        resetAutoplay() // Reset autoplay on manual interaction
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      if (autoplayIntervalRef.current) {
        clearInterval(autoplayIntervalRef.current)
      }
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [resetAutoplay])

  // Función para manejar la descarga del PDF
  const handleDownloadDocumentation = () => {
    setDownloadStatus("downloading")

    setTimeout(() => {
      try {
        const link = document.createElement("a")
        link.href = "/docs/PROYECTO_FINAL_DE_PROGRAMACIÓN_DOCUMENTACION.pdf"
        link.download = "Documento-NeoWatts-Energia-Renovable.pdf"
        link.target = "_blank"

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        setDownloadStatus("success")
        setTimeout(() => setDownloadStatus("idle"), 3000)
      } catch (error) {
        setDownloadStatus("error")
        setTimeout(() => setDownloadStatus("idle"), 3000)
      }
    }, 1500)
  }

  const currentBanner = energyBanners[currentBannerIndex]

  return (
    <div className="space-y-8">
      {/* About Us Section */}
      <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-3 text-2xl md:text-3xl font-bold">
            <span className="text-3xl md:text-4xl">ℹ️</span>
            <span>Sobre Nosotros</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-base md:text-lg leading-relaxed text-blue-100">
            En <strong className="font-semibold text-white">NeoWatts</strong> somos un equipo comprometido con el
            desarrollo y la promoción de energías renovables como la solar, eólica e hidroeléctrica. Buscamos soluciones
            sostenibles e innovadoras para un futuro más limpio.
          </p>
          <p className="mt-4 text-sm md:text-base text-blue-200 font-medium">
            Nuestro grupo está conformado por:{" "}
            <span className="font-bold text-white">
              Juan Camilo Gonzales, Juan Esteban Galvis, Manuela López, Stefany Restrepo
            </span>{" "}
            y <span className="font-bold text-white">Mathius Lozano</span>, (Informacion sacada de los archivos dados y informacion consultada
            de: <a href="https://datos.bancomundial.org/indicador/EG.ELC.RNEW.ZS">Energía renovable (<u>Banco Mundial</u>)</a>
            <a href="https://www.mapfreglobalrisks.com/gerencia-riesgos-seguros/articulos/energias-renovables-tendencias-en-latinoamerica/">
              {" "}
              - <u>Tendencias en Latinoamérica (Energias renovables)</u>
            </a> <a href="https://github.com/MT1504-COFFEE/NeoWatts"><u>GITHUB NeoWatts</u></a>
            ).
          </p>
        </CardContent>
      </Card>

      {/* Documentación del Código */}
      <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white-800">
            <span className="text-xl md:text-2xl">📚</span>
            <span className="text-lg md:text-xl">Documentación del Código</span>
          </CardTitle>
          <CardDescription className="text-white-600 text-sm md:text-base">
            Descarga la documentación técnica completa del Dashboard de Energía Renovable
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          <Card
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
              downloadStatus === "downloading"
                ? "border-blue-500 bg-blue-50"
                : downloadStatus === "success"
                  ? "border-green-500 bg-green-50"
                  : downloadStatus === "error"
                    ? "border-red-500 bg-red-50"
                    : "border-green-300 hover:border-green-500 bg-white"
            }`}
            onClick={downloadStatus === "idle" ? handleDownloadDocumentation : undefined}
          >
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
                <div className="flex items-start space-x-3 md:space-x-4 flex-1">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-12 h-12 md:w-16 md:h-16 rounded-lg flex items-center justify-center ${
                        downloadStatus === "downloading"
                          ? "bg-blue-100 text-blue-600"
                          : downloadStatus === "success"
                            ? "bg-green-100 text-green-600"
                            : downloadStatus === "error"
                              ? "bg-red-100 text-red-600"
                              : "bg-green-100 text-green-600"
                      }`}
                    >
                      {downloadStatus === "downloading" ? (
                        <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-blue-600"></div>
                      ) : downloadStatus === "success" ? (
                        <span className="text-2xl md:text-3xl">✅</span>
                      ) : downloadStatus === "error" ? (
                        <span className="text-2xl md:text-3xl">❌</span>
                      ) : (
                        <span className="text-2xl md:text-3xl">📄</span>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Documentación Técnica Completa</h3>
                    <p className="text-sm md:text-base text-gray-600 mb-3">
                      Guía del código fuente, componentes y funcionalidades del dashboard
                    </p>
                    <div className="flex flex-wrap items-center gap-2 md:gap-4">
                      <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                        PDF
                      </Badge>
                      <span className="text-xs text-gray-500">~771 KB</span>
                      <span className="text-xs text-gray-500">8 páginas</span>
                      <Badge className="text-xs bg-green-100 text-green-800">Técnico</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 w-full md:w-auto md:ml-4">
                  {downloadStatus === "idle" && (
                    <Button className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white">
                      <span className="mr-2">📥</span>
                      Descargar PDF
                    </Button>
                  )}
                  {downloadStatus === "downloading" && (
                    <Button disabled className="w-full md:w-auto bg-blue-500 text-white">
                      <span className="mr-2">⏳</span>
                      Preparando...
                    </Button>
                  )}
                  {downloadStatus === "success" && (
                    <Button disabled className="w-full md:w-auto bg-green-500 text-white">
                      <span className="mr-2">✅</span>
                      Descargado
                    </Button>
                  )}
                  {downloadStatus === "error" && (
                    <Button
                      onClick={handleDownloadDocumentation}
                      className="w-full md:w-auto bg-red-500 hover:bg-red-600 text-white"
                    >
                      <span className="mr-2">🔄</span>
                      Reintentar
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {downloadStatus === "success" && (
            <Alert className="border-green-500 bg-green-50">
              <AlertDescription className="text-green-700">
                ✅ <strong>Descarga exitosa:</strong> La documentación se ha descargado correctamente. Revisa tu carpeta
                de descargas.
              </AlertDescription>
            </Alert>
          )}

          {downloadStatus === "error" && (
            <Alert className="border-red-500 bg-red-50">
              <AlertDescription className="text-red-700">
                ❌ <strong>Error en la descarga:</strong> No se pudo descargar el archivo. Verifica tu conexión e
                intenta nuevamente.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Hero Section - Dynamic Banner */}
      <div
        className={`relative bg-gradient-to-r ${currentBanner.gradient} rounded-xl md:rounded-2xl p-4 md:p-8 text-white overflow-hidden transition-all duration-1500 ease-in-out`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        style={{ cursor: "grab" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div key={currentBanner.key} className="relative z-10 transition-opacity duration-700 ease-in-out">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-2xl md:text-4xl">{currentBanner.icon}</span>
            </div>
            <div>
              <h2 className="text-2xl md:text-4xl font-bold mb-2">{currentBanner.title}</h2>
              <p className="text-lg md:text-xl opacity-90">{currentBanner.description}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <h3 className="text-xl md:text-2xl font-semibold mb-3">
                ¿Qué es la {currentBanner.title.replace("Energía ", "")}?
              </h3>
              <p className="text-base md:text-lg leading-relaxed opacity-95">{currentBanner.mainDescription}</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-3 md:p-4">
              <h4 className="text-base md:text-lg font-semibold mb-2">Datos Clave</h4>
              <ul className="space-y-1 md:space-y-2 text-sm md:text-base">
                {currentBanner.details.map((detail, index) => (
                  <li key={index}>• {detail}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {/* Navigation indicators */}
        <div className="flex justify-center space-x-2 mt-6">
          {energyBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentBannerIndex(index)
                resetAutoplay()
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentBannerIndex ? "bg-white" : "bg-white bg-opacity-50"
              }`}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>

        {/* Keyboard navigation hint */}
        <div className="text-center mt-4 opacity-75">
          <p className="text-xs md:text-sm">Usa las flechas del teclado ← → para navegar | Desliza en móvil</p>
        </div>
      </div>

      {/* Benefits Section */}
      <div>
        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6 text-center">
          Beneficios de las energías renovables
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-green-500">
              <CardHeader className="text-center p-4 md:p-6">
                <div className="text-3xl md:text-4xl mb-2">{benefit.icon}</div>
                <CardTitle className="text-base md:text-lg">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0">
                <p className="text-sm md:text-base text-gray-600 text-center">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Comparison Section */}
      <div>
        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6 text-center">
          Comparación de Fuentes Energéticas
        </h3>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Análisis Comparativo</CardTitle>
            <CardDescription className="text-sm md:text-base">
              Comparación entre diferentes fuentes de energía
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 md:px-4 text-sm md:text-base">Fuente</th>
                    <th className="text-left py-3 px-2 md:px-4 text-sm md:text-base">Eficiencia</th>
                    <th className="text-left py-3 px-2 md:px-4 text-sm md:text-base">Costo</th>
                    <th className="text-left py-3 px-2 md:px-4 text-sm md:text-base">Emisiones CO2</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2 md:px-4">
                        <div className="flex items-center space-x-2 md:space-x-3">
                          <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full ${item.color}`}></div>
                          <span className="font-medium text-sm md:text-base">{item.source}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 md:px-4 text-sm md:text-base">{item.efficiency}</td>
                      <td className="py-3 px-2 md:px-4">
                        <Badge
                          variant={
                            item.cost === "Bajo" ? "default" : item.cost === "Medio" ? "secondary" : "destructive"
                          }
                          className="text-xs"
                        >
                          {item.cost}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 md:px-4 text-sm md:text-base">
                        <span
                          className={
                            item.emissions === "0 kg CO2/MWh" ? "text-green-600 font-semibold" : "text-gray-600"
                          }
                        >
                          {item.emissions}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technology Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg md:text-xl">
              <span>🔋</span>
              <span>Tecnología Fotovoltaica</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4 text-sm md:text-base">
              Los paneles solares fotovoltaicos convierten directamente la luz solar en electricidad mediante el efecto
              fotoeléctrico en células de silicio.
            </p>
            <ul className="space-y-2 text-sm">
              <li>• Eficiencia: 15-22% (comercial)</li>
              <li>• Vida útil: 25-30 años</li>
              <li>• Mantenimiento mínimo</li>
              <li>• Instalación modular</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg md:text-xl">
              <span>🌡️</span>
              <span>Tecnología Térmica</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4 text-sm md:text-base">
              Los colectores solares térmicos capturan el calor del sol para calentar agua o generar vapor para turbinas
              eléctricas.
            </p>
            <ul className="space-y-2 text-sm">
              <li>• Eficiencia: 60-80% (térmica)</li>
              <li>• Ideal para calefacción</li>
              <li>• Almacenamiento térmico</li>
              <li>• Aplicaciones industriales</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
