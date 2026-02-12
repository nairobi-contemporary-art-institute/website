import { revalidateTag } from "next/cache"
import { type NextRequest, NextResponse } from "next/server"
import { parseBody } from "next-sanity/webhook"

export async function POST(req: NextRequest) {
    try {
        const { isValidSignature, body } = await parseBody<{
            _type: string
            slug?: { current: string }
        }>(req, process.env.SANITY_REVALIDATE_SECRET)

        if (!isValidSignature) {
            return new Response("Invalid Signature", { status: 401 })
        }

        if (!body?._type) {
            return new Response("Bad Request", { status: 400 })
        }

        // Revalidate the tag for the document type
        revalidateTag(body._type, {})

        // And specific slug
        if (body.slug?.current) {
            revalidateTag(`${body._type}:${body.slug.current}`, {})
        }

        console.log(`Revalidated tags: ${body._type}, ${body._type}:${body.slug?.current}`)

        return NextResponse.json({
            status: 200,
            revalidated: true,
            now: Date.now(),
            body,
        })
    } catch (err: any) {
        console.error("Revalidation Error", err)
        return new Response(err.message, { status: 500 })
    }
}
