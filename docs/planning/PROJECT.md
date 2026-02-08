# Project Context: Nairobi Contemporary Art Institute (NCAI) Website

## Vision
To build a premium, dynamic digital presence for the Nairobi Contemporary Art Institute (NCAI) that reflects its mission of advancing and archiving East African visual arts. The platform will serve as a hub for exhibitions, educational programs, and a growing digital archive, offering an immersive user experience while maintaining the integrity and aesthetics of a contemporary art institution.

## Core Value
**Digital Accessibility to East African Art History**: The platform provides global access to NCAI's exhibitions, archives, and educational resources, extending the institute's impact beyond its physical location.

## Architecture & Stack
- **Frontend**: Next.js (App Router), Tailwind CSS v4, TypeScript
- **CMS**: Sanity (Headless CMS for flexible content modeling)
- **Styling**: Custom design system using Tailwind v4 (CSS variables, modern layout)
- **Deployment**: Vercel (recommended for Next.js) or Netlify

## Scope Strategies
- **v1 (Launch)**: Core marketing pages (Home, About, Visit), dynamic content (Exhibitions, Events, News), Education/Programmes pages, basic Archive browsing.
- **v2 (Future)**: Internal Interactive Map, Virtual Environment (3D Gallery), Online Shop, Advanced Archive features.

## Key Decisions
| Decision | Rationale | Status |
| :--- | :--- | :--- |
| **Use Sanity CMS** | Best-in-class for structured content, image handling, and free tier generosity. | **Proposed** |
| **Next.js + Tailwind v4** | Modern, performance-focused stack requested by user. | **Confirmed** |
| **Defer Interactive Map** | Complex feature better suited for v2 to ensure timely v1 launch. | **Confirmed** |
| **Defer Virtual Gallery** | High complexity 3D feature; lay foundation only in v1. | **Confirmed** |
| **Defer Shop** | E-commerce adds significant scope; lay foundation (schema) only. | **Confirmed** |

## Context
- **Organization**: Non-profit visual art space in Nairobi, founded 2020 by Michael Armitage.
- **Mission**: Preserve and grow modern/contemporary art from East Africa.
- **Location**: Rosslyn Riviera Mall, Nairobi.
- **Vibe**: Calm, reflective, premium, contemporary.
