import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import RoomsCatalog from '../../components/RoomsCatalog'

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
    <div className="min-h-screen bg-slate-950 py-16 px-6 text-slate-100 selection:bg-amber-500 selection:text-slate-950">
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

        {/* Listado de Habitaciones con Filtro Interactivo */}
        {habitaciones && habitaciones.length > 0 ? (
          <RoomsCatalog initialRooms={habitaciones} />
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