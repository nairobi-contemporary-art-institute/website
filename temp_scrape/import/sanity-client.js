// Shared Sanity write client for import scripts
// Requires SANITY_API_TOKEN in environment (copy from .env.local)
const { createClient } = require('@sanity/client')

const token = process.env.SANITY_API_TOKEN
if (!token) throw new Error('SANITY_API_TOKEN env var required')

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'ngte58ft',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-02-08',
  useCdn: false,
  token,
})

module.exports = { client }
