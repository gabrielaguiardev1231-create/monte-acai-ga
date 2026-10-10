import { createServerClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Rotas públicas que não precisam de autenticação
  const publicPaths = ['/', '/login', '/register', '/auth/callback']
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path))

  // Rotas de API públicas
  const isApiPublic = request.nextUrl.pathname.startsWith('/api/webhooks')

  if (!user && !isPublicPath && !isApiPublic && !request.nextUrl.pathname.startsWith('/api/')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Verificar se é rota de admin e usuário tem permissão
  if (request.nextUrl.pathname.startsWith('/admin') && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}