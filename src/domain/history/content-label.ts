import type { HistoricalContentClassification } from './types';
import { getHistoricalContentLayer } from './content-integrity';

export type HistoricalContentLabel =
  | 'HISTORICAL_RECORD'
  | 'PRIMARY_SOURCE'
  | 'HISTORIAN_INTERPRETATION'
  | 'DRAMATIZED_ADAPTATION'
  | 'ALTERNATE_HISTORY';

export function getHistoricalContentLabel(
  classification: HistoricalContentClassification,
): HistoricalContentLabel {
  switch (classification) {
    case 'HISTORICAL_FACT':
      return 'HISTORICAL_RECORD';
    case 'PRIMARY_SOURCE':
      return 'PRIMARY_SOURCE';
    case 'HISTORIOGRAPHICAL_INTERPRETATION':
      return 'HISTORIAN_INTERPRETATION';
    case 'DRAMATIZED_ADAPTATION':
      return 'DRAMATIZED_ADAPTATION';
    case 'COUNTERFACTUAL_SIMULATION':
      return 'ALTERNATE_HISTORY';
  }
}

export function isAlternateHistory(
  classification: HistoricalContentClassification,
): boolean {
  return getHistoricalContentLayer(classification) === 'SIMULATION';
}
