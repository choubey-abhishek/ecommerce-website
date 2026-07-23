# Deploying Kopal Seth Studio

This is a standard Next.js 14 App Router project, so [Vercel](https://vercel.com) (built by the Next.js team) needs no config file — it auto-detects the framework, build command, and output directory. There is deliberately no `vercel.json` in this repo; the handful of things that actually need configuring (security headers, image settings, cache headers) already live in `next.config.js`, which Vercel reads automatically.

## 1. Connect the repository

Push this project to GitHub/GitLab/Bitbucket, then import it at [vercel.com/new](https://vercel.com/new). Vercel will detect Next.js and use `npm run build` / `.next` without any changes.

## 2. Environment variables

Every variable below lives in `.env.local.example` with a comment explaining what it unlocks and what happens if it's left blank — nothing on this site hard-fails without configuration, per the graceful-degradation pattern used throughout (see the README's Phase 5–9 notes). Add the ones you want live under **Vercel → Project → Settings → Environment Variables**.

| Variable | Required? | Environment | Notes |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Recommended | Production only | Your real custom domain. Preview deployments don't need it — they fall back to Vercel's own `VERCEL_URL` automatically (see `config/site.ts`). |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` | Optional | Production + Preview | Use a Clerk **production** instance for the live domain; a dev instance is fine for previews. |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` etc. | Optional | Same as above | Only needed if you want different routes than the defaults already baked in. |
| `STRIPE_SECRET_KEY` | Optional | Production + Preview | Use **live mode** keys in Production, test mode elsewhere. |
| `STRIPE_WEBHOOK_SECRET` | Optional (required if `STRIPE_SECRET_KEY` is set and you want orders persisted) | Production | See step 4. |
| `ADMIN_EMAILS` | Optional | Production | Set to the real studio owner's email — see the security note in the README's "Before launch" checklist. |
| `DATABASE_URL` | Optional | Production | See step 3. |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET` | Optional | Production + Preview | Public values, safe in both. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Optional | Production | Only takes effect once a `gtag.js` script is also added — see the README's Performance section. |

## 3. Database (only if using Prisma/PostgreSQL)

1. Provision Postgres (Vercel Postgres, Neon, and Supabase all work — this app uses vanilla Prisma, no provider-specific features).
2. Set `DATABASE_URL` in Vercel.
3. Run the migration against production once, from your machine or Vercel's CLI:
   ```bash
   DATABASE_URL="<production-url>" npx prisma migrate deploy
   ```
   (`migrate deploy`, not `migrate dev` — it applies existing migrations without prompting or generating new ones, which is what a production database needs.)

Skipping this step is fine — orders simply won't also be persisted locally, and Stripe's own dashboard remains the record of truth (see the README's Phase 9 notes).

## 4. Stripe webhook (only if using Stripe)

1. In the [Stripe Dashboard](https://dashboard.stripe.com/webhooks), add an endpoint at `https://<your-domain>/api/webhooks/stripe`.
2. Subscribe it to the `checkout.session.completed` event (the only one `app/api/webhooks/stripe/route.ts` currently handles).
3. Copy the generated signing secret into `STRIPE_WEBHOOK_SECRET`.
4. Switch `STRIPE_SECRET_KEY` to a live-mode key once you're ready to accept real payments — test-mode keys work identically for a dry run first.

## 5. Clerk production instance (only if using Clerk)

Clerk's development keys work on any domain for testing, but production instances restrict allowed redirect origins. In the Clerk dashboard, add your live domain (and any Vercel preview domains you want to test against) under **Configure → Domains**.

## 6. Sanity CORS (only if using the Journal)

This app only ever reads from Sanity server-side (`lib/sanity.ts`), so CORS isn't required for the site itself to work. It only matters if you ever open Sanity Studio from a browser pointed at your project — add your domain under **manage.sanity.io → your project → API → CORS Origins** if so.

## 7. Verify after deploying

- `https://<your-domain>/api/health` — confirms the deploy is live and shows which optional integrations are actually configured (booleans only, no secrets).
- `https://<your-domain>/sitemap.xml` and `/robots.txt` — confirm they resolve to the real domain, not a preview URL or `localhost`.
- Run a full Stripe test-mode purchase against the live URL before flipping to live keys.
- Run `npm run test:e2e` against the deployed URL by setting Playwright's `baseURL` (`playwright.config.ts`) to it, or just spot-check the flows in `e2e/` by hand.

## Rollbacks

Vercel keeps every previous deployment; if something's wrong, **Vercel → Deployments → (previous one) → Promote to Production** rolls back instantly without a new build.
