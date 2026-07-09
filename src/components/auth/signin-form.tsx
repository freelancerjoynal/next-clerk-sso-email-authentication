'use client'

import { useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import GoogleSignInButton from './GoogleSignInButton'

export default function SignInForm() {
  const { signIn, errors, fetchStatus } = useSignIn()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // --- Email/Password Submit Handler ---
  const handleSubmit = async (formData: FormData) => {
    if (isLoading || !signIn) return
    setIsLoading(true)
    setErrorMessage(null)

    const emailAddress = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const { error } = await signIn.password({
        emailAddress,
        password,
      })

      if (error) {
        console.error(JSON.stringify(error, null, 2))
        setErrorMessage(error.message || 'Failed to sign in.')
        setIsLoading(false)
        return
      }

      if (signIn.status === 'complete') {
        await signIn.finalize({
          navigate: ({ session, decorateUrl }) => {
            if (session?.currentTask) {
              console.log(session?.currentTask)
              return
            }

            const url = decorateUrl('/dashboard')
            if (url.startsWith('http')) {
              window.location.href = url
            } else {
              router.push(url)
            }
          },
        })
      } else if (signIn.status === 'needs_client_trust') {
        const emailCodeFactor = signIn.supportedSecondFactors?.find(
          (factor) => factor.strategy === 'email_code',
        )

        if (emailCodeFactor) {
          await signIn.mfa.sendEmailCode()
        }
        setIsLoading(false)
      } else {
        console.error('Sign-in attempt not complete:', signIn)
        setIsLoading(false)
      }
    } catch (err: any) {
      console.error('Sign-in error:', err)
      
      if (err?.errors?.[0]?.code === 'form_identifier_not_found') {
        setErrorMessage('No account found with this email address')
      } else if (err?.errors?.[0]?.code === 'form_password_incorrect') {
        setErrorMessage('Incorrect password. Please try again.')
      } else if (err?.errors?.[0]?.code === 'form_identifier_incorrect') {
        setErrorMessage('Invalid email or password')
      } else {
        setErrorMessage(err?.errors?.[0]?.message || 'Invalid email or password. Please try again.')
      }
      
      setIsLoading(false)
    }
  }

  // --- MFA Verification Handler ---
  const handleVerify = async (formData: FormData) => {
    if (isLoading || !signIn) return
    setIsLoading(true)
    setErrorMessage(null)

    const code = formData.get('code') as string

    try {
      await signIn.mfa.verifyEmailCode({ code })

      if (signIn.status === 'complete') {
        await signIn.finalize({
          navigate: ({ session, decorateUrl }) => {
            if (session?.currentTask) {
              console.log(session?.currentTask)
              return
            }

            const url = decorateUrl('/dashboard')
            if (url.startsWith('http')) {
              window.location.href = url
            } else {
              router.push(url)
            }
          },
        })
      } else {
        console.error('Sign-in attempt not complete:', signIn)
        setIsLoading(false)
      }
    } catch (err: any) {
      console.error('Verification error:', err)
      setErrorMessage(err?.errors?.[0]?.message || 'Invalid verification code')
      setIsLoading(false)
    }
  }

  // --- MFA OTP View ---
  if (signIn?.status === 'needs_client_trust') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black px-4">
        <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-800 p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Image src="/next.svg" alt="Logo" width={80} height={20} className="dark:invert" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Verify Your Account 🔐</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Enter the verification code sent to your email</p>
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
              Verify
            </button>
          </form>

          <div className="mt-4 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => signIn.mfa.sendEmailCode()}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-left"
            >
              Resend verification code
            </button>
            <button
              type="button"
              onClick={() => signIn.reset()}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-left"
            >
              Start over
            </button>
          </div>
        </div>
      </div>
    )
  }

  // --- Main Sign In View ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black px-4">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-800 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image src="/next.svg" alt="Logo" width={80} height={20} className="dark:invert" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back! 👋</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Sign in to continue</p>
        </div>

        {/* Error Display */}
        {errorMessage && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-4">
            {errorMessage}
          </div>
        )}

        {(errors?.fields?.identifier || errors?.fields?.password) && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-4 space-y-1">
            {errors.fields.identifier && <p>{errors.fields.identifier.message}</p>}
            {errors.fields.password && <p>{errors.fields.password.message}</p>}
          </div>
        )}

        {/* Google বাটন */}
        <GoogleSignInButton fetchStatus={fetchStatus} />

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-zinc-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-zinc-900 text-gray-500 dark:text-gray-400">or</span>
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
              placeholder="••••••••"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
          </div>

          {/* লিঙ্কটি এখানে অলরেডি লিঙ্কড আছে */}
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={fetchStatus === 'fetching' || isLoading}
            className="w-full bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {(fetchStatus === 'fetching' || isLoading) && (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            )}
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link
            href="/sign-up"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            Sign Up with Email 
          </Link>
        </p>
      </div>
    </div>
  )
}