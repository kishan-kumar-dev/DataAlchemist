"use client";
import Button from "./ui/Button";
import Input from "./ui/Input";
import { useState } from "react";
import { useStore } from "@/lib/store";
import {
  applyNaturalFilter,
  applyNaturalModification,
} from "@/lib/ai/aiNaturalQuery";

export default function NaturalLanguageBar() {
  const [q, setQ] = useState("");
  const { setFilters, filteredCounts, setData } = useStore();

  return (
    <div className="flex gap-2">
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Ask in plain English…"
      />
      <Button onClick={() => setFilters(applyNaturalFilter(q))}>Filter</Button>
      <Button
        onClick={() =>
          setData(
            undefined as any,
            undefined as any,
            undefined as any,
            applyNaturalModification(q)
          )
        }
      >
        Apply Change
      </Button>
      <div className="text-sm opacity-70 self-center">
        Filtered: C{filteredCounts.clients} / W{filteredCounts.workers} / T
        {filteredCounts.tasks}
      </div>
    </div>
  );
}
