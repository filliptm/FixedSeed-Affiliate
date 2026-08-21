# FixedSeed-Affiliate

Affiliate portal for the Fixed Seed ecosystem. Users sign in via Auth0, apply to become an affiliate, and (once approved by an admin) get a shareable referral link plus a dashboard tracking clicks and conversions.

Part of the Fixed Seed ecosystem — companion to `FixedSeed-Server` (API + DB) and `FixedSeed-Website` (fixedseed.com).

## Stack

- React 19 + Vite 6 + TypeScript
- Auth0 PKCE flow via `@auth0/auth0-react`
- React Router 7 for routing
- Bun for production serve (mirrors the Website's setup)

## How it works

1. User signs in via Auth0 (`fixedseed.us.auth0.com`).
2. On first sign-in, `GET /api/affiliates/me` returns 404 → the app shows an application form.
3. User submits application → `POST /api/affiliates/apply` creates a `PENDING` record.
4. Admin approves via the FixedSeed-Server admin dashboard, setting commission type + rate.
5. Affiliate sees their code and referral link on the dashboard, plus click/conversion stats.
6. Referral links look like `https://fixedseed.com/?ref={code}`. The Website sets a 30-day `fs_ref` cookie and passes the code through to checkout; the Stripe webhook records the conversion.

## Local dev

```bash
bun install
cp .env.example .env
# Fill in the public Auth0 SPA client ID. Point VITE_API_BASE at localhost when testing a local server.
bun run dev
```

Runs on http://localhost:7392.

## Env vars

Required:

| Var | Example | Purpose |
|-----|---------|---------|
| `VITE_AUTH0_DOMAIN` | `fixedseed.us.auth0.com` | Auth0 tenant |
| `VITE_AUTH0_CLIENT_ID` | `<public-spa-client-id>` | Auth0 SPA client ID |
| `VITE_AUTH0_AUDIENCE` | `https://api.fixedseed.com` | API identifier (configure in Auth0) |
| `VITE_API_BASE` | `https://api.fixedseed.com` | Canonical FixedSeed-Server base URL |

Railway also injects `PORT` at runtime for `serve.ts`.

These are browser-public, build-time settings. Changing any `VITE_*` value requires a rebuild, and confidential Auth0/server credentials must never be placed in them.

## Deploying

Production is `https://affiliate.fixedseed.com` on Railway service `FixedSeed-Affiliate` (`7f42ceaf-8244-4b45-9c80-427688e11049`) in the official `FixedSeed` workspace/project and `production` environment. Pushes to `main` trigger the NIXPACKS build in [`railway.json`](./railway.json), then `bun serve.ts`.

Repair a missing/stale local Railway link with:

```bash
railway link --workspace ae2c92f1-66e7-470e-85fd-552a6057ec35 --project 308f63df-2d13-42fd-a6f4-3d60b3fde489 --environment 1466bf65-bbca-4afd-bdbf-ba6d9feb482e --service 7f42ceaf-8244-4b45-9c80-427688e11049 --json
```

Before pushing, run:

```bash
bunx tsc --noEmit
bun run build
```

After pushing, confirm `railway status --json`, then poll `railway deployment list --limit 3 --json` until the newest deployment reaches `SUCCESS`. Verify the root page and a deep link, Auth0 login/redirect, authenticated API requests, and production CORS before considering the deploy complete.
