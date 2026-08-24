import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function HabitacionesPage() {
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

  const { data: habitaciones } = await supabase
    .from('habitaciones')
    .select('*')
    .order('precio', { ascending: true })

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold text-center text-blue-900 mb-2">Nuestras Habitaciones</h1>
        <p className="text-center text-gray-600 mb-12">Encuentra el espacio perfecto para tu descanso</p>

        {habitaciones && habitaciones.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {habitaciones.map((habitacion) => (
              <div key={habitacion.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 flex flex-col">
                <div className="h-48 bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-300 font-medium text-sm">📷 Espacio para foto</span>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-gray-800">{habitacion.nombre}</h2>
                    <span className="bg-green-100 text-green-800 text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap ml-2">
                      ${habitacion.precio} / noche
                    </span>
                  </div>

                  <p className="text-gray-600 mb-6 flex-grow">{habitacion.descripcion}</p>

                  {/* Botón visual para los clientes - Ahora es un Enlace */}
                  <Link 
                    href={`/reservar/${habitacion.id}`}
                    className="w-full bg-blue-900 text-white font-semibold py-3 rounded-lg hover:bg-blue-800 transition-colors mt-auto shadow-sm text-center block"
                  >
                    Reservar Ahora
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-2xl text-gray-500 font-semibold mb-4">Próximamente...</h3>
            <p className="text-gray-400">Aún estamos preparando nuestras habitaciones para ti.</p>
          </div>
        )}
      </div>
    </div>
  )
}