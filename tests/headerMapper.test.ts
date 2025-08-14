import { describe, it, expect } from "vitest";
import { aiHeaderMapper } from "@/lib/ai/aiHeaderMapper";

describe("aiHeaderMapper", () => {
  it("maps misnamed headers", () => {
    const rows = [
      {
        client_id: "C1",
        name: "Acme",
        priority: 5,
        tasks: "T1",
        group: "G",
        attributes: "{}",
      },
    ];
    const mapped = aiHeaderMapper("clients", rows as any);
    // Ensure mapping produced canonical keys
    expect("ClientID" in mapped.rows[0]).toBe(true);
  });
});
