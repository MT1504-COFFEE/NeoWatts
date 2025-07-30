"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SolarInfoSection from "./components/SolarInfoSection"
import DataUploader from "./components/DataUploader"
import DataTable from "./components/DataTable"
import EnergyCalculator from "./components/EnergyCalculator"
import Dashboard from "./components/Dashboard"
import type { RenewableEnergyData } from "./types/energy"

export default function Home() {
  const [energyData, setEnergyData] = useState<RenewableEnergyData[]>([])

  const handleDataLoad = (data: RenewableEnergyData[]) => {
    setEnergyData(data)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-green-500">
        <div className="container mx-auto px-2 md:px-4 py-4 md:py-6">
          <div className="flex items-center space-x-2 md:space-x-3">
              <svg className="w-4 h-4 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                  clipRule="evenodd"
                />
              </svg>
              <img src="/favicon.png" alt="NeoWatts Logo" className="h-12 w-12 rounded-full" />
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-gray-800">NeoWatts</h1>
              <p className="text-sm md:text-base text-gray-600">Análisis histórico de datos energéticos (1965-2021)</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-2 md:px-4 py-4 md:py-8">
        <Tabs defaultValue="info" className="space-y-6">
          {/* NAVBAR responsiva en móvil */}
          <TabsList className="grid w-full grid-cols-5 bg-green-100 shadow-md rounded-md p-0.5 gap-0.5">
            <TabsTrigger
              value="info"
              className="bg-white data-[state=active]:bg-green-500 data-[state=active]:text-white text-[10px] xs:text-xs sm:text-sm md:text-base px-1 xs:px-2 md:px-3 py-2 md:py-3 rounded-md transition-all duration-200 font-medium h-full w-full"
            >
              <span className="hidden sm:inline">Información</span>
              <span className="sm:hidden">Info</span>
            </TabsTrigger>
            <TabsTrigger
              value="upload"
              className="bg-white data-[state=active]:bg-green-500 data-[state=active]:text-white text-[10px] xs:text-xs sm:text-sm md:text-base px-1 xs:px-2 md:px-3 py-2 md:py-3 rounded-md transition-all duration-200 font-medium h-full w-full"
            >
              <span className="hidden sm:inline">Cargar Datos</span>
              <span className="sm:hidden">Datos</span>
            </TabsTrigger>
            <TabsTrigger
              value="table"
              className="bg-white data-[state=active]:bg-green-500 data-[state=active]:text-white text-[10px] xs:text-xs sm:text-sm md:text-base px-1 xs:px-2 md:px-3 py-2 md:py-3 rounded-md transition-all duration-200 font-medium h-full w-full"
            >
              <span className="hidden sm:inline">Tabla de Datos</span>
              <span className="sm:hidden">Tabla</span>
            </TabsTrigger>
            <TabsTrigger
              value="calculator"
              className="bg-white data-[state=active]:bg-green-500 data-[state=active]:text-white text-[10px] xs:text-xs sm:text-sm md:text-base px-1 xs:px-2 md:px-3 py-2 md:py-3 rounded-md transition-all duration-200 font-medium h-full w-full"
            >
              <span className="hidden sm:inline">Calculadora</span>
              <span className="sm:hidden">Calc</span>
            </TabsTrigger>
            <TabsTrigger
              value="dashboard"
              className="bg-white data-[state=active]:bg-green-500 data-[state=active]:text-white text-[10px] xs:text-xs sm:text-sm md:text-base px-1 xs:px-2 md:px-3 py-2 md:py-3 rounded-md transition-all duration-200 font-medium h-full w-full"
            >
              Dashboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <SolarInfoSection />
          </TabsContent>

          <TabsContent value="upload">
            <DataUploader onDataLoad={handleDataLoad} />
          </TabsContent>

          <TabsContent value="table">
            <DataTable data={energyData} />
          </TabsContent>

          <TabsContent value="calculator">
            <EnergyCalculator />
          </TabsContent>

          <TabsContent value="dashboard">
            <Dashboard data={energyData} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300 text-sm md:text-base">
            © 2025 Dashboard Energía Renovable - Datos históricos 1965-2021
          </p>
        </div>
      </footer>
    </div>
  )
}
