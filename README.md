# Emmanuel Owusu — Trading Education, Community & Signals

Next.js 15 (App Router) + TypeScript + Tailwind CSS + Firebase + Resend.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in Firebase + Resend keys
npm run dev
```

Visit http://localhost:3000

## What's wired up and working

- **Newsletter** (`/api/newsletter`) — saves to Firestore `subscribers`
  collection, sends a welcome email via Resend. Used on the footer, home
  page and education index.
- **Lead capture** (`/api/leads`) — powers `/join`, saves to `leads`
  collection with a `source` field for attribution, sends a welcome email.
- **Event RSVPs** (`/api/rsvp`) — powers each `/events/[id]` page, saves to
  `rsvps` collection.
- **Signal disclosure gate** (`/api/signals/accept-disclosure`) — logs
  timestamped risk-disclosure acceptance to `signalUsers` before a user can
  reach `/signals/dashboard`. The gate itself is a simple client-side flag
  for this MVP — swap for a real Firebase Auth session before launch (see
  TODOs in `src/app/signals/dashboard/page.tsx`).

## What's scaffolded but needs real data

- `/signals/dashboard` and `/signals/history` currently render sample
  data. Wire them to a live `signals` Firestore collection once the
  indicator engine (Cloud Function) is built — see the architecture notes
  from planning for the rules engine / cron job design.
- `/admin` is a stub. Add Firebase Auth (admin-only) before deploying it,
  and connect the stat cards to real Firestore counts.
- `/education` and `/events` use hardcoded arrays — move these to
  Firestore or MDX once there's real content.

## Environment variables

See `.env.example`. You'll need:
- A Firebase project (Firestore + Auth enabled) — client config from
  Project Settings, admin credentials from a service account JSON
  (Project Settings → Service Accounts → Generate new private key).
- A Resend API key (resend.com) and a verified sending domain — update
  `FROM_EMAIL` in `src/lib/resend.ts` once your domain is verified.

## Firestore collections this app writes to

| Collection | Written by |
|---|---|
| `subscribers` | `/api/newsletter` |
| `leads` | `/api/leads` |
| `rsvps` | `/api/rsvp` |
| `signalUsers` | `/api/signals/accept-disclosure` |
| `signals` | *(not yet — to be written by the indicator engine)* |
| `events` | *(not yet — currently hardcoded, move to Firestore for admin editing)* |

## Design system

- Font: Manrope (all weights via `next/font/google`)
- Accent: violet (`brand-600` = `#7C3AED`)
- Components: `src/components/ui.tsx` has shared primitives
  (`Container`, `Eyebrow`, `SectionHeading`, `StatCard`, buttons)
