import { NextRequest, NextResponse } from 'next/server';
import { addSubscriber } from '@/lib/listmonk';
import { syncOdooContact } from '@/lib/odoo';
import { rateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

const subscriberSchema = z.object({
    email: z.string().email(),
    name: z.string().optional(),
    preferences: z.record(z.boolean()).optional(),
});

export async function POST(req: NextRequest) {
    // 0. Rate Limiting (Prevent Spam)
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    const limit = rateLimit(ip, { limit: 5, windowMs: 60000 }); // 5 requests per minute

    if (!limit.success) {
        return NextResponse.json(
            { error: 'Too many requests. Please try again later.' },
            { status: 429 }
        );
    }

    try {
        const body = await req.json();
        const validation = subscriberSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid email address' },
                { status: 400 }
            );
        }

        const { email, name } = validation.data;

        // 1. Add to Listmonk (Primary Newsletter Tool)
        const result = await addSubscriber({ email, name });

        if (!result.success) {
            return NextResponse.json(
                { error: result.error || 'Failed to subscribe' },
                { status: 500 }
            );
        }

        // 2. Sync to Odoo CRM (Background process, don't await/block success)
        // Note: In production with high volume, this might be a queue job
        syncOdooContact({ email, name }).catch(err => {
            console.error('Odoo sync background error:', err);
        });

        return NextResponse.json({ message: 'Subscribed successfully' });
    } catch (error) {
        console.error('Subscription error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
