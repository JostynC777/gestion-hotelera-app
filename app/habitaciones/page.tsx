import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { rooms } from "@/lib/rooms";

export default function RoomsPage() {
  return (
    <>
      <Navigation />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-sm font-medium uppercase tracking-widest text-slate-500">Alojamiento</p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-950">Habitaciones para descansar</h1>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {rooms.map((room) => (
            <article className="border border-slate-200 bg-white p-6" key={room.id}>
              <p className="text-sm text-slate-500">{room.type}</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">{room.name}</h2>
              <p className="mt-4 text-slate-600">{room.description}</p>
              <p className="mt-6 font-medium text-slate-950">Desde {room.price} € / noche</p>
              <Link className="mt-6 inline-block text-sm font-medium underline" href={`/habitaciones/${room.id}`}>Ver habitación</Link>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}