// app/sso-callback/page.tsx
'use client'

import { AuthenticateWithRedirectCallback } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function SSOCallbackPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Completing sign in...</p>
        <AuthenticateWithRedirectCallback
          redirectUrl="/dashboard"
          afterSignInUrl="/dashboard"
          afterSignUpUrl="/dashboard"
          onSuccess={() => {
            router.push('/dashboard')
          }}
          onError={(err) => {
            console.error('SSO Error:', err)
            router.push('/sign-in')
          }}
        />
      </div>
    </div>
  )
}