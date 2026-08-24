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

  // Función de apoyo para renderizar amenidades ficticias y profesionales basadas en la habitación
  const getAmenities = (nombre: string) => {
    const isSuite = nombre.toLowerCase().includes('suite') || nombre.toLowerCase().includes('presidencial');
    return [
      { name: 'WiFi Gratis', icon: '📶' },
      { name: 'Aire Acondicionado', icon: '❄️' },
      { name: isSuite ? 'Jacuzzi Privado' : 'Baño Privado', icon: isSuite ? '🛁' : '🚿' },
      { name: isSuite ? 'Mini Bar Premium' : 'Televisor HD', icon: isSuite ? '🍾' : '📺' },
    ];
  };

  return (
    <div className="min-h-screen bg-slate-950 py-16 px-6 text-slate-100">
      <div className="container mx-auto max-w-6xl">
        
        {/* Cabecera de la Sección */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-3 block">Exclusividad & Confort</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-100 tracking-tight mb-4 font-serif">Nuestras Habitaciones</h1>
          <div className="w-16 h-1 bg-amber-500 mx-auto rounded mb-4" />
          <p className="text-slate-400">
            Cada una de nuestras habitaciones ha sido diseñada al detalle para ofrecer una atmósfera de tranquilidad, lujo y total desconexión.
          </p>
        </div>

        {/* Listado de Habitaciones */}
        {habitaciones && habitaciones.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {habitaciones.map((habitacion) => {
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
          <div className="text-center py-24 bg-slate-900 border border-slate-950 rounded-3xl max-w-xl mx-auto shadow-xl">
            <svg className="w-16 h-16 text-slate-800 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <h3 className="text-2xl text-slate-300 font-bold mb-3 font-serif">Próximamente...</h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto">Aún estamos preparando y equipando nuestras habitaciones exclusivas. ¡Vuelve pronto!</p>
          </div>
        )}
      </div>
    </div>
  )
}