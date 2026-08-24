import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import BotonSalir from './BotonSalir'
import BotonEliminar from './BotonEliminar'
import BotonCancelarReserva from './BotonCancelarReserva'
import Link from 'next/link'

export default async function DashboardPage() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  let perfil = null
  if (user) {
    const { data } = await supabase
      .from('perfiles')
      .select('*')
      .eq('id', user.id)
      .single()
    perfil = data
  }

  // 1. Traemos las habitaciones
  const { data: habitaciones } = await supabase
    .from('habitaciones')
    .select('*')
    .order('id', { ascending: false })

  // 2. Traemos las reservas dependiendo del rol
  let reservas = []
  if (perfil?.rol === 'admin') {
    // El admin ve todo
    const { data } = await supabase.from('reservas').select('*').order('id', { ascending: false })
    reservas = data || []
  } else if (user) {
    // El huésped solo ve lo suyo
    const { data } = await supabase.from('reservas').select('*').eq('huesped_id', user.id).order('id', { ascending: false })
    reservas = data || []
  }
  
  const totalHabitaciones = habitaciones ? habitaciones.length : 0
  const totalReservas = reservas.length

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-6 selection:bg-amber-500 selection:text-slate-950">
      <div className="max-w-6xl mx-auto">
        
        {/* Cabecera del Panel */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-slate-900">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded bg-amber-500/10 border border-amber-500/20 text-amber-400">
                {perfil?.rol === 'admin' ? 'Área de Administración' : 'Panel de Huésped'}
              </span>
            </div>
            
            <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight mt-2 font-serif">
              ¡Bienvenido de nuevo, {perfil?.nombre || 'Usuario'}!
            </h1>
          </div>

          <BotonSalir />
        </div>

        {/* Tarjetas de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {perfil?.rol === 'admin' && (
            <div className="bg-slate-900 border border-slate-800/80 p-6 rounded-2xl shadow-md flex items-center justify-between group hover:border-slate-700 transition">
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Habitaciones Activas</p>
                <p className="text-3xl font-extrabold text-slate-100">{totalHabitaciones}</p>
              </div>
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          )}

          <div className="bg-slate-900 border border-slate-800/80 p-6 rounded-2xl shadow-md flex items-center justify-between group hover:border-slate-700 transition border-l-4 border-l-amber-500">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                {perfil?.rol === 'admin' ? 'Total Reservas Globales' : 'Tus Reservas Realizadas'}
              </p>
              <p className="text-3xl font-extrabold text-slate-100">{totalReservas}</p>
            </div>
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          {perfil?.rol === 'admin' && (
            <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl shadow-md flex flex-col justify-center items-stretch">
              <Link 
                href="/dashboard/nuevo" 
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-center py-3 rounded-xl shadow-md shadow-amber-500/5 hover:shadow-amber-500/15 hover:scale-[1.01] transition-all duration-300 font-bold text-sm"
              >
                + Añadir Nueva Habitación
              </Link>
            </div>
          )}
        </div>

        {/* SECCIÓN 1: MIS RESERVAS (Visible para todos) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl mb-10">
          <div className="p-6 border-b border-slate-800/80 bg-slate-900/60 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-200 font-serif">
              {perfil?.rol === 'admin' ? 'Historial Global de Reservas' : 'Tus Reservas Registradas'}
            </h3>
            <span className="text-xs font-bold text-slate-400 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
              {totalReservas} {totalReservas === 1 ? 'Reserva' : 'Reservas'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-850">
                  <th className="p-4 pl-6">ID Reserva</th>
                  <th className="p-4">Habitación</th>
                  <th className="p-4">Fecha de Ingreso</th>
                  <th className="p-4 text-right pr-6">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reservas && reservas.length > 0 ? (
                  reservas.map((reserva) => {
                    const hab = habitaciones?.find(h => h.id === reserva.habitacion_id)
                    return (
                      <tr key={reserva.id} className="border-b border-slate-850 hover:bg-slate-850/30 transition-colors text-slate-300">
                        <td className="p-4 pl-6 text-xs text-slate-500 font-mono">
                          #{reserva.id.split('-')[0]}
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-amber-400">{hab ? hab.nombre : 'Habitación Eliminada'}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-slate-300 font-medium">{reserva.fecha}</span>
                        </td>
                        <td className="p-4 text-right pr-6">
                          <BotonCancelarReserva id={reserva.id} />
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-slate-500 text-sm">
                      <div className="flex flex-col items-center gap-2">
                        <span>🗓️</span>
                        <span>No hay reservas activas en tu historial.</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECCIÓN 2: GESTIÓN DE HABITACIONES (SOLO ADMIN) */}
        {perfil?.rol === 'admin' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-slate-800/80 bg-slate-900/60 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-200 font-serif">Catálogo de Habitaciones (Gestión)</h3>
              <span className="text-xs font-bold text-slate-400 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
                {totalHabitaciones} {totalHabitaciones === 1 ? 'Habitación' : 'Habitaciones'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-850">
                    <th className="p-4 pl-6">Nombre de Habitación</th>
                    <th className="p-4">Tarifa / Noche</th>
                    <th className="p-4 text-right pr-6">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {habitaciones && habitaciones.length > 0 ? (
                    habitaciones.map((habitacion) => (
                      <tr key={habitacion.id} className="border-b border-slate-850 hover:bg-slate-850/30 transition-colors text-slate-300">
                        <td className="p-4 pl-6 font-semibold text-slate-200">{habitacion.nombre}</td>
                        <td className="p-4">
                          <span className="text-emerald-400 font-bold">${habitacion.precio}</span>
                        </td>
                        <td className="p-4 text-right pr-6">
                          <BotonEliminar id={habitacion.id} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="p-12 text-center text-slate-500 text-sm">
                        <div className="flex flex-col items-center gap-2">
                          <span>🛏️</span>
                          <span>No hay habitaciones creadas en el catálogo.</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
      </div>
    </div>
  )
}