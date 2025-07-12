'use client'
import { useEffect, useRef } from 'react'

const energias = [
  {
    titulo: 'Energía Solar',
    contenido: (
      <div className="grid md:grid-cols-2 gap-24 items-start">
        <div>
          <p className="text-xl italic mb-4">La fuente de energía más abundante del planeta.</p>
          <h4 className="font-bold text-lg mb-2">¿Qué es la Energía Solar?</h4>
          <p className="leading-relaxed">
            La energía solar es la energía obtenida mediante la captación de la luz y el calor emitidos por el Sol. Esta
            energía se puede aprovechar mediante tecnologías como paneles fotovoltaicos y colectores solares térmicos.
          </p>
        </div>
        <div className="bg-white bg-opacity-10 rounded-lg p-4 w-full md:max-w-sm">
          <h4 className="font-bold text-lg mb-2">Datos Clave</h4>
          <ul className="space-y-5">
            <li>🌞 El Sol proporciona 10,000 veces más energía de la que consume la humanidad</li>
            <li>📊 Crecimiento anual del 20% en capacidad instalada</li>
            <li>🌍 Presente en más de 100 países</li>
            <li>💰 Reducción de costos del 90% en la última década</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    titulo: 'Energía Eólica',
    contenido: (
      <div className="grid md:grid-cols-2 gap-24 items-start">
        <div>
          <p className="text-xl italic mb-4">Energía limpia generada por el viento.</p>
          <h4 className="font-bold text-lg mb-2">¿Qué es la Energía Eólica?</h4>
          <p className="leading-relaxed">
            Utiliza el viento mediante aerogeneradores para producir electricidad sin generar emisiones contaminantes.
          </p>
        </div>
        <div className="bg-white bg-opacity-10 rounded-lg p-4 w-full md:max-w-sm">
          <h4 className="font-bold text-lg mb-2">Datos Clave</h4>
          <ul className="space-y-2">
            <li>💨 Fuente inagotable y limpia</li>
            <li>📈 Alta eficiencia en zonas ventosas</li>
            <li>🔧 Bajo mantenimiento</li>
          </ul>
        </div>
      </div>
    ),
  },
  {

    titulo: 'Energía Hidroeléctrica',
    contenido: (
      <div className="grid md:grid-cols-2 gap-24 items-start">
        <div>
          <p className="text-xl italic mb-4">Generada por el movimiento del agua.</p>
          <h4 className="font-bold text-lg mb-2">¿Qué es la Energía Hidroeléctrica?</h4>
          <p className="leading-relaxed">
            Aprovecha la energía cinética del agua en movimiento, especialmente en ríos y represas, para accionar turbinas
            que generan electricidad.
          </p>
        </div>
        <div className="bg-white bg-opacity-10 rounded-lg p-4 w-full md:max-w-sm">
          <h4 className="font-bold text-lg mb-2">Datos Clave</h4>
          <ul className="space-y-2">
            <li>🌊 Fuente estable y predecible</li>
            <li>🏞️ Aporta más del 15% de la electricidad mundial</li>
            <li>⚠️ Puede afectar ecosistemas acuáticos</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    titulo: 'Energía de Biomasa',
    contenido: (
      <div className="grid md:grid-cols-2 gap-24 items-start">
        <div>
          <p className="text-xl italic mb-4">Energía a partir de materia orgánica.</p>
          <h4 className="font-bold text-lg mb-2">¿Qué es la Energía de Biomasa?</h4>
          <p className="leading-relaxed">
            Utiliza restos vegetales, residuos agrícolas, madera o desechos orgánicos que se transforman en electricidad,
            calor o biocombustibles.
          </p>
        </div>
        <div className="bg-white bg-opacity-10 rounded-lg p-4 w-full md:max-w-sm">
          <h4 className="font-bold text-lg mb-2">Datos Clave</h4>
          <ul className="space-y-2">
            <li>🌱 Reduce residuos y emisiones</li>
            <li>🔥 Puede generar calor directo o electricidad</li>
            <li>🧪 Base para biocombustibles sostenibles</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    titulo: 'Energía Geotérmica',
    contenido: (
      <div className="grid md:grid-cols-2 gap-24 items-start">
        <div>
          <p className="text-xl italic mb-4">Calor desde el interior de la Tierra.</p>
          <h4 className="font-bold text-lg mb-2">¿Qué es la Energía Geotérmica?</h4>
          <p className="leading-relaxed">
            Extrae calor del subsuelo para generar electricidad o calefacción, especialmente en zonas volcánicas o con
            alta actividad geológica.
          </p>
        </div>
        <div className="bg-white bg-opacity-10 rounded-lg p-4 w-full md:max-w-sm">
          <h4 className="font-bold text-lg mb-2">Datos Clave</h4>
          <ul className="space-y-2">
            <li>🌋 Fuente constante todo el año</li>
            <li>🏡 Ideal para calefacción de hogares</li>
            <li>♻️ Emisiones muy bajas de CO₂</li>
          </ul>
        </div>
      </div>
    ),
  },
]

export default function CarruselEnergias() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (containerRef.current) {
        const container = containerRef.current
        const child = container.children[index] as HTMLElement
        container.scrollTo({
          left: child.offsetLeft,
          behavior: 'smooth',
        })
        index = (index + 1) % energias.length
      }
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="overflow-hidden">
      <div
        ref={containerRef}
        className="flex overflow-x-auto scroll-smooth no-scrollbar snap-x snap-mandatory"
      >
        {energias.map((energia, i) => (
          <div
            key={i}
            className="min-w-full flex-shrink-0 snap-center p-10 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl m-4 shadow-xl"
          >
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">{energia.titulo}</h2>
              <div>{energia.contenido}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
