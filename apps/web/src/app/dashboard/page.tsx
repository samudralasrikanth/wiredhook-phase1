"use client";

import { useState } from "react";
import { createTask, runAgent } from "@/lib/api";

export default function DashboardPage() {
  const [taskName, setTaskName] = useState("");
  const [repoUrl, setRepoUrl] = useState("");

  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!taskName) return;
    setSubmitting(true);
    try {
      const task = await createTask({ agentType: "aws-lambda", inputs: { taskName, repoUrl } });
      await runAgent({ taskId: task.id });
      window.location.href = `/task/${task.id}`;
    } catch (e) {
      // eslint-disable-next-line no-alert
      alert("Failed to create/run task");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <section className="glass-card p-6 mb-6">
        <h1 className="mb-4">Create new task</h1>
        <form className="grid gap-3">
          <input
            className="bg-transparent border border-[var(--border)] rounded px-3 py-2"
            placeholder="Task Name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <input
            className="bg-transparent border border-[var(--border)] rounded px-3 py-2"
            placeholder="GitHub URL (optional)"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
          />
          <button type="button" onClick={handleSubmit} disabled={submitting} className="btn-cta px-4 py-2 rounded w-fit">
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </section>
      <section className="grid gap-4">
        <div className="glass-card p-4">Your tasks will appear here.</div>
      </section>
    </main>
  );
}


