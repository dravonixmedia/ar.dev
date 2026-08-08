# AR Hydraulics and Sealing Solutions

Premium industrial marketing website for AR Hydraulics and Sealing Solutions (DEV Group) — hydraulics, mobile hydraulic works, sealing solutions, precision machining, structural fabrication and roofing works.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- GSAP + ScrollTrigger for scroll-driven reveals and the signature service sequence
- Lenis for smooth scrolling
- Custom cursor + magnetic buttons on fine-pointer/desktop, automatically disabled on touch and `prefers-reduced-motion`
- Lucide icons

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

- `src/app` — routes (App Router), one folder per page, plus `sitemap.ts` / `robots.ts`
- `src/components/sections/home` — homepage sections, assembled in `src/app/page.tsx`
- `src/components/layout` — header, mobile nav, footer, WhatsApp float, mobile action bar
- `src/components/ui` — reusable primitives (Button, TextReveal, ImageReveal, Breadcrumbs, custom cursor, magnetic button)
- `src/components/graphics` — original SVG technical illustrations used in place of stock photography (see note below)
- `src/lib/data` — single source of truth for site info, contact details, services, products, industries, projects, nav and SEO copy
- `src/lib/whatsapp.ts` — builds `wa.me` links with page-aware prefilled messages

## Content & imagery note

No brochures, logo artwork, or photography were available in this environment, so:

- The header/footer lockup is an **original placeholder wordmark**, not the supplied DEV Group logo. Swap `src/components/layout/Logo.tsx` for an `<Image>` once the real logo file is added to `public/`.
- Imagery throughout the site uses **original abstract SVG line-art** (`src/components/graphics`) representing hydraulic components, rather than stock or placeholder photography. Real product/workshop photography can replace these `ImageReveal` containers directly.
- Project entries in `src/lib/data/projects.ts` are clearly marked `isPlaceholder: true` and flagged in the UI — replace with real project data, images and outcomes once confirmed.

## Forms

The quote and contact forms validate client-side and submit via a `mailto:` fallback (no backend is configured). See `.env.example` for the environment variables a future server-side form handler would need.

## Production build

```bash
npm run build
npm run lint
```
