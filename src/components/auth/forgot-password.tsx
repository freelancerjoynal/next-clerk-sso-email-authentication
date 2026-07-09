'use client'

import React from 'react'
import { useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default function ForgotPassword() {
  const { signIn, errors, fetchStatus } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [code, setCode] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [codeSent, setCodeSent] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  // Step 1: Send the password reset code to the user's email
  async function sendCode(e: React.FormEvent) {
    e.preventDefault()
    if (isLoading || !signIn) return
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const { error: createError } = await signIn.create({
        identifier: emailAddress,
      })
      if (createError) {
        console.error(JSON.stringify(createError, null, 2))
        setErrorMessage(createError.message || 'Failed to initialize password reset.')
        setIsLoading(false)
        return
      }

      const { error: sendCodeError } = await signIn.resetPasswordEmailCode.sendCode()
      if (sendCodeError) {
        console.error(JSON.stringify(sendCodeError, null, 2))
        setErrorMessage(sendCodeError.message || 'Failed to send verification code.')
        setIsLoading(false)
        return
      }

      setCodeSent(true)
      setIsLoading(false)
    } catch (err: any) {
      console.error(err)
      setErrorMessage(err?.errors?.[0]?.message || 'Something went wrong.')
      setIsLoading(false)
    }
  }

  // Step 2: Verify the code provided by the user
  async function verifyCode(e: React.FormEvent) {
    e.preventDefault()
    if (isLoading || !signIn) return
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const { error } = await signIn.resetPasswordEmailCode.verifyCode({
        code,
      })
      if (error) {
        console.error(JSON.stringify(error, null, 2))
        setErrorMessage(error.message || 'Invalid or expired code.')
        setIsLoading(false)
        return
      }
      setIsLoading(false)
    } catch (err: any) {
      console.error(err)
      setErrorMessage(err?.errors?.[0]?.message || 'Verification failed.')
      setIsLoading(false)
    }
  }

  // Step 3: Submit the new password
  async function submitNewPassword(e: React.FormEvent) {
    e.preventDefault()
    if (isLoading || !signIn) return
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const { error } = await signIn.resetPasswordEmailCode.submitPassword({
        password,
        signOutOfOtherSessions: true,
      })
      if (error) {
        console.error(JSON.stringify(error, null, 2))
        setErrorMessage(error.message || 'Failed to update password.')
        setIsLoading(false)
        return
      }

      if (signIn.status === 'complete') {
        await signIn.finalize({
          navigate: async ({ session, decorateUrl }) => {
            if (session?.currentTask) {
              console.log(session.currentTask)
              return
            }

            const url = decorateUrl('/dashboard') // রিডাইরেক্ট রুট
            if (url.startsWith('http')) {
              window.location.href = url
            } else {
              router.push(url)
            }
          },
        })
      } else if (signIn.status === 'needs_second_factor') {
        setIsLoading(false)
      } else {
        console.error('Sign-in attempt not complete:', signIn)
        setIsLoading(false)
      }
    } catch (err: any) {
      console.error(err)
      setErrorMessage(err?.errors?.[0]?.message || 'Failed to reset password.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black px-4">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-800 p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image src="/next.svg" alt="Logo" width={80} height={20} className="dark:invert" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {!codeSent ? 'Forgot Password? 🔑' : signIn.status === 'needs_new_password' ? 'Reset Password 🔒' : 'Verify Email 📧'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
            {!codeSent 
              ? 'Enter your email to receive a password reset code' 
              : signIn.status === 'needs_new_password' 
                ? 'Choose a strong new password for your account' 
                : `We sent a code to ${emailAddress}`}
          </p>
        </div>

        {/* Global Error Display */}
        {errorMessage && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-4">
            {errorMessage}
          </div>
        )}

        {/* Clerk Field Errors */}
        {(errors?.fields?.identifier || errors?.fields?.code || errors?.fields?.password) && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-4 space-y-1">
            {errors.fields.identifier && <p>{errors.fields.identifier.message}</p>}
            {errors.fields.code && <p>{errors.fields.code.message}</p>}
            {errors.fields.password && <p>{errors.fields.password.message}</p>}
          </div>
        )}

        {/* Step 1 UI: Collect Email */}
        {!codeSent && (
          <form onSubmit={sendCode} className="space-y-4">
            <div>
              <label htmlFor="emailAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                id="emailAddress"
                type="email"
                placeholder="you@example.com"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
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
              Send Code
            </button>
          </form>
        )}

        {/* Step 2 UI: Verify OTP Code */}
        {codeSent && signIn?.status !== 'needs_new_password' && (
          <form onSubmit={verifyCode} className="space-y-4">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Verification Code
              </label>
              <input
                id="code"
                type="text"
                placeholder="Enter reset code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
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
              Verify Code
            </button>
          </form>
        )}

        {/* Step 3 UI: Submit New Password */}
        {signIn?.status === 'needs_new_password' && (
          <form onSubmit={submitNewPassword} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                New Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="•••••••• (min 8 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
                minLength={8}
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
              Set New Password
            </button>
          </form>
        )}

        {/* Step 4 UI: Handle 2FA fallback notice */}
        {signIn?.status === 'needs_second_factor' && (
          <div className="bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 p-3 rounded-lg text-sm mt-4">
            Two-factor authentication required. Please contact support.
          </div>
        )}

        {/* Footer actions */}
        <div className="mt-6 flex items-center justify-between text-sm">
          <Link
            href="/sign-in"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            Back to Sign In
          </Link>
          {codeSent && (
            <button
              type="button"
              onClick={() => {
                setCodeSent(false)
                setCode('')
                setPassword('')
              }}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Start Over
            </button>
          )}
        </div>
      </div>
    </div>
  )
}