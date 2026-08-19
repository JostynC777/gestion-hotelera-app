import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <p className="mb-3 text-sm font-medium text-slate-500">Casa Nerea</p>
      <h1 className="text-3xl font-semibold text-slate-950">Iniciar sesión</h1>
      <p className="mt-2 text-slate-600">Accede a tu cuenta para gestionar tus reservas.</p>
      <form className="mt-8 space-y-5">
        <label className="block text-sm font-medium text-slate-700">Correo electrónico<input className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" type="email" required /></label>
        <label className="block text-sm font-medium text-slate-700">Contraseña<input className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" type="password" required /></label>
        <button className="w-full rounded-lg bg-slate-900 px-4 py-3 font-medium text-white hover:bg-slate-700" type="submit">Entrar</button>
      </form>
      <p className="mt-6 text-sm text-slate-600">¿Aún no tienes cuenta? <Link className="font-medium text-slate-950 underline" href="/register">Regístrate</Link></p>
    </main>
  );
}