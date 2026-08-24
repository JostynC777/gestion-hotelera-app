'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export default function BotonEliminar({ id }: { id: any }) {
  const router = useRouter()
  const [cargando, setCargando] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const eliminar = async () => {
    // Pedimos confirmación para no borrar por accidente
    const confirmar = window.confirm('¿Estás seguro de que deseas eliminar esta habitación?')
    if (!confirmar) return

    setCargando(true)
    
    // Le decimos a Supabase que borre la fila que coincida con el ID
    const { error } = await supabase
      .from('habitaciones')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Error al eliminar: ' + error.message)
      setCargando(false)
    } else {
      router.refresh() // Actualiza la tabla automáticamente sin recargar la página entera
    }
  }

  return (
    <button
      onClick={eliminar}
      disabled={cargando}
      className="text-red-500 hover:text-red-700 font-semibold text-sm bg-red-50 hover:bg-red-100 px-3 py-1 rounded transition disabled:opacity-50"
    >
      {cargando ? 'Borrando...' : 'Eliminar'}
    </button>
  )
}