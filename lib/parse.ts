import { Client, Worker, Task } from "./schemas";
import { parsePhaseList } from "./utils";

export function parseAndNormalize(
  kind: "clients" | "workers" | "tasks",
  rows: any[]
): any[] {
  if (kind === "clients") return rows.map((r) => Client.parse(r));
  if (kind === "workers") return rows.map((r) => Worker.parse(r));
  return rows.map((r) => ({
    ...Task.parse(r),
    PreferredPhases: parsePhaseList(r.PreferredPhases),
  }));
}
