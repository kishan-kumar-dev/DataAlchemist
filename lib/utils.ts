export function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}
export const uniq = <T>(arr: T[]) => Array.from(new Set(arr));
export const toInt = (v: any) => Number.parseInt(String(v).trim(), 10);
export const toList = (v: any) =>
  String(v ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
export const tryJSON = (s: any) => {
  try {
    return JSON.parse(String(s));
  } catch {
    return null;
  }
};
export const parsePhaseList = (v: any): number[] => {
  if (Array.isArray(v)) return v.map(Number).filter((n) => Number.isFinite(n));
  const s = String(v ?? "").trim();
  if (/^\[/.test(s)) return JSON.parse(s);
  if (/^(\d+)-(\d+)$/.test(s)) {
    const [, a, b] = s.match(/(\d+)-(\d+)/)!;
    const A = Number(a),
      B = Number(b);
    if (A <= B) return Array.from({ length: B - A + 1 }, (_, i) => A + i);
  }
  return toList(s)
    .map(Number)
    .filter((n) => Number.isFinite(n));
};
