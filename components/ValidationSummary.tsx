"use client";
import Button from "./ui/Button";
import { useStore } from "@/lib/store";

type ValidationItem = {
  kind: string;
  rowId: string | number;
  field: string;
  message: string;
};

export default function ValidationSummary({
  validations,
}: {
  validations: {
    errors: ValidationItem[];
    warnings: ValidationItem[];
  };
}) {
  const { setValidations } = useStore();

  return (
    <div className="space-y-3">
      <div>
        <div className="font-medium">Errors: {validations.errors.length}</div>
        <div className="font-medium">
          Warnings: {validations.warnings.length}
        </div>
      </div>
      <div className="max-h-64 overflow-auto border rounded-xl p-2 text-sm">
        {validations.errors.map((e: ValidationItem, i: number) => (
          <div key={i} className="text-red-600">
            • [{e.kind}] {e.rowId} → {e.field}: {e.message}
          </div>
        ))}
        {validations.warnings.map((w: ValidationItem, i: number) => (
          <div key={i} className="text-amber-600">
            • [{w.kind}] {w.rowId} → {w.field}: {w.message}
          </div>
        ))}
        {!validations.errors.length && !validations.warnings.length && (
          <div className="opacity-70">All good ✨</div>
        )}
      </div>
      <Button onClick={() => setValidations()}>Re-run Validations</Button>
    </div>
  );
}
