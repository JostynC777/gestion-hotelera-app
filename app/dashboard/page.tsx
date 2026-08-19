import { rooms } from "@/lib/rooms";

export default function DashboardPage() {
  return (
    <main>
      <p className="text-sm font-medium uppercase tracking-widest text-slate-500">Administración</p>
      <h1 className="mt-2 text-4xl font-semibold text-slate-950">Resumen del hotel</h1>
      <div className="mt-8 border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-500">Habitaciones publicadas</p>
        <p className="mt-2 text-4xl font-semibold text-slate-950">{rooms.length}</p>
      </div>
    </main>
  );
}