"use client";

import { getStorage, setStorage, shortId } from "./storage";

export type Risk = "Low" | "Medium" | "High";
export type Status = "Production" | "Staging" | "Deprecated";

export interface Model {
  id: string;
  name: string;
  provider: string;
  version: string;
  owner: string;
  risk: Risk;
  status: Status;
  lastReview: string; // ISO yyyy-mm-dd
  monthlySpend: number;
  callsLast30d: number;
  description?: string;
  custom?: boolean; // true if user-registered (editable/deletable)
}

const SEED_MODELS: Model[] = [
  { id: "mdl_01", name: "GPT-4o", provider: "OpenAI", version: "2024-08-06", owner: "Platform Engineering", risk: "Medium", status: "Production", lastReview: "2026-04-12", monthlySpend: 1842, callsLast30d: 12473, description: "Primary model for legacy modernization. Routed through Aegis governance plane with PII redaction and cost-ceiling policies." },
  { id: "mdl_02", name: "GPT-4o-mini", provider: "OpenAI", version: "2024-07-18", owner: "Service Desk", risk: "Low", status: "Production", lastReview: "2026-04-19", monthlySpend: 612, callsLast30d: 38291, description: "Default for high-volume ITSM triage and summarization." },
  { id: "mdl_03", name: "Claude 3.5 Sonnet", provider: "Anthropic", version: "20241022", owner: "Data & Analytics", risk: "Medium", status: "Production", lastReview: "2026-03-28", monthlySpend: 487, callsLast30d: 4128, description: "Used for long-context reasoning over governed knowledge base." },
  { id: "mdl_04", name: "Claude 3 Haiku", provider: "Anthropic", version: "20240307", owner: "Service Desk", risk: "Low", status: "Production", lastReview: "2026-04-02", monthlySpend: 124, callsLast30d: 9742, description: "Cheap fallback for quick classification and routing." },
  { id: "mdl_05", name: "Llama 3.1 70B", provider: "Meta · self-hosted", version: "3.1", owner: "Security", risk: "High", status: "Staging", lastReview: "2026-04-23", monthlySpend: 0, callsLast30d: 2104, description: "Self-hosted on dedicated GPU cluster — restricted to Security team for sensitive workloads." },
  { id: "mdl_06", name: "Mistral Large", provider: "Mistral", version: "2407", owner: "Platform Engineering", risk: "Medium", status: "Staging", lastReview: "2026-04-08", monthlySpend: 41, callsLast30d: 312, description: "Evaluation candidate for EU-residency workloads." },
  { id: "mdl_07", name: "text-embedding-3-large", provider: "OpenAI", version: "1.0", owner: "Data & Analytics", risk: "Low", status: "Production", lastReview: "2026-03-15", monthlySpend: 89, callsLast30d: 142091, description: "Embeddings for the governed knowledge-base RAG index." },
  { id: "mdl_08", name: "GPT-3.5-turbo", provider: "OpenAI", version: "0125", owner: "Service Desk", risk: "Low", status: "Deprecated", lastReview: "2026-02-01", monthlySpend: 12, callsLast30d: 84, description: "Deprecated. Scheduled for removal once last consumer migrates to GPT-4o-mini." },
  { id: "mdl_09", name: "Whisper Large-v3", provider: "OpenAI", version: "v3", owner: "Service Desk", risk: "Low", status: "Production", lastReview: "2026-04-21", monthlySpend: 67, callsLast30d: 1842, description: "Speech-to-text for inbound voice ITSM tickets." },
];

const KEY = "models.v1";

interface ModelsState {
  added: Model[];
  edits: Record<string, Partial<Model>>;
  deletedIds: string[];
}

const EMPTY_STATE: ModelsState = { added: [], edits: {}, deletedIds: [] };

export function listModels(): Model[] {
  const state = getStorage<ModelsState>(KEY, EMPTY_STATE);
  const seeds = SEED_MODELS.filter((m) => !state.deletedIds.includes(m.id)).map((m) =>
    state.edits[m.id] ? { ...m, ...state.edits[m.id] } : m
  );
  return [...state.added, ...seeds];
}

export function getModel(id: string): Model | undefined {
  return listModels().find((m) => m.id === id);
}

export function addModel(input: Omit<Model, "id" | "lastReview" | "monthlySpend" | "callsLast30d" | "custom">): Model {
  const model: Model = {
    ...input,
    id: shortId("mdl"),
    lastReview: new Date().toISOString().slice(0, 10),
    monthlySpend: 0,
    callsLast30d: 0,
    custom: true,
  };
  const state = getStorage<ModelsState>(KEY, EMPTY_STATE);
  setStorage(KEY, { ...state, added: [model, ...state.added] });
  return model;
}

export function updateModel(id: string, patch: Partial<Model>) {
  const state = getStorage<ModelsState>(KEY, EMPTY_STATE);
  const isCustom = state.added.some((m) => m.id === id);
  if (isCustom) {
    setStorage(KEY, {
      ...state,
      added: state.added.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    });
  } else {
    setStorage(KEY, {
      ...state,
      edits: { ...state.edits, [id]: { ...(state.edits[id] || {}), ...patch } },
    });
  }
}

export function deleteModel(id: string) {
  const state = getStorage<ModelsState>(KEY, EMPTY_STATE);
  const isCustom = state.added.some((m) => m.id === id);
  if (isCustom) {
    setStorage(KEY, { ...state, added: state.added.filter((m) => m.id !== id) });
  } else {
    setStorage(KEY, {
      ...state,
      deletedIds: [...state.deletedIds, id],
      edits: Object.fromEntries(Object.entries(state.edits).filter(([k]) => k !== id)),
    });
  }
}

export function resetModels() {
  setStorage(KEY, EMPTY_STATE);
}
