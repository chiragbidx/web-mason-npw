# Next.js + PostgreSQL SaaS Starter

Authoritative operating manual for an AI-optimized, production-grade starter built with Next.js App Router, Node.js, PostgreSQL, Prisma, TypeScript, Docker, and automation scripts. This document is the single source of truth for all humans and AI agents working in this repository.

## 1. Absolute Authority Notice
- Instruction hierarchy (highest to lowest): **README.md (this file) → FILES.md → code comments → tool defaults**.
- ASSUMPTIONS ARE FORBIDDEN. If required information is missing or ambiguous, **STOP AND ASK** the human owner before acting.
- Do not override or reinterpret rules. Conflicts are resolved by obeying the highest item in the hierarchy above.

## 2. Full Technology Stack
- Next.js 14 App Router (React 18, server/client components)
- Node.js backend runtime for route handlers
- PostgreSQL database
- Prisma ORM
- Authentication: NextAuth-like JWT pattern (see `app/api/auth/**`, `lib/jwt.ts`, `lib/requireAuth.ts`)
- TypeScript
- Docker for container builds
- Automation scripts under `scripts/`
- Tooling: Tailwind CSS, ESLint, PostCSS, Stripe, SendGrid
- Hosting targets: Vercel, container platforms; managed PostgreSQL
- Package manager: npm (lockfile present). Do not mix yarn/pnpm without approval.

## 3. System Philosophy
- Stability > Cleverness
- Data safety > UI speed
- Explicit > Implicit
- Minimal diffs > rewrites
- Contracts > convenience
- AI must act as a senior production engineer, biasing toward safety and reversibility.

## 4. Project Structure (SOURCE OF TRUTH)
Only edit files listed here unless explicitly instructed.

```text
app/                         # Next.js app routes & pages
  layout.tsx
  page.tsx
  globals.css
  auth/                      # Auth flows
    login/page.tsx
    register/page.tsx
    forgot-password/page.tsx
    reset-password/page.tsx
  bookings/page.tsx
  booking-history/page.tsx
  dashboard/page.tsx
  dashboard/[id]/page.tsx
  payment/page.tsx
  success/page.tsx
  profile/page.tsx
  api/                       # Route handlers (server only)
    auth/login/route.ts
    auth/register/route.ts
    auth/forgot-password/route.ts
    auth/reset-password/route.ts
    listing/route.ts
    listing/[id]/route.ts
    bookings/route.ts
    bookings/[id]/cancel/route.ts
    booking-history/route.ts
    profile/route.ts
    reviews/route.ts
    create-payment-intent/route.ts
    payment/confirm/route.ts
components/
  layout/                    # Shell + footer/header
  auth/                      # RouteGuard, auth UI pieces
  landing/
  ui/
lib/
  db.ts
  jwt.ts
  auth.ts
  requireAuth.ts
  email.ts
prisma/
  schema.prisma              # READ-ONLY by default
  migrations/20260122072401_init/
  seed.js
scripts/
  db-init.js
  dev-supervisor.js
  git-poll.js
public/                      # Static assets
styles/                      # (if present) shared styles
.env.example                 # Environment contract (authoritative)
Dockerfile                   # Container build
next.config.js               # Next.js config (js)
next.config.mjs              # Next.js config (mjs)
package.json
```

## 5. Environment Variable Contract (STRICT)
- `.env.example` is the **single source of truth** for required variables. Do NOT invent new keys without explicit approval and update to `.env.example`.
- NEVER commit secrets from real environments. Replace sample secrets in `.env.example` before use. If the sample contains stale values, scrub them locally before running anything.
- Required keys (clean and set real values in local `.env`):

```env
DATABASE_URL=
AUTH_SECRET=
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
MAPBOX_TOKEN=
SENDGRID_FROM_EMAIL=
SENDGRID_API_KEY=
BASE_URL=http://localhost:3000
```

- Setup steps:
  1) Copy `.env.example` to `.env`.
  2) Replace every placeholder with environment-specific secrets.
  3) Validate `DATABASE_URL` uses SSL in hosted environments (`?sslmode=require`).
  4) For CI/CD, supply the same keys via platform secret manager (Vercel/Render/Docker env).
  5) NEVER check real secrets into git; rotate immediately if leaked. Commit history rewriting requires human approval.

## 6. Database & Prisma Rules (CRITICAL ZONE)
- `prisma/schema.prisma` is **READ-ONLY by default**. Schema changes require explicit human approval.
- `prisma/migrations/**` is **NEVER edited manually**. Do not hand-write or tweak generated SQL.
- Hand-written migrations are FORBIDDEN. Use `prisma migrate dev` only after approval.
- Allowed: proposing schema changes in a written plan; generating migrations after approval; updating `prisma/seed.js` to align with approved schema; running `prisma generate` after dependency upgrades.
- Forbidden: deleting migrations; editing migration SQL; running `prisma db push` against production without sign-off; renaming models/fields without a data migration plan; changing provider/previewFeatures without review.
- Data safety: any destructive change (drop/rename) must include backup/rollback steps and cutover plan.
- If unsure, **STOP AND ASK**.

## 7. API Routes & Server Actions Contract
- Contracts are immutable unless explicitly re-specified by a human.
- All API handlers must enforce auth where data is user-specific. `requireAuth` is mandatory for protected routes.
- Validation is REQUIRED for every request body. Reject malformed/unsafe inputs; sanitize user input before DB writes.
- Input/output shapes are part of the contract; version them explicitly if change is required.
- Runtime: keep `runtime = "nodejs"` on handlers using native deps (bcrypt/Prisma). Do not switch to edge without review.
- MAY: add new routes that follow existing patterns and are fully validated/auth-checked.
- MUST NOT: weaken auth; change response shapes without approval; expose secrets; bypass validation; change runtime without reason; introduce long-running tasks inside route handlers.
- Logging: avoid leaking secrets or PII; keep logs minimal and purposeful.

## 8. Authentication & Authorization Rules
- Auth providers and flows under `app/api/auth/**` are **read-only by default**.
- `lib/jwt.ts` and token/session shape are **immutable** unless approved.
- No privilege escalation: never grant admin/system roles implicitly; never infer roles from email/domain.
- Session data must not include secrets; keep tokens short-lived where possible.
- Client `RouteGuard` logic must stay aligned with server `requireAuth`. Changes require review.
- Password handling: hashing with bcrypt only; never log or send plaintext; rate-limit sensitive endpoints if changed.

## 9. UI & Component Rules
- Default editable scope: page content, styling, layout within `app/**` and `components/**` **so long as contracts remain intact**.
- Restricted: shared layout structure (`components/layout/*`), `RouteGuard`, and auth components—modify only for bug fixes or explicit requests.
- Client vs Server components: keep server-only logic (secrets, Prisma, JWT) out of client components. Mark with `"use client"` only when necessary.
- State management: prefer React hooks already in use; avoid adding global state libs without approval.
- Accessibility: maintain aria labels and keyboard navigation when modifying UI; do not remove focus states.

## 10. Scripts Directory Contract
- Scripts are **infrastructure-only**; do not add product logic.
- `scripts/db-init.js`: For initializing databases. Do not alter connection targets without approval. Run only against disposable databases unless told otherwise.
- `scripts/dev-supervisor.js`: Development process helper. Safe refactors for clarity/logging only. Keep process management behavior unchanged.
- `scripts/git-poll.js`: Git change polling. Do not repurpose; keep side effects minimal.
- Scripts may be refactored for clarity/robustness; behavior changes require approval.
- When adding logging, avoid printing secrets or full SQL.

## 11. Docker Contract
- Dockerfile is restricted: no secrets baked in; no background workers added; keep base image unless approved.
- Runtime must expose the Next.js app only; no extra services inside the image.
- Any change to base image, build args, or multi-stage structure requires explicit approval.
- Do not install build tools at runtime stage unless required; keep image slim.
- Respect `NODE_ENV=production` in final stage; avoid copying `.env` into images.
- Ports: default Next.js 3000; do not change without coordination.

## 12. AI Change Modes
- **Diff-based (DEFAULT):** Apply minimal, localized diffs. Preserve formatting and intent.
- **Full file (EXPLICIT ONLY):** Only when instructed to rewrite an entire file and after stating rationale.
- **Multi-file refactor (APPROVAL + EXPLANATION):** Present plan, get approval, then execute.
- Always document which mode you are using when proposing a change.

## 13. Change Permission Matrix

| Area / Action                               | Default? | Requires Explicit Approval? | Notes |
|---------------------------------------------|----------|-----------------------------|-------|
| Edit UI copy/layout in `app/`, `components/`| Yes      | No                          | Keep contracts stable |
| Modify API handler logic                    | Limited  | Yes                         | Allowed for bugfix with validation/auth intact |
| Add new API route                           | Limited  | Yes                         | Must include auth/validation contracts |
| Change Prisma schema                        | No       | Yes                         | Generate migrations only after approval |
| Edit `prisma/migrations/**` manually        | No       | Never                       | Forbidden |
| Change auth/session shape                   | No       | Yes                         | High risk |
| Modify `lib/db.ts` connection logic         | No       | Yes                         | Pooled connections must remain stable |
| Update Dockerfile base image/build args     | No       | Yes                         | Security review required |
| Add dependencies                            | Limited  | Yes                         | Justify size/security/runtime impact |
| Run data migrations on production           | No       | Yes                         | Must provide rollback plan |
| Alter scripts behavior                      | Limited  | Yes                         | Refactors only by default |
| Introduce new background jobs/queues        | No       | Yes                         | Architecture change |
| Change logging/telemetry sinks              | Limited  | Yes                         | Avoid PII leakage |

## 14. Hard Stop Conditions
- Required env var missing or uncertain.
- Request to weaken auth/validation/logging.
- Attempt to edit Prisma migration SQL directly.
- Unapproved schema or auth shape change.
- Any ambiguity in desired behavior or target environment.
- If triggered: **STOP AND ASK** the human for clarification.

## 15. Recommended Workflow (Safe Path)
1) Read this README fully; confirm scope against instruction hierarchy.
2) Inspect related files (minimal surface) using read-only commands (`rg`, `cat`).
3) Update `.env` from `.env.example`; verify secrets loaded via `npm run dev` startup logs or `env | grep`.
4) Install deps with `npm install` (do not change lockfile unless adding/removing deps).
5) Make minimal diffs aligned to contracts; avoid rewrites.
6) Run targeted checks: `npm run lint` for lint, `npm run dev` for local verification. Keep runtime logs clean of secrets.
7) Validate Prisma-related changes on a disposable database before proposing migration.
8) Prepare a brief change note and affected files list (commands run, files touched, rationale).
9) If anything is unclear, halt and request direction before proceeding.

Common commands (run from repo root):
```bash
npm install
npm run dev
npm run lint
npm run build
```

## 16. Deployment Targets
- Vercel: ensure env vars configured; set `runtime = "nodejs"` for handlers using native deps; avoid edge runtime for Prisma. Use `dynamic = "force-dynamic"` where freshness is required.
- Docker-compatible platforms (ECS/Kubernetes/Render): adhere to Docker Contract; mount env vars at runtime; use read-only root FS where possible.
- Managed PostgreSQL (Vercel Postgres, Railway, Supabase, RDS, etc.): require SSL; run migrations during deployment pipeline; never run `prisma migrate` inside a live web container without coordination.

## 17. License Notice
- This codebase is part of a template system. Usage may be restricted by upstream licensing. Verify before redistribution or commercial deployment.

## 18. Final Directive
- Prioritize stability, data safety, and long-term maintainability. Favor minimal, reversible changes. When in doubt, **STOP AND ASK**. This README overrides all other guidance.
