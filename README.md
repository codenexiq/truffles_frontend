This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Staff dashboard (`/dashboard`)

A private area for staff, inside this same app but kept apart from the public pages:

```
src/app/dashboard/            login/ · (panel)/overview · (panel)/reservations · (panel)/blogs (list, new, edit) · (panel)/maintenance
src/components/dashboard/     auth/ · layout/ · overview/ · reservations/ · blog/ (editor, preview, picture upload) · maintenance/
src/lib/dashboard/            api client + formatting
src/hooks/dashboard/  src/types/dashboard.ts
```

It uses the site's existing `NEXT_PUBLIC_BACKEND_URL` and signs in with the same staff login as the API
(`/api/v1/auth/login`). Pages are `noindex`, have no public header/footer, and use their own `dash-*` colours in
`globals.css`. Try it locally: run the backend (`npm run dev`, demo data) and this app, then open
http://localhost:3000/dashboard.

### Blogs
Posts written in the dashboard (**Blogs**) appear on the public `/blog` page next to the built-in posts from
`src/data/blogPosts.ts` (a dashboard post with the same web address replaces the built-in one). The public pages read
published posts from the API (`src/lib/blog.ts`) and refresh about once a minute; if the API is unreachable they show
the built-in posts only. Pictures uploaded in the dashboard are stored by the API (`/media/<id>`) and are the only
outside images the site may load (`next.config.ts`).

### Maintenance mode
**Dashboard → Maintenance** switches the whole public website to a maintenance page (and back). `src/proxy.ts` runs
before every page request: when the API says maintenance is on, it answers with `src/app/maintenance` (HTTP 503 with
`Retry-After`, `noindex`, never cached). The dashboard, `/maintenance` itself and files such as pictures are not covered,
so you can always switch it off again. The API is asked at most once every 10 seconds (`src/lib/siteStatus.ts`), so a
change shows on the site within about 15 seconds. If the API cannot be reached, the site stays as it was (a maintenance
page already showing keeps showing for up to 5 minutes; an open site stays open), so an API problem never takes the
website down by itself.
