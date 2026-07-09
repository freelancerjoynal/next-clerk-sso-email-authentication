// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// পাবলিক রুট - সবাই দেখতে পারে
const isPublicRoute = createRouteMatcher([
  "/",
  "/about",
  "/pricing", 
  "/contact",
  "/privacy",
  "/terms",
  "/api/webhooks(.*)",
  "/sso-callback(.*)",
])

// অথ রুট - শুধু লগআউট ইউজার
const isAuthRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/forgot-password(.*)",
  "sso-callback(.*)",
  
])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()
  const path = req.nextUrl.pathname

  console.log('📍 Path:', path, '| UserId:', userId)

  // ✅ লগইন থাকলে
  if (userId) {
    // অথ পেজে গেলে ড্যাশবোর্ডে পাঠান
    if (isAuthRoute(req)) {
      const dashboardUrl = new URL("/dashboard", req.url)
      return NextResponse.redirect(dashboardUrl)
    }
    // বাকি সব রুটে যেতে দিই
    return NextResponse.next()
  }

  // ❌ লগইন না থাকলে
  if (!userId) {
    // পাবলিক রুটে যেতে দিই
    if (isPublicRoute(req)) {
      return NextResponse.next()
    }
    
    // // প্রোটেক্টেড রুটে গেলে সাইনইনে পাঠান
    // // URL এ কোনো প্যারামিটার যোগ করবেন না
    // const signInUrl = new URL("/sign-in", req.url)
    // return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}