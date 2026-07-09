// src/lib/auth/constants.ts
export const AUTH_ROUTES = {
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  DASHBOARD: '/dashboard',
  SSO_CALLBACK: '/sso-callback',
  FORGOT_PASSWORD: '/forgot-password',
} as const

export const OAUTH_STRATEGIES = {
  GOOGLE: 'oauth_google',
  GITHUB: 'oauth_github',
  MICROSOFT: 'oauth_microsoft',
} as const

export type OAuthStrategy = typeof OAUTH_STRATEGIES[keyof typeof OAUTH_STRATEGIES]