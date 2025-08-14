"use client";

import Button from "./ui/Button";
import Input from "./ui/Input";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { naturalToRule } from "@/lib/ai/aiNaturalRules";

type Rule = {
  type:
    | "coRun"
    | "slotRestriction"
    | "loadLimit"
    | "phaseWindow"
    | "patternMatch"
    | "precedenceOverride";
  [key: string]: any;
};

export default function RuleBuilder() {
  const { rules, addRule, removeRule } = useStore() as {
    rules: Rule[];
    addRule: (rule: Rule) => void;
    removeRule: (index: number) => void;
  };

  const [text, setText] = useState("");
  const [type, setType] = useState<Rule["type"]>("coRun");
  const [payload, setPayload] = useState<string>("");

  return (
    <div className="space-y-3">
      {/* Select and JSON payload input */}
      <div className="flex gap-2 flex-wrap">
        <select
          className="px-3 py-2 rounded-xl border"
          value={type}
          onChange={(e) => setType(e.target.value as Rule["type"])}
        >
          <option value="coRun">Co-run</option>
          <option value="slotRestriction">Slot-restriction</option>
          <option value="loadLimit">Load-limit</option>
          <option value="phaseWindow">Phase-window</option>
          <option value="patternMatch">Pattern-match</option>
          <option value="precedenceOverride">Precedence override</option>
        </select>
        <Input
          placeholder='Payload JSON (e.g. {"tasks":["T1","T2"]})'
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
        />
        <Button
          onClick={() => {
            try {
              const parsed = payload ? JSON.parse(payload) : {};
              addRule({ type, ...parsed });
            } catch {
              console.error("Invalid JSON payload");
            }
          }}
        >
          Add Rule
        </Button>
      </div>

      {/* Natural language rule input */}
      <div className="flex gap-2">
        <Input
          placeholder="Type a rule in plain English…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button
          onClick={() => {
            const r = naturalToRule(text);
            if (r) addRule(r as Rule);
          }}
        >
          Convert & Add
        </Button>
      </div>

      {/* Rules list */}
      <div className="border rounded-xl p-2 text-sm max-h-60 overflow-auto">
        {rules.map((r: Rule, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <code className="bg-black/5 px-2 py-1 rounded">
              {JSON.stringify(r)}
            </code>
            <Button className="ml-auto" onClick={() => removeRule(i)}>
              Remove
            </Button>
          </div>
        ))}
        {!rules.length && <div className="opacity-70">No rules yet.</div>}
      </div>
    </div>
  );
}
