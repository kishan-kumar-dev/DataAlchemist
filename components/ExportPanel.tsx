"use client";
import Button from "./ui/Button";
import { useStore } from "@/lib/store";
import { exportAll } from "@/lib/export";

export default function ExportPanel() {
  const { clients, workers, tasks, rules, priorities } = useStore();
  return (
    <div className="space-y-3">
      <Button
        onClick={() =>
          exportAll({ clients, workers, tasks, rules, priorities })
        }
      >
        Export cleaned CSVs + rules.json
      </Button>
      <div className="text-sm opacity-70">
        Downloads four files: clients.csv, workers.csv, tasks.csv, rules.json
      </div>
    </div>
  );
}
