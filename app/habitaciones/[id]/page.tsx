import Link from "next/link";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { getRoom } from "@/lib/rooms";

export default function RoomDetailPage({ params }: { params: { id: string } }) {
  const room = getRoom(params.id);

  if (!room) notFound();

  return (
    <>
      <Navigation />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <Link className="text-sm text-slate-500 underline" href="/habitaciones">Volver a habitaciones</Link>
        <p className="mt-10 text-sm text-slate-500">{room.type}</p>
        <h1 className="mt-2 text-5xl font-semibold text-slate-950">{room.name}</h1>
        <p className="mt-6 text-lg text-slate-600">{room.description}</p>
        <p className="mt-8 text-xl font-medium text-slate-950">{room.price} € / noche</p>
        <button className="mt-8 rounded-lg bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-700" type="button">Consultar disponibilidad</button>
      </main>
    </>
  );
}