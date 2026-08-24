'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ReservarPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [fecha, setFecha] = useState('')
  const [cargando, setCargando] = useState(false)
  const [usuarioId, setUsuarioId] = useState<string | null>(null)
  const [habitacion, setHabitacion] = useState<any | null>(null)
  const [buscandoHab, setBuscandoHab] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Buscamos quién es el usuario y los detalles de la habitación
  useEffect(() => {
    const cargarInformacion = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUsuarioId(user.id)
      } else {
        alert('Debes iniciar sesión para poder reservar.')
        router.push('/login')
        return
      }

      // Traer la habitación seleccionada
      try {
        const { data: hab } = await supabase
          .from('habitaciones')
          .select('*')
          .eq('id', params.id)
          .single()
        
        if (hab) {
          setHabitacion(hab)
        }
      } catch (err) {
        console.error('Error cargando habitación:', err)
      } finally {
        setBuscandoHab(false)
      }
    }
    
    cargarInformacion()
  }, [router, supabase, params.id])

  const confirmarReserva = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!usuarioId) return

    setCargando(true)

    const { error } = await supabase
      .from('reservas')
      .insert([
        {
          huesped_id: usuarioId,
          habitacion_id: params.id,
          fecha: fecha
        }
      ])

    if (error) {
      alert('Error al reservar: ' + error.message)
      setCargando(false)
    } else {
      alert('¡Reserva confirmada con éxito! Te esperamos.')
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 py-16 px-6 text-slate-100 flex flex-col justify-center selection:bg-amber-500 selection:text-slate-950">
      <div className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-10 relative">
        {/* Fondo decorativo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-amber-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

        {/* COLUMNA 1: Resumen de la Habitación */}
        <div className="flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800 pb-8 md:pb-0 md:pr-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-2 block">Detalles del Destino</span>
            <h1 className="text-3xl font-extrabold text-slate-100 mb-6 font-serif">Tu Reserva</h1>

            {buscandoHab ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-44 bg-slate-800 rounded-2xl w-full"></div>
                <div className="h-6 bg-slate-800 rounded w-2/3"></div>
                <div className="h-4 bg-slate-800 rounded w-full"></div>
              </div>
            ) : habitacion ? (
              <div className="space-y-5">
                {habitacion.imagen_url ? (
                  <img 
                    src={habitacion.imagen_url} 
                    alt={habitacion.nombre}
                    className="w-full h-48 object-cover rounded-2xl border border-slate-800 shadow-inner"
                  />
                ) : (
                  <div className="w-full h-48 bg-slate-950 rounded-2xl border border-slate-850 flex flex-col items-center justify-center gap-2 text-slate-600">
                    <span className="text-2xl">📷</span>
                    <span className="text-xs font-semibold uppercase tracking-wider">Sin fotografía</span>
                  </div>
                )}
                
                <div>
                  <h2 className="text-xl font-bold text-slate-200">{habitacion.nombre}</h2>
                  <p className="text-slate-400 text-sm mt-2 leading-relaxed">{habitacion.descripcion}</p>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-sm">
                No pudimos encontrar los detalles de la habitación.
              </div>
            )}
          </div>

          {!buscandoHab && habitacion && (
            <div className="mt-8 pt-6 border-t border-slate-800/60 flex justify-between items-center bg-slate-950/45 p-4 rounded-2xl border border-slate-850">
              <span className="text-sm text-slate-400">Tarifa por noche</span>
              <span className="text-2xl font-bold text-amber-400">${habitacion.precio}</span>
            </div>
          )}
        </div>

        {/* COLUMNA 2: Formulario de Reserva */}
        <div className="flex flex-col justify-center">
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Ingresa la fecha de tu llegada para registrar tu check-in. Al confirmar, tu suite estará asegurada.
          </p>
          
          <form onSubmit={confirmarReserva} className="flex flex-col gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                ¿En qué fecha deseas hospedarte?
              </label>
              <input
                type="date"
                required
                className="w-full rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 px-4 py-3.5 outline-none transition duration-200 [color-scheme:dark]"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={cargando || !usuarioId || buscandoHab}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cargando ? 'Procesando tu reserva...' : 'Confirmar Reserva'}
            </button>
            
            <Link 
              href="/habitaciones" 
              className="text-center text-xs text-slate-400 hover:text-amber-400 transition-colors font-semibold uppercase tracking-wider mt-2"
            >
              Cancelar y volver al catálogo
            </Link>
          </form>
        </div>
      </div>
    </div>
  )
}