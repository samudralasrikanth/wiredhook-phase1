-- Tasks table
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  agent_type text not null,
  status text not null check (status in ('pending','in_progress','completed','failed')),
  inputs jsonb not null default '{}',
  logs jsonb not null default '[]',
  output jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Simple trigger to update updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_tasks_updated_at on public.tasks;
create trigger trg_tasks_updated_at
before update on public.tasks
for each row execute function public.set_updated_at();

-- Task logs table (optional normalized logs)
create table if not exists public.task_logs (
  id bigserial primary key,
  task_id uuid not null references public.tasks(id) on delete cascade,
  level text not null default 'info',
  message text not null,
  created_at timestamptz not null default now()
);

-- If RLS is enabled, basic policies (adjust as needed)
alter table public.tasks enable row level security;
create policy if not exists tasks_read on public.tasks
  for select using (true);
create policy if not exists tasks_insert on public.tasks
  for insert with check (true);
create policy if not exists tasks_update on public.tasks
  for update using (true);

alter table public.task_logs enable row level security;
create policy if not exists task_logs_read on public.task_logs
  for select using (true);
create policy if not exists task_logs_insert on public.task_logs
  for insert with check (true);
