import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  try {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })
    const { data: { session } } = await supabase.auth.getSession()

    // Allow access to public routes and board features
    const publicRoutes = ['/', '/login', '/auth/callback']
    const publicBoardRoutes = ['/board/[id]/feature-request', '/board/[id]/roadmap']
    const isPublicBoardRoute = publicBoardRoutes.some(route => 
      req.nextUrl.pathname.includes(route.replace('[id]', ''))
    )

    if (publicRoutes.includes(req.nextUrl.pathname) || isPublicBoardRoute) {
      return res
    }

    // Protect private routes
    if (!session) {
      const redirectUrl = new URL('/login', req.url)
      redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 