'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Habitacion {
  id: string
  nombre: string
  precio: number
  descripcion: string
  imagen_url: string | null
}

interface RoomsCatalogProps {
  initialRooms: Habitacion[]
}

export default function RoomsCatalog({ initialRooms }: RoomsCatalogProps) {
  const [busqueda, setBusqueda] = useState('')
  
  // Encontrar el precio máximo para inicializar el filtro deslizante
  const precios = initialRooms.map(r => r.precio)
  const maxPrecioEstablecido = precios.length > 0 ? Math.max(...precios) : 2000
  const minPrecioEstablecido = precios.length > 0 ? Math.min(...precios) : 0
  const [precioMax, setPrecioMax] = useState<number>(maxPrecioEstablecido)

  // Función de apoyo para renderizar amenidades ficticias y profesionales
  const getAmenities = (nombre: string) => {
    const isSuite = nombre.toLowerCase().includes('suite') || nombre.toLowerCase().includes('presidencial');
    return [
      { name: 'WiFi Gratis', icon: '📶' },
      { name: 'Aire Acondicionado', icon: '❄️' },
      { name: isSuite ? 'Jacuzzi Privado' : 'Baño Privado', icon: isSuite ? '🛁' : '🚿' },
      { name: isSuite ? 'Mini Bar Premium' : 'Televisor HD', icon: isSuite ? '🍾' : '📺' },
    ];
  };

  // Filtrar habitaciones basándose en búsqueda y precio máximo
  const habitacionesFiltradas = initialRooms.filter((hab) => {
    const coincideNombre = hab.nombre.toLowerCase().includes(busqueda.toLowerCase())
    const coincidePrecio = hab.precio <= precioMax
    return coincideNombre && coincidePrecio
  })

  return (
    <div className="space-y-10">
      
      {/* Barra de Filtros Interactiva (usa useState) */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row gap-6 justify-between items-center shadow-lg relative">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent rounded-3xl pointer-events-none" />
        
        {/* Buscador */}
        <div className="w-full md:w-1/2 flex flex-col gap-2 relative">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Buscar por nombre
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Ej: Suite, Familiar, Individual..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 pl-10 text-slate-100 placeholder-slate-650 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-sm transition"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <span className="absolute left-3.5 top-3.5 text-slate-600">🔍</span>
          </div>
        </div>

        {/* Control Deslizante de Precio */}
        <div className="w-full md:w-1/3 flex flex-col gap-2 relative">
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-400">
            <span>Precio Máximo</span>
            <span className="text-amber-400 font-bold">${precioMax} USD</span>
          </div>
          <input
            type="range"
            min={minPrecioEstablecido}
            max={maxPrecioEstablecido}
            step="10"
            className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-500 border border-slate-850 mt-4"
            value={precioMax}
            onChange={(e) => setPrecioMax(Number(e.target.value))}
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>Min: ${minPrecioEstablecido}</span>
            <span>Max: ${maxPrecioEstablecido}</span>
          </div>
        </div>
      </div>

      {/* Resultados de la búsqueda */}
      {habitacionesFiltradas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {habitacionesFiltradas.map((habitacion) => {
            const amenities = getAmenities(habitacion.nombre);
            return (
              <div 
                key={habitacion.id} 
                className="bg-slate-900 border border-slate-900 rounded-3xl overflow-hidden hover:border-slate-800 hover:-translate-y-1.5 transition-all duration-300 flex flex-col group shadow-lg hover:shadow-amber-500/5"
              >
                
                {/* Contenedor de Imagen con Efecto Hover */}
                <div className="relative h-64 overflow-hidden bg-slate-850">
                  {habitacion.imagen_url ? (
                    <img
                      src={habitacion.imagen_url}
                      alt={habitacion.nombre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 flex flex-col items-center justify-center gap-2">
                      <svg className="w-10 h-10 text-slate-700 group-hover:text-amber-500/40 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-slate-600 text-xs font-semibold uppercase tracking-wider">Sin fotografía disponible</span>
                    </div>
                  )}
                  {/* Badge de Categoría */}
                  <span className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md text-amber-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-slate-800">
                    {habitacion.nombre.toLowerCase().includes('suite') ? 'Premium Suite' : 'Standard'}
                  </span>
                </div>

                {/* Detalles de la Tarjeta */}
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <h2 className="text-xl font-bold text-slate-100 group-hover:text-amber-400 transition-colors">{habitacion.nombre}</h2>
                    <div className="text-right flex flex-col whitespace-nowrap">
                      <span className="text-2xl font-bold text-amber-400">${habitacion.precio}</span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Por noche</span>
                    </div>
                  </div>

                  <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">{habitacion.descripcion}</p>

                  {/* Amenidades */}
                  <div className="border-t border-slate-800/80 pt-5 mb-6">
                    <div className="grid grid-cols-2 gap-3">
                      {amenities.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                          <span className="text-sm">{item.icon}</span>
                          <span>{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Botón de Acción */}
                  <Link 
                    href={`/reservar/${habitacion.id}`}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold py-3.5 rounded-xl transition-all duration-300 text-center shadow-lg shadow-amber-500/5 hover:shadow-amber-500/10 hover:scale-[1.01]"
                  >
                    Reservar Ahora
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-900 border border-slate-850 rounded-3xl max-w-xl mx-auto">
          <span className="text-3xl">🔍</span>
          <h3 className="text-xl font-bold text-slate-300 mt-4 mb-2">No se encontraron resultados</h3>
          <p className="text-slate-400 text-sm">Prueba ajustando los filtros de búsqueda o el control de precio máximo.</p>
        </div>
      )}
    </div>
  )
}
