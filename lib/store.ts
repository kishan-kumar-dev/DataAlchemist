import { create } from "zustand";
import { runValidations } from "./validate";

export type Rule = { type: string; [k: string]: any };

export const useStore = create<any>((set, get) => ({
  clients: [],
  workers: [],
  tasks: [],
  filteredCounts: { clients: 0, workers: 0, tasks: 0 },
  rules: [] as Rule[],
  priorities: {
    priorityLevel: 7,
    fairness: 5,
    cost: 5,
    speed: 5,
    requestedFulfillment: 7,
  },
  validations: { errors: [], warnings: [] },

  setData: (
    kind?: "clients" | "workers" | "tasks",
    rows?: any[],
    _unused?: any,
    modifier?: (d: any) => any
  ) =>
    set((state: any) => {
      let { clients, workers, tasks } = state;
      if (kind && rows) {
        if (kind === "clients") clients = rows;
        else if (kind === "workers") workers = rows;
        else tasks = rows;
      }
      if (modifier) {
        const changed = modifier({
          clients: [...clients],
          workers: [...workers],
          tasks: [...tasks],
        });
        clients = changed.clients;
        workers = changed.workers;
        tasks = changed.tasks;
      }
      const validations = runValidations();
      return {
        clients,
        workers,
        tasks,
        validations,
        filteredCounts: {
          clients: clients.length,
          workers: workers.length,
          tasks: tasks.length,
        },
      };
    }),

  updateCell: (
    kind: "clients" | "workers" | "tasks",
    id: string,
    field: string,
    value: any
  ) =>
    set((state: any) => {
      const copy = {
        clients: [...state.clients],
        workers: [...state.workers],
        tasks: [...state.tasks],
      };
      const arr = copy[kind];
      const idx = arr.findIndex(
        (r: any) => (r.ClientID || r.WorkerID || r.TaskID) === id
      );
      if (idx > -1) arr[idx] = { ...arr[idx], [field]: value };
      const validations = runValidations();
      return { ...copy, validations };
    }),

  setValidations: () => set({ validations: runValidations() }),

  setFilters: (fn: () => { clients: any[]; workers: any[]; tasks: any[] }) =>
    set((state: any) => {
      const data = fn();
      return {
        ...state,
        ...data,
        filteredCounts: {
          clients: data.clients.length,
          workers: data.workers.length,
          tasks: data.tasks.length,
        },
      };
    }),

  addRule: (rule: Rule) => set((s: any) => ({ rules: [...s.rules, rule] })),
  removeRule: (idx: number) =>
    set((s: any) => ({
      rules: s.rules.filter((_: any, i: number) => i !== idx),
    })),

  setPriorities: (p: Partial<any>) =>
    set((s: any) => ({ priorities: { ...s.priorities, ...p } })),
  applyPreset: (k: "fulfillment" | "fairness" | "minWorkload") =>
    set((s: any) => ({
      priorities:
        k === "fulfillment"
          ? {
              priorityLevel: 9,
              requestedFulfillment: 9,
              fairness: 5,
              cost: 4,
              speed: 6,
            }
          : k === "fairness"
          ? {
              priorityLevel: 6,
              requestedFulfillment: 6,
              fairness: 9,
              cost: 5,
              speed: 5,
            }
          : {
              priorityLevel: 6,
              requestedFulfillment: 6,
              fairness: 5,
              cost: 9,
              speed: 5,
            },
    })),
}));
