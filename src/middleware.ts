import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req: request, res })

    // Refresh session if expired
    const { data: { session } } = await supabase.auth.getSession()

    // Get the current path
    const path = request.nextUrl.pathname

    // If user is logged in and tries to access login page, redirect to home
    if (session && path === '/login') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.next()
  }
}

// Update matcher to exclude static assets and API routes
export const config = {
  matcher: ['/login']
} 