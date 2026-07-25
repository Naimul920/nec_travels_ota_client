<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# NEC Travels OTA — Auth System

## Architecture
- **httpOnly cookies only** — no Redux, no localStorage, no Bearer headers.
- **Tokens are NOT JWTs** — custom `hex:hex` format, cannot be decoded. JWT decode helpers always fail.
- **Role stored separately** in `user_role` cookie (read by proxy + server actions).
- **Departments stored** in `user_departments` cookie (comma-separated string).
- **Token expiry** tracked via `token_expires_at` cookie (absolute unix timestamp).

## Key Files
- `src/proxy.ts` — Edge auth proxy. LOGIN_PATH = `/auth/signin`. Checks `token_expires_at` to detect expiry. Refreshes via `attemptRefresh()` when expired and `refresh_token` exists.
- `src/actions/auth.action.ts` — `loginAction`, `logoutAction`, `isLoginAction`. Stores `token_expires_at` on login, deletes on logout.
- `src/lib/axios/httpClient.ts` — Server-side HTTP client. Uses `last_refresh` cookie for time-based refresh (5 min interval). Stores `token_expires_at` on refresh.
- `src/utils/token.ts` — `setTokenInCookies`, `setTokenExpiresAt`, `getTokenExpiresAt`, `deleteTokenExpiresAt`.
- `src/utils/session.ts` — `setUserRole`, `getUserRole`, `setDepartments`, `getDepartments`, `deleteUserRole`, `deleteDepartments`.
- `src/utils/routes.ts` — `ROUTE_DEPARTMENT` with `departments: string[]` array (not single string).
- `src/utils/auth.ts` — Re-exports from routes.ts.
- `src/services/auth.service.ts` — Server auth service with `tryRefreshToken` + `logout`.
- `src/hooks/useAuthApi.ts` — Client-side React Query hooks (unused by SignIn.tsx, which uses `loginAction`).

## Proxy Flow
1. Skip static paths (`/_next`, `/api`, files with `.`)
2. Check `token_expires_at` to detect expired tokens
3. Auth pages (`/auth/signin`, etc.):
   - If valid tokens → redirect to dashboard
   - If expired + refresh_token → attempt refresh → success: redirect to dashboard, fail: clear cookies, show page
4. Public pages (`/`, `/about-us`, etc.) → pass through
5. Protected pages:
   - Not logged in → attempt refresh if refresh_token exists → fail: redirect to `/auth/signin`
   - Wrong role → redirect to their dashboard
   - Wrong department → redirect to their dashboard
   - Pass through

## Known Issues
- `useAuthApi.ts` is dead code (SignIn.tsx uses `loginAction` directly).
- `token.ts` JWT helpers (`isTokenExpiringSoon`, etc.) always fail for custom tokens — not used in critical path.
- `(commonLayout)/page.tsx` moved to `app/page.tsx` (route group root page 404'd in Next.js 16).
- `NEXT_PUBLIC_NODE_ENV` used for cookie secure/sameSite config (not `NODE_ENV`).

## Route Protection
- `ROUTE_DEPARTMENT` maps regex patterns to `departments: string[]` (multiple departments per route supported).
- `canAccessRoute(pathname, userDepartments)` checks if user has any of the required departments.
- Route-to-role mapping via `getRouteOwner()` using `superadminProtectedRoutes`, `adminProtectedRoutes`, `b2bProtectedRoutes`, `b2cProtectedRoutes`, `commonProtectedRoutes`.

