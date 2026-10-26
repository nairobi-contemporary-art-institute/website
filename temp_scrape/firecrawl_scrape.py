#!/usr/bin/env python3
"""
Full NCAI site scrape using Firecrawl SDK v4.
Document.metadata is a DocumentMetadata object — use attribute access.
"""

import json
import os
import re
import time
from pathlib import Path
from urllib.parse import urlparse

from firecrawl import FirecrawlApp

API_KEY = os.environ.get("FIRECRAWL_API_KEY", "")
if not API_KEY:
    raise SystemExit("FIRECRAWL_API_KEY env var required")
BASE_URL = "https://www.ncai254.com"
OUT_DIR = Path(__file__).parent / "firecrawl"
PAGES_DIR = OUT_DIR / "pages"
PAGES_DIR.mkdir(parents=True, exist_ok=True)

app = FirecrawlApp(api_key=API_KEY)


def slug(url: str) -> str:
    path = urlparse(url).path.strip("/") or "index"
    return re.sub(r"[^\w\-]", "_", path)[:80]


def save_page(url: str, markdown: str, title: str):
    filename = PAGES_DIR / f"{slug(url)}.md"
    with open(filename, "w", encoding="utf-8") as f:
        f.write(f"# {title or url}\n\n")
        f.write(f"**URL:** {url}\n\n")
        f.write(markdown or "")
    return filename


def extract_images(markdown: str, url: str) -> list:
    imgs = re.findall(r"!\[([^\]]*)\]\(([^)]+)\)", markdown or "")
    return [{"alt": alt, "src": src, "page": url} for alt, src in imgs if src.startswith("http")]


def scrape_with_retry(url: str, max_attempts: int = 5) -> tuple:
    """Returns (markdown, title) or raises after max_attempts."""
    for attempt in range(max_attempts):
        try:
            r = app.scrape(url, formats=["markdown"])
            md = r.markdown or ""
            title = getattr(r.metadata, "title", url) if r.metadata else url
            return md, title
        except Exception as e:
            msg = str(e)
            if "Rate" in msg and attempt < max_attempts - 1:
                wait = 65
                print(f"    Rate limited, waiting {wait}s...")
                time.sleep(wait)
            else:
                raise


# ── Step 1: Map all URLs ──────────────────────────────────────────────────────
print("Step 1: Mapping site URLs...")
urls = []
try:
    map_result = app.map(BASE_URL)
    # LinkResult objects — extract href strings
    if hasattr(map_result, "links"):
        raw = map_result.links
        urls = [getattr(x, "url", str(x)) if not isinstance(x, str) else x for x in raw]
    elif isinstance(map_result, list):
        urls = [getattr(x, "url", str(x)) if not isinstance(x, str) else x for x in map_result]
    print(f"  Found {len(urls)} URLs")
    with open(OUT_DIR / "map.json", "w") as f:
        json.dump(urls, f, indent=2)
except Exception as e:
    print(f"  Map failed: {e}")

# ── Step 2: Crawl full site ───────────────────────────────────────────────────
print("\nStep 2: Crawling full site (limit=150)...")
all_images = []
crawled = set()

try:
    crawl_result = app.crawl(
        BASE_URL,
        limit=150,
        scrape_options={"formats": ["markdown"]},
        poll_interval=5,
    )
    pages = crawl_result.data if hasattr(crawl_result, "data") else []
    print(f"  Got {len(pages)} pages from crawl")

    for page in pages:
        meta = page.metadata
        url = getattr(meta, "url", None) if meta else None
        title = getattr(meta, "title", url) if meta else url
        markdown = page.markdown or ""

        if not url:
            continue

        filepath = save_page(url, markdown, title)
        crawled.add(url)
        imgs = extract_images(markdown, url)
        all_images.extend(imgs)
        print(f"  ✓ {url[-70:]} ({len(imgs)} imgs)")

except Exception as e:
    print(f"  Crawl failed: {e}")
    import traceback; traceback.print_exc()

# ── Step 3: Targeted scrapes for missing key pages ───────────────────────────
KEY_PATHS = [
    "/", "/exhibitions", "/events", "/education-outreach", "/turn2",
    "/offsite", "/the-gathering", "/artist-films", "/artist-talks",
    "/ujuzi", "/publications", "/press", "/about", "/residency", "/contact",
]

exh_json = Path(__file__).parent / "exhibitions" / "exhibitions.json"
if exh_json.exists():
    with open(exh_json) as f:
        exhibitions = json.load(f)
    for exh in exhibitions:
        if isinstance(exh, dict) and exh.get("url"):
            path = "/" + exh["url"].replace(BASE_URL, "").strip("/")
            if path not in KEY_PATHS:
                KEY_PATHS.append(path)

print(f"\nStep 3: Targeted scrapes ({len(KEY_PATHS)} URLs, skipping already crawled)...")
for path in KEY_PATHS:
    url = f"{BASE_URL}{path}" if path.startswith("/") else path
    if url in crawled:
        print(f"  skip (crawled): {path}")
        continue
    try:
        md, title = scrape_with_retry(url)
        filepath = save_page(url, md, title)
        imgs = extract_images(md, url)
        all_images.extend(imgs)
        print(f"  ✓ {path} ({len(imgs)} imgs)")
        time.sleep(6)  # stay well under 10 req/min free limit
    except Exception as e:
        print(f"  ✗ {path}: {e}")

# ── Step 4: Write image manifest ─────────────────────────────────────────────
print(f"\nStep 4: Writing image manifest ({len(all_images)} total image refs)...")
seen = set()
unique_images = []
for img in all_images:
    if img["src"] not in seen:
        seen.add(img["src"])
        unique_images.append(img)

with open(OUT_DIR / "image_manifest.json", "w", encoding="utf-8") as f:
    json.dump(unique_images, f, indent=2, ensure_ascii=False)

pages_count = len(list(PAGES_DIR.glob("*.md")))
print(f"\n{'='*50}")
print(f"Done.")
print(f"  Pages:  {pages_count} files → firecrawl/pages/")
print(f"  Images: {len(unique_images)} unique → firecrawl/image_manifest.json")
print(f"  Map:    firecrawl/map.json ({len(urls)} URLs)")
print(f"\nNext: cd firecrawl && python3 download_images.py")
