import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Public routes — no auth required
  const publicPaths = ['/', '/login', '/register'];
  const isPublicPath = publicPaths.includes(pathname);
  const isAuthApi = pathname.startsWith('/api/auth');
  const isPublicApi = pathname.startsWith('/api/public');

  if (isPublicPath || isAuthApi || isPublicApi) {
    return NextResponse.next();
  }

  // Check for JWT token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || 'fallback_secret_for_demo_purposes_only',
    secureCookie: process.env.NODE_ENV === 'production',
  });

  // Redirect to login if not authenticated
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/tasks/:path*',
    '/calendar/:path*',
    '/projects/:path*',
    '/settings/:path*',
    '/api/tasks/:path*',
    '/api/projects/:path*',
    '/api/ai/:path*',
    '/api/dashboard/:path*',
    '/api/reminders/:path*',
  ],
};
