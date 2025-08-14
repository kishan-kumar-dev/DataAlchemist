"use client";
import FileUploader from "@/components/FileUploader";
import DataGridEditable from "@/components/DataGridEditable";
import ValidationSummary from "@/components/ValidationSummary";
import RuleBuilder from "@/components/RuleBuilder";
import PrioritiesPanel from "@/components/PrioritiesPanel";
import ExportPanel from "@/components/ExportPanel";
import NaturalLanguageBar from "@/components/NaturalLanguageBar";
import { useStore } from "@/lib/store";

export default function Page() {
  const { clients, workers, tasks, validations } = useStore();
  return (
    <div className="space-y-8">
      <section className="grid md:grid-cols-2 gap-6">
        <div className="p-4 rounded-2xl shadow-sm border">
          <h2 className="font-semibold text-lg mb-2">1) Upload Your Files</h2>
          <FileUploader />
        </div>
        <div className="p-4 rounded-2xl shadow-sm border">
          <h2 className="font-semibold text-lg mb-2">2) Natural Language</h2>
          <NaturalLanguageBar />
          <p className="text-sm mt-2 opacity-80">
            Try: <em>"tasks longer than 1 phase and having phase 2"</em> or{" "}
            <em>"set duration 2 for category=Ops"</em>
          </p>
        </div>
      </section>

      <section className="p-4 rounded-2xl shadow-sm border">
        <h2 className="font-semibold text-lg mb-3">3) Edit in Grids</h2>
        <div className="grid gap-6">
          <DataGridEditable title="Clients" kind="clients" data={clients} />
          <DataGridEditable title="Workers" kind="workers" data={workers} />
          <DataGridEditable title="Tasks" kind="tasks" data={tasks} />
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="p-4 rounded-2xl shadow-sm border">
          <h2 className="font-semibold text-lg mb-2">4) Validation Summary</h2>
          <ValidationSummary validations={validations} />
        </div>
        <div className="p-4 rounded-2xl shadow-sm border">
          <h2 className="font-semibold text-lg mb-2">
            5) Priorities & Weights
          </h2>
          <PrioritiesPanel />
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="p-4 rounded-2xl shadow-sm border">
          <h2 className="font-semibold text-lg mb-2">6) Rule Builder</h2>
          <RuleBuilder />
        </div>
        <div className="p-4 rounded-2xl shadow-sm border">
          <h2 className="font-semibold text-lg mb-2">7) Export</h2>
          <ExportPanel />
        </div>
      </section>
    </div>
  );
}
