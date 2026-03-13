# PandaStay Codebase Index
Guide for AI-assisted development. Note: this project is a **Next.js 14 App Router** full-stack template (not NestJS). Concepts below map NestJS-style terminology (entry points, controllers, providers, modules) to the Next.js structure used here.

## 1) High-Level Overview
- **Purpose**: Vacation-rental marketplace (listings, bookings, payments, reviews, profiles) with email notifications and Stripe checkout.
- **Architecture**: Next.js App Router; serverless API Route Handlers act as the “controllers”; shared utilities in `lib/`; Prisma-backed data layer; client pages/components in `app/` & `components/`.
- **Tech Stack**: Next.js 14, TypeScript, React 18, Prisma ORM (PostgreSQL), Stripe Payments, SendGrid email, JWT auth, bcryptjs password hashing, Tailwind CSS, Zod (present but not applied yet).

## 2) Application Entry Points
- **app/layout.tsx**: Root layout; wraps all pages with `RouteGuard` and `react-hot-toast` Toaster. Acts like global middleware/layout.
- **app/page.tsx** and other `app/**/page.tsx`: Client-rendered routes for UI flows (landing, auth, dashboard, bookings, etc.).
- **API Route Handlers (app/api/**)**: Equivalent to NestJS controllers; each file exports HTTP method functions (GET/POST/PATCH) executed on the server (Node runtime when specified). No global NestJS bootstrap; Next.js handles routing. Global middleware-like auth handled per route via `requireAuth` and on the client via `RouteGuard`.
- **Global concerns**: No global pipes/filters, but per-handler validation & try/catch. Logging via console. Middleware equivalent limited to `requireAuth` helper.

## 3) Module Index (feature/infrastructure folders)
- **app/api/auth/** (feature: authentication)
  - Responsibilities: register, login, password reset flows.
  - Public providers: route handlers using `prisma`, `bcryptjs`, `jwt`, `email` sender.
  - Imports: `@/lib/db`, `@/lib/jwt`, `@/lib/email`, `bcryptjs`, `crypto`.
- **app/api/listing/** (feature: listings catalog)
  - Fetch all listings or single listing with relations.
  - Providers: Prisma queries including images/amenities/reviews/availability.
- **app/api/bookings/** (feature: booking management)
  - Fetch bookings for authenticated user; cancel booking (subroute `[id]/cancel`).
  - Providers: Prisma transaction, SendGrid emails, `requireAuth`.
- **app/api/payment/** (feature: payments)
  - `create-payment-intent`: Stripe PaymentIntent creation.
  - `payment/confirm`: Confirms PaymentIntent, writes booking/payment/availability, sends emails.
- **app/api/booking-history/** (feature: payment history)
- **app/api/reviews/** (feature: reviews)
- **app/api/profile/** (feature: user profile CRUD)
- **lib/** (infrastructure/shared)
  - `db` Prisma client singleton; `jwt` helpers; `auth` token verification; `requireAuth` request guard; `email` SendGrid templates.
- **components/** (shared UI & auth guard)
  - Layout shell, RouteGuard, auth inputs/layout, landing search box, loader.
- **prisma/** (data layer) schema, migrations, seed script.
- **scripts/** (ops utilities) dev supervisor, git poller, DB init.

## 4) Controllers (API Route Handlers)
- `app/api/auth/register/route.ts` (POST): Validate fields → hash password → create user → send welcome email → returns user summary.
- `app/api/auth/login/route.ts` (POST): Verify email/password with bcrypt → issue JWT via `signToken`.
- `app/api/auth/forgot-password/route.ts` (POST): Create verification token → send reset email (non-leaking response).
- `app/api/auth/reset-password/route.ts` (POST): Validate token expiry → hash & update password → delete token.
- `app/api/listing/route.ts` (GET): List all listings with images, amenities, reviews (with reviewer names), future availability; sorted newest first.
- `app/api/listing/[id]/route.ts` (GET): Fetch single listing with full relations; 404 if missing.
- `app/api/bookings/route.ts` (GET): Auth required; returns user bookings with listing thumb + any review; maps review array to single item.
- `app/api/bookings/[id]/cancel/route.ts` (PATCH): Auth required; ownership and date checks → transaction to cancel booking, cancel payment, free availability → send cancellation email.
- `app/api/reviews/route.ts` (POST/GET): Auth required; enforce one review per booking; recalculates listing average rating; GET checks if review exists for booking.
- `app/api/profile/route.ts` (GET/PATCH): Auth required; fetch or update name/email; returns limited fields.
- `app/api/booking-history/route.ts` (GET): Auth required; returns payments with nested booking/listing info.
- `app/api/create-payment-intent/route.ts` (POST): Calculates nights & fees → Stripe PaymentIntent with metadata.
- `app/api/payment/confirm/route.ts` (POST): Auth required; verifies PaymentIntent success → creates booking, payment, availability records inside transaction → sends booking confirmation + payment receipt emails.

## 5) Services & Providers (lib/)
- `lib/db.ts` (singleton PrismaClient; logs errors only; caches in dev).
- `lib/jwt.ts` (sign/verify JWT with `AUTH_SECRET`; 7d expiry).
- `lib/auth.ts` (verify auth token returning payload or null).
- `lib/requireAuth.ts` (server-side guard: reads Bearer header or `token` cookie; verifies JWT; returns `{userId,email}` or NextResponse 401/invalid).
- `lib/email.ts` (SendGrid-based templated emails: account verification, password reset, booking confirmation, payment receipt, cancellation). Uses `SENDGRID_API_KEY` and `SENDGRID_FROM_EMAIL`; warns if unset.
- **Scoping**: All providers are singletons or stateless helpers; Prisma is a singleton; no request-scoped DI.
- **Side effects**: DB access (Prisma), external APIs (Stripe, SendGrid), JWT signing/verification, console logging.

## 6) Data Layer
- **ORM**: Prisma with PostgreSQL (`prisma/schema.prisma`).
- **Entities/Models**: User, Account, Session, VerificationToken (auth); Listing, ListingImage, Amenity, ListingAmenity, Availability; Booking, BookingGuest; Payment; Review.
- **Repositories**: Direct Prisma client usage inside route handlers; no custom repository classes.
- **Transactions**: Used in booking cancellation and payment confirmation to keep booking/payment/availability consistent; password reset also uses transaction for update+delete.
- **Migrations**: Stored under `prisma/migrations/`; initial migration `20260122072401_init`. Run via `prisma migrate` (implicit through Prisma CLI). Seed data in `prisma/seed.js`.

## 7) DTOs, Schemas & Validation
- **DTO locations**: Inline in each route handler (JSON body parsing with property checks). No dedicated DTO files.
- **Validation strategy**: Manual checks (presence, ranges); no global validation pipe. Zod is installed but not yet used.
- **Mapping**: API responses often map Prisma entities directly; some transformations (e.g., bookings map reviews array to single review; landing page maps listing fields to UI model).

## 8) Cross-Cutting Concerns
- **Authentication**: JWT issued at login; stored client-side (localStorage) and optionally cookie token support in `requireAuth`. Client `RouteGuard` redirects based on presence of token and route allowlist.
- **Authorization**: Handled per-handler (ownership checks for bookings/reviews/profile).
- **Error Handling**: Try/catch in each handler with generic 500 responses; minimal error typing.
- **Logging**: Console logging for errors and email operations; Prisma log level `error`.
- **Caching**: None; listings routes are marked `dynamic = "force-dynamic"` to avoid static cache.
- **Middleware/Interceptors/Pipes**: Not used globally; patterns could be added by wrapping handlers.

## 9) Configuration & Environment
- **Env file**: `.env.example` lists required variables: `DATABASE_URL` (note: example file currently repeats value with PowerShell syntax—clean before use), `AUTH_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `MAPBOX_TOKEN`, `SENDGRID_FROM_EMAIL`, `SENDGRID_API_KEY`, `BASE_URL`.
- **Next config**: `next.config.js`/`next.config.mjs` (framework config; inspect when modifying build/runtime settings).
- **Tooling configs**: `tsconfig.json`, `eslint.config.mjs`, `tailwind.config.js`, `postcss.config.mjs`.
- **Deployment**: `Dockerfile` for container build; `railway.json` for Railway deployment metadata.

## 10) Async & Background Processing
- No queues/workers/BullMQ. All async work is request-scoped (emails, Stripe calls). Consider moving long-running emails to background if latency grows.

## 11) Testing Structure
- No tests currently present (unit/integration/e2e). Suggested layout if added: `__tests__` for units, `tests/e2e` using Playwright, and Prisma test DB with migrations.

## 12) File & Directory Index
- `app/` (Next.js app router pages & API)
  - `app/layout.tsx` – Root layout; wraps pages with `RouteGuard` and toast provider.
  - `app/globals.css` – Global Tailwind/CSS styles.
  - `app/page.tsx` – Landing page; fetches listings; hero/featured stays UI.
  - `app/dashboard/page.tsx` – Dashboard listing search UI (publicly accessible per guard).
  - `app/dashboard/[id]/page.tsx` – Listing detail page using dynamic route id.
  - `app/dashboard/SearchDashboard.tsx` – Shared dashboard search component.
  - `app/bookings/page.tsx` – Auth-required bookings view.
  - `app/booking-history/page.tsx` – Auth-required payment history view.
  - `app/profile/page.tsx` – Auth-required profile settings page.
  - `app/payment/page.tsx` – Checkout/payment UI.
  - `app/success/page.tsx` – Post-payment success page.
  - `app/auth/login/page.tsx` – Login form.
  - `app/auth/register/page.tsx` – Registration form.
  - `app/auth/forgot-password/page.tsx` – Request reset link UI.
  - `app/auth/reset-password/page.tsx` – Enter new password with token.
  - `app/api/auth/login/route.ts` – POST login controller.
  - `app/api/auth/register/route.ts` – POST register controller.
  - `app/api/auth/forgot-password/route.ts` – POST reset-link issuer.
  - `app/api/auth/reset-password/route.ts` – POST password reset executor.
  - `app/api/listing/route.ts` – GET all listings with relations.
  - `app/api/listing/[id]/route.ts` – GET single listing by id.
  - `app/api/bookings/route.ts` – GET user bookings (auth).
  - `app/api/bookings/[id]/cancel/route.ts` – PATCH cancel booking (auth, ownership, date checks).
  - `app/api/booking-history/route.ts` – GET user payment history (auth).
  - `app/api/profile/route.ts` – GET/PATCH profile (auth).
  - `app/api/reviews/route.ts` – POST/GET reviews (auth, uniqueness, rating validation).
  - `app/api/create-payment-intent/route.ts` – POST Stripe PaymentIntent creation.
  - `app/api/payment/confirm/route.ts` – POST confirm Stripe payment + persist booking/payment/availability + emails.
- `components/`
  - `components/layout/Header.tsx` – Site header with navigation.
  - `components/layout/Footer.tsx` – Global footer.
  - `components/layout/ConditionalFooter.tsx` – Footer shown on selected paths.
  - `components/auth/RouteGuard.tsx` – Client-side guard/redirect logic around routes; toggles header/footer visibility.
  - `components/auth/AuthInput.tsx` – Reusable styled auth input field.
  - `components/auth/AuthLayout.tsx` – Layout wrapper for auth pages.
  - `components/landing/SearchBox.tsx` – Search box component for landing/dashboard.
  - `components/ui/Loader.tsx` – Spinner/loader.
- `lib/`
  - `lib/db.ts` – Prisma client singleton with dev caching.
  - `lib/jwt.ts` – sign/verify helpers using `AUTH_SECRET`.
  - `lib/auth.ts` – JWT verification returning payload or null.
  - `lib/requireAuth.ts` – Server-side guard to enforce Bearer/cookie token presence/validity.
  - `lib/email.ts` – SendGrid email templates + senders (registration, reset, booking confirmation, payment receipt, cancellation).
- `prisma/`
  - `prisma/schema.prisma` – Data model definitions and relations.
  - `prisma/migrations/20260122072401_init/migration.sql` – Initial migration SQL.
  - `prisma/migrations/migration_lock.toml` – Prisma migration lock.
  - `prisma/seed.js` – Seed script for initial data population.
- `scripts/`
  - `scripts/db-init.js` – Utility to initialize database (check contents before running).
  - `scripts/dev-supervisor.js` – Dev helper (likely process supervisor/hot-reload helper).
  - `scripts/git-poll.js` – Polls git for changes (CI/dev utility).
- `public/` – Static assets (SVG icons: globe, file, next, vercel, window).
- Root configs: `package.json`, `package-lock.json`, `tsconfig.json`, `eslint.config.mjs`, `tailwind.config.js`, `postcss.config.mjs`, `next.config.js|mjs`, `Dockerfile`, `railway.json`, `SETUP.md`, `.env.example`, `next-env.d.ts` (TypeScript Next types).

## 13) How to Modify This Codebase Safely
- **Add new API feature**: Create a new handler under `app/api/<feature>/route.ts` (or nested route) using existing patterns: parse/validate body, call Prisma via `lib/db`, reuse `requireAuth` for protected routes, wrap in try/catch with `NextResponse` errors.
- **Add new pages/UI**: Place page in `app/<route>/page.tsx`; reuse layout components and `RouteGuard` if protection needed. Shared UI goes into `components/`.
- **Data changes**: Update `prisma/schema.prisma` → run `prisma migrate dev` → adjust API handlers and client fetch logic. Update `prisma/seed.js` if seed data should reflect changes.
- **Where *not* to change**: Avoid editing generated Prisma migration files manually; don’t mutate `lib/db.ts` pattern unless you know Prisma connection pooling impacts (esp. serverless). Keep `AUTH_SECRET` handling consistent; do not log secrets.
- **Tracing a request**: Client page/component → fetch to `/api/...` route → handler uses `requireAuth` (if needed) → Prisma queries/mutations → optional email/Stripe side-effects → JSON response consumed by React component state.
- **Find related files**: Search by route path (`/api/<name>`), Prisma model name, or component feature folder (auth, dashboard, bookings). Listings/reviews/bookings/payment all touch `prisma` models with same names.
- **Common pitfalls**: Missing `runtime = "nodejs"` on routes that need native modules (bcrypt/Prisma) in Vercel; forgetting `dynamic = "force-dynamic"` when data must stay fresh; not clearing expired reset tokens; misaligned availability date ranges; leaking JWT secret into client bundle (keep helpers server-only).

