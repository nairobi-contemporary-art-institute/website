# Phase 2: Core Architecture & Info Pages - Implementation Plan

## Goal
Build the static core of the NCAI website (Layouts, Navigation, Basic Pages) using Figma Dev Mode to ensure pixel-perfect implementation of the Design System.

## Prerequisites
- [ ] **Figma File URL**: User must provide the link to the NCAI Design System / Website file.
- [ ] **Figma Auth**: Agent must be authenticated (via MCP).

## Step 1: Design System Sync (Figma -> Code)
- **Action**: Extract Design Tokens (Colors, Typography, Spacing, Shadows).
- **Tool**: `figma-dev-mode-mcp-server:get_variable_defs` or `get_design_context` on "Design System" frame.
- **Output**: Update `src/app/globals.css` and `tailwind.config.ts` (if needed) to match Figma variables exactly.

## Step 2: UI Component Library (Atomic Design)
- **Action**: Create reusable "atom" components.
- **Components**:
    - `Button` (Primary, Secondary, Ghost) - *Source: Figma "Buttons" Frame*
    - `Typography` (Heading 1-6, Body, Caption) - *Source: Figma "Typography" Frame*
    - `Container / Grid` - *Source: Figma "Grid" Layout*
    - `Card` (Generic wrapper)
- **Verification**: Create `src/app/[locale]/design-system/page.tsx` to visualize all components.

## Step 3: Global Layout & Navigation
- **Action**: Build the persistent site shell.
- **Components**:
    - `Header` (Logo, Desktop Nav, Mobile Menu Trigger)
    - `Footer` (Links, Newsletter, Copyright)
    - `LanguageSwitcher` (Dropdown/Toggle)
- **Integration**: Update `src/app/[locale]/layout.tsx` to use these components.

## Step 4: Static Page Scaffolding
- **Action**: Create the basic structure for info pages.
- **Pages**:
    - `/about`
    - `/visit`
    - `/contact`
    - `/support`
- **Content**: Use placeholder or "lorem ipsum" if final content isn't ready (or fetch from Sanity if schematized).

## Verification Strategy
1.  **Visual Check**: Compare `localhost:3000/design-system` against Figma "Design System" page.
2.  **Responsiveness**: Verify Header/Footer on Mobile vs Desktop.
3.  **Navigation**: Test links and Language Switcher.
