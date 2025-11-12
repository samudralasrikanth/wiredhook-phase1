"use client";
import { useState, useEffect } from "react";
import { createTask, getAgents, getTasks, deleteTask, retryTask } from "@/lib/api";
import {
  PlusIcon,
  ChevronRightIcon,
  CodeBracketIcon,
  PaintBrushIcon,
  ServerIcon,
  CircleStackIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  BriefcaseIcon,
  CommandLineIcon,
  GlobeAltIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

// Define interfaces for Agent and Task
interface Agent {
  id: string;
  name: string;
  status: "idle" | "busy" | "offline";
  type: "DevAgent" | "DesignAgent" | "DeployAgent" | "DataAgent" | "DocAgent";
}

interface Task {
  id: string;
  agentType: string;
  inputs: {
    taskName: string;
    repoUrl: string;
  };
  status: "pending" | "in-progress" | "completed" | "failed";
}

// Helper to get status color and icon
const getStatusInfo = (status: Agent["status"] | Task["status"]) => {
  switch (status) {
    case "idle":
    case "completed":
      return {
        color: "#00e0ff", // cyan
        icon: <CheckCircleIcon className="w-5 h-5" />,
        bg: "rgba(0, 224, 255, 0.1)",
      };
    case "busy":
    case "in-progress":
      return {
        color: "#9b5cff", // purple
        icon: <ArrowPathIcon className="w-5 h-5 animate-spin" />,
        bg: "rgba(155, 92, 255, 0.1)",
      };
    case "offline":
    case "failed":
      return {
        color: "#ff007a", // neon pink
        icon: <ExclamationCircleIcon className="w-5 h-5" />,
        bg: "rgba(255, 0, 122, 0.1)",
      };
    default:
      return {
        color: "rgba(230, 238, 248, 0.6)", // muted text
        icon: <ClockIcon className="w-5 h-5" />,
        bg: "rgba(255, 255, 255, 0.05)",
      };
  }
};

const getAgentIcon = (type: Agent["type"]) => {
  switch (type) {
    case "DevAgent":
      return <CodeBracketIcon className="w-8 h-8" />;
    case "DesignAgent":
      return <PaintBrushIcon className="w-8 h-8" />;
    case "DeployAgent":
      return <ServerIcon className="w-8 h-8" />;
    case "DataAgent":
      return <CircleStackIcon className="w-8 h-8" />;
    case "DocAgent":
      return <DocumentTextIcon className="w-8 h-8" />;
    default:
      return <CodeBracketIcon className="w-8 h-8" />;
  }
};

const Sidebar = ({
  submitting,
  error,
  handleSubmit,
  taskName,
  setTaskName,
  repoUrl,
  setRepoUrl,
  agentType,
  setAgentType,
}: any) => (
  <aside className="glass-card p-6 sticky top-8">
    <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3" style={{ color: 'var(--text-strong)' }}>
      <PlusIcon className="w-6 h-6" />
      New Task
    </h2>
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="relative">
        <BriefcaseIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text)', opacity: 0.5 }} />
        <input
          id="taskName"
          className="form-input pl-10"
          placeholder="e.g., 'Build a REST API for users'"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          required
        />
      </div>
      <div className="relative">
        <CommandLineIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text)', opacity: 0.5 }} />
        <select
          id="agentType"
          className="form-input pl-10"
          value={agentType}
          onChange={(e) =>
            setAgentType(
              e.target.value as "DevAgent" | "DesignAgent" | "DeployAgent"
            )
          }
        >
          <option value="DevAgent">🧑‍💻 DevAgent</option>
          <option value="DesignAgent">🎨 DesignAgent</option>
          <option value="DeployAgent">☁️ DeployAgent</option>
        </select>
      </div>
      <div className="relative">
        <GlobeAltIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text)', opacity: 0.5 }} />
        <input
          id="repoUrl"
          className="form-input pl-10"
          placeholder="https://github.com/user/repo"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="btn-cta w-full flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <>
            <ArrowPathIcon className="w-5 h-5 animate-spin" />
            <span>Assigning...</span>
          </>
        ) : (
          <>
            <span>Assign Task</span>
            <ChevronRightIcon className="w-5 h-5" />
          </>
        )}
      </button>
      {error && (
        <div className="glass-card p-3 mt-2" style={{ 
          background: 'rgba(255, 0, 122, 0.1)',
          border: '1px solid rgba(255, 0, 122, 0.3)'
        }}>
          <p className="text-sm text-center" style={{ color: 'var(--cta)' }}>{error}</p>
        </div>
      )}
    </form>
  </aside>
);

export default function DashboardPage() {
  const [taskName, setTaskName] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [agentType, setAgentType] = useState<
    "DevAgent" | "DesignAgent" | "DeployAgent"
  >("DevAgent");
  const [submitting, setSubmitting] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loadingAgents, setLoadingAgents] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [agentFilter, setAgentFilter] = useState<string>("all");

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [fetchedAgents, fetchedTasks] = await Promise.all([
          getAgents(),
          getTasks(),
        ]);
        setAgents(fetchedAgents);
        const sorted = fetchedTasks.sort((a: Task, b: Task) => b.id.localeCompare(a.id));
        setTasks(sorted);
        setFilteredTasks(sorted);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoadingAgents(false);
        setLoadingTasks(false);
      }
    };

    fetchAllData();
    const interval = setInterval(fetchAllData, 5000); // Refresh every 5s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let filtered = [...tasks];
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((task) =>
        task.inputs.taskName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.agentType.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }
    
    // Agent filter
    if (agentFilter !== "all") {
      filtered = filtered.filter((task) => task.agentType === agentFilter);
    }
    
    setFilteredTasks(filtered);
  }, [tasks, searchQuery, statusFilter, agentFilter]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!taskName) return;

    setSubmitting(true);
    setError(null);
    try {
      const task = await createTask({
        agentType,
        inputs: { taskName, repoUrl },
      });
      setTasks((prev) => [task, ...prev]);
      setTaskName("");
      setRepoUrl("");
      // Redirect to task detail page
      window.location.href = `/task/${task.id}`;
    } catch (err) {
      setError("Failed to create task. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteTask(taskId: string) {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to delete task");
      setTimeout(() => setError(null), 5000);
    }
  }

  async function handleRetryTask(taskId: string) {
    try {
      await retryTask(taskId);
      setError(null);
      // Refresh tasks to show updated status
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks.sort((a: Task, b: Task) => b.id.localeCompare(a.id)));
      // Navigate to task detail to see progress
      window.location.href = `/task/${taskId}`;
    } catch (err: any) {
      setError(err.message || "Failed to retry task");
      setTimeout(() => setError(null), 5000);
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <div className="container-max">
        <header className="mb-8">
          <h1 className="text-4xl font-bold" style={{ color: 'var(--text-strong)' }}>Agent Command Center</h1>
          <p className="mt-2" style={{ color: 'var(--text)', opacity: 0.8 }}>
            Create tasks and monitor your AI workforce in real-time.
          </p>
          {error && (
            <div className="glass-card p-3 mt-4" style={{ 
              background: 'rgba(255, 0, 122, 0.1)',
              border: '1px solid rgba(255, 0, 122, 0.3)'
            }}>
              <p className="text-sm" style={{ color: 'var(--cta)' }}>{error}</p>
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Sidebar
              submitting={submitting}
              error={error}
              handleSubmit={handleSubmit}
              taskName={taskName}
              setTaskName={setTaskName}
              repoUrl={repoUrl}
              setRepoUrl={setRepoUrl}
              agentType={agentType}
              setAgentType={setAgentType}
            />
          </div>

          <main className="lg:col-span-2 grid gap-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-strong)' }}>
                Agent Status
              </h2>
              {loadingAgents ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="glass-card p-4 animate-pulse">
                      <div className="h-8 w-8 rounded-full mb-4" style={{ background: 'rgba(255,255,255,0.05)' }}></div>
                      <div className="h-4 w-2/3 rounded" style={{ background: 'rgba(255,255,255,0.05)' }}></div>
                      <div className="h-4 w-1/2 rounded mt-2" style={{ background: 'rgba(255,255,255,0.05)' }}></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {agents.map((agent) => (
                    <div
                      key={agent.id}
                      className="glass-card p-4 transition-colors hover:border-opacity-20"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="p-2 rounded-full"
                          style={{ background: 'rgba(255,255,255,0.05)' }}
                        >
                          {getAgentIcon(agent.type)}
                        </div>
                        <div>
                          <h3 className="font-bold" style={{ color: 'var(--text-strong)' }}>
                            {agent.name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm">
                            {getStatusInfo(agent.status).icon}
                            <span style={{ color: getStatusInfo(agent.status).color }}>
                              {agent.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-strong)' }}>
                  Task Queue
                </h2>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="form-input"
                    style={{ width: '200px', padding: '0.5rem' }}
                  />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="form-input"
                    style={{ padding: '0.5rem' }}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                  <select
                    value={agentFilter}
                    onChange={(e) => setAgentFilter(e.target.value)}
                    className="form-input"
                    style={{ padding: '0.5rem' }}
                  >
                    <option value="all">All Agents</option>
                    <option value="DevAgent">DevAgent</option>
                    <option value="DesignAgent">DesignAgent</option>
                    <option value="DeployAgent">DeployAgent</option>
                  </select>
                </div>
              </div>
              <div className="glass-card">
                {loadingTasks ? (
                  <p className="p-4" style={{ color: 'var(--text)', opacity: 0.6 }}>Loading tasks...</p>
                ) : (
                  <ul className="divide-y" style={{ borderColor: 'var(--border)' }}>
                    {filteredTasks.length === 0 && tasks.length > 0 && (
                      <p className="text-center py-8" style={{ color: 'var(--text)', opacity: 0.5 }}>
                        No tasks match your filters.
                      </p>
                    )}
                    {filteredTasks.length === 0 && tasks.length === 0 && (
                      <p className="text-center py-8" style={{ color: 'var(--text)', opacity: 0.5 }}>
                        No tasks assigned yet.
                      </p>
                    )}
                    {filteredTasks.map((task) => (
                      <li
                        key={task.id}
                        className="p-4 flex justify-between items-center transition-colors cursor-pointer"
                        style={{ 
                          borderColor: 'var(--border)',
                          '--hover-bg': 'rgba(255,255,255,0.02)'
                        } as React.CSSProperties & { '--hover-bg': string }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        onClick={() => window.location.href = `/task/${task.id}`}
                      >
                        <div className="flex-1">
                          <p className="font-medium" style={{ color: 'var(--text-strong)' }}>
                            {task.inputs.taskName}
                          </p>
                          <p className="text-sm" style={{ color: 'var(--text)', opacity: 0.7 }}>
                            Assigned to: {task.agentType}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div
                            className="flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full"
                            style={{
                              background: getStatusInfo(task.status).bg,
                              color: getStatusInfo(task.status).color
                            }}
                          >
                            {getStatusInfo(task.status).icon}
                            <span>{task.status}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.location.href = `/task/${task.id}`;
                              }}
                              className="p-2 rounded hover:bg-white/5 transition-colors"
                              title="View task"
                              style={{ color: 'var(--accent)' }}
                            >
                              <EyeIcon className="w-5 h-5" />
                            </button>
                            {(task.status === 'failed' || task.status === 'completed') && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRetryTask(task.id);
                                }}
                                className="p-2 rounded hover:bg-white/5 transition-colors"
                                title="Retry task"
                                style={{ color: 'var(--accent-2)' }}
                              >
                                <ArrowPathIcon className="w-5 h-5" />
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTask(task.id);
                              }}
                              className="p-2 rounded hover:bg-white/5 transition-colors"
                              title="Delete task"
                              style={{ color: 'var(--cta)' }}
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

