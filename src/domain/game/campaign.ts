import type { GameSessionSnapshot } from './types';

export type CampaignEndingKind =
  | 'LEADERSHIP_LOST'
  | 'MOVEMENT_COLLAPSED'
  | 'POLITICAL_MARGINALIZATION'
  | 'POWER_NOT_REACHED'
  | 'GOVERNMENT_LOST'
  | 'DIPLOMATIC_ISOLATION'
  | 'STATE_COLLAPSE'
  | 'HISTORICAL_TERMINUS'
  | 'ALTERNATE_TERMINUS';

export interface CampaignProfile {
  playerName: string;
  campaignId: 'germany-1921';
  startedAt: string;
  leadershipActive: boolean;
  endingId?: CampaignEndingKind;
}

export interface CampaignEnding {
  id: CampaignEndingKind;
  title: string;
  description: string;
  classification: 'COUNTERFACTUAL_SIMULATION' | 'HISTORICAL_FACT';
}

function value(snapshot: GameSessionSnapshot, key: string): number {
  return snapshot.state.variables[key] ?? 50;
}

export function evaluateGermanyCampaignEnding(
  snapshot: GameSessionSnapshot,
): CampaignEnding | null {
  const publicSupport = value(snapshot, 'publicSupport');
  const institutionalInfluence = value(snapshot, 'institutionalInfluence');
  const stability = value(snapshot, 'stability');
  const foreignRelations = value(snapshot, 'foreignRelations');
  const decisions = snapshot.decisionHistory.length;
  const date = snapshot.state.currentDate;

  if (publicSupport <= 5 && institutionalInfluence <= 10) {
    return {
      id: 'MOVEMENT_COLLAPSED',
      title: 'Siyasi hareket dağıldı',
      description: 'Kamu desteği ve örgütsel etki sürdürülemeyecek düzeye indi.',
      classification: 'COUNTERFACTUAL_SIMULATION',
    };
  }

  if (institutionalInfluence <= 5 && decisions >= 8) {
    return {
      id: 'LEADERSHIP_LOST',
      title: 'Liderlik sona erdi',
      description: 'Karar zinciriniz sonunda hareket üzerindeki liderlik etkinliğiniz sona erdi.',
      classification: 'COUNTERFACTUAL_SIMULATION',
    };
  }

  if (foreignRelations <= 5 && stability <= 10 && date >= '1933-01-01') {
    return {
      id: 'DIPLOMATIC_ISOLATION',
      title: 'Uluslararası ve iç kriz',
      description: 'Dış ilişkiler ile iç istikrar aynı anda kritik seviyeye geriledi.',
      classification: 'COUNTERFACTUAL_SIMULATION',
    };
  }

  if (stability <= 5 && date >= '1933-01-01') {
    return {
      id: 'GOVERNMENT_LOST',
      title: 'Yönetim sürdürülemedi',
      description: 'İç istikrarın kritik seviyeye düşmesi mevcut siyasi çizginin sürmesini engelledi.',
      classification: 'COUNTERFACTUAL_SIMULATION',
    };
  }

  if (date >= '1945-05-08') {
    return {
      id: 'HISTORICAL_TERMINUS',
      title: 'Kampanya tarihsel sınırına ulaştı',
      description: 'Zaman çizgisi Avrupa’daki savaşın 1945’teki tarihsel bitiş sınırına ulaştı.',
      classification: 'HISTORICAL_FACT',
    };
  }

  return null;
}
