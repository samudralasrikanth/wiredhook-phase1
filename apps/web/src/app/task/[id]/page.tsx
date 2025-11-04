type Props = { params: { id: string } };

export default function TaskDetailPage({ params }: Props) {
  const { id } = params;
  return (
    <main>
      <section className="glass-card p-6 mb-6">
        <h1 className="mb-2">Task #{id}</h1>
        <div className="opacity-80">Status: Pending</div>
      </section>
      <section className="glass-card p-4">
        <div className="text-sm mb-2 opacity-80">Logs</div>
        <pre className="text-xs leading-5 whitespace-pre-wrap">Waiting for updates...</pre>
      </section>
    </main>
  );
}


