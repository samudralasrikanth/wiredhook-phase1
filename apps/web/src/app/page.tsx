export default function Home() {
  return (
    <main>
      <section className="glass-card p-8 mb-6">
        <h1 className="mb-3">AgentBuddy — Cyber Pulse</h1>
        <p className="opacity-80 mb-6">
          Submit a task and track progress from Dev, Design, and Deploy agents.
        </p>
        <a href="/dashboard" className="btn-cta px-4 py-2 inline-flex items-center gap-2 rounded">
          <span>Get started</span>
        </a>
      </section>
      <section className="grid md:grid-cols-3 gap-4">
        {["Pending", "In Progress", "Completed"].map((s) => (
          <div key={s} className="glass-card p-4">
            <div className="text-sm opacity-70">Agent Status</div>
            <div className="text-white text-lg">{s}</div>
        </div>
        ))}
      </section>
      </main>
  );
}
