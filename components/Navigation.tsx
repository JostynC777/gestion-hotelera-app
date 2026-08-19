import Link from 'next/link';

export default function Navigation() {
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
          <Link href="/login" className="hover:text-blue-300 transition">
            Iniciar Sesión
          </Link>
          <Link href="/register" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 transition">
            Registrarse
          </Link>
        </div>
      </div>
    </nav>
  );
}