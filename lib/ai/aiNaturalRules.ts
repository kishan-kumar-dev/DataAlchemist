export function naturalToRule(text: string) {
  const s = text.toLowerCase();
  const co = s.match(/run\s+(t\w+)\s+(with|together with)\s+(t\w+)/);
  if (co)
    return { type: "coRun", tasks: [co[1].toUpperCase(), co[3].toUpperCase()] };
  const phase = s.match(/restrict\s+(t\w+)\s+to\s+phases?\s+([0-9-,\[\]\s]+)/);
  if (phase)
    return {
      type: "phaseWindow",
      task: phase[1].toUpperCase(),
      phases: parseList(phase[2]),
    };
  const load = s.match(
    /limit\s+group\s+(\w+)\s+to\s+(\d+)\s+slots?\s+per\s+phase/
  );
  if (load)
    return {
      type: "loadLimit",
      group: load[1],
      maxSlotsPerPhase: Number(load[2]),
    };
  return null;
}
function parseList(s: string) {
  if (/\[/.test(s)) return JSON.parse(s);
  if (/\d+-\d+/.test(s)) {
    const [a, b] = s.split("-").map(Number);
    return Array.from({ length: b - a + 1 }, (_, i) => a + i);
  }
  return s.split(",").map((n) => Number(n.trim()));
}
