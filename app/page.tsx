"use client"

import { useState } from "react"
import { Sun, Wind, Droplets, Leaf, Zap, Calculator, ArrowRight, Phone, Mail, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Bar,
  BarChart,
  Pie,
  PieChart,
  Line,
  LineChart,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Datos simulados para los gráficos
const produccionData = [
  { fuente: "Hidroeléctrica", produccion: 45.2, fill: "#0ea5e9" },
  { fuente: "Solar", produccion: 18.7, fill: "#f59e0b" },
  { fuente: "Eólica", produccion: 15.3, fill: "#10b981" },
  { fuente: "Biofuel", produccion: 12.1, fill: "#8b5cf6" },
  { fuente: "Geotérmica", produccion: 8.7, fill: "#ef4444" },
]

const participacionData = [
  { fuente: "Renovables", porcentaje: 68.5, fill: "#10b981" },
  { fuente: "Convencional", porcentaje: 31.5, fill: "#6b7280" },
]

const evolucionData = [
  { año: "2018", capacidad: 15.2 },
  { año: "2019", capacidad: 18.7 },
  { año: "2020", capacidad: 22.1 },
  { año: "2021", capacidad: 26.8 },
  { año: "2022", capacidad: 31.4 },
  { año: "2023", capacidad: 36.9 },
  { año: "2024", capacidad: 42.3 },
]

const consumoComparativoData = [
  { año: "2020", renovable: 22.1, convencional: 45.8 },
  { año: "2021", renovable: 26.8, convencional: 43.2 },
  { año: "2022", renovable: 31.4, convencional: 40.6 },
  { año: "2023", renovable: 36.9, convencional: 38.1 },
  { año: "2024", renovable: 42.3, convencional: 35.7 },
]

export default function TransicionEnergetica() {
  const [consumoKwh, setConsumoKwh] = useState("")
  const [resultado, setResultado] = useState<number | null>(null)

  const calcularPorcentajeRenovable = () => {
    if (!consumoKwh || isNaN(Number(consumoKwh))) return

    // Simulación del cálculo basado en datos ficticios
    const totalRenovableInstalada = 42.3 // GW
    const totalConsumo = 78.0 // GW
    const porcentajeRenovable = (totalRenovableInstalada / totalConsumo) * 100
    const consumoRenovablePosible = (Number(consumoKwh) * porcentajeRenovable) / 100

    setResultado(Math.round(consumoRenovablePosible))
  }

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-green-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="text-xl font-bold text-green-800">NeOWatts</span>
            </div>
            <div className="hidden md:flex space-x-6">
              <Button
                variant="ghost"
                onClick={() => scrollToSection("inicio")}
                className="text-green-700 hover:text-green-800"
              >
                Inicio
              </Button>
              <Button
                variant="ghost"
                onClick={() => scrollToSection("energia-solar")}
                className="text-green-700 hover:text-green-800"
              >
                Energía Solar
              </Button>
              <Button
                variant="ghost"
                onClick={() => scrollToSection("dashboard")}
                className="text-green-700 hover:text-green-800"
              >
                Dashboard
              </Button>
              <Button
                variant="ghost"
                onClick={() => scrollToSection("calculadora")}
                className="text-green-700 hover:text-green-800"
              >
                Calculadora
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-green-800 mb-6">Transición Energética Justa</h1>
            <p className="text-xl md:text-2xl text-blue-700 mb-8 font-medium">
              Hacia un futuro sostenible con energías limpias
            </p>
            <p className="text-lg text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed">
              Colombia avanza hacia un modelo energético más limpio, equitativo y sostenible. Descubre cómo las energías
              renovables están transformando nuestro país y contribuyendo a un futuro más verde para todos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => scrollToSection("energia-solar")}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
              >
                Explorar Energías Limpias
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection("dashboard")}
                className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3"
              >
                Ver Dashboard
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Energía Solar */}
      <section id="energia-solar" className="py-16 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-green-800 mb-4">Energía Solar en Colombia</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              El potencial solar de Colombia es excepcional, con una radiación promedio de 4.5 kWh/m²/día
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Sun className="h-8 w-8 text-orange-500" />
                    <CardTitle className="text-2xl text-orange-800">Potencial Solar</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-white/60 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">4.5</div>
                      <div className="text-sm text-gray-600">kWh/m²/día</div>
                    </div>
                    <div className="text-center p-4 bg-white/60 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">18.7</div>
                      <div className="text-sm text-gray-600">GW Instalados</div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Colombia cuenta con condiciones excepcionales para el desarrollo de energía solar, especialmente en
                    las regiones de La Guajira, Atlántico y Cesar, donde la radiación solar supera los 6 kWh/m²/día.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-green-800">
                    <Zap className="h-6 w-6" />
                    <span>Beneficios de la Energía Solar</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <Badge variant="secondary" className="bg-green-100 text-green-800 mt-1">
                        ✓
                      </Badge>
                      <span className="text-gray-700">Reducción de emisiones de CO₂ hasta en un 80%</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Badge variant="secondary" className="bg-green-100 text-green-800 mt-1">
                        ✓
                      </Badge>
                      <span className="text-gray-700">Creación de empleos verdes en zonas rurales</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Badge variant="secondary" className="bg-green-100 text-green-800 mt-1">
                        ✓
                      </Badge>
                      <span className="text-gray-700">Acceso a energía limpia en comunidades remotas</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Badge variant="secondary" className="bg-green-100 text-green-800 mt-1">
                        ✓
                      </Badge>
                      <span className="text-gray-700">Reducción de costos energéticos a largo plazo</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard */}
      <section id="dashboard" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-blue-800 mb-4">Dashboard Energético</h2>
            <p className="text-xl text-gray-600">
              Visualización interactiva de datos sobre energías renovables en Colombia
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Gráfico de Barras - Producción por Fuente */}
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-blue-800">
                  <Wind className="h-6 w-6" />
                  <span>Producción por Fuente Renovable (GW)</span>
                </CardTitle>
                <CardDescription>Capacidad instalada por tipo de energía renovable</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    produccion: {
                      label: "Producción (GW)",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <BarChart data={produccionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="fuente" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="produccion" radius={4} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Gráfico de Torta - Participación */}
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-800">
                  <Leaf className="h-6 w-6" />
                  <span>Participación en Consumo Eléctrico</span>
                </CardTitle>
                <CardDescription>Distribución entre energías renovables y convencionales</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    porcentaje: {
                      label: "Porcentaje (%)",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <PieChart>
                    <Pie
                      data={participacionData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="porcentaje"
                      label={({ fuente, porcentaje }) => `${fuente}: ${porcentaje}%`}
                    >
                      {participacionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Gráfico de Líneas - Evolución Histórica */}
            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-purple-800">
                  <Droplets className="h-6 w-6" />
                  <span>Evolución de Capacidad Instalada</span>
                </CardTitle>
                <CardDescription>Crecimiento histórico de energías renovables (2018-2024)</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    capacidad: {
                      label: "Capacidad (GW)",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <LineChart data={evolucionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="año" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="capacidad"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Gráfico de Área - Comparativo */}
            <Card className="border-teal-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-teal-800">
                  <Zap className="h-6 w-6" />
                  <span>Consumo: Renovable vs Convencional</span>
                </CardTitle>
                <CardDescription>Comparación del consumo energético por tipo (GW)</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    renovable: {
                      label: "Renovable (GW)",
                      color: "#10b981",
                    },
                    convencional: {
                      label: "Convencional (GW)",
                      color: "#6b7280",
                    },
                  }}
                  className="h-[300px]"
                >
                  <AreaChart data={consumoComparativoData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="año" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="renovable"
                      stackId="1"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="convencional"
                      stackId="1"
                      stroke="#6b7280"
                      fill="#6b7280"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Calculadora */}
      <section id="calculadora" className="py-16 px-4 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-green-800 mb-4">Calculadora de Energía Renovable</h2>
            <p className="text-xl text-gray-600">
              Descubre qué porcentaje de tu consumo eléctrico podría ser cubierto por energías renovables
            </p>
          </div>

          <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-800">
                <Calculator className="h-6 w-6" />
                <span>Calcula tu Potencial Renovable</span>
              </CardTitle>
              <CardDescription>
                Ingresa tu consumo mensual promedio en kWh para conocer tu potencial de energía renovable
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="consumo" className="text-sm font-medium text-gray-700">
                      Consumo Eléctrico Mensual (kWh)
                    </Label>
                    <Input
                      id="consumo"
                      type="number"
                      placeholder="Ej: 350"
                      value={consumoKwh}
                      onChange={(e) => setConsumoKwh(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <Button
                    onClick={calcularPorcentajeRenovable}
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={!consumoKwh}
                  >
                    Calcular Potencial Renovable
                  </Button>
                </div>

                <div className="space-y-4">
                  {resultado !== null && (
                    <Card className="border-blue-200 bg-blue-50">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600 mb-2">{resultado} kWh</div>
                          <div className="text-sm text-gray-600 mb-4">Consumo renovable posible mensual</div>
                          <div className="text-lg font-semibold text-green-600">
                            {Math.round((resultado / Number(consumoKwh)) * 100)}% de tu consumo
                          </div>
                          <p className="text-sm text-gray-600 mt-2">podría ser cubierto por energías renovables</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Datos del Sistema:</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Capacidad renovable instalada: 42.3 GW</li>
                      <li>• Consumo total nacional: 78.0 GW</li>
                      <li>• Participación renovable: 54.2%</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Leaf className="h-6 w-6 text-green-400" />
                <span className="text-xl font-bold">Energía Justa</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Promoviendo la transición hacia un sistema energético más limpio, justo y sostenible para Colombia.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Fuentes de Datos</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="#" className="flex items-center space-x-2 hover:text-green-400 transition-colors">
                    <ExternalLink className="h-4 w-4" />
                    <span>Ministerio de Minas y Energía</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-2 hover:text-green-400 transition-colors">
                    <ExternalLink className="h-4 w-4" />
                    <span>UPME - Unidad de Planeación</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-2 hover:text-green-400 transition-colors">
                    <ExternalLink className="h-4 w-4" />
                    <span>XM - Operador del Sistema</span>
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contacto</h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>info@energiajusta.co</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>+57 (1) 234-5678</span>
                </div>
              </div>

              <Separator className="my-4 bg-gray-600" />

              <div className="text-sm text-gray-400">
                <p>© 2024 Transición Energética Justa</p>
                <p>Proyecto educativo - Datos simulados</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
