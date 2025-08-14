import * as XLSX from "xlsx";

export function downloadCSV(filename: string, rows: any[]) {
  const ws = XLSX.utils.json_to_sheet(rows);
  const csv = XLSX.utils.sheet_to_csv(ws);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

export function downloadJSON(filename: string, obj: any) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], {
    type: "application/json",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

export function exportAll({
  clients,
  workers,
  tasks,
  rules,
  priorities,
}: {
  clients: any[];
  workers: any[];
  tasks: any[];
  rules: any[];
  priorities: any;
}) {
  downloadCSV("clients.csv", clients);
  downloadCSV("workers.csv", workers);
  downloadCSV("tasks.csv", tasks);
  downloadJSON("rules.json", { rules, priorities });
}
