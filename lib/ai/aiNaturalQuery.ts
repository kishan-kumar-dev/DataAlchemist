import { useStore } from "@/lib/store";

// Define loose types based on your data shape
type Client = { ClientName: string; [key: string]: any };
type Worker = { WorkerName: string; [key: string]: any };
type Task = {
  TaskName: string;
  Duration: number;
  PreferredPhases: number[];
  [key: string]: any;
};

export function applyNaturalFilter(q: string) {
  const { clients, workers, tasks } = useStore.getState() as {
    clients: Client[];
    workers: Worker[];
    tasks: Task[];
  };

  const result = { clients, workers, tasks };

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
        (t: Task) =>
          (dur ? t.Duration > dur : true) &&
          (ph ? t.PreferredPhases.includes(ph) : true)
      ),
    });
  }

  return () => ({
    clients: clients.filter((c: Client) =>
      c.ClientName.toLowerCase().includes(s)
    ),
    workers: workers.filter((w: Worker) =>
      w.WorkerName.toLowerCase().includes(s)
    ),
    tasks: tasks.filter((t: Task) =>
      t.TaskName.toLowerCase().includes(s)
    ),
  });
}

export function applyNaturalModification(q: string) {
  const set = q.match(/set\s+(\w+)\s+(\S+)\s+for\s+(\w+)=([\w-]+)/i);
  if (!set) return undefined;

  const [, field, value, whereKey, whereVal] = set;

  return (data: { tasks: Task[] }) => {
    const { tasks } = data;

    tasks.forEach((t: Task) => {
      if (String(t[whereKey]) === whereVal) {
        t[field] = isNaN(Number(value)) ? value : Number(value);
      }
    });

    return data;
  };
}
