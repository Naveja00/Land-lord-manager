# PropManager — Property Management App

A deterministic, logic-based property management application built for Chicago-style 3-flats and apartment buildings. No AI decision-making — just clean if-then logic for landlords to manage their own buildings.

## Tech Stack

- **Frontend**: Next.js 16 (App Router) + TypeScript + Tailwind CSS
- **Database**: Supabase / PostgreSQL (schema included in `supabase/migrations/`)
- **Design**: "High-End Concierge" — white/navy/gray palette, mobile-first

## Features

### Landlord Dashboard
- **Building Management** — Add buildings with address, PIN, and type
- **Building Vault** — Store boiler serials, paint codes, roof age, HVAC filter sizes
- **Unit Templates** — Create reusable layouts with room dimensions and appliance specs
- **Bulk Unit Inserter** — Add units 1-10 with a template applied in one click
- **Responsibility Matrix** — Boolean toggles per building (landlord vs tenant pays)
- **Work Order Management** — Track, assign, and close maintenance requests
- **Tax-Ready Ledger** — Schedule E export with Repairs vs Improvements categorization

### Tenant Dashboard
- **Logic-Tree Issue Reporting** — Step-by-step: Room → Category → Issue
- **Troubleshooting Buffer** — "Try this first" steps before ticket submission
- **Automatic Routing** — Tickets go to maintenance staff if assigned, otherwise landlord (DIY mode)
- **Request Tracking** — View open and resolved maintenance requests

### Accounting
- **Receipt Capture** — Upload receipt photos to close work orders
- **Expense Categorization** — Repairs, Supplies, Improvements, Maintenance
- **Schedule E Dashboard** — Filter by building and year, see deductible vs depreciable totals
- **CSV Export** — Download tax-ready expense reports

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Demo Mode

The app includes demo data with role switching. Click the user buttons in the top bar to switch between Landlord, Tenant, and Maintenance Staff views.

### Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the migration in `supabase/migrations/001_initial_schema.sql`
3. Add your credentials to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Project Structure

```
src/
├── app/
│   ├── dashboard/          # Landlord dashboard pages
│   │   ├── buildings/      # Building management + vault
│   │   ├── templates/      # Unit template builder
│   │   ├── units/          # Unit management + bulk insert
│   │   ├── work-orders/    # Work order tracking
│   │   └── accounting/     # Tax ledger + Schedule E
│   └── tenant/             # Tenant dashboard pages
│       ├── report/         # Logic-tree issue reporting
│       └── orders/         # Tenant request tracking
├── components/
│   ├── ui/                 # Shared UI components
│   └── layout/             # App shell, sidebar, top bar
├── lib/                    # State management, demo data, Supabase client
├── types/                  # TypeScript type definitions
supabase/
└── migrations/             # PostgreSQL schema with RLS policies
```  
