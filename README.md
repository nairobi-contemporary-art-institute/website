# Nairobi Contemporary Art Institute (NCAI) Website

A premium, dynamic digital presence for the Nairobi Contemporary Art Institute (NCAI), reflecting its mission of advancing and archiving East African visual arts. This platform serves as a hub for exhibitions, educational programs, and a growing digital archive.

## Core Value
**Digital Accessibility to East African Contemporary Art History**: Providing global access to NCAI's exhibitions, archives, and educational resources, extending the institute's impact beyond its physical location.

## Technology Stack
- **Frontend**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **CMS**: [Sanity](https://www.sanity.io/) (Headless CMS)
- **Language**: TypeScript

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

The project follows a standard Next.js App Router structure with localized routes:

- `src/app/[locale]/`: Main application routes (localized).
- `src/components/`: Reusable UI components.
- `src/sanity/`: Sanity CMS configuration and schemas.
- `src/lib/`: Utility functions and shared logic.
- `sanity/`: Sanity Studio configuration (if running separately).

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
