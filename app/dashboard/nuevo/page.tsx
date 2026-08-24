'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NuevaHabitacion() {
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Estados para guardar lo que escribes en los inputs
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [archivoImagen, setArchivoImagen] = useState<File | null>(null)
  const [cargando, setCargando] = useState(false)

  // Función que se ejecuta al darle clic a "Guardar"
  const guardarHabitacion = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)

    let urlPublica = null

    if (archivoImagen) {
      const nombreArchivo = `${Date.now()}-${archivoImagen.name}`
      const { error: errorSubida } = await supabase.storage
        .from('imagenes-habitaciones')
        .upload(nombreArchivo, archivoImagen)

      if (errorSubida) {
        alert('Error al subir la imagen: ' + errorSubida.message)
        setCargando(false)
        return
      }

      const { data: urlData } = supabase.storage
        .from('imagenes-habitaciones')
        .getPublicUrl(nombreArchivo)

      urlPublica = urlData.publicUrl
    }

    const { error } = await supabase
      .from('habitaciones')
      .insert([
        {
          nombre: nombre,
          precio: parseFloat(precio),
          descripcion: descripcion,
          imagen_url: urlPublica
        }
      ])

    if (error) {
      alert('Error al guardar: ' + error.message)
      setCargando(false)
    } else {
      alert('¡Habitación guardada con éxito!')
      router.push('/dashboard') // Te regresa al panel principal
      router.refresh()
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Añadir Nueva Habitación</h1>
        <Link href="/dashboard" className="text-blue-600 hover:underline">
          Volver al Dashboard
        </Link>
      </div>

      <form onSubmit={guardarHabitacion} className="bg-white p-6 border rounded-lg shadow-sm flex flex-col gap-4">
        <div>
          <label className="block text-gray-700 mb-2 font-semibold">Nombre de la habitación</label>
          <input
            type="text"
            required
            className="w-full border p-2 rounded text-black"
            placeholder="Ej: Suite Presidencial"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2 font-semibold">Precio por noche ($)</label>
          <input
            type="number"
            required
            step="0.01"
            className="w-full border p-2 rounded text-black"
            placeholder="Ej: 150.00"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2 font-semibold">Descripción</label>
          <textarea
            required
            className="w-full border p-2 rounded text-black"
            rows={4}
            placeholder="Detalles de la habitación (TV, Wifi, balcón...)"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2 font-semibold">Fotografía de la Habitación</label>
          <input
            type="file"
            accept="image/*"
            className="w-full border p-2 rounded text-black bg-gray-50"
            onChange={(e) => setArchivoImagen(e.target.files?.[0] || null)}
          />
        </div>

        <button
          type="submit"
          disabled={cargando}
          className="mt-4 bg-blue-600 text-white font-semibold py-3 px-6 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {cargando ? 'Guardando en base de datos...' : 'Guardar Habitación'}
        </button>
      </form>
    </div>
  )
}