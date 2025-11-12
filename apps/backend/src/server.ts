import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local first, then fallback to .env
dotenv.config({ path: join(__dirname, '../.env.local') });
dotenv.config({ path: join(__dirname, '../.env') });
import express from 'express';
import cors from 'cors';
import usersRouter from './routes/users.js';
import agentRouter from './routes/agent.js';
import agentsRouter from './routes/agents.js';
import tasksRouter from './routes/tasks.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'backend', time: new Date().toISOString() }));
app.use('/api', usersRouter);
app.use('/api', agentRouter);
app.use('/api', agentsRouter);
app.use('/api', tasksRouter);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Backend running on http://localhost:${port}`));
}

export default app;
