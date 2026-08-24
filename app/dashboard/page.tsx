import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import BotonSalir from './BotonSalir'
import BotonEliminar from './BotonEliminar' // 1. Importamos el nuevo botón
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

  const { data: habitaciones } = await supabase
    .from('habitaciones')
    .select('*')
    .order('id', { ascending: false })
  
  const totalHabitaciones = habitaciones ? habitaciones.length : 0

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-xl font-bold text-gray-500 uppercase tracking-wider mb-2">
        {perfil?.rol === 'admin' ? 'Administración' : 'Panel de Huésped'}
      </h1>
      
      <h2 className="text-4xl font-semibold text-gray-900 mb-8">
        ¡Bienvenido, {perfil?.nombre || 'Usuario'}!
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 border rounded-lg shadow-sm">
          <p className="text-gray-500 text-sm mb-2">Habitaciones publicadas</p>
          <p className="text-4xl font-bold text-gray-900">{totalHabitaciones}</p>
        </div>

        {perfil?.rol === 'admin' && (
          <div className="bg-blue-50 p-6 border border-blue-100 rounded-lg shadow-sm flex flex-col justify-center items-start">
            <h3 className="text-blue-800 font-semibold mb-2">Gestión del Hotel</h3>
            <p className="text-blue-600 text-sm mb-4">Tienes control total sobre el sistema.</p>
            <Link href="/dashboard/nuevo" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition inline-block">
              + Añadir Nueva Habitación
            </Link>
          </div>
        )}
      </div>

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
                <th className="p-4 font-medium">Descripción</th>
                {/* 2. Añadimos la cabecera de la columna si es admin */}
                {perfil?.rol === 'admin' && <th className="p-4 font-medium text-right">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {habitaciones && habitaciones.length > 0 ? (
                habitaciones.map((habitacion) => (
                  <tr key={habitacion.id} className="border-b hover:bg-gray-50 transition-colors text-gray-800">
                    <td className="p-4 font-semibold">{habitacion.nombre}</td>
                    <td className="p-4 text-green-700 font-medium">${habitacion.precio}</td>
                    <td className="p-4 text-gray-600 text-sm">{habitacion.descripcion}</td>
                    
                    {/* 3. Insertamos el botón enviándole el ID de esta habitación específica */}
                    {perfil?.rol === 'admin' && (
                      <td className="p-4 text-right">
                        <BotonEliminar id={habitacion.id} />
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    Aún no hay habitaciones registradas. ¡Añade la primera!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <BotonSalir />
    </div>
  )
}