'use client'

import { OAuthStrategy } from '@clerk/shared/types'
import { useSignIn } from '@clerk/nextjs'

export default function Page() {
  const { signIn, errors } = useSignIn()

  const signInWith = async (strategy: OAuthStrategy) => {
    const { error } = await signIn.sso({
      strategy,
      redirectCallbackUrl: '/sso-callback',
      redirectUrl: '/sign-in/tasks', // Learn more about session tasks at https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
    })
    if (error) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(error, null, 2))
      return
    }

    if (signIn.status === 'needs_second_factor') {
      // See https://clerk.com/docs/guides/development/custom-flows/authentication/multi-factor-authentication
    } else if (signIn.status === 'needs_client_trust') {
      // See https://clerk.com/docs/guides/development/custom-flows/authentication/client-trust
    } else {
      // Check why the sign-in is not complete
      console.error('Sign-in attempt not complete:', signIn)
    }
  }

  // Render a button for each supported OAuth provider
  // you want to add to your app. This example uses only Google.
  return (
    <>
      <button onClick={() => signInWith('oauth_google')}>Sign in with Google</button>
      {/* For your debugging purposes. You can just console.log errors, but we put them in the UI for convenience */}
      {errors && <p>{JSON.stringify(errors, null, 2)}</p>}
    </>
  )
}