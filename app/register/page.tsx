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

    // 2. Registramos al usuario en Supabase Auth[cite: 1]
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Error al registrar:", error.message);
      // redirect("/register?error=true");
    }

    // 3. Guardamos el rol en la base de datos, extendiendo el perfil del usuario[cite: 1]
    if (data.user) {
      await supabase.from("perfiles").insert({
        id: data.user.id,
        nombre: nombre,
        rol: "huesped", // Rol por defecto[cite: 1]
      });
    }

    // 4. Si todo sale bien, lo enviamos al login
    redirect("/login?registrado=true");
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <p className="mb-3 text-sm font-medium text-blue-600">Hotel Gestión</p>
      <h1 className="text-3xl font-semibold text-slate-950">Crear una cuenta</h1>
      
      {/* Conectamos el formulario con la Server Action usando "action" */}
      <form action={signUp} className="mt-8 space-y-5">
        <label className="block text-sm font-medium text-slate-700">
          Nombre
          {/* Agregamos el atributo 'name' para que la Action lo reconozca */}
          <input name="nombre" className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" type="text" required />
        </label>
        
        <label className="block text-sm font-medium text-slate-700">
          Correo electrónico
          <input name="email" className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" type="email" required />
        </label>
        
        <label className="block text-sm font-medium text-slate-700">
          Contraseña
          <input name="password" className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" type="password" required />
        </label>
        
        <button className="w-full rounded-lg bg-blue-900 px-4 py-3 font-medium text-white hover:bg-blue-800 transition" type="submit">
          Crear cuenta
        </button>
      </form>
      
      <p className="mt-6 text-sm text-slate-600">
        ¿Ya tienes cuenta? <Link className="font-medium text-blue-600 hover:text-blue-800 underline" href="/login">Inicia sesión</Link>
      </p>
    </main>
  );
}