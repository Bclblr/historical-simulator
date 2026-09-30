import type { HistoricalContentClassification } from './types';

export type HistoricalContentLayer = 'HISTORY' | 'INTERPRETATION' | 'ADAPTATION' | 'SIMULATION';

export function getHistoricalContentLayer(
  classification: HistoricalContentClassification,
): HistoricalContentLayer {
  switch (classification) {
    case 'HISTORICAL_FACT':
    case 'PRIMARY_SOURCE':
      return 'HISTORY';
    case 'HISTORIOGRAPHICAL_INTERPRETATION':
      return 'INTERPRETATION';
    case 'DRAMATIZED_ADAPTATION':
      return 'ADAPTATION';
    case 'COUNTERFACTUAL_SIMULATION':
      return 'SIMULATION';
  }
}

export function isHistoricalEvidence(
  classification: HistoricalContentClassification,
): boolean {
  return classification === 'HISTORICAL_FACT' || classification === 'PRIMARY_SOURCE';
}

export function isSimulationContent(
  classification: HistoricalContentClassification,
): boolean {
  return classification === 'COUNTERFACTUAL_SIMULATION';
}

export function assertHistoricalEvidence(
  classification: HistoricalContentClassification,
  context = 'content',
): void {
  if (!isHistoricalEvidence(classification)) {
    throw new Error(
      `${context} must be historical evidence, received ${classification}.`,
    );
  }
}

export function assertSimulationContent(
  classification: HistoricalContentClassification,
  context = 'content',
): void {
  if (!isSimulationContent(classification)) {
    throw new Error(
      `${context} must be counterfactual simulation content, received ${classification}.`,
    );
  }
}
