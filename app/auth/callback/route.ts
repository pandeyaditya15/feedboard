import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next') || '/create-board'

    if (code) {
      const cookieStore = cookies()
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
      
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) {
        throw error
      }

      // Refresh the session
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Session not found after code exchange')
      }
    }

    return NextResponse.redirect(new URL(next, request.url))
  } catch (error) {
    console.error('Auth callback error:', error)
    return NextResponse.redirect(new URL('/login?error=auth', request.url))
  }
} 