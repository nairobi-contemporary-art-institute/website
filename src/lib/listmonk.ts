interface ListmonkSubscriber {
    email: string;
    name?: string;
    attribs?: Record<string, any>;
    lists?: number[];
    status?: 'enabled' | 'disabled' | 'blocklisted';
}

export interface ListmonkResponse {
    success: boolean;
    error?: string;
    code?: string;
}

export async function addSubscriber(data: ListmonkSubscriber): Promise<ListmonkResponse> {
    const url = process.env.LISTMONK_API_URL;
    const username = process.env.LISTMONK_USERNAME;
    const password = process.env.LISTMONK_PASSWORD;

    if (!url || !username || !password) {
        console.error('[Listmonk] Configuration missing: URL, Username, or Password not set.');
        return { success: false, error: 'Newsletter service not configured', code: 'CONFIG_MISSING' };
    }

    try {
        const auth = Buffer.from(`${username}:${password}`).toString('base64');

        const response = await fetch(`${url}/api/subscribers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`
            },
            body: JSON.stringify({
                ...data,
                status: data.status || 'enabled',
                lists: data.lists || [1]
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            console.error(`[Listmonk] API Error (${response.status}):`, errorData);

            if (response.status === 409) {
                return { success: true, code: 'ALREADY_SUBSCRIBED' }; // Handle duplicates as success
            }

            return {
                success: false,
                error: errorData.message || 'Failed to subscribe',
                code: `API_ERROR_${response.status}`
            };
        }

        return { success: true };
    } catch (error: any) {
        console.error('[Listmonk] Connection failed:', error.message);
        return { success: false, error: 'Connection to newsletter service failed', code: 'CONNECTION_FAILURE' };
    }
}
