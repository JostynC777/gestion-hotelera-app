import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white flex flex-col justify-between">
      <header className="container mx-auto px-6 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wider">HOTEL GESTIÓN</h1>
        <div className="flex gap-4">
          <Link href="/login" className="px-4 py-2 text-sm font-semibold hover:bg-blue-800 rounded-lg transition">
            Iniciar Sesión
          </Link>
          <Link href="/register" className="px-4 py-2 text-sm font-semibold bg-white text-blue-900 rounded-lg shadow hover:bg-gray-100 transition">
            Registrarse
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 text-center py-20 flex flex-col items-center">
        <span className="bg-blue-700 text-blue-200 text-xs font-bold uppercase tracking-widest py-1 px-3 rounded-full mb-4">
          Experiencia y Confort
        </span>
        <h2 className="text-5xl md:text-6xl font-extrabold max-w-3xl mb-6 leading-tight">
          Descansa como te mereces en nuestro espacio exclusivo
        </h2>
        <p className="text-lg text-blue-200 max-w-xl mb-10">
          Administra tus reservas, explora habitaciones de lujo y vive una estadía inolvidable con nuestro sistema de gestión inteligente.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/habitaciones" className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition text-lg">
            Ver Habitaciones
          </Link>
          <Link href="/dashboard" className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-900 font-bold py-3 px-8 rounded-xl transition text-lg">
            Ir al Panel
          </Link>
        </div>
      </main>

      <footer className="container mx-auto px-6 py-6 text-center text-blue-300 text-sm border-t border-blue-800/50">
        Sistema Gestor Hotelero - Proyecto Académico &copy; 2026
      </footer>
    </div>
  )
}