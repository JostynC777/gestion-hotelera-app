export default function NewRoomPage() {
  return (
    <main className="max-w-2xl">
      <p className="text-sm font-medium uppercase tracking-widest text-slate-500">Administración</p>
      <h1 className="mt-2 text-4xl font-semibold text-slate-950">Nueva habitación</h1>
      <form className="mt-8 space-y-5 border border-slate-200 bg-white p-6">
        <label className="block text-sm font-medium text-slate-700">Nombre<input className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" type="text" required /></label>
        <label className="block text-sm font-medium text-slate-700">Tipo<input className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" type="text" required /></label>
        <label className="block text-sm font-medium text-slate-700">Precio por noche<input className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" min="0" type="number" required /></label>
        <label className="block text-sm font-medium text-slate-700">Descripción<textarea className="mt-2 min-h-28 w-full rounded-lg border border-slate-300 px-4 py-3" required /></label>
        <button className="rounded-lg bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-700" type="submit">Guardar habitación</button>
      </form>
    </main>
  );
}