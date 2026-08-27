import { useState, useEffect } from "react";
import { Artifact, Source, primarySource, artifacts as initialArtifacts } from "@/data/demo";
import { TransformationResponse } from "./api";

export interface CustomSource {
  id: string;
  title: string;
  type: string;
  pages: number;
  size: string;
  rawText?: string;
  file?: File;
  summary?: string;
  facts?: Array<{ id: string; text: string; confidence: number; evidence: { id: string; page: number; excerpt: string } }>;
}

export interface GeneratedRun {
  id: string;
  sourceTitle: string;
  date: string;
  audience: string;
  tone: string;
  status: "ready" | "processing" | "failed";
  outputs: TransformationResponse[];
  artifacts: Artifact[];
}

const ACTIVE_SOURCE_KEY = "transform_ai_active_source";
const GENERATED_RUNS_KEY = "transform_ai_generated_runs";

export function getActiveSource(): CustomSource {
  try {
    const saved = localStorage.getItem(ACTIVE_SOURCE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Failed to parse active source", e);
  }
  return {
    id: primarySource.id,
    title: primarySource.title,
    type: primarySource.type,
    pages: primarySource.pages,
    size: primarySource.size,
    summary: primarySource.summary,
  };
}

export function setActiveSource(source: CustomSource) {
  try {
    const dataToSave = { ...source };
    delete dataToSave.file; // Don't serialize binary File to localStorage
    localStorage.setItem(ACTIVE_SOURCE_KEY, JSON.stringify(dataToSave));
  } catch (e) {
    console.error("Failed to save active source", e);
  }
}

export function getStoredRuns(): GeneratedRun[] {
  try {
    const saved = localStorage.getItem(GENERATED_RUNS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Failed to parse runs", e);
  }
  return [];
}

export function saveRun(run: GeneratedRun) {
  const runs = getStoredRuns();
  const existingIndex = runs.findIndex((r) => r.id === run.id);
  if (existingIndex >= 0) {
    runs[existingIndex] = run;
  } else {
    runs.unshift(run);
  }
  try {
    localStorage.setItem(GENERATED_RUNS_KEY, JSON.stringify(runs));
  } catch (e) {
    console.error("Failed to save run", e);
  }
}

export function getRunById(id: string): GeneratedRun | undefined {
  const runs = getStoredRuns();
  return runs.find((r) => r.id === id);
}

export function getArtifactById(id: string): Artifact | undefined {
  const runs = getStoredRuns();
  for (const r of runs) {
    const found = r.artifacts.find((a) => a.id === id);
    if (found) return found;
  }
  return initialArtifacts.find((a) => a.id === id);
}
