import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (!code) {
      throw new Error('No code provided')
    }

    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Exchange the code for a session
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    if (exchangeError) {
      throw exchangeError
    }

    // Get the session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) {
      throw sessionError
    }

    if (!session) {
      throw new Error('No session found')
    }

    // Redirect to create-board on successful auth
    return NextResponse.redirect(new URL('/create-board', request.url))
  } catch (error) {
    console.error('Auth callback error:', error)
    // Redirect to login with error
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent('Authentication failed')}`, request.url)
    )
  }
} 