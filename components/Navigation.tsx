import Link from "next/link";

export function Navigation() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link className="text-xl font-semibold tracking-tight text-slate-900" href="/">
          Casa Nerea
        </Link>
        <div className="flex items-center gap-5 text-sm text-slate-600">
          <Link className="hover:text-slate-950" href="/habitaciones">Habitaciones</Link>
          <Link className="hover:text-slate-950" href="/login">Iniciar sesión</Link>
          <Link className="rounded-full bg-slate-900 px-4 py-2 text-white hover:bg-slate-700" href="/register">Registrarse</Link>
        </div>
      </nav>
    </header>
  );
}