import { useSectionHandoff, type HandoffPair } from "@/hooks/use-section-handoff";

/** Shared section continuity. The homepage now has one desktop pin, in Identity. */
const PAIRS: readonly HandoffPair[] = [
  ["Introduction", "What MaCo does", "sheet-only"],
  ["What MaCo does", "Capabilities"],
  ["Capabilities", "Who we work with"],
  ["Who we work with", "Selected client work"],
  ["Selected client work", "Products"],
  ["Products", "MaCo, in one name and many scripts", "emphasis"],
  ["MaCo, in one name and many scripts", "How MaCo works", "sheet-only"],
  ["How MaCo works", "Start a project", "emphasis"],
  ["Start a project", "Site footer", "emphasis"],
];

export function GroundHandoff() {
  useSectionHandoff(PAIRS);
  return null;
}
