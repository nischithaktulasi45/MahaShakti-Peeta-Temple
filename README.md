# Temple Website Monorepo

This project now uses a client/server architecture with a React frontend in the client folder and an Express backend in the server folder.

## Structure

- client/: React + Vite frontend
- server/: Express + MongoDB backend

## Development

Install dependencies:

```bash
npm install
cd client && npm install
cd ../server && npm install
```

Run both apps:

```bash
npm run dev
```

The frontend runs on http://localhost:5173 and the API runs on http://localhost:5000.
