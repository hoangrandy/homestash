# Home Stash

A sleek, full-stack home inventory management app built with **Next.js 16**, **Prisma**, **Neon PostgreSQL**, and **Firebase Authentication**. Deployed on Vercel for free.

---

## What We Built

A single-page web application that lets you track household items by name, category, description, and location. The app is secured behind Firebase Auth (Email/Password + Google Sign-In) and persists data in a cloud-hosted Postgres database.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Vanilla CSS (custom design system) |
| Database | Neon PostgreSQL (free tier) |
| ORM | Prisma |
| Authentication | Firebase Auth |
| Hosting | Vercel (free Hobby plan) |

---

## Features

- 🔐 **Authentication** — Email/Password sign-up & login, Google Sign-In, session persistence, Sign Out
- 📦 **Inventory Management** — Add, edit, and delete items
- 🔍 **Real-time Search** — Filter items by name or location
- 📍 **Location Dropdown** — Select a location from a list of existing locations when editing
- 🎨 **Premium UI** — Custom CSS design system with gradients, micro-animations, and a hunter green + periwinkle palette

---

## Project History (What We Did Step by Step)

### 1. Project Bootstrapped
- Created a Next.js 16 app with TypeScript using `create-next-app`
- Set up Prisma ORM with a SQLite database for local development
- Built a `Product` model with `id`, `name`, `category`, `description`, `sku`, `createdAt`, `updatedAt`

### 2. Core Inventory UI Built
- Built `InventoryManager`, `ProductForm`, `ProductTable`, and `ProductTableRow` components
- Implemented server actions (`actions.ts`) for all CRUD operations using Prisma
- Added real-time search via URL search params
- Designed a fully custom CSS design system in `globals.css` with no frameworks

### 3. Terminology Refactors
- Renamed `Product` → `Item` throughout the UI and actions (schema kept as `Product` for DB compatibility)
- Renamed `SKU` field → `Location` field across the schema, seed data, actions, and all components

### 4. Field Removals & Enhancements
- Removed the `quantity` field entirely from schema, seed, actions, and UI
- Converted the Location text input into a **smart dropdown** that shows all existing locations in the database

### 5. Firebase Added
- Installed the Firebase JS SDK (`npm install firebase`)
- Created `src/lib/firebase.ts` with project config, SSR-safe initialization of `app`, `auth`, and `analytics`

### 6. Firebase Authentication
- Enabled **Email/Password** and **Google Sign-In** providers in Firebase Console
- Created `src/contexts/AuthContext.tsx` — global auth state via `onAuthStateChanged`
- Created `src/components/AuthScreen.tsx` — premium login/signup UI matching the app design
- Created `src/components/AppContainer.tsx` — client-side gate that shows `AuthScreen` if unauthenticated, or the dashboard + Sign Out button if authenticated
- Wrapped the root layout (`layout.tsx`) with `AuthProvider`

### 7. Database Migrated to Neon (PostgreSQL)
- Switched Prisma provider from `sqlite` to `postgresql`
- Created a free **Neon** database at [neon.tech](https://neon.tech)
- Ran `npx prisma db push` to sync the schema to Neon
- Added `postinstall: prisma generate` to `package.json` so Vercel auto-generates the Prisma client on deploy

### 8. Deployed to Vercel
- Initialized a git repository and pushed code to GitHub (`hoangrandy/homestash`)
- Imported the repo into **Vercel** and set the `DATABASE_URL` environment variable
- Added the Vercel domain to Firebase's **Authorized Domains** list to enable Google Sign-In on the live site

---

## Environment Variables

Create a `.env` file at the root with:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require"
```

> **Note:** Never commit `.env` to git. It is already in `.gitignore`.

---

## Local Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Sync the database schema
npx prisma db push

# 3. (Optional) Seed the database with sample items
npm run seed

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Production Deployment

The app auto-deploys to Vercel on every push to the `main` branch.

To deploy manually:
```bash
git add .
git commit -m "your message"
git push origin main
```

---

## Firebase Console Links (homestash-161ff)

- [Authentication → Sign-in Methods](https://console.firebase.google.com/project/homestash-161ff/authentication/providers) — Enable/disable providers
- [Authentication → Authorized Domains](https://console.firebase.google.com/project/homestash-161ff/authentication/settings) — Add new domains (required for Google Sign-In on any new deployment URL)

---

## Adding a New Deployment Domain (Google Sign-In Fix)

If you deploy to a new URL and Google Sign-In breaks:

1. Go to Firebase Console → Authentication → Settings → Authorized Domains
2. Click **Add domain**
3. Paste the new domain (e.g. `homestash-abc123.vercel.app`) without `https://`
4. Click **Add** — takes effect immediately
