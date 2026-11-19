<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Studiospace

Single Next.js 16.4.5 app (App Router, `src/app/`), not a monorepo. Marketplace for renting photo/video/music studios. No tests, no CI, no `.env` files — don't invent test commands. `README.md` is untouched create-next-app boilerplate; trust the code instead.

## The tree is uncommitted user WIP, and it changes between sessions

- Only the initial create-next-app commit exists. `src/components/`, `src/lib/`, `src/app/Destinations/`, `src/app/AddStudioSpace/` are **untracked** (deletions there are unrecoverable); `src/app/page.tsx`, `layout.tsx`, `globals.css`, `next.config.ts`, `package.json` are modified.
- Components and home-page sections are added and removed between sessions (a `StudioCard.tsx` / `TopDestinations.tsx` pair existed and was deleted). Re-glob `src/components/` and re-read callers before importing or referencing any component.
- Never delete or "fix" user WIP without asking; run `git status` before anything destructive.

## Commands

- `npm run dev` — dev server (Turbopack).
- `npm run lint` — runs bare `eslint` over the whole repo (flat config `eslint.config.mjs`; `next lint` no longer exists). Focused run: `npx eslint <path>`.
- `npm run build` — build **plus TypeScript typecheck**; the typecheck step is what usually fails.
- Typecheck alone: `npx tsc --noEmit` (no `typecheck` script exists).

**Current status (verify — it goes stale fast):** `npx tsc --noEmit`, `npm run lint`, and `npm run build` all fail on `src/app/Destinations/page.tsx` (~line 191): it renders `<StudioCard>` but that component file no longer exists (`TS2304` / `react/jsx-no-undef`). Lint also reports a pre-existing warning: unused `Aperture` import in `src/components/navbar.tsx`. Re-run the commands before assuming your own change caused a failure.

## Architecture facts that aren't obvious

- **Capitalized route folders:** `src/app/Destinations/` and `src/app/AddStudioSpace/` → routes `/Destinations` and `/AddStudioSpace` (case-sensitive in prod); `/Destinations/[id]` is the studio detail page. Follow the existing casing for new routes.
- **Hardcoded backend on port 5000, no env vars anywhere:** `src/lib/destinations.ts` fetches `http://localhost:5000/destinations` (used by `/Destinations` and `/Destinations/[id]`); `src/app/AddStudioSpace/page.tsx` POSTs to `http://localhost:5000/add-destination`. With the backend down, those pages show their own error/empty states with a Retry button — expected, not a regression.
- **Most nav/footer links point at routes that don't exist** (`/studios`, `/host`, `/login`, `/register`, `/about`, `/contact`, `/terms`, `/privacy`, `/studios?category=...`). `next build` does not fail on these — don't treat them as broken imports.
- `src/app/layout.tsx` must keep the generated `LayoutProps<"/">` parameter type (not `LayoutProps` or manual props); it also mounts react-hot-toast's `<Toaster>`.
- `src/lib/destinations.ts` is the API client: `Destination` type, `fetchDestinations()`, and image helpers (`FALLBACK_IMAGES`, `imageCandidates`, `isUsableImageSrc`). Placeholder photos live in `public/` (`banner.jpg`, `banner1.jpg`, `hero-studio.jpg`, `studiopic.jpg`, `cities/`).

## Toolchain quirks

- **Tailwind v4 is CSS-first:** no `tailwind.config`. Theme lives in `src/app/globals.css` (`@theme inline`; imports `tailwindcss`, `tw-animate-css`, `shadcn/tailwind.css`). CSS is compiled through the `@tailwindcss/turbopack` loader rule in `next.config.ts` — Turbopack only.
- **React Compiler is on** (`reactCompiler: true` + `babel-plugin-react-compiler`). Components must follow compiler rules: no impure renders, no mutation of props/state during render.
- **`next/image` deliberately allows every host** (`images.remotePatterns` with `hostname: "**"` in `next.config.ts`) because image URLs come from MongoDB documents — don't "tighten" this or remote card images throw.
- **shadcn CLI is configured** (`components.json`, style `base-nova`) and generates **`@base-ui/react`, not Radix** (no Radix packages in `package.json`) — don't hand-write Radix imports. `cn` comes from the `cn` package, re-exported by `src/lib/utils.ts` (some components import it from `"cn"` directly).
- Path alias: `@/*` → `./src/*` (`tsconfig.json` `paths`).

## Conventions

- Interactive pages/components start with `"use client"` at the top of the file (see `src/app/Destinations/page.tsx`, `src/app/AddStudioSpace/page.tsx`, `src/components/navbar.tsx`); everything else is a server component by default.
- Toasts via `react-hot-toast` (`<Toaster>` is already mounted in the root layout — just call `toast.*`).
- Styling pattern: Tailwind utility strings, heavy `dark:` variants for dark mode, orange (`orange-500`) as the accent color, `#172b45` for headings on light backgrounds.
