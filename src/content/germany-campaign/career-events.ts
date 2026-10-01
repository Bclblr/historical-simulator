import { createHistoricalEvent, type HistoricalEvent } from '@/domain/history';
import type { DecisionRecord } from '@/domain/game';

interface CareerCardDefinition {
  id: string;
  date: string;
  order: number;
  title: string;
  summary: string;
  unlock?: (history: DecisionRecord[]) => boolean;
}

const decided = (history: DecisionRecord[], eventId: string) =>
  history.some((record) => record.eventId === eventId);

const chose = (history: DecisionRecord[], eventId: string, suffix: string) =>
  history.some((record) => record.eventId === eventId && record.optionId.endsWith(`:${suffix}`));

const cards: CareerCardDefinition[] = [
  {
    id: 'career-1919-mayr-assignment',
    date: '1919-06-10',
    order: 101,
    title: 'Yeni bir görev teklifi',
    summary: 'Ordudaki bağlantılarından biri, Münih’teki siyasi çevreleri gözlemleyebileceğin geçici bir görev öneriyor.',
  },
  {
    id: 'career-1919-civilian-future',
    date: '1919-06-18',
    order: 102,
    title: 'Sivil hayata dönüş',
    summary: 'Eski bir asker arkadaşın, ordudan sonra ne yapacağını soruyor ve düzenli bir iş fırsatından söz ediyor.',
    unlock: (history) => decided(history, 'career-1919-mayr-assignment'),
  },
  {
    id: 'career-1919-beerhall-contact',
    date: '1919-07-02',
    order: 103,
    title: 'Yeni bir tanışma',
    summary: 'Münih’te küçük toplantılara katılan bir tanıdık seni akşamki siyasi sohbete çağırıyor.',
    unlock: (history) => decided(history, 'career-1919-civilian-future'),
  },
  {
    id: 'career-1919-money-problem',
    date: '1919-07-14',
    order: 104,
    title: 'Para sıkıntısı',
    summary: 'Günlük masraflar artıyor. Bir tanıdığın ücretli bir iş ile siyasi çevrelerde daha fazla zaman geçirmek arasında seçim yapmanı istiyor.',
    unlock: (history) => decided(history, 'career-1919-beerhall-contact'),
  },
  {
    id: 'career-1919-small-speech',
    date: '1919-08-05',
    order: 105,
    title: 'Küçük bir toplantı',
    summary: 'Yeni tanıştığın bir örgütçü, kalabalık olmayan bir toplantıda birkaç dakika konuşmanı teklif ediyor.',
    unlock: (history) => chose(history, 'career-1919-beerhall-contact', 'attend-evening-circle'),
  },
  {
    id: 'career-1919-newspaper-contact',
    date: '1919-08-18',
    order: 106,
    title: 'Gazeteciyle tanışma',
    summary: 'Yerel bir gazeteci siyasi toplantılarla ilgili görüşünü soruyor. Bu tanışıklık ileride basın bağlantısına dönüşebilir.',
    unlock: (history) => decided(history, 'career-1919-small-speech') || decided(history, 'career-1919-money-problem'),
  },
  {
    id: 'career-1920-organizer-offer',
    date: '1920-01-12',
    order: 107,
    title: 'Örgütçülük teklifi',
    summary: 'Parti çevresinden biri toplantıları düzenleme ve yeni katılımcılarla ilgilenme görevini üstlenmeni istiyor.',
    unlock: (history) => decided(history, 'de-1919-hitler-joins-dap'),
  },
  {
    id: 'career-1920-rival-organizer',
    date: '1920-02-03',
    order: 108,
    title: 'İçeride bir rakip',
    summary: 'Başka bir örgütçü, toplantılarda fazla öne çıktığını düşünüyor ve yetkilerin paylaşılmasını istiyor.',
    unlock: (history) => decided(history, 'career-1920-organizer-offer'),
  },
  {
    id: 'career-1920-donor-meeting',
    date: '1920-05-20',
    order: 109,
    title: 'Mali destek görüşmesi',
    summary: 'Bir destekçi toplantı salonu ve yayın masrafları için yardım teklif ediyor; karşılığında parti yönetimine erişim bekliyor.',
    unlock: (history) => decided(history, 'de-1920-party-program'),
  },
  {
    id: 'career-1921-leadership-allies',
    date: '1921-06-30',
    order: 110,
    title: 'Liderlik için destek',
    summary: 'Yakınındaki bir parti yöneticisi, yaklaşan yönetim tartışmasında seni destekleyebileceğini söylüyor ancak nasıl bir yönetim istediğini bilmek istiyor.',
    unlock: (history) => decided(history, 'career-1920-donor-meeting') || decided(history, 'career-1920-rival-organizer'),
  },
];

export function getGermanyCareerEvents(history: DecisionRecord[]): HistoricalEvent[] {
  return cards
    .filter((card) => !card.unlock || card.unlock(history))
    .map((card) =>
      createHistoricalEvent({
        id: card.id,
        eraId: 'germany-1921',
        countryIds: ['germany'],
        title: card.title,
        summary: card.summary,
        startDate: card.date,
        scope: 'LOCAL',
        classification: 'COUNTERFACTUAL_SIMULATION',
        sortOrder: card.order,
        status: 'PUBLISHED',
      }),
    );
}
