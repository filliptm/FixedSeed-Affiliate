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
# Copy .env.example to .env and fill in (or rely on Vite defaults)
bun run dev
```

Runs on http://localhost:7392.

## Env vars

Required:

| Var | Example | Purpose |
|-----|---------|---------|
| `VITE_AUTH0_DOMAIN` | `fixedseed.us.auth0.com` | Auth0 tenant |
| `VITE_AUTH0_CLIENT_ID` | `CBagKZWc9SSC...` | Auth0 SPA client ID |
| `VITE_AUTH0_AUDIENCE` | `https://api.fixedseed.com` | API identifier (configure in Auth0) |
| `VITE_API_BASE` | `https://fixedseed-server-production-79f0.up.railway.app` | FixedSeed-Server base URL |

Railway also injects `PORT` at runtime for `serve.ts`.

## Deploying

Push to `main` — Railway's NIXPACKS builder runs `bun install && bun run build`, then `bun serve.ts`.
