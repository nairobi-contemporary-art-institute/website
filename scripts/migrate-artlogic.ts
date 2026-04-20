import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Define types safely
interface ArtlogicRow {
  id: number;
  stock_number: string;
  title: string;
  year: string;
  medium: string;
  dimensions: string;
  artist: string;
}

interface ArtlogicDump {
  rows: ArtlogicRow[];
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-03-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

function slugify(text: string) {
  return text
    .toString()
    .normalize('NFD') // split an accented letter in the base letter and the acent
    .replace(/[\u0300-\u036f]/g, '') // remove all previously split accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 ]/g, '') // remove all chars not letters, numbers and spaces (to be replaced)
    .replace(/\s+/g, '-');
}

async function getOrCreateArtist(artistName: string): Promise<string | null> {
  if (!artistName || artistName.trim() === '') return null;
  
  const nameTrimmed = artistName.trim();
  const slug = slugify(nameTrimmed);
  
  // Try to find existing
  const query = `*[_type == "artist" && slug.current == $slug][0]._id`;
  const existingId = await client.fetch(query, { slug });
  if (existingId) return existingId;

  // Create new
  console.log(`✨ Creating new artist: ${nameTrimmed}`);
  const doc = {
    _type: 'artist',
    name: [{ _key: 'en', value: nameTrimmed }],
    slug: { _type: 'slug', current: slug },
  };

  const created = await client.create(doc);
  return created._id;
}

async function uploadImage(imagePath: string, artistName: string, row: ArtlogicRow) {
    console.log(`🖼️ Uploading image: ${imagePath}`);
    try {
        const stream = fs.createReadStream(imagePath);
        const asset = await client.assets.upload('image', stream, {
            filename: path.basename(imagePath),
        });

        // BUILD HIGH-FIDELITY TITLE FOR MEDIA FOLDER
        const date = row.year || 'n.d.';
        const copyright = `© ${artistName}${date !== 'n.d.' ? ', ' + date : ''}`;
        
        const assetTitleParts = [
          `Artist Name: ${artistName}`,
          `Artwork Title: ${row.title}`,
          `Date: ${date}`,
          row.medium ? `Medium: ${row.medium}` : null,
          row.dimensions ? `Dimensions: ${row.dimensions}` : null,
          `Copyright: ${copyright}`
        ].filter(Boolean);

        const fullTitle = assetTitleParts.join(' | ');
        const extension = path.extname(imagePath) || '.jpg';
        const newFilename = `${fullTitle}${extension}`;

        // Update the asset document metadata
        await client.patch(asset._id)
            .set({
                title: fullTitle,
                altText: fullTitle,
                originalFilename: newFilename
            })
            .commit();
        
        return {
            _type: 'image',
            asset: {
                _type: 'reference',
                _ref: asset._id,
            },
            caption: [
                {
                    _key: 'en',
                    value: `${artistName ? artistName + ', ' : ''}${row.title}`,
                }
            ]
        };
    } catch (e) {
        console.error(`❌ Failed to upload image ${imagePath}:`, e);
        return null; // Don't crash the whole import on 1 bad image
    }
}

async function run() {
  if (!process.env.SANITY_API_TOKEN) {
    console.error("❌ ERROR: SANITY_API_TOKEN is not set in your environment.");
    console.error("Please create a token in the Sanity dashboard (with Editor or Admin rights)");
    console.error("and run the script with: SANITY_API_TOKEN=your_token npx tsx scripts/migrate-artlogic.ts");
    process.exit(1);
  }

  // Helper wait function for rate-limiting
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const dumpPath = path.resolve(__dirname, 'data/artlogic_artworks_dump.json');
  if (!fs.existsSync(dumpPath)) {
    console.error(`❌ Cannot find ${dumpPath}`);
    process.exit(1);
  }

  const dump: ArtlogicDump = JSON.parse(fs.readFileSync(dumpPath, 'utf8'));
  const rows = dump.rows;
  console.log(`📦 Loaded ${rows.length} records from Artlogic dump.`);

  // Find all images in our image directory
  const imageDir = path.resolve(__dirname, 'data/images');
  const allImagePaths = getAllFiles(imageDir).filter(p => !p.includes('.DS_Store'));
  console.log(`📸 Found ${allImagePaths.length} image files localy.`);

  // Create an image mapping
  // Map format: DKO/SAF/001 -> /full/path/to/001 - original.jpg
  // Note: Artlogic folders use '-' instead of '/' often, or are nested.
  // We'll search for the right side of the stock number. e.g. '001' or '001 - original.jpg'
  
  let processedCount = 0;
  
  // TO ENSURE WE CAN TEST SAFELY, DEFAULT TEST_MODE = TRUE
  // TO DO FULL IMPORT, CHANGE testMode = false
  const testMode = false; 
  let limit = testMode ? 5 : rows.length;

  for (let i = 0; i < limit; i++) {
    const row = rows[i];
    const stockNumber = row.stock_number || '';
    if (!stockNumber) continue;

    console.log(`\n============================`);
    console.log(`Processing: [${stockNumber}] ${row.title}`);

    // Check if it already exists
    const existing = await client.fetch(`*[_type == "work" && artlogicId == $id][0]`, { id: String(row.id) });
    if (existing) {
        console.log(`⏭️ Skipping (already exists logic ID ${row.id})`);
        continue;
    }

    // Attempt to match an image
    // Stock number is typically AAA/BBB/001. We want to find a file path containing AAA/BBB/001 or similar.
    // e.g. "SAF/001" or "001" inside "DKO".
    // Usually, the last chunk of the stock number is the filename prefix.
    const parts = stockNumber.split('/');
    const lastPart = parts[parts.length - 1]; // e.g. 001
    const prefixDirMatch = parts.length > 2 ? parts[0] : ''; // e.g. DKO

    let matchedImagePath: string | null = null;

    if (lastPart) {
      // Find paths that end with that part '001 - original.jpg' or similar
      // AND optionally contain the artist prefix directory to be safe.
      const possibleMatches = allImagePaths.filter(p => p.includes(lastPart) && p.toLowerCase().includes('.jpg'));
      if (possibleMatches.length === 1) {
          matchedImagePath = possibleMatches[0];
      } else if (possibleMatches.length > 1) {
          // refine by prefix if available
          const refined = possibleMatches.find(p => p.includes(prefixDirMatch));
          if (refined) matchedImagePath = refined;
          else matchedImagePath = possibleMatches[0]; // fallback
      }
    }

    // 1. Resolve Artist
    let artistId = null;
    if (row.artist) {
        artistId = await getOrCreateArtist(row.artist);
    }

    // 2. Upload Image
    let imageObj = null;
    if (matchedImagePath) {
        imageObj = await uploadImage(matchedImagePath, row.artist, row);
    } else {
        console.log(`⚠️ No local image matched for stock number: ${stockNumber}`);
    }

    // 3. Create Document
    const doc = {
      _type: 'work',
      title: row.title ? [{ _key: 'en', value: row.title }] : undefined,
      artist: artistId ? { _type: 'reference', _ref: artistId } : undefined,
      year: row.year || '',
      medium: row.medium ? [{ _key: 'en', value: row.medium }] : undefined,
      dimensions: row.dimensions || '',
      artlogicId: String(row.id),
      stockNumber: stockNumber,
      image: imageObj,
      featuredOnHome: false,
      mediaType: 'image',
    };

    if (testMode) {
      console.log(`🧪 DRY RUN RECORD DATA:`, { ...doc, image: doc.image ? 'Image Data Included' : 'None' });
    } else {
      await client.create(doc);
      console.log(`✅ Created record for: ${stockNumber} in Sanity!`);
      // Sleep for 300ms to avoid overwhelming the Sanity API rate limits
      await wait(300);
    }

    processedCount++;
  }

  console.log(`\n🎉 Processed ${processedCount} records. (Test mode = ${testMode})`);
}

run().catch(console.error);
