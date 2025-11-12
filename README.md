# AgentBuddy Monorepo


Phase 1: Core Platform MVP (web, backend, Python DeployAgent).

## Prereqs (macOS M4)
- Node.js 18.x (installed via brew or nvm)
- pnpm (corepack enable && corepack prepare pnpm@latest --activate)
- Python 3.11+
- Docker Desktop (optional, for compose)

## Env Setup
Frontend `apps/web/.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Backend `apps/backend/.env.local`:
```
PORT=3001
SUPABASE_URL=your-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role
DEPLOY_AGENT_URL=http://localhost:8001
```

## Install
```
pnpm install -w
```

## Run (local processes)
Frontend:
```
pnpm -C apps/web dev
```
DeployAgent:
```
cd services/deployagent
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```
Backend:
```
pnpm -C apps/backend dev
```

## Run (Docker Compose)
```
echo "SUPABASE_URL=your-url" > .env
echo "SUPABASE_SERVICE_ROLE_KEY=your-service-role" >> .env
docker compose up --build
```

## Tests
Backend unit:
```
pnpm -C apps/backend test
```
E2E (Playwright):
```
pnpm -C tests/e2e install
pnpm -C tests/e2e exec playwright install --with-deps
pnpm -C tests/e2e test
```

## Notes
- Cyber Pulse theme applied to web.
- DeployAgent simulates deploy, returns preview URL.
- PAT is forwarded only to DeployAgent, never persisted.


## Note: Firebase integration (added during validation)

This Phase1 update includes Firebase client setup (see apps/web/src/lib/firebaseClient.ts) and backend mock endpoints wired to infra/agents_seed.json. Update `.env` values per `.env.example` and restart services.
>>>>>>> Stashed changes
