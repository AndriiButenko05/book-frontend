# BookTrack

A personal reading catalog — add books, search your library, filter by rating, and paginate through large collections.

## Stack

- React 18 + TypeScript
- Vite
- TanStack Query v5
- React Hook Form + Zod
- Vitest + React Testing Library

## Getting started

```bash
npm install
npm run dev
```

Requires the backend running at `http://localhost:3030`. See [book-db](../book-db).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server at http://localhost:5173 |
| `npm run build` | Production build |
| `npm test` | Run tests |

## Deployment

Set `VITE_API_URL` to your backend URL (e.g. `https://your-app.onrender.com`) on Vercel. Leave it unset locally — the Vite proxy handles it.
