"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function SolarInfoSection() {
  enum EnergyCost {
    Low = "Bajo",
    Medium = "Medio",
    High = "Alto",
  }

  type Energy = {
    source: string;
    efficiency: string;
    cost: EnergyCost;
    emissions: string;
    color: string;
  }
  const benefits = [
    { title: "Energía Limpia", description: "No produce emisiones de CO2 durante su operación", icon: "🌱" },
    { title: "Renovable", description: "Fuente inagotable de energía del sol", icon: "♻️" },
    { title: "Bajo Mantenimiento", description: "Costos operativos mínimos una vez instalada", icon: "🔧" },
    { title: "Escalable", description: "Desde instalaciones residenciales hasta plantas industriales", icon: "📈" },
  ]

  const comparisons: Energy[] = [
    { source: "Solar", efficiency: "20-22%", cost: EnergyCost.Low, emissions: "0 kg CO2/MWh", color: "bg-yellow-500" },
    { source: "Eólica", efficiency: "35-45%", cost: EnergyCost.Low, emissions: "11 kg CO2/MWh", color: "bg-blue-500" },
    { source: "Hidráulica", efficiency: "80-90%", cost: EnergyCost.Medium, emissions: "24 kg CO2/MWh", color: "bg-cyan-500" },
    { source: "Geotérmica", efficiency: "10-20%", cost: EnergyCost.Medium, emissions: "5 kg CO2/MWh", color: "bg-red-500" },
    { source: "Biomasa", efficiency: "20-25%", cost: EnergyCost.High, emissions: "120 kg CO2/MWh", color: "bg-green-500" },
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
  const touchStartX = useRef(0)

  const resetAutoplay = useCallback(() => {
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current)
    }
    autoplayIntervalRef.current = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % energyBanners.length)
    }, 5000) // Cambia cada 5 segundos
  }, [energyBanners.length])

  useEffect(() => {
    resetAutoplay() // Start autoplay on mount

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
  }, [energyBanners.length, resetAutoplay])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX
    const deltaX = touchEndX - touchStartX.current
    const swipeThreshold = 50 // Minimum swipe distance in pixels

    if (deltaX > swipeThreshold) {
      // Swiped right (previous banner)
      setCurrentBannerIndex((prevIndex) => (prevIndex - 1 + energyBanners.length) % energyBanners.length)
      resetAutoplay()
    } else if (deltaX < -swipeThreshold) {
      // Swiped left (next banner)
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % energyBanners.length)
      resetAutoplay()
    }
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

  const currentBanner = energyBanners[currentBannerIndex]

  return (
    <div className="space-y-8">
      {/* About Us Section - Enhanced */}
      <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-3 text-3xl font-bold">
            <img src="/favicon.png" alt="NeoWatts Logo" className="h-12 w-12 rounded-full" />
            <span>Sobre Nosotros</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-lg leading-relaxed text-blue-100 text-shadow-sm">
            En <strong className="font-semibold text-white">NeoWatts</strong> somos un equipo comprometido con el
            desarrollo y la promoción de energías renovables como la solar, eólica e hidroeléctrica. Buscamos soluciones
            sostenibles e innovadoras para un futuro más limpio.
          </p>
          <p className="mt-4 text-base text-blue-200 font-medium">
            Nuestro grupo está conformado por:{" "}
            <span className="font-bold text-white">Juan Camilo Gonzales, Juan Esteban Galvis, Manuela López, Stefany Restrepo</span> y{" "}
            <span className="font-bold text-white">Mathius Lozano</span>, unidos por conocer más sobre energías renovables y dar a 
            conocer su potencial (Informacion sacada de los archivos dados y informacion consultada de: - ).
          </p>
        </CardContent>
      </Card>

    
      <div
        className={`relative bg-gradient-to-r ${currentBanner.gradient} rounded-2xl p-8 text-white overflow-hidden transition-all duration-1500 ease-in-out`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        style={{ cursor: "grab" }} 
      >
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div key={currentBanner.key} className="relative z-10 transition-opacity duration-700 ease-in-out">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-4xl">{currentBanner.icon}</span>
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-2">{currentBanner.title}</h2>
              <p className="text-xl opacity-90">{currentBanner.description}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-2xl font-semibold mb-3">¿Qué es la {currentBanner.title.replace("Energía ", "")}?</h3>
              <p className="text-lg leading-relaxed opacity-95">{currentBanner.mainDescription}</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <h4 className="text-lg font-semibold mb-2">Datos Clave</h4>
              <ul className="space-y-2">
                {currentBanner.details.map((detail, index) => (
                  <li key={index}>• {detail}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      
      </div>

      {/* Benefits Section */}
      <div>
        <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">Beneficios de las energías renovables</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-green-500">
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">{benefit.icon}</div>
                <CardTitle className="text-lg">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Comparison Section */}
      <div>
        <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">Comparación de Fuentes Energéticas</h3>
        <Card>
          <CardHeader>
            <CardTitle>Análisis Comparativo</CardTitle>
            <CardDescription>Comparación entre diferentes fuentes de energía</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Fuente</th>
                    <th className="text-left py-3 px-4">Eficiencia</th>
                    <th className="text-left py-3 px-4">Costo</th>
                    <th className="text-left py-3 px-4">Emisiones CO2</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                          <span className="font-medium">{item.source}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{item.efficiency}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            item.cost === EnergyCost.Low ?  "destructive" : "secondary"}
                        >
                          {item.cost}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
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
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🔋</span>
              <span>Tecnología Fotovoltaica</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
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
            <CardTitle className="flex items-center space-x-2">
              <span>🌡️</span>
              <span>Tecnología Térmica</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
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
