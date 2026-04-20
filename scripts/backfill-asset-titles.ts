import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-03-01',
  token: process.env.SANITY_API_TOKEN, // Needs a token with WRITE access
  useCdn: false,
});

// SAFETY FLAG: Change to false to perform actual updates
const DRY_RUN = false;

/**
 * Helper to get value from internationalizedArrayString
 */
function getVal(arr: any, locale: string = 'en') {
  if (!arr || !Array.isArray(arr)) return '';
  const match = arr.find((item: any) => item._key === locale);
  return match ? match.value : (arr[0]?.value || '');
}

async function backfill() {
  console.log('🔍 Starting Asset Backfill with Detailed ArtLogic formatting...');

  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ Error: SANITY_API_TOKEN is missing in .env.local');
    process.exit(1);
  }

  // 1. Fetch all Works with their associated metadata
  const query = `*[_type == "work"]{
    _id,
    "artistName": artist->name,
    "artworkTitle": title,
    year,
    medium,
    dimensions,
    "artworkType": tags[0]->title,
    "assetId": image.asset._ref,
    "assetOriginalFilename": image.asset->originalFilename
  }`;

  const works = await client.fetch(query);
  console.log(`📦 Found ${works.length} works to process.`);

  let updatedCount = 0;
  let skippedCount = 0;

  for (const work of works) {
    if (!work.assetId) {
      skippedCount++;
      continue;
    }

    const artistName = getVal(work.artistName);
    const title = getVal(work.artworkTitle);
    const date = work.year || 'n.d.';
    const medium = getVal(work.medium);
    const dimensions = work.dimensions || '';
    const type = getVal(work.artworkType); // Correctly resolve internationalized string from reference
    const copyright = `© ${artistName}${date !== 'n.d.' ? ', ' + date : ''}`;

    // Build the requested high-fidelity title string
    const assetTitleParts = [
      `Artist Name: ${artistName}`,
      `Artwork Title: ${title}`,
      `Date: ${date}`,
      medium ? `Medium: ${medium}` : null,
      type ? `Artwork Type: ${type}` : null,
      dimensions ? `Dimensions: ${dimensions}` : null,
      `Copyright: ${copyright}`
    ].filter(Boolean);

    const fullTitle = assetTitleParts.join(' | ');
    const extension = work.assetOriginalFilename ? path.extname(work.assetOriginalFilename) : '.jpg';
    const newFilename = `${fullTitle}${extension}`;

    try {
      if (DRY_RUN) {
        console.log(`🧪 [DRY RUN] Would update Asset ${work.assetId.substring(0, 8)}... with: \n   > ${fullTitle}\n   > Filename: ${newFilename}\n`);
      } else {
        // Patch the asset document
        await client.patch(work.assetId)
          .set({
            title: fullTitle,
            altText: fullTitle, // Good for SEO as well
            originalFilename: newFilename
          })
          .commit();
        
        console.log(`✅ Updated Asset & Filename: ${work.assetId.substring(0, 12)}... for "${title}"`);
      }
      updatedCount++;
    } catch (err) {
      console.error(`❌ Failed to update asset for ${title}:`, err);
    }

    // Small delay to avoid hitting rate limits too hard
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n--- 🏁 Backfill Complete ---');
  console.log(`Total Works Processed: ${works.length}`);
  console.log(`Assets Updated: ${updatedCount}`);
  console.log(`Skipped (No Image): ${skippedCount}`);
}

backfill().catch(console.error);
