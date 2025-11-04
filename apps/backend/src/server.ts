import express from 'express';
const app = express();
const port = process.env.PORT || 3001;
app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'backend', time: new Date().toISOString() }));
app.listen(port, () => console.log(`Backend running on http://localhost:${port}`));
