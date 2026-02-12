import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { authenticateOdoo } from '@/lib/odoo';

/**
 * Health Check API
 * Verifies connectivity to the institute's core infrastructure:
 * - Sanity CMS
 * - Listmonk (Inferred via env check for now as it lacks a simple ping endpoint without specific list context)
 * - Odoo CRM
 */
export async function GET() {
    const status: Record<string, any> = {
        timestamp: new Date().toISOString(),
        services: {
            sanity: { status: 'loading' },
            listmonk: { status: 'loading' },
            odoo: { status: 'loading' },
        }
    };

    // 1. Check Sanity
    try {
        await client.fetch('*[_type == "siteSettings"][0]{title}');
        status.services.sanity = { status: 'ok' };
    } catch (error: any) {
        status.services.sanity = { status: 'error', message: error.message };
    }

    // 2. Check Listmonk (Basic reachable/config check)
    const listmonkUrl = process.env.LISTMONK_API_URL;
    if (!listmonkUrl || process.env.LISTMONK_PASSWORD === 'changeme') {
        status.services.listmonk = { status: 'not_configured' };
    } else {
        try {
            const res = await fetch(`${listmonkUrl}/api/health`, { signal: AbortSignal.timeout(3000) }).catch(() => null);
            // Listmonk might return 401 on /api/health if not public, but reaching it is a good sign
            status.services.listmonk = { status: res ? 'ok' : 'unreachable' };
        } catch (error: any) {
            status.services.listmonk = { status: 'error', message: error.message };
        }
    }

    // 3. Check Odoo
    const odooUrl = process.env.ODOO_URL;
    if (!odooUrl || process.env.ODOO_PASSWORD === 'changeme') {
        status.services.odoo = { status: 'not_configured' };
    } else {
        try {
            const uid = await authenticateOdoo();
            status.services.odoo = { status: uid ? 'ok' : 'auth_failed' };
        } catch (error: any) {
            status.services.odoo = { status: 'error', message: error.message };
        }
    }

    const allOk = Object.values(status.services).every((s: any) => s.status === 'ok' || s.status === 'not_configured');

    return NextResponse.json(status, { status: allOk ? 200 : 503 });
}
