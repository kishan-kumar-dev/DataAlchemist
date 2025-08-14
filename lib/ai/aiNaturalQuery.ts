import { useStore } from "@/lib/store";

export function applyNaturalFilter(q: string) {
  const { clients, workers, tasks } = useStore.getState();
  const result = { clients: clients, workers: workers, tasks: tasks };
  if (!q.trim()) return () => result;
  const s = q.toLowerCase();
  const durMatch = s.match(/longer than (\d+) phase/);
  const phaseMatch = s.match(/phase\s*(\d+)/);
  if (durMatch || phaseMatch) {
    const dur = durMatch ? Number(durMatch[1]) : undefined;
    const ph = phaseMatch ? Number(phaseMatch[1]) : undefined;
    return () => ({
      clients,
      workers,
      tasks: tasks.filter(
        (t) =>
          (dur ? t.Duration > dur : true) &&
          (ph ? t.PreferredPhases.includes(ph) : true)
      ),
    });
  }
  return () => ({
    clients: clients.filter((c) => c.ClientName.toLowerCase().includes(s)),
    workers: workers.filter((w) => w.WorkerName.toLowerCase().includes(s)),
    tasks: tasks.filter((t) => t.TaskName.toLowerCase().includes(s)),
  });
}

export function applyNaturalModification(q: string) {
  const set = q.match(/set\s+(\w+)\s+(\S+)\s+for\s+(\w+)=([\w-]+)/i);
  if (!set) return undefined;
  const [, field, value, whereKey, whereVal] = set;
  return (data: any) => {
    const { tasks } = data;
    tasks.forEach((t: any) => {
      if (String((t as any)[whereKey]) === whereVal) {
        (t as any)[field] = isNaN(Number(value)) ? value : Number(value);
      }
    });
    return data;
  };
}
