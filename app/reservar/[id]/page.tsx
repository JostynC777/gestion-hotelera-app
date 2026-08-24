'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ReservarPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [fecha, setFecha] = useState('')
  const [cargando, setCargando] = useState(false)
  const [usuarioId, setUsuarioId] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Cuando la página carga, buscamos quién es el usuario logueado
  useEffect(() => {
    const obtenerUsuario = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUsuarioId(user.id)
      } else {
        alert('Debes iniciar sesión para poder reservar.')
        router.push('/login')
      }
    }
    obtenerUsuario()
  }, [router, supabase])

  const confirmarReserva = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!usuarioId) return

    setCargando(true)

    // Insertamos los datos exactos que me mostraste en la imagen
    const { error } = await supabase
      .from('reservas')
      .insert([
        {
          huesped_id: usuarioId,
          habitacion_id: params.id,
          fecha: fecha
        }
      ])

    if (error) {
      alert('Error al reservar: ' + error.message)
      setCargando(false)
    } else {
      alert('¡Reserva confirmada con éxito! Te esperamos.')
      router.push('/dashboard') // Lo mandamos a su panel al terminar
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <h1 className="text-2xl font-bold text-blue-900 mb-2 text-center">Completar Reserva</h1>
        <p className="text-gray-500 text-sm text-center mb-6">Estás a un paso de asegurar tu descanso.</p>
        
        <form onSubmit={confirmarReserva} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">¿En qué fecha deseas hospedarte?</label>
            <input
              type="date"
              required
              className="w-full border p-3 rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={cargando || !usuarioId}
            className="mt-4 bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 shadow-sm"
          >
            {cargando ? 'Procesando tu reserva...' : 'Confirmar Reserva'}
          </button>
          
          <Link href="/habitaciones" className="text-center text-gray-500 hover:text-blue-600 transition mt-2 text-sm">
            Cancelar y volver al catálogo
          </Link>
        </form>
      </div>
    </div>
  )
}