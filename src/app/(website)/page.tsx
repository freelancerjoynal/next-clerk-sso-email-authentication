// app/page.tsx
"use client"

import { useUser, useSession, SignInButton, SignUpButton, SignOutButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
  const { user, isLoaded: userLoaded, isSignedIn } = useUser()
  const { session } = useSession()

  if (!userLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your data...</p>
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
                | Test Dashboard
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
                  <SignInButton mode="redirect">
                    <button className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="redirect">
                    <button className="text-sm font-medium bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-colors">
                      Get Started
                    </button>
                  </SignUpButton>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isSignedIn ? (
          <div className="space-y-6">
            {/* Welcome Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 p-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user?.firstName || user?.username || "User"}! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                You're signed in and ready to test your application.
              </p>
            </div>

            {/* User Info Card */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  👤 User Information
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-zinc-800">
                    <span className="text-gray-500 dark:text-gray-400">User ID</span>
                    <span className="font-mono text-gray-900 dark:text-white truncate ml-4">
                      {user?.id?.slice(0, 20)}...
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-zinc-800">
                    <span className="text-gray-500 dark:text-gray-400">Email</span>
                    <span className="text-gray-900 dark:text-white">
                      {user?.primaryEmailAddress?.emailAddress || "No email"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-zinc-800">
                    <span className="text-gray-500 dark:text-gray-400">Full Name</span>
                    <span className="text-gray-900 dark:text-white">
                      {user?.fullName || "Not set"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500 dark:text-gray-400">Joined</span>
                    <span className="text-gray-900 dark:text-white">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  🔐 Session Info
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-zinc-800">
                    <span className="text-gray-500 dark:text-gray-400">Session ID</span>
                    <span className="font-mono text-gray-900 dark:text-white truncate ml-4">
                      {session?.id?.slice(0, 20)}...
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-zinc-800">
                    <span className="text-gray-500 dark:text-gray-400">Status</span>
                    <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Active
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-zinc-800">
                    <span className="text-gray-500 dark:text-gray-400">Last Active</span>
                    <span className="text-gray-900 dark:text-white">
                      {session?.lastActiveAt ? new Date(session.lastActiveAt).toLocaleString() : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500 dark:text-gray-400">Expires</span>
                    <span className="text-gray-900 dark:text-white">
                      {session?.expiresAt ? new Date(session.expiresAt).toLocaleString() : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                🚀 Quick Actions
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Link
                  href="/profile"
                  className="p-4 text-center bg-gray-50 dark:bg-zinc-800 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                >
                  <div className="text-2xl mb-2">👤</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Profile</div>
                </Link>
                <Link
                  href="/settings"
                  className="p-4 text-center bg-gray-50 dark:bg-zinc-800 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                >
                  <div className="text-2xl mb-2">⚙️</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Settings</div>
                </Link>
                <Link
                  href="/dashboard"
                  className="p-4 text-center bg-gray-50 dark:bg-zinc-800 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                >
                  <div className="text-2xl mb-2">📊</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Dashboard</div>
                </Link>
                <button
                  onClick={() => alert("This is a test action!")}
                  className="p-4 text-center bg-gray-50 dark:bg-zinc-800 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                >
                  <div className="text-2xl mb-2">🧪</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Test Action</div>
                </button>
              </div>
            </div>

            {/* Sign Out Button */}
            <div className="flex justify-center pt-4">
              <SignOutButton>
                <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors font-medium">
                  Sign Out
                </button>
              </SignOutButton>
            </div>
          </div>
        ) : (
          // Not Signed In - Hero Section
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-center max-w-2xl">
              <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Welcome! 👋
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
                Sign in to view your user data and test the dashboard
              </p>
              
              {/* Sign In & Sign Up Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <SignInButton mode="redirect">
                  <button className="px-8 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors font-medium text-lg">
                    Sign In
                  </button>
                </SignInButton>
                
                <SignUpButton mode="redirect">
                  <button className="px-8 py-3 rounded-lg bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-colors font-medium text-lg">
                    Get Started
                  </button>
                </SignUpButton>
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