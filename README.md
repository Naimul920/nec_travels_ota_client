# NEC Travels OTA Client

Next.js 16 frontend for the NEC Travels online travel agency platform. The
application contains public/B2C booking flows and protected B2B, admin, and
super-admin consoles.

## Requirements

- Node.js matching the version declared in `package.json`
- Bun (the package scripts use Bun)
- Access to the NEC Travels backend API

Use one package manager consistently. `bun.lock` is the lockfile used by the
current scripts; `pnpm-lock.yaml` is retained for environments that deploy with
pnpm.

## Environment

Copy `.env.example` to `.env` and configure:

- `API_BASE_URL`: server-only backend base URL used by server actions, Proxy,
  rewrites, and authenticated media requests.
- `NEXT_PUBLIC_API_URL`: browser-visible API base URL used by the geo lookup.

Do not expose secrets through variables prefixed with `NEXT_PUBLIC_`.

## Commands

```bash
bun install
bun run dev
bun run typecheck
bun run lint
bun run build
bun run start
```

The development server runs on port 3000. The production start script uses
port 3027.

## Architecture

- `src/app`: App Router pages, layouts, loading states, and route handlers.
- `src/actions`: server actions that call the backend through the shared HTTP client.
- `src/components`: reusable UI, shared layout, and business-domain modules.
- `src/hooks`: React Query hooks and view-oriented data hooks.
- `src/lib/axios/httpClient.ts`: server-only backend client and token refresh.
- `src/proxy.ts`: route authentication, role checks, department checks, and expired-session refresh.
- `src/store`: Zustand stores for client presentation state. Authentication tokens must never be stored here.
- `src/utils/routes.ts`: route ownership, post-login destinations, and department access rules.
- `src/utils/token.ts` and `src/utils/session.ts`: cookie helpers for tokens, role, departments, and absolute token expiry.

## Authentication

Authentication uses httpOnly cookies only. Access and refresh tokens are opaque
custom tokens, not JWTs, and must never be decoded in the client.

The relevant cookies are `access_token`, `refresh_token`, `token_expires_at`,
`user_role`, and `user_departments`.

Proxy protects navigation and improves user experience, but the backend is the
authoritative security boundary. Every protected backend operation must verify
the authenticated user, role, department, and resource ownership independently
of frontend cookies.

## Main application areas

- Public/B2C flight search, booking, registration, and profiles
- B2B agency bookings, passengers, finance, bank deposits, and support
- Admin ticket queues, transactions, agencies, users, and settings
- Super-admin users, packages, commissions, deposits, and operational queues

## Quality checks

Before merging changes, run:

```bash
bun run typecheck
bun run lint
bun run build
```

`next/font/google` downloads fonts during production builds. Build agents must
have access to Google Fonts unless these fonts are changed to locally hosted assets.

## Security conventions

- Never place tokens in local storage, Redux, Zustand, browser headers, or URL parameters.
- Never log passwords, passenger records, documents, booking payloads, or full backend responses.
- Post-login redirect values must remain same-origin application paths.
- Authenticated media responses must use private caching.
- Add new protected routes to the role and department rules in `src/utils/routes.ts`.
