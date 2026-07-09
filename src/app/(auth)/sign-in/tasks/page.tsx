// app/sign-in/tasks/page.tsx
'use client'

import { useSignIn, useSignUp, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function TasksPage() {
  const { signIn } = useSignIn()
  const { signUp } = useSignUp()
  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(true)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('Checking your account...')

  useEffect(() => {
    const handleTasks = async () => {
      try {
        // 1. যদি ইউজার ইতিমধ্যে সাইন-ইন হয়ে থাকে
        if (isLoaded && isSignedIn) {
          setStatus('You are already signed in!')
          setTimeout(() => {
            window.location.href = '/dashboard'
          }, 1000)
          return
        }

        // 2. সাইন-আপ এর current task চেক করি
        if (signUp && signUp.status === 'needs_verification') {
          setStatus('Verifying your email...')
          
          // Email verification এর জন্য
          if (signUp.verifications?.emailAddress?.status === 'verified') {
            // ইমেইল ভেরিফাইড হলে complete করি
            await signUp.attemptEmailAddressVerification({
              code: 'verified' // Clerk এ skip করে
            })
            setStatus('Email verified!')
          } else {
            // ইমেইল ভেরিফাইড না হলে রিসেন্ড করি
            await signUp.prepareEmailAddressVerification({
              strategy: 'email_code',
            })
            setStatus('Verification email sent!')
            
            // ইউজারকে বলে দিই email চেক করতে
            // কিন্তু আমরা auto-redirect করে দিচ্ছি
          }
        }

        // 3. সাইন-ইন এর current task চেক করি
        if (signIn && signIn.status === 'needs_verification') {
          setStatus('Verifying your account...')
          
          if (signIn.verifications?.emailAddress?.status === 'verified') {
            await signIn.attemptEmailAddressVerification({
              code: 'verified'
            })
          }
        }

        // 4. সব tasks complete হয়ে গেলে dashboard-এ যাবো
        setStatus('Almost done! Redirecting...')
        
        setTimeout(() => {
          // ফোর্সড রিডিরেক্ট
          window.location.href = '/dashboard'
        }, 1500)

      } catch (err: any) {
        console.error('Task handling error:', err)
        setError(err?.errors?.[0]?.message || 'Something went wrong')
        setStatus('Redirecting to sign in...')
        
        setTimeout(() => {
          window.location.href = '/sign-in'
        }, 2000)
      } finally {
        setIsProcessing(false)
      }
    }

    handleTasks()
  }, [signIn, signUp, isLoaded, isSignedIn, user, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black px-4">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-800 p-8">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          {!error ? (
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl">🔐</span>
              </div>
            </div>
          ) : (
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <span className="text-3xl">⚠️</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
          {error ? 'Something went wrong' : 'Setting up your account'}
        </h2>

        {/* Status Message */}
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          {status}
        </p>

        {/* Progress Bar */}
        {!error && (
          <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-2 overflow-hidden mb-4">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-500 animate-progress"
              style={{ width: isProcessing ? '50%' : '100%' }}
            ></div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {/* Manual Redirect Option */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            {error ? 'Click below to try again' : 'Please wait...'}
          </p>
          {error && (
            <button
              onClick={() => window.location.href = '/sign-in'}
              className="mt-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm font-medium"
            >
              Go to Sign In →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}