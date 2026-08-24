import Link from 'next/link'

// API Externa: Consumo de clima usando fetch + async/await con manejo de errores
async function getWeatherData() {
  try {
    // Coordenadas de Cancún, México (un destino turístico exclusivo)
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=21.1619&longitude=-86.8515&current=temperature_2m,weather_code'
    
    const res = await fetch(url, {
      next: { revalidate: 1800 } // Revalidar cada 30 minutos
    })

    if (!res.ok) {
      throw new Error('Error en respuesta de la API de clima')
    }

    const data = await res.json()
    return {
      temp: data.current.temperature_2m,
      code: data.current.weather_code,
      error: null
    }
  } catch (error: any) {
    console.error('Error al consumir API de clima:', error.message)
    return {
      temp: null,
      code: null,
      error: 'Información del clima no disponible temporalmente'
    }
  }
}

// Mapeador de códigos de clima según especificaciones WMO de Open-Meteo
function obtenerDescripcionClima(codigo: number | null): string {
  if (codigo === null) return 'Templado'
  if (codigo === 0) return '☀️ Despejado y Soleado'
  if (codigo >= 1 && codigo <= 3) return '⛅ Parcialmente Nublado'
  if (codigo === 45 || codigo === 48) return '🌫️ Neblina'
  if (codigo >= 51 && codigo <= 55) return '🌦️ Llovizna Ligera'
  if (codigo >= 61 && codigo <= 65) return '🌧️ Lluvia'
  if (codigo >= 80 && codigo <= 82) return '🌧️ Chubascos de Lluvia'
  if (codigo >= 95 && codigo <= 99) return '⛈️ Tormenta'
  return '🌡️ Templado'
}

export default async function Home() {
  const clima = await getWeatherData()
  const descripcionClima = obtenerDescripcionClima(clima.code)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950">
      
      {/* HERO SECTION */}
      <main className="flex-grow">
        <section className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28">
          {/* Fondo decorativo con gradiente y efecto de patrón */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/35 via-slate-950 to-slate-950 -z-10" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
          
          <div className="container mx-auto px-6 max-w-5xl text-center flex flex-col items-center">
            
            {/* Badges de Lujo y Clima (API Externa) */}
            <div className="flex flex-col sm:flex-row gap-3 items-center mb-8">
              {/* Badge 1: Booking */}
              <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full py-1.5 px-4 shadow-sm">
                <span className="flex text-amber-400 text-xs">★ ★ ★ ★ ★</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                <span className="text-xs font-semibold text-slate-300">Puntuación 4.9/5 en Booking</span>
              </div>

              {/* Badge 2: Clima en tiempo real (API Externa) */}
              <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full py-1.5 px-4 shadow-sm">
                <span className="text-xs">🌴</span>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Clima en el Resort:</span>
                {clima.error ? (
                  <span className="text-[11px] text-slate-400">{clima.error}</span>
                ) : (
                  <span className="text-[11px] text-slate-200 font-semibold">
                    {clima.temp}°C — {descripcionClima}
                  </span>
                )}
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold max-w-4xl tracking-tight leading-[1.1] mb-8">
              Descubre el Arte del <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 font-serif italic">
                Descanso Absoluto
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
              Administra tus reservas, explora suites presidenciales con vistas de ensueño y experimenta una estadía memorable potenciada por nuestra gestión digital inteligente.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
              <Link 
                href="/habitaciones" 
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 transition-all duration-300 hover:scale-[1.02] text-center"
              >
                Explorar Habitaciones
              </Link>
              <Link 
                href="/dashboard" 
                className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 font-semibold py-3.5 px-8 rounded-xl transition-all duration-300 text-center"
              >
                Panel de Reserva
              </Link>
            </div>
          </div>
        </section>

        {/* SECCIÓN DE AMENIDADES / SERVICIOS */}
        <section className="py-20 border-t border-slate-900 bg-slate-950">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-3">Servicios Premium</h2>
              <p className="text-3xl md:text-4xl font-bold text-slate-100">Disfruta de una Experiencia Sin Límites</p>
              <p className="text-slate-400 mt-4">Nos enfocamos en cada detalle para garantizar que tu estadía sea relajante, lujosa y tecnológicamente impecable.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Servicio 1 */}
              <div className="bg-slate-900/50 border border-slate-900 p-6 rounded-2xl shadow-sm hover:border-slate-800 transition duration-300">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400 mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-100 mb-2">Suites de Lujo</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Diseñadas para maximizar el confort, con camas premium y espectaculares vistas panorámicas.</p>
              </div>

              {/* Servicio 2 */}
              <div className="bg-slate-900/50 border border-slate-900 p-6 rounded-2xl shadow-sm hover:border-slate-800 transition duration-300">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400 mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-100 mb-2">Reserva Inmediata</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Olvídate de procesos lentos. Nuestro sistema de reserva en la nube es instantáneo y seguro.</p>
              </div>

              {/* Servicio 3 */}
              <div className="bg-slate-900/50 border border-slate-900 p-6 rounded-2xl shadow-sm hover:border-slate-800 transition duration-300">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400 mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5a3 3 0 003-3V6.7m0 0l-3-3m3 3l3-3M6.7 21h10.6" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-100 mb-2">Ubicaciones Únicas</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Nuestros hoteles se sitúan en los destinos turísticos y financieros más atractivos y seguros.</p>
              </div>

              {/* Servicio 4 */}
              <div className="bg-slate-900/50 border border-slate-900 p-6 rounded-2xl shadow-sm hover:border-slate-800 transition duration-300">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400 mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-100 mb-2">Seguridad Total</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Encriptación de datos bancarios y personal altamente calificado para tu tranquilidad y resguardo.</p>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIOS */}
        <section className="py-20 border-t border-slate-900 bg-slate-950/40">
          <div className="container mx-auto px-6 max-w-5xl">
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-500 text-center mb-3">Testimonios</h2>
            <h3 className="text-3xl font-bold text-center text-slate-100 mb-14">La Opinión de Nuestros Huéspedes</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl relative shadow-md">
                <span className="absolute top-6 right-8 text-5xl text-amber-500/10 font-serif pointer-events-none">“</span>
                <p className="text-slate-300 italic mb-6">
                  "Una estancia mágica. El proceso de reservación en línea fue increíblemente sencillo y rápido. Al llegar, la habitación superó todas nuestras expectativas de confort y elegancia."
                </p>
                <div>
                  <h4 className="font-bold text-slate-100">Alejandra R.</h4>
                  <p className="text-xs text-amber-400 font-medium">Huésped de la Suite Marina</p>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl relative shadow-md">
                <span className="absolute top-6 right-8 text-5xl text-amber-500/10 font-serif pointer-events-none">“</span>
                <p className="text-slate-300 italic mb-6">
                  "Soy un viajero frecuente de negocios y valoro mucho la eficiencia. El panel de usuario me permitió cancelar y modificar mis fechas sin llamadas molestas. Excelente servicio."
                </p>
                <div>
                  <h4 className="font-bold text-slate-100">Carlos M.</h4>
                  <p className="text-xs text-amber-400 font-medium">Huésped de Premium Ciudad</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-900 text-slate-500 py-12">
        <div className="container mx-auto px-6 max-w-5xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-amber-500 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-slate-950 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-sm font-bold tracking-wider text-slate-200">GRAND PALACE HOTEL</span>
          </div>
          <p className="text-xs text-center md:text-left">
            &copy; 2026 Grand Palace Hotel. Sistema de Gestión Inteligente. Proyecto Académico.
          </p>
        </div>
      </footer>
    </div>
  )
}