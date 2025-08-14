import { useStore } from "./store";

export function runValidations() {
  const { clients, workers, tasks, rules } = useStore.getState();
  const errors: any[] = [];
  const warnings: any[] = [];

  const dup = (key: string, arr: any[]) => {
    const ids = arr.map((r: any) => r[key]);
    const set = new Set();
    const d: string[] = [];
    ids.forEach((id: any) => {
      if (set.has(id)) d.push(id);
      else set.add(id);
    });
    return d;
  };
  dup("ClientID", clients).forEach((id) =>
    errors.push({
      kind: "clients",
      rowId: id,
      field: "ClientID",
      message: "Duplicate ClientID",
    })
  );
  dup("WorkerID", workers).forEach((id) =>
    errors.push({
      kind: "workers",
      rowId: id,
      field: "WorkerID",
      message: "Duplicate WorkerID",
    })
  );
  dup("TaskID", tasks).forEach((id) =>
    errors.push({
      kind: "tasks",
      rowId: id,
      field: "TaskID",
      message: "Duplicate TaskID",
    })
  );

  clients.forEach((c) => {
    try {
      JSON.parse(c.AttributesJSON || "{}");
    } catch {
      errors.push({
        kind: "clients",
        rowId: c.ClientID,
        field: "AttributesJSON",
        message: "Broken JSON",
      });
    }
  });

  clients.forEach((c) => {
    if (c.PriorityLevel < 1 || c.PriorityLevel > 5)
      errors.push({
        kind: "clients",
        rowId: c.ClientID,
        field: "PriorityLevel",
        message: "Must be 1–5",
      });
  });
  tasks.forEach((t) => {
    if (t.Duration < 1)
      errors.push({
        kind: "tasks",
        rowId: t.TaskID,
        field: "Duration",
        message: "< 1",
      });
  });

  const taskIds = new Set(tasks.map((t) => t.TaskID));
  clients.forEach((c) => {
    c.RequestedTaskIDs.forEach((tid: string) => {
      if (!taskIds.has(tid))
        errors.push({
          kind: "clients",
          rowId: c.ClientID,
          field: "RequestedTaskIDs",
          message: `Unknown TaskID ${tid}`,
        });
    });
  });

  const skills = new Set(workers.flatMap((w) => w.Skills));
  tasks.forEach((t) => {
    t.RequiredSkills.forEach((s: string) => {
      if (!skills.has(s))
        errors.push({
          kind: "tasks",
          rowId: t.TaskID,
          field: "RequiredSkills",
          message: `Missing worker skill ${s}`,
        });
    });
  });

  workers.forEach((w) => {
    if (w.AvailableSlots.length < w.MaxLoadPerPhase)
      warnings.push({
        kind: "workers",
        rowId: w.WorkerID,
        field: "MaxLoadPerPhase",
        message: "MaxLoadPerPhase exceeds available slots",
      });
  });

  const phaseLoad: Record<number, number> = {};
  tasks.forEach((t) =>
    t.PreferredPhases.forEach((p: number) => {
      phaseLoad[p] = (phaseLoad[p] || 0) + t.Duration;
    })
  );
  const workerSlotsByPhase: Record<number, number> = {};
  workers.forEach((w) =>
    w.AvailableSlots.forEach(
      (p: number) => (workerSlotsByPhase[p] = (workerSlotsByPhase[p] || 0) + 1)
    )
  );
  Object.entries(phaseLoad).forEach(([p, load]) => {
    const slots = workerSlotsByPhase[Number(p)] || 0;
    if ((load as number) > slots)
      warnings.push({
        kind: "tasks",
        rowId: String(p),
        field: "PreferredPhases",
        message: `Phase ${p}: load ${load} > slots ${slots}`,
      });
  });

  tasks.forEach((t) => {
    const qualified = workers.filter(
      (w) =>
        t.RequiredSkills.every((s: string) => w.Skills.includes(s)) &&
        w.AvailableSlots.some((p: number) => t.PreferredPhases.includes(p))
    );
    if (t.MaxConcurrent > qualified.length)
      warnings.push({
        kind: "tasks",
        rowId: t.TaskID,
        field: "MaxConcurrent",
        message: `MaxConcurrent ${t.MaxConcurrent} > qualified workers ${qualified.length}`,
      });
  });

  rules
    .filter((r: any) => r.type === "coRun")
    .forEach((r: any) =>
      r.tasks.forEach((tid: string) => {
        if (!taskIds.has(tid))
          errors.push({
            kind: "rules",
            rowId: "coRun",
            field: "tasks",
            message: `Unknown TaskID in coRun: ${tid}`,
          });
      })
    );
  return { errors, warnings };
}
