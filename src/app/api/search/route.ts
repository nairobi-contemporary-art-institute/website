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
    *[_type in ["post", "exhibition", "artist", "program", "event", "collectionItem", "work"] && 
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
        pt::text(body[].value) match $term + "*" ||
        artist->name[].value match $term + "*"
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
      "slug": coalesce(slug.current, artist->slug.current),
      "image": coalesce(mainImage, image),
      "date": coalesce(publishedAt, startDate, year, creationDate),
      "artistName": artist->name
    } | order(_score desc, date desc)[0...15]
  `

  try {
    const results = await sanityFetch<any[]>({
      query,
      params: { term },
      revalidate: 30
    })
    return NextResponse.json({ results })
  } catch (error: any) {
    console.error('Search error:', error)
    return NextResponse.json({ 
      error: 'Failed to search', 
      details: error.message,
      stack: error.stack 
    }, { status: 500 })
  }
}
