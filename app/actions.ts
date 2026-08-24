'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

// Inicializar cliente Supabase del lado del servidor
function getSupabaseServerClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch (error) {
            // Este catch evita errores si se intenta setear cookies en Server Components de solo lectura
          }
        },
      },
    }
  )
}

// 1. CREAR HABITACIÓN
export async function crearHabitacionAction(data: {
  nombre: string
  precio: number
  descripcion: string
  imagenUrl: string | null
}) {
  const supabase = getSupabaseServerClient()

  // Verificamos permisos (solo admin)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autorizado')

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol')
    .eq('id', user.id)
    .single()

  if (perfil?.rol !== 'admin') {
    throw new Error('Permisos insuficientes')
  }

  const { error } = await supabase.from('habitaciones').insert([
    {
      nombre: data.nombre,
      precio: data.precio,
      descripcion: data.descripcion,
      imagen_url: data.imagenUrl,
    },
  ])

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/habitaciones')
  revalidatePath('/dashboard')
}

// 2. EDITAR HABITACIÓN (UPDATE)
export async function editarHabitacionAction(
  id: string,
  data: {
    nombre: string
    precio: number
    descripcion: string
    imagenUrl: string | null
  }
) {
  const supabase = getSupabaseServerClient()

  // Verificamos permisos (solo admin)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autorizado')

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol')
    .eq('id', user.id)
    .single()

  if (perfil?.rol !== 'admin') {
    throw new Error('Permisos insuficientes')
  }

  // Si se pasa una nueva imagen se actualiza, de lo contrario mantenemos la anterior
  const updateData: any = {
    nombre: data.nombre,
    precio: data.precio,
    descripcion: data.descripcion,
  }

  if (data.imagenUrl !== undefined) {
    updateData.imagen_url = data.imagenUrl
  }

  const { error } = await supabase
    .from('habitaciones')
    .update(updateData)
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/habitaciones')
  revalidatePath('/dashboard')
}

// 3. ELIMINAR HABITACIÓN
export async function eliminarHabitacionAction(id: string) {
  const supabase = getSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autorizado')

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol')
    .eq('id', user.id)
    .single()

  if (perfil?.rol !== 'admin') {
    throw new Error('Permisos insuficientes')
  }

  const { error } = await supabase.from('habitaciones').delete().eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/habitaciones')
  revalidatePath('/dashboard')
}

// 4. CREAR RESERVA
export async function crearReservaAction(data: {
  habitacionId: string
  fecha: string
}) {
  const supabase = getSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Debes iniciar sesión para reservar')

  const { error } = await supabase.from('reservas').insert([
    {
      huesped_id: user.id,
      habitacion_id: data.habitacionId,
      fecha: data.fecha,
    },
  ])

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/dashboard')
}

// 5. CANCELAR RESERVA
export async function cancelarReservaAction(id: string) {
  const supabase = getSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autorizado')

  const { error } = await supabase.from('reservas').delete().eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/dashboard')
}
