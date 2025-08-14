import { uniq } from "@/lib/utils";

const maps: Record<string, string[]> = {
  ClientID: ["clientid", "client_id", "id", "cid"],
  ClientName: ["clientname", "name"],
  PriorityLevel: ["priority", "prioritylevel", "prio"],
  RequestedTaskIDs: ["requestedtaskids", "requested_tasks", "taskids", "tasks"],
  GroupTag: ["grouptag", "group", "segment"],
  AttributesJSON: ["attributesjson", "attributes", "meta", "metadata"],
  WorkerID: ["workerid", "wid", "id"],
  WorkerName: ["workername", "name"],
  Skills: ["skills", "skillset"],
  AvailableSlots: ["availableslots", "slots", "availability"],
  MaxLoadPerPhase: ["maxloadperphase", "maxload", "capacity"],
  WorkerGroup: ["workergroup", "group"],
  QualificationLevel: ["qualificationlevel", "qual", "level"],
  TaskID: ["taskid", "tid", "id"],
  TaskName: ["taskname", "name"],
  Category: ["category", "type"],
  Duration: ["duration", "length"],
  RequiredSkills: ["requiredskills", "skills", "requires"],
  PreferredPhases: ["preferredphases", "phases", "preferred"],
  MaxConcurrent: ["maxconcurrent", "concurrency", "parallel"],
};

export function aiHeaderMapper(
  kind: "clients" | "workers" | "tasks",
  rows: any[]
) {
  if (!rows.length) return { rows: [] };
  const header = Object.keys(rows[0]);
  const lower = header.map((h) => h.toLowerCase().replace(/\s|-/g, ""));
  const canonical = (key: string) => {
    const list = maps[key] || [];
    const idx = lower.findIndex((h) => list.includes(h));
    if (idx > -1) return header[idx];
    const idx2 = header.findIndex((h) => h === key);
    if (idx2 > -1) return header[idx2];
    return null;
  };
  const targetKeys =
    kind === "clients"
      ? [
          "ClientID",
          "ClientName",
          "PriorityLevel",
          "RequestedTaskIDs",
          "GroupTag",
          "AttributesJSON",
        ]
      : kind === "workers"
      ? [
          "WorkerID",
          "WorkerName",
          "Skills",
          "AvailableSlots",
          "MaxLoadPerPhase",
          "WorkerGroup",
          "QualificationLevel",
        ]
      : [
          "TaskID",
          "TaskName",
          "Category",
          "Duration",
          "RequiredSkills",
          "PreferredPhases",
          "MaxConcurrent",
        ];

  const mapped = rows.map((r) => {
    const out: any = {};
    for (const k of targetKeys) {
      const src = canonical(k);
      out[k] = src ? (r as any)[src] : (r as any)[k];
    }
    return out;
  });
  return { rows: mapped };
}
