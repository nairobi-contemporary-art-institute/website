import { NextResponse } from 'next/server'
import { addSubscriber } from '@/lib/listmonk'
import { syncOdooContact } from '@/lib/odoo'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { email, name, eventTitle, eventSlug, locale, consent } = body

        if (!email) {
            return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 })
        }

        // 1. Sync to Odoo CRM
        // We include the event title in the note/comment if possible, 
        // but the current syncOdooContact only takes email and name.
        // Let's modify syncOdooContact later if needed, but for now we'll just sync the partner.
        const odooResult = await syncOdooContact({
            email,
            name
        })

        if (!odooResult.success && odooResult.code !== 'AUTH_FAILED') {
            console.error('[API/Events/Register] Odoo Sync failed:', odooResult.error)
        }

        // 2. Add to Listmonk (Newsletter) if consented
        if (consent) {
            const listmonkResult = await addSubscriber({
                email,
                name,
                attribs: {
                    source: 'event_registration',
                    event_title: eventTitle,
                    event_slug: eventSlug,
                    locale: locale
                }
            })

            if (!listmonkResult.success && listmonkResult.code !== 'ALREADY_SUBSCRIBED' && listmonkResult.code !== 'CONFIG_MISSING') {
                console.error('[API/Events/Register] Listmonk Sync failed:', listmonkResult.error)
            }
        }

        // Success!
        return NextResponse.json({
            success: true,
            message: 'Registration successful'
        })

    } catch (error: any) {
        console.error('[API/Events/Register] Unhandled error:', error)
        return NextResponse.json({
            success: false,
            error: 'Internal server error'
        }, { status: 500 })
    }
}
