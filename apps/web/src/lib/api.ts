const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export async function createTask(payload: { agentType: string; inputs: Record<string, any> }) {
  const res = await fetch(`${BACKEND_URL}/api/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Create task failed: ${res.status}`);
  return res.json();
}

export async function runAgent(payload: { taskId: string; inputs?: Record<string, any>; pat?: string }) {
  const res = await fetch(`${BACKEND_URL}/api/agent/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Run agent failed: ${res.status}`);
  return res.json();
}


