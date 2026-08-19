import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <aside className="w-full border-b border-slate-200 bg-white p-6 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
        <Link className="text-xl font-semibold text-slate-950" href="/dashboard">Panel de administración</Link>
        <nav className="mt-8 flex gap-4 text-sm text-slate-600 md:flex-col">
          <Link className="hover:text-slate-950" href="/dashboard">Resumen</Link>
          <Link className="hover:text-slate-950" href="/dashboard/nuevo">Nueva habitación</Link>
          <Link className="hover:text-slate-950" href="/habitaciones">Ver sitio público</Link>
        </nav>
      </aside>
      <section className="flex-1 p-6 md:p-10">{children}</section>
    </div>
  );
}