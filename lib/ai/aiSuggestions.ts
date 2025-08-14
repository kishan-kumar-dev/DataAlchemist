import { useStore } from "@/lib/store";

export function generateSuggestions() {
  const { tasks, workers } = useStore.getState();
  const suggestions: any[] = [];
  for (let i = 0; i < tasks.length; i++) {
    for (let j = i + 1; j < tasks.length; j++) {
      const a = tasks[i],
        b = tasks[j];
      if (
        a.Category === b.Category &&
        JSON.stringify(a.PreferredPhases) === JSON.stringify(b.PreferredPhases)
      ) {
        suggestions.push({
          type: "coRun",
          tasks: [a.TaskID, b.TaskID],
          reason: "same category & phases",
        });
      }
    }
  }
  const maxLoadByGroup: Record<string, number> = {};
  workers.forEach((w) => {
    maxLoadByGroup[w.WorkerGroup] = Math.max(
      maxLoadByGroup[w.WorkerGroup] || 0,
      w.MaxLoadPerPhase
    );
  });
  Object.entries(maxLoadByGroup).forEach(([group, cap]) => {
    if (cap < 1)
      suggestions.push({
        type: "loadLimit",
        group,
        maxSlotsPerPhase: cap,
        reason: "low capacity detected",
      });
  });
  return suggestions;
}
