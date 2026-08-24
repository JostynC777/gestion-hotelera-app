import Link from 'next/link';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export default async function Navigation() {
  const cookieStore = cookies();
  
  // Inicializamos Supabase para leer las cookies de sesión
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  // Verificamos si hay un usuario logueado
  const { data: { user } } = await supabase.auth.getUser();

  // Traemos el perfil para mostrar el nombre y rol de forma premium
  let perfil = null;
  if (user) {
    const { data } = await supabase
      .from('perfiles')
      .select('*')
      .eq('id', user.id)
      .single();
    perfil = data;
  }

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/90 border-b border-slate-800 text-white shadow-lg">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo de Lujo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
            <svg className="w-5 h-5 text-slate-900 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 group-hover:opacity-90 transition-opacity">
            GRAND PALACE
          </span>
        </Link>

        {/* Menú de Enlaces */}
        <div className="flex items-center gap-6">
          <Link 
            href="/habitaciones" 
            className="text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Habitaciones
          </Link>
          
          {/* Si hay usuario, mostramos el Dashboard e indicador de Perfil */}
          {user ? (
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard" 
                className="text-sm font-semibold bg-slate-800 border border-slate-700 text-slate-100 px-4 py-2 rounded-lg hover:bg-slate-700 hover:border-slate-600 transition-all shadow-sm flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Dashboard
              </Link>
              
              {/* Badge de Usuario */}
              <div className="hidden md:flex flex-col items-end">
                <span className="text-xs text-slate-400">Bienvenido,</span>
                <span className="text-xs font-semibold text-amber-300 flex items-center gap-1">
                  {perfil?.nombre || 'Usuario'}
                  <span className="px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-bold rounded bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    {perfil?.rol === 'admin' ? 'Admin' : 'Huésped'}
                  </span>
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link 
                href="/login" 
                className="text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors px-3 py-2"
              >
                Iniciar Sesión
              </Link>
              <Link 
                href="/register" 
                className="text-sm font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 px-4 py-2 rounded-lg transition-all duration-300 shadow-md shadow-amber-500/10 hover:shadow-amber-500/20 hover:scale-[1.02]"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}