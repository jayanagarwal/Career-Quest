# Career Quest

A job search tracker for applications, networking, and cold outreach.

## Stack

- Next.js (App Router)
- Supabase (Auth + Postgres)
- Tailwind CSS

## Local Setup

1) Install dependencies

```bash
npm install
```

2) Create a `.env.local` file with:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

3) Start the dev server

```bash
npm run dev
```

## Supabase Setup

1) Create a Supabase project.
2) Run the SQL in [supabase-schema.sql](supabase-schema.sql) in the SQL Editor.
3) Confirm RLS is enabled and policies exist for:
   - `jobs`
   - `networking_email`
   - `networking_linkedin`

## Vercel Deployment

1) Import the repo into Vercel.
2) Add the same env vars in Vercel Project Settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3) Deploy.

## Notes

- The app scopes reads and writes by `user_id`, and RLS is enforced in Supabase.
- If you update table schemas, keep [types/database.ts](types/database.ts) and forms in sync.
