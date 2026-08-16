# Beacon

A real-time incident response platform for engineering teams — built to demonstrate multi-tenant architecture, role-based access control, and live collaboration using CRDTs and WebSockets.

![Demo Gif](./app/images/demo.gif)

## Overview

When something breaks in production, teams need one place to coordinate: track severity and status, assign responders, chat in real time, and take shared notes without stepping on each other's edits. Beacon is that space — every organization gets its own isolated workspace, and every incident becomes a live, collaborative war room.

## Key Features

- **Multi-tenant architecture** — every query is scoped to an organization via JWT-derived context, enforced server-side on every read and write
- **Role-based access control** — Admin / Responder / Viewer roles gate mutations (service creation, responder reassignment) independently of ownership
- **Real-time incident chat** — Socket.io with room-based broadcasting over a custom Node.js server
- **Collaborative incident notes** — conflict-free multi-user editing via Yjs (CRDTs), with live presence and typing indicators through the Awareness protocol
- **Full audit trail** — every status change, assignment, and resolution is logged as a structured, replayable event
- **Token-based org invitations** — join-by-code and email invite flows with expiring, single-use tokens

## Tech Stack

**Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, React Hook Form + Zod
**Backend:** Node.js custom server, Next.js Route Handlers, Socket.io
**Database:** PostgreSQL, Prisma ORM
**Real-time collaboration:** Yjs, y-protocols (Awareness)
**Auth:** JWT (httpOnly cookies), bcrypt

## Architecture Notes

- **Auth & sessions** — JWTs are stored in httpOnly cookies rather than `localStorage`, verified server-side on every protected request; no client-side code ever has direct access to the token.
- **Real-time transport** — a single custom Node.js server (`server.ts`) runs Next.js and Socket.io together, since WebSockets require a persistent process rather than Next's default serverless-function model. Incident-scoped Socket.io rooms handle both chat broadcasting and Yjs update relaying, avoiding a second parallel WebSocket server.
- **Collaborative notes** — rather than a full rich-text editor, notes use a plain `<textarea>` bound to a `Y.Text` CRDT. Keystroke diffs are translated into precise positional insert/delete operations so concurrent edits from multiple users merge correctly instead of overwriting each other. Document state is persisted to Postgres on a debounced interval, independent of the live socket relay.
- **Data isolation** — every Prisma query touching organization-scoped data includes an explicit `organizationId` filter derived from the verified JWT, never from client-supplied input.

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database

### Setup

```bash
git clone <repo-url>
cd beacon
npm install
```

Create a `.env` file:
DATABASE_URL="postgresql://user:password@localhost:5432/beacon"
JWT_SECRET="your-secret-here"

Push the schema and seed sample data:

```bash
npx prisma db push
npx prisma db seed
```

Run the dev server:

```bash
npm run dev
```

Visit `http://localhost:3000`. Seeded accounts (all use password `password123`):
- `alice@example.com` — Admin
- `bob@example.com` — Responder
- `chris@example.com` — Responder
- `dana@example.com` — Viewer

## Known Limitations

- Collaborative notes support live text sync and presence, but not cursor-position visualization — that requires a `contentEditable`-based rich text editor, which was deliberately scoped out to prioritize correct CRDT sync over editor polish.
- Filtering on the incidents list is minimal by design.
- Avatars are color-coded initials rather than uploaded images, avoiding external file storage for a portfolio-scale project.