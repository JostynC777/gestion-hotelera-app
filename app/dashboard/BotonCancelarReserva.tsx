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
      className="text-red-450 hover:text-red-300 hover:bg-red-950/40 border border-red-900/30 hover:border-red-900/60 font-bold text-xs px-3 py-1.5 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {cargando ? 'Cancelando...' : 'Cancelar Reserva'}
    </button>
  )
}
