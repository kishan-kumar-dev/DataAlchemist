"use client";
import Button from "./ui/Button";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { useStore } from "@/lib/store";
import { aiHeaderMapper } from "@/lib/ai/aiHeaderMapper";
import { parseAndNormalize } from "@/lib/parse";

export default function FileUploader() {
  const { setData, setValidations } = useStore();

  function handleFiles(kind: "clients" | "workers" | "tasks", file: File) {
    const name = file.name.toLowerCase();
    const isCSV = name.endsWith(".csv");
    const parseCSV = () => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (result) => {
          const rows = result.data as any[];
          const mapped = aiHeaderMapper(kind, rows);
          const normalized = parseAndNormalize(kind, mapped.rows);
          setData(kind, normalized);
          setValidations(); // ✅ no args
        },
      });
    };
    if (isCSV) return parseCSV();
    const reader = new FileReader();
    reader.onload = () => {
      const wb = XLSX.read(reader.result, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(ws) as any[];
      const mapped = aiHeaderMapper(kind, json);
      const normalized = parseAndNormalize(kind, mapped.rows);
      setData(kind, normalized);
      setValidations(); // ✅ no args
    };
    reader.readAsBinaryString(file);
  }

  return (
    <div className="space-y-3">
      {(["clients", "workers", "tasks"] as const).map((k) => (
        <div key={k} className="flex items-center gap-2">
          <label className="w-28 font-medium capitalize">{k}</label>
          <input
            type="file"
            accept=".csv,.xlsx"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFiles(k, f);
            }}
          />
        </div>
      ))}
      <div className="text-xs opacity-70">
        Tip: Drop in your own CSV/XLSX or use the samples in the repo.
      </div>
    </div>
  );
}
