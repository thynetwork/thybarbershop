import { NextRequest, NextResponse } from 'next/server';

/** Routes that require authentication */
const PROTECTED_PREFIXES = ['/dashboard', '/home', '/book'];

/** Routes that are always public */
const PUBLIC_PREFIXES = ['/', '/register', '/api', '/privacy', '/terms', '/conditions', '/_next', '/favicon.ico'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public routes
  const isPublic = PUBLIC_PREFIXES.some((prefix) => {
    if (prefix === '/') return pathname === '/';
    return pathname.startsWith(prefix);
  });

  if (isPublic) {
    return NextResponse.next();
  }

  // Check for protected routes
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isProtected) {
    const session = req.cookies.get('session')?.value;

    if (!session) {
      const loginUrl = new URL('/', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
