// app/page.tsx
"use client"

import { useUser, SignOutButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
  const { user, isLoaded: userLoaded, isSignedIn } = useUser()

  if (!userLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/next.svg"
                alt="Logo"
                width={80}
                height={20}
                className="dark:invert"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">
                | Landing
              </span>
            </div>
            <div className="flex items-center gap-4">
              {isSignedIn ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {user?.imageUrl && (
                      <Image
                        src={user.imageUrl}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    )}
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user?.firstName || user?.username || "User"}
                    </span>
                  </div>
                  <SignOutButton>
                    <button className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium">
                      Sign Out
                    </button>
                  </SignOutButton>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/sign-in"
                    className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="text-sm font-medium bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {isSignedIn ? (
          // Signed In - Simple Welcome
          <div className="text-center max-w-2xl mx-auto">
            <div className="mb-6">
              {user?.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="rounded-full mx-auto ring-4 ring-blue-500/20"
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center text-3xl text-white font-bold ring-4 ring-blue-500/20">
                  {user?.firstName?.[0] || user?.username?.[0] || "U"}
                </div>
              )}
            </div>

            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {user?.firstName || user?.username || "User"}! 👋
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              {user?.primaryEmailAddress?.emailAddress || "No email"}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-colors font-medium"
              >
                Visit Dashboard →
              </Link>
              <SignOutButton>
                <button className="px-8 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors font-medium">
                  Sign Out
                </button>
              </SignOutButton>
            </div>
          </div>
        ) : (
          // Not Signed In - Hero Section
          <div className="flex flex-col items-center justify-center">
            <div className="text-center max-w-2xl">
              <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Welcome! 👋
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
                Sign in to view your user data and test the dashboard
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/sign-in"
                  className="px-8 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors font-medium text-lg"
                >
                  Sign In
                </Link>
                
                <Link
                  href="/sign-up"
                  className="px-8 py-3 rounded-lg bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-colors font-medium text-lg"
                >
                  Get Started
                </Link>
              </div>
              
              {/* Feature Highlights */}
              <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
                <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800">
                  <div className="text-2xl mb-2">🔐</div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Secure Auth</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Clerk authentication with Google OAuth</p>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800">
                  <div className="text-2xl mb-2">⚡</div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Fast</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Built on Next.js App Router</p>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800">
                  <div className="text-2xl mb-2">🎨</div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Modern UI</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tailwind CSS with dark mode</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}