import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const router = express.Router();

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''
  );
}

const TaskCreateSchema = z.object({
  agentType: z.string(),
  inputs: z.record(z.any()).default({})
});

router.get('/tasks', async (_req, res) => {
  const supabase = getSupabase();
  const { data, error } = await (supabase as any).from('tasks').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data?.map((t: any) => ({
    id: t.id,
    agentType: t.agent_type,
    status: t.status,
    inputs: t.inputs,
    logs: t.logs,
    output: t.output,
    createdAt: t.created_at,
    updatedAt: t.updated_at
  })) || []);
});

router.get('/tasks/:id', async (req, res) => {
  const supabase = getSupabase();
  const { data, error } = await (supabase as any)
    .from('tasks')
    .select('*')
    .eq('id', req.params.id)
    .single();
  if (error && (error as any).code !== 'PGRST116') return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Not found' });
  res.json({
    id: data.id,
    agentType: data.agent_type,
    status: data.status,
    inputs: data.inputs,
    logs: data.logs,
    output: data.output,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  });
});

router.post('/tasks', async (req, res) => {
  const parsed = TaskCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
  }
  const id = uuidv4();
  const now = new Date().toISOString();
  const task = {
    id,
    agent_type: parsed.data.agentType,
    status: 'pending',
    inputs: parsed.data.inputs,
    logs: [],
    output: null,
    created_at: now,
    updated_at: now
  } as const;

  const supabase = getSupabase();
  const { error } = await (supabase as any).from('tasks').insert(task as any);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({
    id,
    agentType: task.agent_type,
    status: task.status,
    inputs: task.inputs,
    logs: task.logs,
    output: task.output,
    createdAt: task.created_at,
    updatedAt: task.updated_at
  });
});

router.delete('/tasks/:id', async (req, res) => {
  const supabase = getSupabase();
  const { error } = await (supabase as any).from('tasks').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true, message: 'Task deleted' });
});

router.patch('/tasks/:id/cancel', async (req, res) => {
  const supabase = getSupabase();
  const { error } = await (supabase as any)
    .from('tasks')
    .update({ status: 'failed', logs: [...((req.body.currentLogs || []) as any[]), 'Task cancelled by user'] })
    .eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true, message: 'Task cancelled' });
});

export default router;
