'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { editarHabitacionAction } from '../../../actions'

export default function EditarHabitacion({ params }: { params: { id: string } }) {
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Estados para los inputs
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [imagenUrlExistente, setImagenUrlExistente] = useState<string | null>(null)
  const [archivoImagen, setArchivoImagen] = useState<File | null>(null)
  
  const [cargandoDatos, setCargandoDatos] = useState(true)
  const [guardando, setGuardando] = useState(false)

  // Cargar datos actuales de la habitación
  useEffect(() => {
    const cargarHabitacion = async () => {
      try {
        const { data: hab, error } = await supabase
          .from('habitaciones')
          .select('*')
          .eq('id', params.id)
          .single()

        if (error) throw error

        if (hab) {
          setNombre(hab.nombre)
          setPrecio(hab.precio.toString())
          setDescripcion(hab.descripcion)
          setImagenUrlExistente(hab.imagen_url)
        }
      } catch (err: any) {
        alert('Error al cargar datos: ' + err.message)
        router.push('/dashboard')
      } finally {
        setCargandoDatos(false)
      }
    }

    cargarHabitacion()
  }, [params.id, router, supabase])

  // Guardar cambios utilizando la Server Action
  const guardarCambios = async (e: React.FormEvent) => {
    e.preventDefault()
    setGuardando(true)

    let urlPublica = imagenUrlExistente

    // Si el usuario seleccionó un nuevo archivo, lo subimos a Supabase Storage
    if (archivoImagen) {
      const nombreArchivo = `${Date.now()}-${archivoImagen.name}`
      const { error: errorSubida } = await supabase.storage
        .from('imagenes-habitaciones')
        .upload(nombreArchivo, archivoImagen)

      if (errorSubida) {
        alert('Error al subir la nueva imagen: ' + errorSubida.message)
        setGuardando(false)
        return
      }

      const { data: urlData } = supabase.storage
        .from('imagenes-habitaciones')
        .getPublicUrl(nombreArchivo)

      urlPublica = urlData.publicUrl
    }

    try {
      // Llamamos a la Server Action de actualizar
      await editarHabitacionAction(params.id, {
        nombre: nombre,
        precio: parseFloat(precio),
        descripcion: descripcion,
        imagenUrl: urlPublica,
      })

      alert('¡Habitación actualizada con éxito!')
      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      alert('Error al guardar cambios: ' + err.message)
      setGuardando(false)
    }
  }

  if (cargandoDatos) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center animate-pulse">
          <span className="text-sm text-amber-500 uppercase tracking-widest block mb-2">Cargando</span>
          <p className="text-lg font-semibold text-slate-300">Cargando detalles de habitación...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 py-16 px-6 text-slate-100 selection:bg-amber-500 selection:text-slate-950">
      <div className="max-w-2xl mx-auto">
        
        {/* Cabecera */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-900">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-500">Panel de Control</span>
            <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight mt-1 font-serif">Editar Habitación</h1>
          </div>
          <Link 
            href="/dashboard" 
            className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al Dashboard
          </Link>
        </div>

        {/* Formulario */}
        <form onSubmit={guardarCambios} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl flex flex-col gap-6 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
              Nombre de la habitación
            </label>
            <input
              type="text"
              required
              className="w-full rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 px-4 py-3.5 outline-none transition duration-200"
              placeholder="Ej: Suite Presidencial Vista al Mar"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
              Precio por noche ($ USD)
            </label>
            <input
              type="number"
              required
              step="0.01"
              className="w-full rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 px-4 py-3.5 outline-none transition duration-200"
              placeholder="Ej: 180.00"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
              Descripción de Características
            </label>
            <textarea
              required
              className="w-full rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 px-4 py-3.5 outline-none transition duration-200 resize-none"
              rows={4}
              placeholder="Detalles..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          {/* Mostrar Imagen Existente */}
          {imagenUrlExistente && !archivoImagen && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                Fotografía Actual
              </label>
              <div className="relative w-48 h-32 rounded-xl overflow-hidden border border-slate-800">
                <img 
                  src={imagenUrlExistente} 
                  alt="Actual" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
              Cambiar Fotografía (Opcional)
            </label>
            
            <div className="relative border-2 border-dashed border-slate-800 hover:border-amber-500/50 rounded-2xl p-6 bg-slate-950/45 transition-colors cursor-pointer group flex flex-col items-center justify-center text-center">
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => setArchivoImagen(e.target.files?.[0] || null)}
              />
              
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-slate-500 group-hover:text-amber-400 transition-colors mb-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              
              <span className="text-xs font-bold text-slate-300">
                {archivoImagen ? archivoImagen.name : 'Selecciona una nueva imagen para reemplazar la actual'}
              </span>
              <span className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold mt-1">
                Formatos soportados: PNG, JPG, WEBP (Max 5MB)
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={guardando}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {guardando ? 'Guardando Cambios...' : 'Guardar Cambios'}
          </button>
        </form>
      </div>
    </div>
  )
}
