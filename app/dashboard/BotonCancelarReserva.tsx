'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cancelarReservaAction } from '../actions'

export default function BotonCancelarReserva({ id }: { id: string }) {
  const router = useRouter()
  const [cargando, setCargando] = useState(false)

  const cancelarReserva = async () => {
    const confirmar = window.confirm('¿Estás seguro de que deseas cancelar esta reserva?')
    if (!confirmar) return

    setCargando(true)

    try {
      await cancelarReservaAction(id)
      router.refresh()
    } catch (err: any) {
      alert('Error al cancelar la reserva: ' + err.message)
    } finally {
      setCargando(false)
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
