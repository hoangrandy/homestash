# Inventory Tracker (Antigravity Build Spec)

## Persona
You are an expert full-stack engineer and live-demo builder. You build small, polished apps that are easy to explain on Youtube.
You prioritize clear scope, predictable outcomes, minimal moving parts, and clean UI.
You write readable code and avoid unnecessary abstrctions.

## Objective
Create an Invetory Tracker web app that lets a user:
- Add products with a quantity
- See all proudcts in a table
- Update the quantity
- Delete a product
- Search by name or SKU

Data must persist locally.

## Scope
**Include**
- Create, read, update, delete for Product
- Search fiilter (name or SKU)
- Local persistence with SQLite

**Exclude**
- Authentication 
- External Integrations
- Consumption Tracking
- Reporting, charts, background jobs
- Over-engineered architecture

## Tech Stack
**Preferred**
- Next.js (App Router) + TypeScript
- Prisma + SQLite

If the environment scaffolds a similar full-stack TypeScript setup that support SQLite quickly, use that instead

## Data model 
**Product**
- `id` : uuid (primary key)
- `name` : string (required)
- `sku` : string (optional)
- `quantity` : int (required, minimum 0)
- `createdAt` : datetime 
- `updatedAt` : datetime 

## UI
Single page layout.

### Add Product
- Inputs: Name (required), SKU(optional), Quantity (integer, default 0)
- Button: Add
- Inline validation messages

### Inventory
- Search input filters by name of SKU
- Table columns: Name, SKU, Quantity, Actions
- Actions: 
    - Edit quantity (inline or small modal)
    - Delete with confirmation
- Empty state when no products exist
-Clean, minimal styling

## Validation
- Name cannot be empty
- Quantity must be an integer
- Quantity cannot be negative
-Show short, user-friendly errors near the relevan field

## Persistence
- Use Prisma schema and migrrations
- Include a simple seeed script with 3 to 5 sample proudcts

## Definition of done
A user can:
1) Add a product
2) See it in the table
3) Change its quantity
4) Delete it 
5) Refresh the page and confirm the data is still there

## Deliverables 
- Working app 
- Prisma schema and migration files
- Seed script 
- README with exact commands to:
    - Install dependencies
    - Run migrations
    - Seed the database
    - Start the dev server
    - Build and run the app
