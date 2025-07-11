export interface RenewableEnergyData {
  year: number
  country: string
  "wind-generation": number
  "solar-energy-consumption": number
  "hydropower-consumption": number
  "biofuel-production": number
  "installed-geothermal-capacity": number
  "share-electricity-renewables": number
  "share-electricity-wind": number
  "share-electricity-solar": number
  "share-electricity-hydro": number
  "cumulative-installed-wind-energy-capacity-gigawatts": number
  "installed-solar-PV-capacity": number
  "modern-renewable-energy-consumption": number
  "conventional-energy-consumption": number
}

// Tipos para los archivos CSV originales
export interface SolarShareData {
  Entity: string
  Code: string
  Year: number
  "Solar (% equivalent primary energy)": number
}

export interface LatamRenewableData {
  Entity: string
  Code: string
  Year: number
  "Electricity from wind (TWh)": string
  "Electricity from hydro (TWh)": string
  "Electricity from solar (TWh)": string
  "Other renewables including bioenergy (TWh)": string
}

// Nuevo tipo para el gráfico de barras
export interface ModernRenewableConsumptionData {
  Entity: string
  Code: string
  Year: number
  "Geo Biomass Other - TWh": string
  "Solar Generation - TWh": string
  "Wind Generation - TWh": string
  "Hydro Generation - TWh": string
}

// Tipos para los archivos del gráfico de torta
export interface HydropowerData {
  Entity: string
  Code: string
  Year: number
  "Electricity from hydro (TWh)": string
}

export interface WindGenerationData {
  Entity: string
  Code: string
  Year: number
  "Electricity from wind (TWh)": string
}

export interface BiofuelProductionData {
  Entity: string
  Code: string
  Year: number
  "Biofuels Production - TWh - Total": number
}

export interface SolarEnergyData {
  Entity: string
  Code: string
  Year: number
  "Electricity from solar (TWh)": string
}

export interface GeothermalCapacityData {
  Entity: string
  Code: string
  Year: number
  "Geothermal Capacity": string
}

export interface DatasetFile {
  id: string
  name: string
  description: string
  type: "CSV" | "JSON"
  size: string
  records: number
  url: string
  schema: string[]
}

// Tipos para gráficos específicos
export interface ChartDataFile {
  id: string
  name: string
  description: string
  chartType: "bar" | "pie" | "line" | "area"
  type: "CSV" | "JSON"
  size: string
  records: number
  url: string
  schema: string[]
}
