import { createBrowserClient } from '@supabase/ssr'

// Creamos un cliente para componentes del lado del cliente
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}