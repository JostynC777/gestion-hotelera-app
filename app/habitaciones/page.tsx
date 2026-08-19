import RoomCard from "../../components/RoomCard";

export default function HabitacionesPage() {
  // Datos temporales (hardcodeados) para probar nuestro componente
  // En el Día 3 reemplazaremos esto con datos reales de Supabase[cite: 1]
  const habitacionesDemo = [
    { id: "1", nombre: "Suite Presidencial", precio: 250, descripcion: "Vista al mar con cama King y balcón." },
    { id: "2", nombre: "Habitación Doble", precio: 120, descripcion: "Dos camas matrimoniales, ideal para familias." },
    { id: "3", nombre: "Habitación Sencilla", precio: 80, descripcion: "Cómoda y económica para viajeros solos." }
  ];

  return (
    <main className="container mx-auto p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-blue-900 mb-8">Nuestras Habitaciones</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {habitacionesDemo.map((hab) => (
          <RoomCard 
            key={hab.id}
            id={hab.id}
            nombre={hab.nombre}
            precio={hab.precio}
            descripcion={hab.descripcion}
          />
        ))}
      </div>
    </main>
  );
}