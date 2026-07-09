// app/dashboard/page.tsx
"use client"

import { useUser, useSession, SignOutButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const { user, isLoaded: userLoaded, isSignedIn } = useUser()
  const { session } = useSession()
  const router = useRouter()

  // শুধু মাত্র লোড হলে চেক করি, বারবার না
  useEffect(() => {
    if (userLoaded && !isSignedIn) {
      console.log('Not signed in, redirecting to sign-in')
      router.replace("/sign-in")
    }
  }, [userLoaded, isSignedIn, router]) // ডিপেন্ডেন্সি ঠিক আছে

  // লোডিং স্টেট
  if (!userLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // সাইন ইন না থাকলে null রিটার্ন করি (useEffect রিডিরেক্ট করবে)
  if (!isSignedIn) {
    return null
  }

  // ড্যাশবোর্ড কন্টেন্ট
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/next.svg"
                  alt="Logo"
                  width={80}
                  height={20}
                  className="dark:invert"
                />
              </Link>
              <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">
                | Dashboard
              </span>
            </div>
            <div className="flex items-center gap-4">
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
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Welcome Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome to your Dashboard, {user?.firstName || user?.username || "User"}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              This is your protected dashboard page. Only signed-in users can see this.
            </p>
          </div>

          {/* User Info */}
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
      </main>
    </div>
  )
}