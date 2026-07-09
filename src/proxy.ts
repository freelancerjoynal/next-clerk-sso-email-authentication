// middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// ১. পাবলিক রুটগুলোর লিস্ট
const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/pricing", 
  "/contact",
  "/privacy",
  "/services",

]

// ২. অথ রুট - শুধু লগআউট করা ইউজারদের জন্য
const AUTH_ROUTES = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/sso-callback",
]

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()
  const path = req.nextUrl.pathname

  console.log('📍 Path:', path, '| UserId:', userId)

  // রুট টাইপ চেক (startsWith দিয়ে করায় /sign-in/anything ও হ্যান্ডেল হবে)
  const isPublicRoute = PUBLIC_ROUTES.includes(path) || path.startsWith("/api/webhooks") || path.startsWith("/sso-callback")
  const isAuthRoute = AUTH_ROUTES.some(route => path.startsWith(route))

  // ✅ ইউজার লগইন করা থাকলে
  if (userId) {
    if (isAuthRoute) {
      const dashboardUrl = new URL("/dashboard", req.url)
      return NextResponse.redirect(dashboardUrl)
    }
    
    // ড্যাশবোর্ড বা প্রোটেক্টেড রুটে রিলোড মারলে যেন ক্যাশ প্রবলেম না হয়, তার জন্য হেডার সেট
    const response = NextResponse.next()
    response.headers.set('x-middleware-cache', 'no-cache')
    return response
  }

  // ❌ ইউজার লগইন করা না থাকলে
  if (!userId) {
    // যদি পাবলিক রুট অথবা সাইন-ইন পেজ হয়, তবেই যেতে দিন
    if (isPublicRoute || isAuthRoute) {
      return NextResponse.next()
    }
    
    // বাকি সব প্রোটেক্টেড রুটের জন্য সাইন-ইন পেজে রিডাইরেক্ট করুন
    // সাথে একটা ক্যাশ-কন্ট্রোল হেডার দেওয়া হয়েছে যাতে নেক্সট-জেএস ভুল রিডাইরেকশন ক্যাশ না করে
    const signInUrl = new URL("/sign-in", req.url)
    const response = NextResponse.redirect(signInUrl)
    response.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate')
    return response
  }

  return NextResponse.next()
})

export const config = {
  // আপনার matcher একদম পারফেক্ট আছে, সেটাই রাখা হলো
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}