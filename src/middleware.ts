import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n';

export default createMiddleware(routing);

export const config = {
    // Match all pathnames except for
    // - API routes
    // - Static files (_next/static, images, favicon.ico, etc.)
    matcher: ['/((?!api|_next|.*\\..*).*)']
};
