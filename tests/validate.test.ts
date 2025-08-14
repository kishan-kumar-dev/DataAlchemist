import { describe, it, expect } from "vitest";
import { useStore } from "@/lib/store";
import { runValidations } from "@/lib/validate";

describe("validations", () => {
  it("flags missing skills", () => {
    useStore.setState({
      clients: [],
      workers: [
        {
          WorkerID: "W1",
          WorkerName: "A",
          Skills: ["analysis"],
          AvailableSlots: [1],
          MaxLoadPerPhase: 1,
          WorkerGroup: "G",
          QualificationLevel: 1,
        },
      ],
      tasks: [
        {
          TaskID: "T1",
          TaskName: "X",
          Category: "C",
          Duration: 1,
          RequiredSkills: ["unknown"],
          PreferredPhases: [1],
          MaxConcurrent: 1,
        },
      ],
      rules: [],
    } as any);
    const v = runValidations();
    expect(v.errors.some((e) => e.field === "RequiredSkills")).toBe(true);
  });
});
