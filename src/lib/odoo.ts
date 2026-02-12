/**
 * Odoo JSON-RPC Client for NCAI CRM Integration
 * This client handles contact management in the Odoo 'res.partner' model.
 */

interface OdooResponse<T> {
    jsonrpc: string;
    id: number | string;
    result?: T;
    error?: {
        code: number;
        message: string;
        data?: any;
    };
}

const ODOO_URL = process.env.ODOO_URL;
const ODOO_DB = process.env.ODOO_DB;
const ODOO_USER = process.env.ODOO_USERNAME;
const ODOO_PASS = process.env.ODOO_PASSWORD;

/**
 * Executes an Odoo XML-RPC/JSON-RPC call via the JSON-RPC interface.
 * Odoo's JSON-RPC endpoint is typically at /jsonrpc
 */
/**
 * Executes an Odoo XML-RPC/JSON-RPC call via the JSON-RPC interface.
 */
async function callOdoo<T>(service: string, method: string, args: any[]): Promise<T> {
    if (!ODOO_URL || !ODOO_DB || !ODOO_USER || !ODOO_PASS) {
        throw new Error('CONFIG_MISSING');
    }

    const payload = {
        jsonrpc: '2.0',
        method: 'call',
        params: {
            service,
            method,
            args,
        },
        id: Math.floor(Math.random() * 1000000),
    };

    try {
        const response = await fetch(`${ODOO_URL}/jsonrpc`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(5000), // 5s timeout
        });

        if (!response.ok) {
            throw new Error(`HTTP_ERROR_${response.status}`);
        }

        const data: OdooResponse<T> = await response.json();

        if (data.error) {
            console.error('[Odoo] RPC Error:', data.error);
            throw new Error(data.error.message || 'RPC_ERROR');
        }

        return data.result as T;
    } catch (error: any) {
        if (error.name === 'TimeoutError') throw new Error('TIMEOUT');
        throw error;
    }
}

/**
 * Authenticates with Odoo to get an User ID (UID).
 */
export async function authenticateOdoo(): Promise<number> {
    return callOdoo<number>('common', 'login', [ODOO_DB, ODOO_USER, ODOO_PASS]);
}

/**
 * Creates or updates a contact in Odoo.
 */
export async function syncOdooContact(data: { email: string; name?: string }) {
    if (!ODOO_URL || ODOO_PASS === 'changeme') {
        return { success: true, message: 'Skipped - Not Configured' };
    }

    try {
        const uid = await authenticateOdoo();
        if (!uid) {
            console.error('[Odoo] Authentication failed: Check credentials.');
            return { success: false, error: 'Authentication failed', code: 'AUTH_FAILED' };
        }

        // 1. Search for existing partner
        const partnerIds = await callOdoo<number[]>('object', 'execute_kw', [
            ODOO_DB, uid, ODOO_PASS,
            'res.partner', 'search',
            [[['email', '=', data.email]]]
        ]);

        if (partnerIds.length > 0) {
            await callOdoo<boolean>('object', 'execute_kw', [
                ODOO_DB, uid, ODOO_PASS,
                'res.partner', 'write',
                [partnerIds[0], {
                    name: data.name || data.email,
                }]
            ]);
            console.log(`[Odoo] Updated contact: ${data.email}`);
        } else {
            await callOdoo<number>('object', 'execute_kw', [
                ODOO_DB, uid, ODOO_PASS,
                'res.partner', 'create',
                [{
                    name: data.name || data.email,
                    email: data.email,
                    customer_rank: 1,
                    comment: 'Created via Website Newsletter Signup'
                }]
            ]);
            console.log(`[Odoo] Created contact: ${data.email}`);
        }

        return { success: true };
    } catch (error: any) {
        console.error('[Odoo] Sync Exception:', error.message);
        return { success: false, error: error.message, code: 'SYNC_EXCEPTION' };
    }
}
