import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n';

export default createMiddleware(routing);

export const config = {
    // Match all pathnames except for
    // - API routes
    // - Static files (_next/static, images, favicon.ico, etc.)
    // - Sanity Studio
    matcher: [
        '/',
        '/(en|sw|ar|hi|de|pt|fr|es|am|so)/:path*',
        '/((?!api|_next|_vercel|studio|.*\\..*).*)'
    ]
};
