# AtomicSync Website

Landing page for [AtomicSync](https://atomicsync.cloud) - a gamified health-tracking iOS app where AI-generated anime avatars evolve based on real Apple HealthKit data.

## Tech Stack

- **Next.js 16** (App Router, static export)
- **React 19** + TypeScript
- **Tailwind CSS v4** + shadcn/ui
- **Lucide React** (icons)

## Pages

- `/` - Landing page (hero, features, evolution, pricing, beta signup)
- `/privacy` - Privacy policy (HealthKit, AI disclosure, CCPA)
- `/terms` - Terms of service (subscriptions, health disclaimer)

## Development

```bash
npm install
npm run dev    # localhost:3001
npm run build  # static export
```

## Deployment

Optimized for Vercel, Cloudflare Pages, or S3 + CloudFront.
