// src/app/(auth)/sign-up/page.tsx

import SignUpForm from '@/components/auth/SignUpForm'
import { SignUpWithGoogle } from '@/components/auth/SignUpWithGoogle'

export default function SignUpPage() {
  return (
    <>
    {/* <SignUpWithGoogle></SignUpWithGoogle> */}
    <SignUpForm />
    </>
  )
}