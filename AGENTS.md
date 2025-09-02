# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Source code (routes, features, components, lib). Example: `app/routes/*.tsx` for pages, `app/components/ui/*` for shared UI.
- `public/`: Static assets served as-is.
- `build/`: Output after `build` (SSR `server/`, static `client/`).
- `scripts/`: Utility scripts.
- Config: `biome.jsonc` (lint/format), `tsconfig.json`, `vite.config.ts`, `.react-router/` (typegen), `Dockerfile`.

## Build, Test, and Development Commands
- `npm run dev` (or `bun dev`): Start React Router dev server with HMR.
- `npm run build` (or `bun run build`): Build client and server bundles.
- `npm start` (or `bun run start`): Serve built app via `react-router-serve`.
- `npm run typecheck`: Generate types and run TypeScript.
- `npm run typegen`: Generate Sanity types.

## Coding Style & Naming Conventions
- Language: TypeScript (strict mode). Framework: React Router + Vite + Tailwind.
- Formatter/Linter: Biome. Run locally with `npx biome check --write .`.
- Indentation: 2 spaces; prefer named exports; component files in `PascalCase` (e.g., `Button.tsx`).
- Routes: File-based under `app/routes/` using conventional segment names; colocate loaders/actions in the same file.

## Testing Guidelines
- Status: No test runner configured yet. Recommended: Vitest + React Testing Library.
- Suggested naming: `*.test.ts` / `*.test.tsx` next to implementation or under `app/**/__tests__/`.
- Aim for critical-path coverage: route loaders/actions, lib utilities, and complex UI.

## Commit & Pull Request Guidelines
- Commit style: Conventional Commits (e.g., `feat:`, `fix:`, `refactor:`, `ui:`) as seen in history.
- PRs: Clear description, linked issues, and screenshots/GIFs for UI changes. Keep PRs focused and small; note any breaking changes.

## Security & Configuration Tips
- Env: Use `.env` for runtime configuration (keys for Sanity, auth, external APIs). Do not commit secrets.
- Validate env at startup (e.g., with `zod`) and document required vars in the PR when adding new ones.

## Architecture Overview
- SSR React Router app built with Vite. Tailwind for styling. Types generated for routes (`.react-router/types`) and Sanity (`sanity.types.ts`).
