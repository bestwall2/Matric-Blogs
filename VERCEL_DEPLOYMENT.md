# Vercel Deployment

Deploy this repository from the repo root. The root `vercel.json` builds the
shared libraries, bundles the Express API, builds the Vite frontend, and serves
the frontend from `artifacts/matric-blog/dist/public`.

## Required Environment Variables

Set these in Vercel Project Settings -> Environment Variables:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Optional variables:

- `GEMINI_API_KEY` for AI generation routes
- `GEMINI_MODEL` to override the default Gemini model
- `ADMIN_EMAIL_ALLOWLIST` as a comma-separated list of admin emails
- `LOG_LEVEL`

The frontend and API are deployed together. Browser routes are rewritten to
`index.html`, while `/api/*` requests are handled by the Express serverless
function in `api/index.mjs`.
