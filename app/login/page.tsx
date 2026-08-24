import Link from "next/link";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function LoginPage() {
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
      // Si falla (ej. contraseña incorrecta), recargamos la página con un error en la URL
      redirect("/login?error=true");
    }

    // 3. Si las credenciales son correctas, lo enviamos a su panel protegido
    redirect("/dashboard");
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <p className="mb-3 text-sm font-medium text-blue-600">Hotel Gestión</p>
      <h1 className="text-3xl font-semibold text-slate-950">Iniciar sesión</h1>
      <p className="mt-2 text-slate-600">Accede a tu cuenta para gestionar tus reservas.</p>
      
      {/* Conectamos el formulario a la Server Action */}
      <form action={signIn} className="mt-8 space-y-5">
        <label className="block text-sm font-medium text-slate-700">
          Correo electrónico
          {/* Es vital el atributo name="email" para capturar el dato */}
          <input name="email" className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" type="email" required />
        </label>
        
        <label className="block text-sm font-medium text-slate-700">
          Contraseña
          {/* Es vital el atributo name="password" */}
          <input name="password" className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" type="password" required />
        </label>
        
        <button className="w-full rounded-lg bg-blue-900 px-4 py-3 font-medium text-white hover:bg-blue-800 transition" type="submit">
          Entrar
        </button>
      </form>
      
      <p className="mt-6 text-sm text-slate-600">
        ¿Aún no tienes cuenta? <Link className="font-medium text-blue-600 hover:text-blue-800 underline" href="/register">Regístrate</Link>
      </p>
    </main>
  );
}