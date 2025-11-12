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

export async function getAgents() {
  const res = await fetch(`${BACKEND_URL}/api/agents`);
  if (!res.ok) throw new Error(`Get agents failed: ${res.status}`);
  return res.json();
}

export async function getTasks() {
  const res = await fetch(`${BACKEND_URL}/api/tasks`);
  if (!res.ok) throw new Error(`Get tasks failed: ${res.status}`);
  return res.json();
}

export async function deleteTask(taskId: string) {
  const res = await fetch(`${BACKEND_URL}/api/tasks/${taskId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Delete task failed: ${res.status}`);
  return res.json();
}

export async function cancelTask(taskId: string, currentLogs: string[] = []) {
  const res = await fetch(`${BACKEND_URL}/api/tasks/${taskId}/cancel`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentLogs }),
  });
  if (!res.ok) throw new Error(`Cancel task failed: ${res.status}`);
  return res.json();
}

export async function retryTask(taskId: string) {
  // Retry = reset to pending and run again
  const res = await fetch(`${BACKEND_URL}/api/agent/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ taskId }),
  });
  if (!res.ok) throw new Error(`Retry task failed: ${res.status}`);
  return res.json();
}


