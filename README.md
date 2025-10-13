## Proxy hacia backend C# local

Configura la variable de entorno `BACKEND_BASE_URL` apuntando al backend C# (por ejemplo `http://localhost:5000`).

Rutas disponibles en Next:

- `app/api/proxy/[...path]/route.ts`: reenvía `GET/POST/PUT/PATCH/DELETE/OPTIONS` al backend, preservando query y headers.

Ejemplos desde el cliente:

```ts
// GET
await fetch('/api/proxy/properties');

// GET con query
await fetch('/api/proxy/properties?type=rent');

// POST con JSON
await fetch('/api/proxy/properties', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'X' }),
});
```

Variables de entorno sugeridas (`.env.local`):

```
BACKEND_BASE_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
```

# AgenteInmobiliriasBackOffice

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/goodappsvdrs-projects/v0-agente-inmobilirias-back-office)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/qvaIonUTPNe)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/goodappsvdrs-projects/v0-agente-inmobilirias-back-office](https://vercel.com/goodappsvdrs-projects/v0-agente-inmobilirias-back-office)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/qvaIonUTPNe](https://v0.app/chat/projects/qvaIonUTPNe)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository