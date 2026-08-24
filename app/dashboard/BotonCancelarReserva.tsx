'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export default function BotonCancelarReserva({ id }: { id: string }) {
  const router = useRouter()
  const [cargando, setCargando] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const cancelarReserva = async () => {
    const confirmar = window.confirm('¿Estás seguro de que deseas cancelar esta reserva?')
    if (!confirmar) return

    setCargando(true)

    const { error } = await supabase
      .from('reservas')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Error al cancelar la reserva: ' + error.message)
      setCargando(false)
    } else {
      router.refresh()
    }
  }

  return (
    <button
      onClick={cancelarReserva}
      disabled={cargando}
      className="text-red-500 hover:text-red-700 font-semibold text-xs bg-red-50 hover:bg-red-100 px-3 py-1 rounded transition disabled:opacity-50"
    >
      {cargando ? 'Cancelando...' : 'Cancelar'}
    </button>
  )
}
