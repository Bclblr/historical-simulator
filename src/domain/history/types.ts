export type HistoricalEntityId = string;

export type HistoricalContentClassification =
  | 'HISTORICAL_FACT'
  | 'PRIMARY_SOURCE'
  | 'HISTORIOGRAPHICAL_INTERPRETATION'
  | 'DRAMATIZED_ADAPTATION'
  | 'COUNTERFACTUAL_SIMULATION';

export interface HistoricalRole {
  id: HistoricalEntityId;
  institutionId: HistoricalEntityId;
  name: string;
}
