"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowPathIcon, XMarkIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { retryTask, cancelTask } from "@/lib/api";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

interface Task {
  id: string;
  agentType: string;
  status: string;
  inputs: Record<string, any>;
  logs: string[];
  output: { url?: string; artifactPath?: string } | null;
  createdAt: string;
  updatedAt: string;
}

export default function TaskDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/tasks/${id}`);
        if (!res.ok) throw new Error("Task not found");
        const data = await res.json();
        setTask(data);
        
        // Auto-trigger agent if task is pending
        if (data.status === "pending") {
          await fetch(`${BACKEND_URL}/api/agent/run`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ taskId: id }),
          });
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
    const interval = setInterval(fetchTask, 2000); // Poll every 2s
    return () => clearInterval(interval);
  }, [id]);

  async function handleRetry() {
    if (!task) return;
    setActionLoading(true);
    try {
      await retryTask(task.id);
      // Refresh task data
      const res = await fetch(`${BACKEND_URL}/api/tasks/${id}`);
      if (res.ok) {
        const data = await res.json();
        setTask(data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to retry task");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCancel() {
    if (!task) return;
    if (!confirm("Are you sure you want to cancel this task?")) return;
    setActionLoading(true);
    try {
      await cancelTask(task.id, task.logs || []);
      // Refresh task data
      const res = await fetch(`${BACKEND_URL}/api/tasks/${id}`);
      if (res.ok) {
        const data = await res.json();
        setTask(data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to cancel task");
    } finally {
      setActionLoading(false);
    }
  }

  function handleExportLogs() {
    if (!task || !task.logs || task.logs.length === 0) {
      alert("No logs to export");
      return;
    }
    const logText = task.logs.join("\n");
    const blob = new Blob([logText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `task-${task.id}-logs.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <main>
        <section className="glass-card p-6 mb-6">
          <div className="opacity-80">Loading task...</div>
        </section>
      </main>
    );
  }

  if (error || !task) {
    return (
      <main>
        <section className="glass-card p-6 mb-6">
          <h1 className="mb-2">Task #{id}</h1>
          <div style={{ color: 'var(--cta)' }}>Error: {error || "Task not found"}</div>
        </section>
      </main>
    );
  }

  const statusColors: Record<string, string> = {
    pending: "rgba(230, 238, 248, 0.6)",
    in_progress: "#9b5cff", // purple
    completed: "#00e0ff", // cyan
    failed: "#ff007a", // neon pink
  };

  return (
    <main>
      <section className="glass-card p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="mb-2">Task #{id}</h1>
            <div className="opacity-80 mb-2">
              <span style={{ color: statusColors[task.status] || "rgba(230, 238, 248, 0.6)" }}>
                Status: {task.status}
              </span>
            </div>
            <div className="opacity-60 text-sm">
              Agent: {task.agentType}
            </div>
            {task.output?.url && (
              <div className="mt-4">
                <a
                  href={task.output.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--accent)' }}
                  className="hover:underline"
                >
                  Preview: {task.output.url}
                </a>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {task.status === "in_progress" && (
              <button
                onClick={handleCancel}
                disabled={actionLoading}
                className="px-4 py-2 rounded flex items-center gap-2 transition-colors disabled:opacity-50"
                style={{ 
                  background: 'rgba(255, 0, 122, 0.1)',
                  color: 'var(--cta)',
                  border: '1px solid rgba(255, 0, 122, 0.3)'
                }}
              >
                <XMarkIcon className="w-4 h-4" />
                Cancel
              </button>
            )}
            {(task.status === "failed" || task.status === "completed") && (
              <button
                onClick={handleRetry}
                disabled={actionLoading}
                className="px-4 py-2 rounded flex items-center gap-2 transition-colors disabled:opacity-50"
                style={{ 
                  background: 'rgba(155, 92, 255, 0.1)',
                  color: 'var(--accent-2)',
                  border: '1px solid rgba(155, 92, 255, 0.3)'
                }}
              >
                <ArrowPathIcon className="w-4 h-4" />
                Retry
              </button>
            )}
            {task.logs && task.logs.length > 0 && (
              <button
                onClick={handleExportLogs}
                className="px-4 py-2 rounded flex items-center gap-2 transition-colors"
                style={{ 
                  background: 'rgba(0, 224, 255, 0.1)',
                  color: 'var(--accent)',
                  border: '1px solid rgba(0, 224, 255, 0.3)'
                }}
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                Export Logs
              </button>
            )}
          </div>
        </div>
      </section>
      <section className="glass-card p-4">
        <div className="text-sm mb-2 opacity-80">Logs</div>
        <pre className="text-xs leading-5 whitespace-pre-wrap font-mono bg-black/20 p-4 rounded">
          {task.logs && task.logs.length > 0
            ? task.logs.join("\n")
            : "Waiting for updates..."}
        </pre>
      </section>
    </main>
  );
}


