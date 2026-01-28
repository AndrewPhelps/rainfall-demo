# Rainfall Demo

## Project Overview

Custom branded frontend for Rainfall Digital's asset verification platform. Rainfall provides NFC/smart tag infrastructure and a REST API for managing digital assets, product authentication, and event tracking. This project builds premium, white-label verification experiences for brands that want a custom domain and polished UI instead of Rainfall's stock verification page.

## Business Context

- **Rainfall Digital** (gorainfall.com) handles backend: NFC tags, asset management, ownership verification, event tracking
- **This project** is the custom frontend layer, pulling data from Rainfall's API and rendering brand-specific verification experiences
- **Target clients**: Brands with collectibles/high-value items (sports memorabilia, luxury goods, etc.) that need the verification experience to match their brand identity
- Rainfall partners with us to build these custom frontends for their brand clients
- The MJ jersey demo is the proof of concept showing the gap between Rainfall's default page and a custom experience

## Tech Stack

- **Next.js 14** (App Router) with TypeScript
- **Tailwind CSS** for styling
- **No database** - entirely API-driven
- Deploys to Vercel

## Rainfall API Integration

- **Base URL**: `https://rainf4ll.com/api/`
- **Auth**: Token-based (`Authorization: Token <key>`) - stored in `.env.local` as `RAINFALL_API_TOKEN`
- **Cloudflare workaround**: Node.js `fetch` gets blocked by Cloudflare bot detection. API routes shell out to `curl` with a browser User-Agent header to bypass this. Direct `curl` from CLI works fine.
- **API spec**: OpenAPI 3.0 spec available at `C:\Users\royph\Downloads\Rainfall Digital API.yaml` (385KB)

### Key Endpoints Used

- `GET /api/assets/search/{query}/` - Look up asset by serial number, short ID, or UUID. Returns full asset with events, attributes, featured_event, merchant info
- `GET /api/assets/?limit=N&offset=N` - Paginated list of assets owned by authenticated user
- Auth endpoints exist (`/api/auth/login/`, `/api/auth/magic-link/`) but login is blocked by Cloudflare server-side; token auth is the working approach

## Project Structure

- `src/app/verify/[serial]/page.tsx` - Main verification page (primary demo)
- `src/app/verify2/[serial]/page.tsx` - Design variant 2
- `src/app/verify3/[serial]/page.tsx` - Design variant 3
- `src/app/api/assets/search/[query]/route.ts` - Proxies to Rainfall asset search API (via curl)
- `src/app/api/assets/route.ts` - Proxies to Rainfall assets list API (via curl)
- `src/app/api/auth/` - Auth proxy routes (login, magic-link, magic-link/validate)
- `src/app/login/page.tsx` - Login page (magic link auth)
- `src/app/assets/page.tsx` - Assets listing page
- `src/lib/api.ts` - Client-side API helper functions

## Demo Asset

- **Chicago Bulls MJ 1995-96 Jersey** (serial: `EW3H-MRPQ`, short ID: `6zxAj3pkVcmdp`)
- 5 timeline events: Jersey Drop, Gatorade sponsorship, HOF Induction, 1996 Finals Game 1, 72-Win Season Tip-Off
- Rainfall's default page for comparison: `https://rainf4ll.com/details/6zxAj3pkVcmdp/`

## Open Architecture Questions (to clarify with Rainfall)

### NFC Tag Routing
How does a scanned tag route to the custom frontend instead of Rainfall's default page? Options:
- Rainfall configures NFC tag URLs to point to custom domain at provisioning time
- Rainfall does a server-side redirect based on merchant/product config
- Tags are written with custom URLs from the start
This determines whether the custom frontend needs its own domain per brand or can share one.

### Multi-Level Customization
The API has a clear hierarchy: **Merchant > Product Line > Product > Asset**. Brands may want different styling at each level:
- Brand A wants Product Line 1 assets styled differently than Product Line 2
- Within a product line, individual products might need unique layouts
- Architecture should support cascading themes: product-level overrides product-line, overrides merchant, overrides defaults
- The `product_line` field is already present on each event in the API response
- Relevant API endpoints: `/api/merchants/{slug}/`, `/api/product_lines/{id}/`, `/api/products/{id}/`

## Roadmap

### Phase 1 - Demo Ready (as of Jan 26, 2025)
- [x] API connection working with token auth
- [x] MJ jersey verification page complete (3 design variants)
- [ ] Complete demo pages for 2 new assets (different brands/styles to show range)
- [ ] Create landing page showcasing custom frontend capabilities
- [ ] Deploy to Vercel production

Goal: Package ready for Rainfall to pitch to brand customers.
