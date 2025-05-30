import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define routes that don't require authentication
const publicRoutes = ['/login', '/register']

// Define static asset paths that should be publicly accessible
const publicAssets = ['/favicon.ico', '/icon.png']

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
    return res
  }
}

// Update matcher to exclude static assets and API routes
export const config = {
  matcher: ['/login']
} 