import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/login', '/register']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('lexai_token')?.value
  const { pathname } = request.nextUrl

  // If on public route and already logged in → redirect to home
  if (PUBLIC_ROUTES.includes(pathname) && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If on protected route and not logged in → redirect to login
  if (!PUBLIC_ROUTES.includes(pathname) && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}
