# Project Conventions & Hard Rules

## General Rules
- **Strict Root Access Only**: I (the AI assistant) am strictly prohibited from searching for, viewing, or interacting with any files or directories outside the project root: `/Users/ciarannash/Documents/NCAI`. 
- **Web Search**: I am permitted to search the web for documentation and research purposes.
- **Directory Traversal**: No `cd ..` or absolute path access outside the project root is allowed.

## Technology Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **CMS**: Sanity
- **Languages**: TypeScript, JavaScript, HTML, CSS

## Deployment & Workflow
- **Commit Protocol**: Every commit/push to the remote repository defaults to skipping the Vercel build (by adding `[skip ci]` to the commit message). I must explicitly ask for confirmation: *"Should this push trigger a build?"* before every push. Unless explicitly instructed otherwise, the default is always to skip the build.
