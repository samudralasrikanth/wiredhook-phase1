import {
  CheckCircleIcon,
  ChevronRightIcon,
  CodeBracketIcon,
  PaintBrushIcon,
  ServerIcon,
} from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <div className="container-max">
      <header className="text-center my-16">
        <h1 className="text-5xl font-bold text-white mb-4">
          Welcome to AgentBuddy
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Your AI-powered team for building and deploying software, faster.
        </p>
        <a
          href="/dashboard"
          className="btn-cta px-6 py-3 inline-flex items-center gap-2 rounded-lg text-lg transition-transform duration-300 hover:scale-105"
        >
          <span>Get Started</span>
          <ChevronRightIcon className="w-5 h-5" />
        </a>
      </header>

      <main>
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="glass-card p-8">
              <h2 className="text-3xl font-semibold text-white mb-4">
                Your Command Center
              </h2>
              <p className="text-gray-400 mb-6">
                From the dashboard, you can manage agents, track task progress,
                and oversee your deployments all in one place.
              </p>
              <a
                href="/dashboard"
                className="btn-secondary px-6 py-3 inline-flex items-center gap-2 rounded-lg text-lg transition-transform duration-300 hover:scale-105"
              >
                <span>Go to Dashboard</span>
                <ChevronRightIcon className="w-5 h-5" />
              </a>
            </div>
            <div className="relative h-64">
              <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 bg-primary-glow rounded-full blur-2xl"></div>
              </div>
              <div className="relative flex items-center justify-center h-full">
                {/* <WindowIcon className="w-48 h-48 text-white" /> */}
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-white text-center mb-8">
            Meet Your AI Agents
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="glass-card p-8">
              <CodeBracketIcon className="w-12 h-12 mx-auto mb-4 text-[var(--accent)]" />
              <h3 className="text-xl font-bold text-white">DevAgent</h3>
              <p className="text-gray-400">
                Handles all your coding tasks, from API creation to bug fixes.
              </p>
            </div>
            <div className="glass-card p-8">
              <PaintBrushIcon className="w-12 h-12 mx-auto mb-4 text-[var(--accent-2)]" />
              <h3 className="text-xl font-bold text-white">DesignAgent</h3>
              <p className="text-gray-400">
                Creates stunning UI/UX, branding, and visual assets.
              </p>
            </div>
            <div className="glass-card p-8">
              <ServerIcon className="w-12 h-12 mx-auto mb-4 text-[var(--cta)]" />
              <h3 className="text-xl font-bold text-white">DeployAgent</h3>
              <p className="text-gray-400">
                Manages hosting, CI/CD pipelines, and cloud infrastructure.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="glass-card p-8 text-center">
            <h2 className="text-3xl font-semibold text-white mb-4">
              How It Works
            </h2>
            <ol className="text-left max-w-2xl mx-auto space-y-4">
              <li className="flex items-start gap-4">
                <CheckCircleIcon className="w-6 h-6 text-green-400 mt-1" />
                <div>
                  <h4 className="font-bold text-white">1. Submit a Task</h4>
                  <p className="text-gray-400">
                    Describe your goal, whether it's a new feature, a UI
                    design, or a deployment setup.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircleIcon className="w-6 h-6 text-green-400 mt-1" />
                <div>
                  <h4 className="font-bold text-white">2. Agents Get to Work</h4>
                  <p className="text-gray-400">
                    The right AI agent for the job picks up your task and
                    starts working immediately.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircleIcon className="w-6 h-6 text-green-400 mt-1" />
                <div>
                  <h4 className="font-bold text-white">3. Track Progress</h4>
                  <p className="text-gray-400">
                    Monitor the status of your tasks in real-time from the
                    dashboard.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </section>
      </main>
    </div>
  );
}
