# Copilot Instructions - Back Office Inmobiliario

## Architecture Overview

This is a Next.js 14 real estate back-office application with a **proxy-based hybrid architecture**:

- **Frontend**: Next.js 14 with TypeScript, Tailwind CSS, Radix UI components
- **Backend Integration**: Proxies to external C# API via `BACKEND_BASE_URL` env var
- **Database**: Dual setup - Supabase for some features, external backend for core real estate data
- **State Management**: TanStack Query for server state, React Context for auth

## Core Development Patterns

### API Integration Strategy

- **Primary**: Use `axiosBackend` client from `request/Properties.ts` for C# backend calls
- **TanStack Query**: All API operations use `useApi.ts` hooks with proper cache invalidation
- **Query Keys**: Follow pattern `["entity", "operation", params]` (e.g., `["localidades", "list", params]`)
- **Environment**: `BACKEND_BASE_URL` (server) or `NEXT_PUBLIC_BACKEND_BASE_URL` (client)

### Component Structure

- **Page Layout**: Use consistent responsive pattern from `app/properties/page.tsx`
  - Hidden sidebar on mobile (`md:hidden`), visible on desktop (`hidden md:block`)
  - Responsive padding: `p-4 sm:p-6 lg:p-8`
  - Header with title/description + action button pattern
- **Forms**: Follow `components/zone-form.tsx` pattern with Radix UI + react-hook-form
- **Tables**: Use dedicated table components (e.g., `localities-table.tsx`)

### File Organization

```
app/
  [entity]/
    page.tsx           # Main list view
    new/page.tsx       # Create form
    [id]/page.tsx      # Edit form
    [id]/edit/page.tsx # Edit form alternative
components/
  [entity]-table.tsx   # Data table
  [entity]-form.tsx    # Form component
hooks/
  use[Entity].ts       # Specific entity hooks
request/
  [Entity].ts          # API client methods
```

### Data Flow Conventions

1. **CRUD Operations**: Use hooks from `useApi.ts` with automatic query invalidation
2. **Form Handling**: react-hook-form + zod validation + optimistic updates
3. **Error Handling**: Use Sonner toasts for user feedback
4. **Loading States**: TanStack Query provides `isLoading`, `isError` states

### Responsive Design Patterns

- **Mobile-first**: Start with mobile layout, enhance for desktop
- **Sidebar**: Hidden on mobile with Sheet overlay, fixed on desktop
- **Navigation**: Mobile header with hamburger menu, desktop sidebar
- **Layout**: Use `md:pl-64` on main content to account for desktop sidebar

### Google Maps Integration

- **Maps**: Use `@react-google-maps/api` with `ClientOnly` wrapper for SSR compatibility
- **API Key**: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` environment variable
- **Pattern**: See `app/mapa-inmobiliaria/` for complete map implementation

### Environment Configuration

Required environment variables:

```
BACKEND_BASE_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

## Development Workflow

### Adding New Entity

1. Create API methods in `request/[Entity].ts`
2. Add TanStack Query hooks to `useApi.ts`
3. Build table component in `components/[entity]-table.tsx`
4. Build form component in `components/[entity]-form.tsx`
5. Create pages following `/zones/` structure
6. Update sidebar navigation in `components/sidebar.tsx`

### Script Commands

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run dev:tunnel` - Development with tunnel env config

### Database Operations

- SQL scripts in `scripts/` folder for table creation and seeding
- Use lowercase table/column names to match backend conventions
- Primary data source is external C# API, Supabase for auxiliary features
