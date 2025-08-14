// middleware.js
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const path = req.nextUrl.pathname;

  // Get authentication tokens/flags from cookies.
  // **IMPORTANT**: Ensure your login API sets an 'isAdmin' cookie upon admin login.
  const authToken = req.cookies.get('authToken')?.value;
  const isAdminUser = req.cookies.get('isAdmin')?.value === 'true';

  // --- 1. Handle Admin Authentication Routes ---
  // These are paths like /admin/login, /admin/signup, /admin/logout.
  // They use the `(admin-auth)` route group and should NOT show the admin sidebar.
  if (path.startsWith('/admin/login') || path.startsWith('/admin/signup')) {
    // If an admin user is already logged in, redirect them away from admin login/signup pages.
    if (authToken && isAdminUser) {
      return NextResponse.redirect(new URL('/admin', req.url)); // Redirect to admin dashboard.
    }
    return NextResponse.next(); // Allow unauthenticated or non-admin users to access admin auth pages.
  }

  // --- 2. Protect Core Admin Pages ---
  // This applies to routes within the `(admin)` group (e.g., /admin, /admin/others-pages, /admin/ui-elements).
  // These pages *expect* the admin sidebar and header.
  if (path.startsWith('/admin')) {
    // If no token OR the user is NOT an admin, redirect to admin login.
    if (!authToken || !isAdminUser) {
      console.log(`Middleware: Unauthorized access to admin route '${path}'. Redirecting to /admin/login.`);
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    // If authenticated as an admin, allow access.
    return NextResponse.next();
  }

  // --- 3. Handle Public/User Authentication Routes ---
  // These are paths like /login, /signup, which use the `(public-site)/(auth)` group.
  if (path.startsWith('/login') || path.startsWith('/signup')) {
    // If a non-admin (regular) user is already logged in, redirect them from the public login/signup pages.
    if (authToken && !isAdminUser) {
      return NextResponse.redirect(new URL('/', req.url)); // Redirect to public homepage.
    }
    return NextResponse.next(); // Allow unauthenticated or admin users to access public auth pages.
  }

  // --- 4. Protect Other Public/User Routes (Optional) ---
  // If you have pages in your `(public-site)` group that require a regular user to be logged in
  // (e.g., a user dashboard at `/dashboard`, a `/profile` page).
  /*
  if (path.startsWith('/profile') || path.startsWith('/dashboard')) {
    // If not authenticated, or if an admin tries to access a regular user-only page.
    if (!authToken || isAdminUser) {
      console.log(`Middleware: Unauthorized access to user route '${path}'. Redirecting to /login.`);
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next(); // Allow authenticated regular users.
  }
  */

  // --- 5. Default Case: Allow all other requests to proceed ---
  // This applies to your public homepage ('/') and any other truly public pages
  // that don't fall into the protected categories above.
  return NextResponse.next();
}

// This matcher ensures the middleware only runs for page routes and not for
// internal Next.js files, API routes, or static assets.
export const config = {
  matcher: [
    // Match all request paths except for files with extensions (like .png, .css, .js),
    // API routes, and Next.js internal files.
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};