import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <h1 className="text-4xl font-bold text-blue-900 mb-4 text-center">
        Bienvenido al Sistema de Gestión Hotelera
      </h1>
      <p className="text-lg text-gray-600 mb-8 text-center">
        Encuentra y reserva la habitación perfecta para tu próxima estadía.
      </p>
      <Link 
        href="/habitaciones" 
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Explorar Habitaciones
      </Link>
    </main>
  );
}