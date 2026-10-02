export interface MediterraneanSourceNote {
  id: string;
  title: string;
  author: string;
  roleInScenario: string;
  themes: string[];
}

export const OTTOMAN_MEDITERRANEAN_SOURCE_NOTES: MediterraneanSourceNote[] = [
  {
    id: 'sultanin-casuslari',
    title: 'Sultanın Casusları',
    author: 'Emrah Safa Gürkan',
    roleInScenario:
      'İstihbarat kaynakları, casusluk ağları, bilgi toplama, operasyonlar, kurumsal yapı ve karşı istihbarat mekaniklerinin tarihsel esin kaynağı.',
    themes: [
      'Osmanlı-Habsburg rekabeti',
      'istihbarat kaynakları',
      'casusluk ağları',
      'bilgi ve haberleşme',
      'sabotaj ve rüşvet ağları',
      'karşı istihbarat',
    ],
  },
  {
    id: 'sultanin-korsanlari',
    title: 'Sultanın Korsanları',
    author: 'Emrah Safa Gürkan',
    roleInScenario:
      'Korsanlık ve denizcilik dünyasının sosyal, ekonomik ve gündelik boyutlarının; mürettebat, gemi hayatı, esaret, fidye, hukuk ve kimlik temalarının oyunlaştırılmasına kaynaklık eder.',
    themes: [
      'Akdeniz denizciliği',
      'korsanlık ve gaza ilişkisi',
      'mürettebat ve gemi hayatı',
      'esaret ve fidye',
      'denizcilik ekonomisi',
      'hukuk ve idare',
      'kimlik ve aidiyet',
    ],
  },
];

export const OTTOMAN_MEDITERRANEAN_CONTENT_POLICY = {
  sourceDerived:
    'Kartlardaki tarihsel temalar iki kitabın incelenen yapısından türetilmiştir.',
  gameDesigned:
    'Oyuncu isimleri, kişisel diyaloglar, seçimler ve sonuçlar kurgusal oyun içeriğidir; tarihsel kişilerin birebir canlandırılması amaçlanmaz.',
};
