import Link from "next/link";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const isError = searchParams?.error === "true";
  const isRegistered = searchParams?.registrado === "true";

  // Server Action para procesar el inicio de sesión de forma segura
  const signIn = async (formData: FormData) => {
    "use server";
    
    // 1. Extraemos los datos de los inputs
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

    // 2. Autenticamos al usuario con Supabase
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error al iniciar sesión:", error.message);
      // Si falla, recargamos la página con un error en la URL
      redirect("/login?error=true");
    }

    // 3. Si las credenciales son correctas, lo enviamos a su panel protegido
    redirect("/dashboard");
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Bienvenido de nuevo</h1>
          <p className="text-slate-400 text-sm mt-1">Ingresa tus datos para acceder a tus reservas</p>
        </div>

        {/* Mensajes de feedback */}
        {isError && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2.5">
            <span className="text-sm">⚠️</span>
            <span>Correo o contraseña incorrectos. Por favor, verifica tus credenciales.</span>
          </div>
        )}

        {isRegistered && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2.5">
            <span className="text-sm">✨</span>
            <span>¡Cuenta creada con éxito! Ahora puedes iniciar sesión.</span>
          </div>
        )}

        {/* Formulario */}
        <form action={signIn} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">
              Correo electrónico
            </label>
            <input 
              name="email" 
              className="mt-2 w-full rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 px-4 py-3 outline-none transition duration-200" 
              type="email" 
              placeholder="ejemplo@correo.com"
              required 
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">
                Contraseña
              </label>
            </div>
            <input 
              name="password" 
              className="mt-2 w-full rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 px-4 py-3 outline-none transition duration-200" 
              type="password" 
              placeholder="••••••••"
              required 
            />
          </div>
          
          <button 
            className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold py-3.5 transition-all duration-300 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 hover:scale-[1.01]" 
            type="submit"
          >
            Iniciar Sesión
          </button>
        </form>
        
        {/* Pie del formulario */}
        <div className="mt-8 text-center border-t border-slate-800/80 pt-6">
          <p className="text-xs text-slate-400">
            ¿Aún no tienes cuenta?{" "}
            <Link className="font-semibold text-amber-400 hover:text-amber-300 hover:underline transition-colors" href="/register">
              Regístrate ahora
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}