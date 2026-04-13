# Repository Guidelines

## Project Structure & Module Organization

The Nairobi Contemporary Art Institute (NCAI) website is built with a modern Next.js 15 App Router architecture, featuring:

- `src/app/[locale]/` - Localized application routes with internationalization support
- `src/components/` - Organized by feature/domain (layout, ui, home, education, exhibitions, etc.)
- `src/sanity/` - Sanity CMS integration including client configuration, image handling, and queries
- `src/lib/` - Shared utility functions for various features (analytics, gsap animations, listmonk integration)
- `sanity/` - Sanity Studio schemas organized by content type (artists, exhibitions, events, pages, etc.)

The project follows a component-driven architecture with clear separation of concerns between presentation, business logic, and data fetching layers.

## Build, Test, and Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

The development server runs on port 3000 by default. The build process includes TypeScript compilation, CSS optimization through Tailwind CSS v4, and asset optimization.

## Coding Style & Naming Conventions

- TypeScript is strictly enforced with explicit typing
- Components are organized by feature/domain in the `src/components/` directory
- Component files use PascalCase naming convention
- Utility functions use camelCase naming convention
- Internationalization is handled through `next-intl` with locale-specific routing
- Styling uses Tailwind CSS v4 with utility-first approach
- ESLint rules enforce code quality with warnings for unused variables and explicit any types

Key ESLint configurations:
- `@typescript-eslint/no-explicit-any`: warn
- `@typescript-eslint/no-unused-vars`: warn
- `react/no-unescaped-entities`: off

## Testing Guidelines

Testing is configured through the Next.js framework with TypeScript support. Run tests using:

```bash
npm run test
```

The project utilizes:
- Unit testing for utility functions
- Integration testing for components
- End-to-end testing for critical user flows

## Commit & Pull Request Guidelines

Commit messages follow conventional commits format:
- `feat:` for new features
- `chore:` for maintenance tasks
- `docs:` for documentation updates
- `fix:` for bug fixes

Example commit messages:
- `feat: implement GSAP-powered header logo scroll transition with width expansion`
- `chore: commit untracked and modified sanity schemas and UI components from previous session`
- `docs: complete milestone v1-launch`

## CMS Integration

The project integrates with Sanity CMS for content management:
- Content schemas defined in `sanity/schemaTypes/`
- Client configuration in `src/sanity/lib/client.ts`
- Image handling through `src/sanity/lib/image.ts`
- Custom queries in `src/sanity/lib/queries.ts`

## Internationalization

Internationalization is implemented with `next-intl`:
- Locale-specific routing through `[locale]` directory structure
- Translation files and configuration in `src/i18n.ts`
- Middleware handling in `src/middleware.ts`