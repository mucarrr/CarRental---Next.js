import { handlers } from '@/auth'

export const { GET, POST } = handlers

// /api/auth/signin
// /api/auth/signout
// /api/auth/session
// /api/auth/providers
// /api/auth/csrf
// /api/auth/callback/credentials
// /api/auth/error
// ... and more come from next-auth automatically no need to add manually.
// [...nextauth] means catch all routes.

