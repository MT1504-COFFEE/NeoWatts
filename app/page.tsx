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
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <img src="/favicon.png" alt="NeoWatts Logo" className="h-12 w-12 rounded-full" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">NeoWatts</h1>
              <p className="text-gray-600">Análisis histórico de datos energéticos (1965-2022)</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="info" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white shadow-md">
            <TabsTrigger value="info" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              Información General
            </TabsTrigger>
            <TabsTrigger value="upload" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              Cargar Datos
            </TabsTrigger>
            <TabsTrigger value="table" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              Tabla de Datos
            </TabsTrigger>
            <TabsTrigger value="calculator" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              Calculadora
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
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
            <EnergyCalculator data={energyData} />
          </TabsContent>

          <TabsContent value="dashboard">
            <Dashboard data={energyData} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300">© 2025 Dashboard Energía Renovable - Datos históricos 1965-2022</p>
        </div>
      </footer>
    </div>
  )
}
