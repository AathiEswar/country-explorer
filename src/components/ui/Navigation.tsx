'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Navigation() {
  const pathname = usePathname()
  const [session, setSession] = useState<boolean | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(!!session)
      } catch (error) {
        console.error('Error checking session:', error)
        setSession(null)
      } finally {
        setMounted(true)
      }
    }

    checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(!!session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      window.location.href = '/'
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Don't render anything until we know the session state
  if (!mounted) {
    return null
  }

  return (
    <header className="bg-[var(--card)] shadow-lg">
      <nav 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" 
        aria-label="Main navigation"
      >
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link 
              href="/"
              className="flex-shrink-0 flex items-center"
            >
              <span className="text-xl font-bold gradient-text">Country Explorer</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {!session ? (
              <Link
                href="/login"
                className={`${
                  pathname === '/login'
                    ? 'bg-[var(--accent)]'
                    : 'bg-[var(--accent)] hover:bg-opacity-90'
                } text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200`}
              >
                <span>Login</span>
              </Link>
            ) : (
              <button
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                type="button"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
} 