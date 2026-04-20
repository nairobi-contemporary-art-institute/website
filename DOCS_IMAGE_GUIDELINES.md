# NCAI Image Asset Guidelines

This document outlines the recommended image dimensions and best practices for the NCAI website to maintain the "Clinical Luxury" aesthetic and optimal performance.

## Core Principles
1. **Clinical Sharpness**: Always provide high-resolution source files. The website uses Next.js `next/image` to generate optimized versions for various screen sizes, but it needs a high-quality master.
2. **Dynamic Cropping**: Most images use Sanity's **Hotspot** feature. When uploading, ensure you click the image in Sanity Studio to set the focal point (red circle) so important details are never cropped out.
3. **Optimized Delivery**: Next.js automatically converts your JPEGs/PNGs into WebP or AVIF format.

## Recommended Dimensions

| Section | Field Name | Recommended Size | Aspect Ratio | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Exhibition Hero** | `mainImage` | **3000px × 1800px** | 16:9 / 3:2 | Used for the split-hero and full-screen displays. |
| **Exhibition Listing** | `listImage` | **1500px × 1500px** | 1:1 or 4:5 | Used in the main archive grid cards. |
| **Homepage Hero** | `hero/image` | **2500px × 1500px** | Flexible | Focus on the subject; hotspot is crucial here. |
| **Featured Post** | `mainImage` | **2000px × 1200px** | 16:9 | High-fidelity blog/article covers. |
| **Gallery Images** | `gallery/images` | **2000px+ (Height)** | Original | The Cinematic Gallery constrains height to 700px; 2x source ensures sharpness on retina. |
| **Partner Logos** | `logo` | **800px × 400px** | Varied | Provide on tight transparent backgrounds (PNG or SVG). |

## File Naming & SEO
- **Alt Text is Mandatory**: Always describe the image in the "Alternative Text" field for screen readers and search engines.
- **Example**: *Instead of "exhibition_photo.jpg", use "Artwork by Peterson Kamwathi displayed in Gallery 1 at NCAI Nairobi."*

## Best Practices
- **Portrait vs Landscape**: While our system is flexible, Portrait images (`4:5`) generally feel more premium for Artist profiles and individual works, while Landscape (`16:9`) works best for installation views and heroes.
- **Color Profile**: Use **sRGB** for all web uploads to ensure color consistency across browsers.
- **Max File Size**: While Sanity handles compression, try to keep uploads under **10MB** to ensure the Studio remains fast.
