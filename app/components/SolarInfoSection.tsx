"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import CarruselEnergias from '../data/CarruselEnergias'


export default function SolarInfoSection() {
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
    { source: "Carbón", efficiency: "33-40%", cost: "Medio", emissions: "820 kg CO2/MWh", color: "bg-gray-700" },
    { source: "Gas Natural", efficiency: "50-60%", cost: "Medio", emissions: "490 kg CO2/MWh", color: "bg-orange-500" },
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl p-8 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 2L13.09 8.26L20 9L15 14.74L16.18 21.02L10 17.77L3.82 21.02L5 14.74L0 9L6.91 8.26L10 2Z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-2">Energía Solar</h2>
              <p className="text-xl opacity-90">La fuente de energía más abundante del planeta</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-2xl font-semibold mb-3">¿Qué es la Energía Solar?</h3>
              <p className="text-lg leading-relaxed opacity-95">
                La energía solar es la energía obtenida mediante la captación de la luz y el calor emitidos por el Sol.
                Esta energía se puede aprovechar mediante tecnologías como paneles fotovoltaicos y colectores solares
                térmicos.
              </p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <h4 className="text-lg font-semibold mb-2">Datos Clave</h4>
              <ul className="space-y-2">
                <li>☀️ El Sol proporciona 10,000 veces más energía de la que consume la humanidad</li>
                <li>📊 Crecimiento anual del 20% en capacidad instalada</li>
                <li>🌍 Presente en más de 100 países</li>
                <li>💰 Reducción de costos del 90% en la última década</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
     {/* Carrusel de energías renovables */}
      <CarruselEnergias />
      
      {/* Benefits Section */}
      <div>
        <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">Beneficios de la Energía Solar</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-yellow-500">
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
                            item.cost === "Bajo" ? "default" : item.cost === "Medio" ? "secondary" : "destructive"
                          }
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
