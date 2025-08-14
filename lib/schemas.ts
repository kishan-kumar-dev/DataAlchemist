import { z } from "zod";

export const Client = z.object({
  ClientID: z.string().min(1),
  ClientName: z.string().min(1),
  PriorityLevel: z.coerce.number().min(1).max(5),
  RequestedTaskIDs: z.string().transform((s) =>
    s
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
  ),
  GroupTag: z.string().optional().default(""),
  AttributesJSON: z.string().optional().default("{}"),
});
export type ClientT = z.infer<typeof Client>;

export const Worker = z.object({
  WorkerID: z.string().min(1),
  WorkerName: z.string().min(1),
  Skills: z.string().transform((s) =>
    s
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
  ),
  AvailableSlots: z
    .any()
    .transform((v) =>
      Array.isArray(v) ? v : typeof v === "string" ? v : String(v)
    )
    .transform((v) => (Array.isArray(v) ? v : JSON.parse(v)))
    .transform((arr: any[]) => arr.map(Number).filter(Number.isFinite)),
  MaxLoadPerPhase: z.coerce.number().min(0),
  WorkerGroup: z.string().optional().default(""),
  QualificationLevel: z.coerce.number().min(0).default(0),
});
export type WorkerT = z.infer<typeof Worker>;

export const Task = z.object({
  TaskID: z.string().min(1),
  TaskName: z.string().min(1),
  Category: z.string().min(1),
  Duration: z.coerce.number().min(1),
  RequiredSkills: z.string().transform((s) =>
    s
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
  ),
  PreferredPhases: z.any(),
  MaxConcurrent: z.coerce.number().min(0),
});
export type TaskT = z.infer<typeof Task>;
