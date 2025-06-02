import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  console.log('Middleware function entered. Path:', request.nextUrl.pathname);
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = request.cookies.get(name)?.value;
          console.log(`Middleware cookies.get: name='${name}', value='${cookie ? cookie.substring(0, 20) + '...' : undefined}'`);
          return cookie;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Update request cookies for current request's context
          request.cookies.set({
            name,
            value,
            ...options,
          });
          // Set cookie on the response to send back to the browser
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          // Update request cookies for current request's context
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          // Set cookie on the response to send back to the browser (to delete it)
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  console.log(`Middleware running for path: ${request.nextUrl.pathname}`);
  // Refresh session if expired - important for server-side calls
  const { data: { user: middlewareUser } } = await supabase.auth.getUser();
  console.log(`Middleware user email: ${middlewareUser?.email || 'No user found in middleware'}`);

  return response;
}

// Ensure the middleware is only called for relevant paths.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - /auth (the temporary login page, to avoid loops or issues)
     * - /api/auth (if you had Supabase auth API routes like callback, user, etc.)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|auth|api/auth).*)',
  ],
};
