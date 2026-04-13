import { sanityFetch } from '@/sanity/lib/client'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const term = searchParams.get('q')

  if (!term) {
    return NextResponse.json({ results: [] })
  }

  // Search across posts, exhibitors, artists, programs, and events
  // We use match and score for basic relevance
  // Note: title/name are often internationalized arrays, so we search their values
  const query = `
    *[_type in ["post", "exhibition", "artist", "program", "event", "collectionItem"] && 
      (
        title match $term + "*" || 
        title[].value match $term + "*" ||
        name match $term + "*" || 
        name[].value match $term + "*" ||
        excerpt match $term + "*" ||
        excerpt[].value match $term + "*" ||
        pt::text(excerpt[].value) match $term + "*" ||
        description match $term + "*" ||
        description[].value match $term + "*" ||
        pt::text(description[].value) match $term + "*" ||
        pt::text(body[].value) match $term + "*"
      )
    ] | score(
      title match $term,
      title[].value match $term,
      name match $term,
      name[].value match $term
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
    const results = await sanityFetch<any[]>({
      query,
      params: { term },
      revalidate: 30 // Short 30s cache for search to protect quota while staying fresh
    })
    return NextResponse.json({ results })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Failed to search' }, { status: 500 })
  }
}
