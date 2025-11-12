import { Router } from 'express';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const agentRouter = Router();

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''
  );
}

agentRouter.post('/agent/run', async (req, res) => {
  const Schema = z.object({
    taskId: z.string(),
    inputs: z.record(z.any()).optional(),
    pat: z.string().optional()
  });
  const parsed = Schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' });
  const taskId = parsed.data.taskId;

  const supabase = getSupabase();
  await (supabase as any).from('tasks').update({ status: 'in_progress' }).eq('id', taskId);

  try {
    const agentUrl = process.env.DEPLOY_AGENT_URL || 'http://localhost:8001';
    const resp = await fetch(`${agentUrl}/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task_id: taskId, simulate: true, pat: parsed.data.pat })
    });
    const data: any = await resp.json();
    if (!resp.ok) throw new Error(data?.error || 'Deploy agent failed');

    const supabaseUpdate = getSupabase();
    await (supabaseUpdate as any).from('tasks').update({
      status: 'completed',
      logs: data.logs || [],
      output: { url: data.url, artifactPath: `/mnt/output/${taskId}.zip` }
    }).eq('id', taskId);

    return res.json({ ok: true });
  } catch (err: any) {
    const supabase = getSupabase();
    await (supabase as any).from('tasks').update({ status: 'failed' }).eq('id', taskId);
    return res.status(500).json({ error: err.message || 'Agent error' });
  }
});

export default agentRouter;
