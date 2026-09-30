export type HistoricalEntityId = string;

export type HistoricalContentClassification =
  | 'HISTORICAL_FACT'
  | 'PRIMARY_SOURCE'
  | 'HISTORIOGRAPHICAL_INTERPRETATION'
  | 'DRAMATIZED_ADAPTATION'
  | 'COUNTERFACTUAL_SIMULATION';

export interface Era {
  id: HistoricalEntityId;
  name: string;
  startYear: number;
  endYear: number;
}

export interface Country {
  id: HistoricalEntityId;
  eraId: HistoricalEntityId;
  name: string;
}

export interface Institution {
  id: HistoricalEntityId;
  countryId: HistoricalEntityId;
  name: string;
}

export interface HistoricalRole {
  id: HistoricalEntityId;
  institutionId: HistoricalEntityId;
  name: string;
}
