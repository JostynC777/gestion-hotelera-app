import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import BotonSalir from './BotonSalir'
import BotonEliminar from './BotonEliminar'
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
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-xl font-bold text-gray-500 uppercase tracking-wider mb-2">
        {perfil?.rol === 'admin' ? 'Administración' : 'Panel de Huésped'}
      </h1>
      
      <h2 className="text-4xl font-semibold text-gray-900 mb-8">
        ¡Bienvenido, {perfil?.nombre || 'Usuario'}!
      </h2>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {perfil?.rol === 'admin' && (
          <div className="bg-white p-6 border rounded-lg shadow-sm">
            <p className="text-gray-500 text-sm mb-2">Habitaciones publicadas</p>
            <p className="text-4xl font-bold text-gray-900">{totalHabitaciones}</p>
          </div>
        )}

        <div className="bg-white p-6 border rounded-lg shadow-sm border-l-4 border-l-green-500">
          <p className="text-gray-500 text-sm mb-2">
            {perfil?.rol === 'admin' ? 'Total de Reservas Globales' : 'Mis Reservas Activas'}
          </p>
          <p className="text-4xl font-bold text-gray-900">{totalReservas}</p>
        </div>

        {perfil?.rol === 'admin' && (
          <div className="bg-blue-50 p-6 border border-blue-100 rounded-lg shadow-sm flex flex-col justify-center items-start">
            <Link href="/dashboard/nuevo" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition inline-block text-sm font-semibold">
              + Añadir Habitación
            </Link>
          </div>
        )}
      </div>

      {/* SECCIÓN 1: MIS RESERVAS (Visible para todos) */}
      <div className="bg-white border rounded-lg shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b bg-green-50">
          <h3 className="text-lg font-semibold text-green-900">
            {perfil?.rol === 'admin' ? 'Historial de Reservas (Todas)' : 'Mis Reservas'}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-gray-500 text-sm border-b">
                <th className="p-4 font-medium">ID Reserva</th>
                <th className="p-4 font-medium">Habitación</th>
                <th className="p-4 font-medium">Fecha de Ingreso</th>
              </tr>
            </thead>
            <tbody>
              {reservas && reservas.length > 0 ? (
                reservas.map((reserva) => {
                  // Buscamos el nombre de la habitación en base al ID
                  const hab = habitaciones?.find(h => h.id === reserva.habitacion_id)
                  return (
                    <tr key={reserva.id} className="border-b hover:bg-gray-50 transition-colors text-gray-800">
                      <td className="p-4 text-xs text-gray-400 font-mono">{reserva.id.split('-')[0]}...</td>
                      <td className="p-4 font-semibold text-blue-700">{hab ? hab.nombre : 'Habitación Eliminada'}</td>
                      <td className="p-4 font-medium">{reserva.fecha}</td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-500">
                    No hay reservas registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECCIÓN 2: GESTIÓN DE HABITACIONES (SOLO ADMIN) */}
      {perfil?.rol === 'admin' && (
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Listado de Habitaciones</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-gray-500 text-sm border-b">
                  <th className="p-4 font-medium">Nombre</th>
                  <th className="p-4 font-medium">Precio / Noche</th>
                  <th className="p-4 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {habitaciones && habitaciones.length > 0 ? (
                  habitaciones.map((habitacion) => (
                    <tr key={habitacion.id} className="border-b hover:bg-gray-50 transition-colors text-gray-800">
                      <td className="p-4 font-semibold">{habitacion.nombre}</td>
                      <td className="p-4 text-green-700 font-medium">${habitacion.precio}</td>
                      <td className="p-4 text-right">
                        <BotonEliminar id={habitacion.id} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-gray-500">
                      Aún no hay habitaciones registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <BotonSalir />
    </div>
  )
}