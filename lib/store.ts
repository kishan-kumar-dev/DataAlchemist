import { create } from "zustand";
import { runValidations } from "./validate";

export type Rule = { type: string; [k: string]: any };

export interface ValidationError {
  kind: string;
  rowId: string;
  field: string;
  message: string;
}

export interface Validation {
  errors: ValidationError[];
  warnings: ValidationError[];
}

export interface StoreState {
  clients: any[];
  workers: any[];
  tasks: any[];
  filteredCounts: { clients: number; workers: number; tasks: number };
  rules: Rule[];
  priorities: {
    priorityLevel: number;
    fairness: number;
    cost: number;
    speed: number;
    requestedFulfillment: number;
  };
  validations: Validation;

  setData: (
    kind?: "clients" | "workers" | "tasks",
    rows?: any[],
    _unused?: any,
    modifier?: (d: { clients: any[]; workers: any[]; tasks: any[] }) => {
      clients: any[];
      workers: any[];
      tasks: any[];
    }
  ) => void;

  updateCell: (
    kind: "clients" | "workers" | "tasks",
    id: string,
    field: string,
    value: any
  ) => void;

  setValidations: () => void;

  setFilters: (
    fn: () => { clients: any[]; workers: any[]; tasks: any[] }
  ) => void;

  addRule: (rule: Rule) => void;
  removeRule: (idx: number) => void;

  setPriorities: (p: Partial<StoreState["priorities"]>) => void;
  applyPreset: (k: "fulfillment" | "fairness" | "minWorkload") => void;
}

export const useStore = create<StoreState>((set, get) => ({
  clients: [],
  workers: [],
  tasks: [],
  filteredCounts: { clients: 0, workers: 0, tasks: 0 },
  rules: [],
  priorities: {
    priorityLevel: 7,
    fairness: 5,
    cost: 5,
    speed: 5,
    requestedFulfillment: 7,
  },
  validations: { errors: [], warnings: [] },

  setData: (kind, rows, _unused, modifier) =>
    set((state) => {
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

  updateCell: (kind, id, field, value) =>
    set((state) => {
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

  setFilters: (fn) =>
    set((state) => {
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

  addRule: (rule) => set((s) => ({ rules: [...s.rules, rule] })),
  removeRule: (idx) =>
    set((s) => ({
      rules: s.rules.filter((_, i) => i !== idx),
    })),

  setPriorities: (p) => set((s) => ({ priorities: { ...s.priorities, ...p } })),

  applyPreset: (k) =>
    set((s) => ({
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
