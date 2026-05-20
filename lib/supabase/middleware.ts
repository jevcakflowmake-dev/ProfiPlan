import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

type CookieSetItem = { name: string; value: string; options?: CookieOptions }

const PUBLIC_PATHS = ['/', '/login', '/register', '/demo']

function isPublic(path: string): boolean {
  if (PUBLIC_PATHS.includes(path)) return true
  if (path.startsWith('/demo/')) return true
  if (path.startsWith('/api/health')) return true
  return false
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Pokud chybí env vars — propustíme všechny public routes; dashboard pošleme na /login.
  if (!url || !anonKey) {
    if (!isPublic(request.nextUrl.pathname)) {
      const redirect = request.nextUrl.clone()
      redirect.pathname = '/login'
      return NextResponse.redirect(redirect)
    }
    return response
  }

  try {
    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: CookieSetItem[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    })

    const { data: { user } } = await supabase.auth.getUser()

    const path = request.nextUrl.pathname
    const authPage = path === '/login' || path === '/register'

    if (!user && !isPublic(path) && !authPage) {
      const redirect = request.nextUrl.clone()
      redirect.pathname = '/login'
      redirect.searchParams.set('next', path)
      return NextResponse.redirect(redirect)
    }
    if (user && authPage) {
      const redirect = request.nextUrl.clone()
      redirect.pathname = '/dashboard'
      return NextResponse.redirect(redirect)
    }
  } catch (err) {
    console.error('[middleware] Supabase failure — pouštím request dál.', err)
  }

  return response
}
