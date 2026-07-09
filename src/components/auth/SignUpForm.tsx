'use client'

import { useAuth, useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function SignUpForm() {
  const { signUp, errors, fetchStatus } = useSignUp()
  const { isSignedIn } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // ইউজার অলরেডি সাইন-ইন করা থাকলে রিডাইরেক্ট করুন বা খালি রিটার্ন করুন
  if (signUp?.status === 'complete' || isSignedIn) {
    return null
  }

  // --- Email/Password Submit Handler ---
  const handleSubmit = async (formData: FormData) => {
    if (isLoading || !signUp) return
    setIsLoading(true)
    setErrorMessage(null)

    const emailAddress = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const { error } = await signUp.password({
        emailAddress,
        password,
      })

      if (error) {
        console.error(JSON.stringify(error, null, 2))
        setErrorMessage(error.message || 'Failed to submit password.')
        setIsLoading(false)
        return
      }

      // পাসওয়ার্ড সাবমিট সফল হলে ভেরিফিকেশন কোড পাঠান
      await signUp.verifications.sendEmailCode()
      setIsLoading(false)
    } catch (err: any) {
      console.error('Sign-up error:', err)
      
      if (err?.errors?.[0]?.code === 'form_identifier_exists') {
        setErrorMessage('An account with this email already exists. Please sign in instead.')
      } else if (err?.errors?.[0]?.code === 'form_password_size') {
        setErrorMessage('Password must be at least 8 characters long.')
      } else if (err?.errors?.[0]?.code === 'form_identifier_invalid') {
        setErrorMessage('Please enter a valid email address.')
      } else {
        setErrorMessage(err?.errors?.[0]?.message || 'Something went wrong. Please try again.')
      }
      
      setIsLoading(false)
    }
  }

  // --- Verification Handler ---
  const handleVerify = async (formData: FormData) => {
    if (isLoading || !signUp) return
    setIsLoading(true)
    setErrorMessage(null)

    const code = formData.get('code') as string

    try {
      await signUp.verifications.verifyEmailCode({
        code,
      })

      if (signUp.status === 'complete') {
        await signUp.finalize({
          navigate: ({ session, decorateUrl }) => {
            if (session?.currentTask) {
              console.log(session?.currentTask)
              return
            }

            const url = decorateUrl('/dashboard') // আপনার ড্যাশবোর্ড রুট
            if (url.startsWith('http')) {
              window.location.href = url
            } else {
              router.push(url)
            }
          },
        })
      } else {
        console.error('Verification attempt not complete:', signUp)
        setErrorMessage('Invalid verification code. Please try again.')
        setIsLoading(false)
      }
    } catch (err: any) {
      console.error('Verification error:', err)
      setErrorMessage(err?.errors?.[0]?.message || 'Invalid verification code')
      setIsLoading(false)
    }
  }

  // --- Resend Verification Code ---
  const handleResendCode = async () => {
    if (isLoading || !signUp) return
    setIsLoading(true)
    
    try {
      await signUp.verifications.sendEmailCode()
      setErrorMessage(null)
      setIsLoading(false)
    } catch (err: any) {
      console.error('Resend error:', err)
      setErrorMessage(err?.errors?.[0]?.message || 'Failed to resend code')
      setIsLoading(false)
    }
  }

  // --- Verification View (ওটিপি স্ক্রিন) ---
  if (
    signUp?.status === 'missing_requirements' &&
    signUp.unverifiedFields.includes('email_address') &&
    signUp.missingFields.length === 0
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black px-4">
        <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-800 p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Image src="/next.svg" alt="Logo" width={80} height={20} className="dark:invert" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Verify Your Email 📧</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              We sent a verification code to your email address
            </p>
          </div>

          {errorMessage && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-4">
              {errorMessage}
            </div>
          )}

          {errors?.fields?.code && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-4">
              {errors.fields.code.message}
            </div>
          )}

          <form action={handleVerify} className="space-y-4">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Verification Code
              </label>
              <input
                id="code"
                name="code"
                type="text"
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={fetchStatus === 'fetching' || isLoading}
              className="w-full bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {(fetchStatus === 'fetching' || isLoading) && (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              )}
              Verify Email
            </button>
          </form>

          <div className="mt-4 flex flex-col gap-2 text-center">
            <button
              onClick={handleResendCode}
              disabled={isLoading}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50"
            >
              Resend verification code
            </button>
            <button
              onClick={() => signUp.reset()}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Start over
            </button>
          </div>
        </div>
      </div>
    )
  }

  // --- Main Sign Up View ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black px-4">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-800 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image src="/next.svg" alt="Logo" width={80} height={20} className="dark:invert" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Account 🚀</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Sign up to get started</p>
        </div>

        {/* Error Display */}
        {errorMessage && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-4">
            {errorMessage}
          </div>
        )}

        {(errors?.fields?.emailAddress || errors?.fields?.password) && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-4 space-y-1">
            {errors.fields.emailAddress && <p>{errors.fields.emailAddress.message}</p>}
            {errors.fields.password && <p>{errors.fields.password.message}</p>}
          </div>
        )}

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-zinc-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-zinc-900 text-gray-500 dark:text-gray-400">
              Create account with email
            </span>
          </div>
        </div>

        {/* Email/Password Form */}
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="•••••••• (min 8 characters)"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
              minLength={8}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Password must be at least 8 characters long
            </p>
          </div>

          <button
            type="submit"
            disabled={fetchStatus === 'fetching' || isLoading}
            className="w-full bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {(fetchStatus === 'fetching' || isLoading) && (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            )}
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            href="/sign-in"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            Sign In
          </Link>
        </p>

        {/* Clerk Captcha */}
        <div id="clerk-captcha" className="mt-4" />
      </div>
    </div>
  )
}