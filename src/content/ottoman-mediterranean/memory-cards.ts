import type { MediterraneanCardDefinition, MediterraneanChoice } from './deck';

const fx = (key: string, delta: number) => ({ type: 'CHANGE_VARIABLE', key, delta } as const);
const fl = (key: string) => ({ type: 'SET_FLAG', key, value: true } as const);
const day = (days: number) => ({ type: 'ADVANCE_DAYS', days } as const);

const pick = (idSuffix: string, label: string, description: string, effects: any[]): MediterraneanChoice => ({
  idSuffix,
  label,
  description,
  effects,
});

const memory = (
  id: string,
  speaker: string,
  role: string,
  line: string,
  category: MediterraneanCardDefinition['category'],
  flag: string,
  left: MediterraneanChoice,
  right: MediterraneanChoice,
): MediterraneanCardDefinition => ({
  id,
  speaker,
  role,
  line,
  category,
  requires: { [flag]: true },
  weight: 14,
  left,
  right,
});

export const MEDITERRANEAN_MEMORY_CARDS: MediterraneanCardDefinition[] = [
  memory(
    'med-memory-rumor',
    'Salih',
    'Liman kahvesindeki tanıdık',
    'Salih: Geçen aylarda peşine düştüğün haber yeniden önüme geldi. Bu kez kaynağı daha açık.',
    'INTELLIGENCE',
    'memory_rumor_returned',
    pick('verify-again', 'Bu kez kaynağı kontrol ederim.', 'İlk duyduğun haberle yeni kaynağı karşılaştır.', [fx('information', 4), fx('reputation', 1), day(45), fl('verified_rumor')]),
    pick('use-connection', 'Bu bağlantıyı kullanırım.', 'Haberi yeni bağlantının üzerinden takip et.', [fx('intelligenceNetwork', 4), fx('safety', -2), day(55), fl('deep_rumor_network')]),
  ),
  memory(
    'med-memory-route',
    'Mateo',
    'Denizci',
    'Mateo: Daha önce izini sürdüğün rota yine konuşuluyor. Bu kez seni doğrudan soruyorlar.',
    'SEA',
    'memory_route_returned',
    pick('stay-away-route', 'Bu kez uzak dururum.', 'Eski bağlantının seni tekrar görünür kılmasına izin verme.', [fx('safety', 3), fx('sailorNetwork', -1), day(60)]),
    pick('follow-route-again', 'Rota hakkında konuşurum.', 'Eski bağlantıyı yeniden kullan ama daha görünür hale gel.', [fx('sailorNetwork', 4), fx('reputation', 2), fx('safety', -3), day(70), fl('route_reused')]),
  ),
  memory(
    'med-memory-letter',
    'Yusuf',
    'Eski bağlantı',
    'Yusuf: Taşıdığın mektubun ardından adın bir yerde daha geçti. Bunun tesadüf olduğunu düşünmüyorum.',
    'INTELLIGENCE',
    'memory_letter_returned',
    pick('distance-letter', 'Bu bağlantıyı kapatırım.', 'Bir önceki işin ardından oluşan görünürlüğü azalt.', [fx('safety', 3), fx('intelligenceNetwork', -2), day(50)]),
    pick('continue-letter', 'Bir kez daha dinlerim.', 'Yeni haberin ne olduğunu öğrenmek için bağlantıyı sürdür.', [fx('information', 3), fx('intelligenceNetwork', 4), fx('safety', -2), day(65), fl('letter_network_continues')]),
  ),
  memory(
    'med-memory-payment',
    'Mehmet',
    'Liman görevlisi',
    'Mehmet: Aldığın ödemenin kaydı doğrudan görünmüyor ama kimlerin seninle çalıştığı soruluyor.',
    'INTELLIGENCE',
    'memory_payment_returned',
    pick('explain-payment', 'Ne biliyorsam anlatırım.', 'Ödemenin kaynağını açıkça anlatıp şüpheyi azaltmaya çalış.', [fx('safety', 2), fx('reputation', 2), day(55), fl('payment_explained')]),
    pick('keep-silent-payment', 'Ayrıntıya girmem.', 'Bağlantını korurken soruşturmanın baskısını artır.', [fx('intelligenceNetwork', 3), fx('safety', -3), day(60), fl('payment_suspected')]),
  ),
  memory(
    'med-memory-crew',
    'Kaptan Selim',
    'Gemi kaptanı',
    'Kaptan Selim: Daha önce tayfaya katıldığın için seni artık tanıyorlar. Yeni bir seferde senden açıkça söz ediyorlar.',
    'SEA',
    'memory_crew_returned',
    pick('crew-ashore', 'Bu kez karada kalırım.', 'Deniz çevresindeki görünürlüğünü azalt.', [fx('safety', 3), fx('sailorNetwork', -2), day(70)]),
    pick('crew-again', 'Yine tayfaya katılırım.', 'Eski güveni kullanarak deniz çevrende yerini sağlamlaştır.', [fx('sailorNetwork', 5), fx('shipTrust', 3), fx('safety', -3), day(80), fl('crew_rejoined')]),
  ),
  memory(
    'med-memory-trade',
    'Hassan',
    'Tüccar',
    'Hassan: Daha önce yaptığın işten sonra seni başka bir limandaki ortağıma da anlattım. Şimdi senden haber bekliyor.',
    'TRADE',
    'memory_trade_returned',
    pick('trade-cautious', 'Önce şartları öğrenirim.', 'Yeni bağlantıya girmeden önce borç ve ödeme koşullarını sor.', [fx('merchantNetwork', 2), fx('money', 2), day(60), fl('trade_terms_checked')]),
    pick('trade-expand', 'İşi büyütürüm.', 'Eski ticaret bağlantısını daha geniş bir ağa çevir.', [fx('merchantNetwork', 5), fx('money', 4), fx('safety', -2), day(75), fl('trade_network_expanded')]),
  ),
  memory(
    'med-memory-family',
    'Meryem',
    'Aileden biri',
    'Meryem: Denize dönüp dönmediğini artık evdekiler de konuşuyor. Önceki kararının sonucu herkese ulaştı.',
    'FAMILY',
    'memory_family_returned',
    pick('family-return', 'Bir süre eve dönerim.', 'Aile bağını güçlendirip deniz çevrenden biraz uzaklaş.', [fx('familyTies', 5), fx('safety', 2), fx('sailorNetwork', -2), day(90), fl('family_returned')]),
    pick('family-support', 'Denizde kalıp destek olurum.', 'Uzakta kalırken aileye maddi ve sosyal destek vermeyi sürdür.', [fx('familyTies', 3), fx('money', -2), fx('sailorNetwork', 2), day(90), fl('family_supported_from_sea')]),
  ),
  memory(
    'med-memory-identity',
    'Ahmed',
    'Yeni çevreden tanıdık',
    'Ahmed: Farklı çevrelerle kurduğun ilişkin artık fark ediliyor. Eski ve yeni bağlantıların aynı yerde kesişebilir.',
    'IDENTITY',
    'memory_identity_returned',
    pick('keep-balance', 'İki çevreyi de dengelerim.', 'Kimliğini tek bir çevreye bağlamadan ilişkilerini koru.', [fx('social', 4), fx('language', 2), day(80), fl('balanced_identity')]),
    pick('new-circle', 'Yeni çevreye ağırlık veririm.', 'Yeni bağlantıların içinde daha görünür hale gel.', [fx('social', 4), fx('language', 3), fx('familyTies', -2), day(85), fl('new_circle_strengthened')]),
  ),
];
