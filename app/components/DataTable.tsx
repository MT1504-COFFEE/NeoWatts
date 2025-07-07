"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { RenewableEnergyData } from "../types/energy"

interface DataTableProps {
  data: RenewableEnergyData[]
}

export default function DataTable({ data }: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof RenewableEnergyData>("year")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [filterCountry, setFilterCountry] = useState<string>("all")

  // Obtener países únicos para el filtro
  const countries = useMemo(() => {
    const uniqueCountries = [...new Set(data.map((item) => item.country))]
    return uniqueCountries.sort()
  }, [data])

  // Filtrar y ordenar datos
  const filteredAndSortedData = useMemo(() => {
    const filtered = data.filter((item) => {
      const matchesSearch =
        item.country.toLowerCase().includes(searchTerm.toLowerCase()) || item.year.toString().includes(searchTerm)
      const matchesCountry = filterCountry === "all" || item.country === filterCountry
      return matchesSearch && matchesCountry
    })

    // Ordenar
    filtered.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      return sortDirection === "asc" ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number)
    })

    return filtered
  }, [data, searchTerm, filterCountry, sortField, sortDirection])

  // Paginación
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage)

  const handleSort = (field: keyof RenewableEnergyData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay datos disponibles</h3>
          <p className="text-gray-500">Carga un archivo de datos desde la pestaña "Cargar Datos"</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>📋</span>
            <span>Tabla de Datos Energéticos</span>
          </CardTitle>
          <CardDescription>
            Visualización tabular de {data.length} registros históricos de energía renovable
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Controles de filtrado y búsqueda */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Buscar por país o año..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={filterCountry} onValueChange={setFilterCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por país" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los países</SelectItem>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("year")}
                      className="font-semibold hover:bg-gray-100"
                    >
                      Año {sortField === "year" && (sortDirection === "asc" ? "↑" : "↓")}
                    </Button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("country")}
                      className="font-semibold hover:bg-gray-100"
                    >
                      País {sortField === "country" && (sortDirection === "asc" ? "↑" : "↓")}
                    </Button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("wind-generation")}
                      className="font-semibold hover:bg-gray-100 text-xs"
                    >
                      Eólica {sortField === "wind-generation" && (sortDirection === "asc" ? "↑" : "↓")}
                    </Button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("solar-energy-consumption")}
                      className="font-semibold hover:bg-gray-100 text-xs"
                    >
                      Solar {sortField === "solar-energy-consumption" && (sortDirection === "asc" ? "↑" : "↓")}
                    </Button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("hydropower-consumption")}
                      className="font-semibold hover:bg-gray-100 text-xs"
                    >
                      Hidro {sortField === "hydropower-consumption" && (sortDirection === "asc" ? "↑" : "↓")}
                    </Button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("share-electricity-renewables")}
                      className="font-semibold hover:bg-gray-100 text-xs"
                    >
                      % Renovable{" "}
                      {sortField === "share-electricity-renewables" && (sortDirection === "asc" ? "↑" : "↓")}
                    </Button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, index) => (
                  <tr key={`${item.country}-${item.year}-${index}`} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{item.year}</td>
                    <td className="px-4 py-3">{item.country}</td>
                    <td className="px-4 py-3 text-right">{item["wind-generation"].toFixed(1)}</td>
                    <td className="px-4 py-3 text-right">{item["solar-energy-consumption"].toFixed(1)}</td>
                    <td className="px-4 py-3 text-right">{item["hydropower-consumption"].toFixed(1)}</td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          item["share-electricity-renewables"] > 50
                            ? "bg-green-100 text-green-800"
                            : item["share-electricity-renewables"] > 25
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item["share-electricity-renewables"].toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredAndSortedData.length)} de{" "}
              {filteredAndSortedData.length} registros
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <span className="flex items-center px-3 py-2 text-sm">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
