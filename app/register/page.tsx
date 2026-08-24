import Link from "next/link";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function RegisterPage() {
  // Esta es la Server Action que procesa el formulario
  const signUp = async (formData: FormData) => {
    "use server";
    
    // 1. Extraemos los datos de los inputs
    const nombre = formData.get("nombre") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch (error) {}
          },
        },
      }
    );

    // 2. Registramos al usuario en Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Error al registrar:", error.message);
      // Opcional: Redirigir con error si falla
      redirect("/register?error=true");
    }

    // 3. Guardamos el rol en la base de datos, extendiendo el perfil del usuario
    if (data.user) {
      await supabase.from("perfiles").insert({
        id: data.user.id,
        nombre: nombre,
        rol: "huesped", // Rol por defecto
      });
    }

    // 4. Si todo sale bien, lo enviamos al login
    redirect("/login?registrado=true");
  };

  return (
    <main className="min-h-[90vh] bg-slate-950 flex flex-col justify-center px-6 py-12 relative overflow-hidden selection:bg-amber-500 selection:text-slate-950">
      {/* Luces de Fondo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="w-full max-w-md mx-auto bg-slate-900 border border-slate-800/80 p-8 rounded-3xl shadow-2xl relative">
        {/* Cabecera del formulario */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-400 mx-auto mb-4 border border-amber-500/20">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Crea tu Cuenta</h1>
          <p className="text-slate-400 text-sm mt-1">Registra tus datos para comenzar a planear tu estadía</p>
        </div>

        {/* Formulario */}
        <form action={signUp} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">
              Nombre Completo
            </label>
            <input 
              name="nombre" 
              className="mt-2 w-full rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 px-4 py-3 outline-none transition duration-200" 
              type="text" 
              placeholder="Juan Pérez"
              required 
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">
              Correo electrónico
            </label>
            <input 
              name="email" 
              className="mt-2 w-full rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 px-4 py-3 outline-none transition duration-200" 
              type="email" 
              placeholder="juan.perez@correo.com"
              required 
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">
              Contraseña
            </label>
            <input 
              name="password" 
              className="mt-2 w-full rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 px-4 py-3 outline-none transition duration-200" 
              type="password" 
              placeholder="Mínimo 6 caracteres"
              required 
            />
          </div>
          
          <button 
            className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold py-3.5 transition-all duration-300 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 hover:scale-[1.01]" 
            type="submit"
          >
            Registrarse
          </button>
        </form>
        
        {/* Pie del formulario */}
        <div className="mt-8 text-center border-t border-slate-800/80 pt-6">
          <p className="text-xs text-slate-400">
            ¿Ya tienes una cuenta?{" "}
            <Link className="font-semibold text-amber-400 hover:text-amber-300 hover:underline transition-colors" href="/login">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}