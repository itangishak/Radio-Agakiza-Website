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

---

# Radio Agakiza Frontend & API

## Prerequisites

- Node.js LTS
- MySQL running with the schema already created

## Install & Run (development)

```bash
npm install
cp env.example .env
# Optionally set NEXT_PUBLIC_API_ORIGIN if accessing the app via a different host/port
# e.g. NEXT_PUBLIC_API_ORIGIN=http://localhost:3000
npm run dev
```

The app and API run at: http://localhost:3000

## REST API Base

- Base path: `/api/v1`
- Examples:
  - `GET /api/v1/programs`
  - `GET /api/v1/programs/live`
  - `GET /api/v1/articles`
  - `GET /api/v1/podcasts/episodes`
  - `GET /api/v1/testimonials/public`
  - `GET /api/v1/settings/stream.live_url`

## Sticky Live Player

- HTML5 `<audio>` player is fixed at the bottom of every page
- Starts playback after first user interaction (click/keydown/touch)
- Auto-reconnects on `waiting/stalled/error/ended` with exponential backoff
- Recovers after network comes back (`online` event)
- Pauses when any on-page episode audio starts (avoids double audio)

### Stream URL

- Default: https://cast6.asurahosting.com/proxy/radioaga/stream
- Can be overridden in DB table `app_settings` with key `stream.live_url`
  - `INSERT INTO app_settings (settings_key, settings_value) VALUES ('stream.live_url','<URL>')
     ON DUPLICATE KEY UPDATE settings_value = VALUES(settings_value);`

## Pages

- Home: Live Now/Next, latest news, testimonials
- Programs: Full weekly schedule, timezone-aware
- Podcasts: Episodes list with inline playback
- News: List and article details
- About: Static info

## Admin Panel

Complete admin interface for content management:

- **Access**: http://localhost:3000/admin/login
- **Credentials**: admin@radioagakiza.com / admin123
- **Setup**: `npm run admin:setup` (creates admin user)
- **Sample Data**: `npm run admin:sample` (optional test data)

### Admin Features

- **Programs**: Manage radio shows with hosts and schedules
- **News**: Create/edit articles with publish status
- **Podcasts**: Upload episodes with audio URLs
- **Testimonials**: Manage listener feedback
- **Streaming**: Update live stream URL instantly

All CRUD operations work with table-based UI, form validation, and JWT authentication.

## Notes

- No React hydration warnings expected; if you see any, restart dev server after env or dependency changes
- For SSR fetches, the app uses absolute API origin on the server and relative on the client

sudo systemctl start mysql