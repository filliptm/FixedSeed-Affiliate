# FixedSeed-Affiliate — Agent Instructions

Affiliate portal for `affiliate.fixedseed.com`. Users authenticate through Auth0, apply to the program, receive referral links after approval, and inspect clicks and conversions. Admin-role users can review and manage affiliates.

## Documentation

Workspace documentation lives at [`../docs/`](../docs/). Start with:

- [`../docs/README.md`](../docs/README.md) — documentation and instruction-file protocol
- [`../docs/affiliate/README.md`](../docs/affiliate/README.md) — portal-specific reference map
- [`../docs/server/AFFILIATES.md`](../docs/server/AFFILIATES.md) — affiliate state machine, attribution, commissions, and server routes
- [`../docs/server/API.md`](../docs/server/API.md) — endpoint catalog
- [`../docs/website/CHECKOUT.md`](../docs/website/CHECKOUT.md) — referral cookie and checkout propagation
- [`../docs/workspace/INFRASTRUCTURE.md`](../docs/workspace/INFRASTRUCTURE.md) — Railway, domain, and Auth0 configuration
- [`../docs/workspace/SECRETS.md`](../docs/workspace/SECRETS.md) — credential locations and environment variables

Before relying on a documentation claim, verify it against the cited code. Code wins ties.

Before finishing a change:

1. Grep `../docs/` and this repo's [`README.md`](./README.md) for the files, endpoints, roles, environment variables, and concepts you touched.
2. Update stale documentation in the same change.
3. Add documentation for new behavior rather than deferring it.

## Runtime and key files

- React 19, React Router 7, Vite 6, strict TypeScript
- Auth0 PKCE through `@auth0/auth0-react`
- Bun for installs and the production static server
- Development port `7392`
- [`src/main.tsx`](./src/main.tsx) — Auth0 provider and BrowserRouter setup
- [`src/App.tsx`](./src/App.tsx) — route table
- [`src/lib/api.ts`](./src/lib/api.ts) — typed authenticated API client
- [`src/lib/roles.ts`](./src/lib/roles.ts) — Auth0 custom-role claim parsing
- [`serve.ts`](./serve.ts) — production static server and SPA fallback
- [`railway.json`](./railway.json) — Railway build and start configuration

## Critical rules

- **All server requests belong in [`src/lib/api.ts`](./src/lib/api.ts).** Components obtain an Auth0 access token and call typed client functions; do not scatter authenticated `fetch()` calls through pages.
- **The Auth0 role claim namespace is shared with the server.** Keep `https://fixedseed.com/roles` in [`src/lib/roles.ts`](./src/lib/roles.ts) synchronized with `ROLES_CLAIM` in [`../FixedSeed-Server/src/middleware/auth0.ts`](../FixedSeed-Server/src/middleware/auth0.ts).
- **Client-side admin checks are navigation and presentation guards only.** The server's `requireAuth0Admin` middleware is the authorization boundary. Never weaken server authorization because the UI hides a route.
- **Preserve the `NotFoundError` behavior for `GET /api/affiliates/me`.** A 404 means an authenticated user has not applied yet and drives the application form; it is not a generic request failure.
- **Commission units are not interchangeable.** `PERCENT` rates are basis points; `FLAT` rates are cents. Preserve those units in forms, API types, and formatting.
- **`VITE_*` configuration is build-time.** Changes to Auth0 or API values require a rebuild. Never place confidential server secrets in `VITE_*`; browser-delivered Auth0 client configuration is public by design.
- **Node is pinned to 22 or newer** in both [`.nvmrc`](./.nvmrc) and [`package.json`](./package.json). Nixpacks reads these files when selecting the Railway build image; do not remove or weaken the pins.
- **BrowserRouter requires the production SPA fallback in [`serve.ts`](./serve.ts).** Unknown non-asset paths must return `dist/index.html` so `/dashboard` and `/admin/:id` survive refreshes.
- **Do not change Auth0 `cacheLocation="localstorage"` casually.** It controls session persistence and changes the portal's security/UX tradeoff; document and test any change deliberately.
- **Port `7392` is reserved for the affiliate portal.** The server's development CORS allowlist depends on it.

## Development and validation

```bash
bun install
bun run dev                 # Vite on http://localhost:7392
bunx tsc --noEmit           # strict TypeScript validation
bun run build               # production Vite build
bun run preview             # preview on port 7392
bun serve.ts                # production server; serves dist/ and SPA fallbacks
```

Before finishing any code change, run `bunx tsc --noEmit` and `bun run build`.

## Deployment safety

Pushing `main` triggers Railway. A successful Git push is not proof that the portal deployed.

Before pushing, run the validation commands above. After pushing, use the Railway CLI in this repository to confirm the linked service and poll the newest deployment until it reaches `SUCCESS`. If it reaches `FAILED` or `CRASHED`, inspect bounded build/runtime logs, fix the cause, push again, and re-verify. Do not consider the task complete while production is behind `main`.
