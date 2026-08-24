'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { eliminarHabitacionAction } from '../actions'

export default function BotonEliminar({ id }: { id: any }) {
  const router = useRouter()
  const [cargando, setCargando] = useState(false)

  const eliminar = async () => {
    const confirmar = window.confirm('¿Estás seguro de que deseas eliminar esta habitación?')
    if (!confirmar) return

    setCargando(true)
    
    try {
      await eliminarHabitacionAction(id)
      router.refresh()
    } catch (err: any) {
      if (err.message.includes('violates foreign key constraint') || err.message.includes('reservas_habitacion_id_fkey')) {
        alert('No se puede eliminar esta habitación porque tiene reservas asociadas. Por favor, cancela primero las reservas de esta habitación en el historial antes de eliminarla.');
      } else {
        alert('Error al eliminar: ' + err.message)
      }
      setCargando(false)
    }
  }

  return (
    <button
      onClick={eliminar}
      disabled={cargando}
      className="text-red-400 hover:text-red-300 hover:bg-red-950/40 border border-red-900/30 hover:border-red-900/60 font-bold text-xs px-3 py-1.5 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {cargando ? 'Borrando...' : 'Eliminar'}
    </button>
  )
}