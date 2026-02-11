import { client } from '@/sanity/lib/client'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const term = searchParams.get('q')

    if (!term) {
        return NextResponse.json({ results: [] })
    }

    // Search across posts, exhibitors, artists, and programs
    // We use match and score for basic relevance
    const query = `
    *[_type in ["post", "exhibition", "artist", "program"] && 
      (
        title match $term + "*" || 
        name match $term + "*" || 
        excerpt match $term + "*" ||
        description match $term + "*"
      )
    ] | score(
      title match $term,
      name match $term
    ) {
      _id,
      _type,
      "title": coalesce(title, name),
      "slug": slug.current,
      "image": coalesce(mainImage, image),
      "date": coalesce(publishedAt, startDate),
    } | order(_score desc, date desc)[0...10]
  `

    try {
        const results = await client.fetch(query, { term })
        return NextResponse.json({ results })
    } catch (error) {
        console.error('Search error:', error)
        return NextResponse.json({ error: 'Failed to search' }, { status: 500 })
    }
}
