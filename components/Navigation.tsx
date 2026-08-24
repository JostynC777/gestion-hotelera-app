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

  return (
    <nav className="bg-blue-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold tracking-wider">
          HOTEL GESTIÓN
        </Link>
        <div className="space-x-4">
          <Link href="/habitaciones" className="hover:text-blue-300 transition">
            Habitaciones
          </Link>
          
          {/* Si hay usuario, mostramos el Dashboard. Si no, Login/Registro */}
          {user ? (
            <Link href="/dashboard" className="hover:text-blue-300 transition font-semibold">
              Mi Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="hover:text-blue-300 transition">
                Iniciar Sesión
              </Link>
              <Link href="/register" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 transition">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}