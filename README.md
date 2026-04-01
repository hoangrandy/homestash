# Inventory Tracker

A sleek, robust, and dynamic inventory management dashboard built with Next.js (App Router), TypeScript, Prisma, and SQLite.

## Features
- **Product Management:** Add, Update, and Delete inventory items.
- **Real-time Search:** Instantly filter items by product name or SKU.
- **Premium UI:** Designed natively without CSS frameworks utilizing custom CSS variables, gradients, and micro-animations for a pristine look and feel.
- **Local Persistence:** Data is reliably stored locally using SQLite powered safely by Prisma ORM.

## Setup Requirements
Ensure you have Node.js 18+ and `npm` installed.

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run database migrations**
   ```bash
   npx prisma db push
   ```

3. **Seed the database**
   ```bash
   npm run seed
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   npm run start
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
