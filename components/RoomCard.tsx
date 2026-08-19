import Link from "next/link";

// Tipamos las Props con TypeScript para evitar el uso de 'any'
interface RoomCardProps {
  id: string;
  nombre: string;
  precio: number;
  descripcion: string;
}

export default function RoomCard({ id, nombre, precio, descripcion }: RoomCardProps) {
  return (
    <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition bg-white">
      <h2 className="text-2xl font-bold text-blue-900 mb-2">{nombre}</h2>
      <p className="text-gray-600 mb-4">{descripcion}</p>
      <div className="flex justify-between items-center">
        <span className="text-xl font-bold text-green-600">${precio} / noche</span>
        {/* Usamos el ID para la ruta dinámica obligatoria */}
        <Link 
          href={`/habitaciones/${id}`} 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Ver detalles
        </Link>
      </div>
    </div>
  );
}