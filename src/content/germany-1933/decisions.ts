import type { DecisionEffect } from '@/domain/game';

export interface ScenarioDecisionChoice {
  idSuffix: string;
  label: string;
  description: string;
  result: string;
  effects: DecisionEffect[];
}

export interface ScenarioDecisionContent {
  prompt: string;
  speaker: string;
  left: ScenarioDecisionChoice;
  right: ScenarioDecisionChoice;
}

const decisions: Record<string, ScenarioDecisionContent> = {
  'de-1933-schleicher-resigns': {
    prompt: 'Hükûmet krizi derinleşiyor. Kabine dosyası için nasıl bir tutum kayda geçirilsin?',
    speaker: 'Kabine Sekreterliği',
    left: {
      idSuffix: 'institutional-review',
      label: 'Usul incelemesi iste',
      description: 'Yetki devri ve anayasal usul hakkında ek değerlendirme talep et.',
      result: 'Dosya ek incelemeye alındı. Kurumsal usule verilen önem arttı, fakat belirsizlik uzadı.',
      effects: [
        { type: 'CHANGE_VARIABLE', key: 'institutionalInfluence', delta: 6 },
        { type: 'CHANGE_VARIABLE', key: 'stability', delta: -3 },
      ],
    },
    right: {
      idSuffix: 'forward-transition',
      label: 'Geçiş dosyasını ilerlet',
      description: 'Yeni hükûmet oluşumuna ilişkin idari hazırlığı geciktirmeden ilerlet.',
      result: 'Geçiş işlemleri hızlandı. İdari düzen korundu, fakat kurumun bağımsız hareket alanı daraldı.',
      effects: [
        { type: 'CHANGE_VARIABLE', key: 'stability', delta: 5 },
        { type: 'CHANGE_VARIABLE', key: 'institutionalInfluence', delta: -3 },
      ],
    },
  },
  'de-1933-hitler-appointed-chancellor': {
    prompt: 'Yeni şansölye göreve başladı. Kabine sekreterliği ilk dosyalarda nasıl hareket etsin?',
    speaker: 'Kabine Sekreterliği',
    left: {
      idSuffix: 'document-authority',
      label: 'Yetki sınırlarını kayda geçir',
      description: 'Yeni hükûmetin işlemlerinde mevcut hukuki ve kurumsal sınırların açıkça belgelenmesini iste.',
      result: 'Yetki sınırları dosyaya işlendi. Kurumsal kayıt güçlendi ancak yeni yönetimle sürtüşme arttı.',
      effects: [
        { type: 'CHANGE_VARIABLE', key: 'institutionalInfluence', delta: 7 },
        { type: 'CHANGE_VARIABLE', key: 'stability', delta: -2 },
      ],
    },
    right: {
      idSuffix: 'routine-transition',
      label: 'Rutin geçişi uygula',
      description: 'Yeni kabinenin idari geçişini olağan prosedürle yürüt.',
      result: 'İdari geçiş hızlı tamamlandı. Kısa vadeli düzen arttı ancak kurumun denetleyici ağırlığı azaldı.',
      effects: [
        { type: 'CHANGE_VARIABLE', key: 'stability', delta: 5 },
        { type: 'CHANGE_VARIABLE', key: 'institutionalInfluence', delta: -4 },
      ],
    },
  },
  'de-1933-reichstag-fire': {
    prompt: 'Reichstag yangınının ardından olağanüstü önlemler tartışılıyor. Dosyaya hangi yaklaşım işlensin?',
    speaker: 'İçişleri dosyası',
    left: {
      idSuffix: 'request-legal-review',
      label: 'Hukuki inceleme iste',
      description: 'Temel hakları etkileyen önlemler için ayrıntılı hukuki değerlendirme talep et.',
      result: 'Ek hukuki inceleme talep edildi. Kurumsal denetim güçlendi, karar süreci yavaşladı.',
      effects: [
        { type: 'CHANGE_VARIABLE', key: 'institutionalInfluence', delta: 6 },
        { type: 'CHANGE_VARIABLE', key: 'stability', delta: -2 },
      ],
    },
    right: {
      idSuffix: 'expedite-emergency-file',
      label: 'Acil dosyayı ilerlet',
      description: 'Olağanüstü tedbir dosyasını hızlandırılmış idari süreçle ilerlet.',
      result: 'Dosya hızlandırıldı. Yönetim kapasitesi kısa vadede arttı, kurumsal denetim zayıfladı.',
      effects: [
        { type: 'CHANGE_VARIABLE', key: 'stability', delta: 5 },
        { type: 'CHANGE_VARIABLE', key: 'institutionalInfluence', delta: -6 },
      ],
    },
  },
  'de-1933-reichstag-election': {
    prompt: 'Seçim sonuçları açıklandı. Kabine, yeni parlamento dengesi için hazırlık istiyor. Ne yapacaksın?',
    speaker: 'Kabine Sekreterliği',
    left: {
      idSuffix: 'parliamentary-analysis',
      label: 'Parlamento analizi hazırla',
      description: 'Koalisyon ve çoğunluk durumunu ayrıntılı biçimde değerlendir.',
      result: 'Parlamento dengeleri ayrıntılı raporlandı. Kurumun bilgi ağırlığı arttı.',
      effects: [
        { type: 'CHANGE_VARIABLE', key: 'institutionalInfluence', delta: 5 },
        { type: 'CHANGE_VARIABLE', key: 'publicSupport', delta: 1 },
      ],
    },
    right: {
      idSuffix: 'prepare-government-agenda',
      label: 'Hükûmet gündemini hazırla',
      description: 'Mevcut siyasi dengeyi veri kabul ederek kabine gündemini hızla oluştur.',
      result: 'Kabine gündemi hızla hazırlandı. İdari düzen arttı ancak değerlendirme alanı daraldı.',
      effects: [
        { type: 'CHANGE_VARIABLE', key: 'stability', delta: 4 },
        { type: 'CHANGE_VARIABLE', key: 'institutionalInfluence', delta: -2 },
      ],
    },
  },
};

export function getGermany1933FollowUpDecisionContent(eventId: string): ScenarioDecisionContent {
  return {
    prompt: 'Önceki kararınızın ardından yeni bir kurumsal değerlendirme gerekiyor. Nasıl ilerleyeceksiniz?',
    speaker: 'Takip dosyası',
    left: {
      idSuffix: 'record-follow-up',
      label: 'Sonucu kayda geçir',
      description: 'Ortaya çıkan sonucu kurumsal kayda al ve sonraki değerlendirmelerde görünür tut.',
      result: 'Takip sonucu kayda geçirildi. Kurumsal hafıza güçlendi.',
      effects: [{ type: 'CHANGE_VARIABLE', key: 'institutionalInfluence', delta: 2 }],
    },
    right: {
      idSuffix: 'close-follow-up',
      label: 'Dosyayı kapat',
      description: 'Takip değerlendirmesini tamamla ve gündemi sonraki olaya taşı.',
      result: 'Takip dosyası kapatıldı ve kurumun gündemi sonraki gelişmeye geçti.',
      effects: [{ type: 'CHANGE_VARIABLE', key: 'stability', delta: 1 }],
    },
  };
}

export function getGermany1933DecisionContent(
  eventId: string,
  eventTitle = '',
  eventSummary = '',
): ScenarioDecisionContent {
  const exact = decisions[eventId];
  if (exact) return exact;

  const context = `${eventTitle} ${eventSummary}`.toLocaleLowerCase('tr-TR');

  if (/seçim|reichstag|oy|referandum|plebisit/.test(context)) {
    return {
      prompt: '',
      speaker: 'Siyasi strateji',
      left: {
        idSuffix: 'broaden-campaign',
        label: 'Desteği genişlet',
        description: 'Daha geniş seçmen desteğine yönelen siyasi çizgiyi öne çıkar.',
        result: '',
        effects: [
          { type: 'CHANGE_VARIABLE', key: 'publicSupport', delta: 4 },
          { type: 'CHANGE_VARIABLE', key: 'institutionalInfluence', delta: -1 },
        ],
      },
      right: {
        idSuffix: 'consolidate-base',
        label: 'Tabanı koru',
        description: 'Mevcut destek tabanını ve parti örgütünü sağlamlaştırmaya ağırlık ver.',
        result: '',
        effects: [
          { type: 'CHANGE_VARIABLE', key: 'institutionalInfluence', delta: 3 },
          { type: 'CHANGE_VARIABLE', key: 'publicSupport', delta: -1 },
        ],
      },
    };
  }

  if (/parti|dap|nsdap|lider|örgüt|konferans|strasser|gençli/.test(context)) {
    return {
      prompt: '',
      speaker: 'Parti yönetimi',
      left: {
        idSuffix: 'decentralize-party',
        label: 'Yerel kadrolara alan aç',
        description: 'Yerel örgütlerin karar alanını genişlet ve parti içindeki farklı gruplarla uzlaş.',
        result: '',
        effects: [
          { type: 'CHANGE_VARIABLE', key: 'publicSupport', delta: 2 },
          { type: 'CHANGE_VARIABLE', key: 'institutionalInfluence', delta: -2 },
          { type: 'CHANGE_VARIABLE', key: 'stability', delta: 2 },
        ],
      },
      right: {
        idSuffix: 'centralize-party',
        label: 'Yönetimi merkezileştir',
        description: 'Parti kararlarını merkezde toplayarak örgütsel kontrolü artır.',
        result: '',
        effects: [
          { type: 'CHANGE_VARIABLE', key: 'institutionalInfluence', delta: 3 },
          { type: 'CHANGE_VARIABLE', key: 'stability', delta: -2 },
        ],
      },
    };
  }

  if (/pakt|anlaşma|dış politika|milletler cemiyeti|avusturya|saar|münih|uluslararası/.test(context)) {
    return {
      prompt: '',
      speaker: 'Dış politika',
      left: {
        idSuffix: 'seek-negotiation',
        label: 'Müzakereyi sürdür',
        description: 'Diplomatik görüşmeleri ve uluslararası anlaşma zeminini öne çıkar.',
        result: '',
        effects: [
          { type: 'CHANGE_VARIABLE', key: 'foreignRelations', delta: 4 },
          { type: 'CHANGE_VARIABLE', key: 'publicSupport', delta: -1 },
        ],
      },
      right: {
        idSuffix: 'take-unilateral-line',
        label: 'Tek taraflı çizgi izle',
        description: 'Dış baskıya rağmen mevcut hedefi tek taraflı siyasi adımlarla sürdür.',
        result: '',
        effects: [
          { type: 'CHANGE_VARIABLE', key: 'publicSupport', delta: 2 },
          { type: 'CHANGE_VARIABLE', key: 'foreignRelations', delta: -4 },
        ],
      },
    };
  }

  if (/savaş|işgal|asker|ordu|taarruz|muharebe|cephe|silah|ren bölgesi/.test(context)) {
    return {
      prompt: '',
      speaker: 'Kriz masası',
      left: {
        idSuffix: 'limit-escalation',
        label: 'Gerilimi sınırla',
        description: 'Siyasi ve diplomatik seçenekleri öne çıkararak gerilimin büyümesini sınırlamaya çalış.',
        result: '',
        effects: [
          { type: 'CHANGE_VARIABLE', key: 'foreignRelations', delta: 3 },
          { type: 'CHANGE_VARIABLE', key: 'stability', delta: 1 },
        ],
      },
      right: {
        idSuffix: 'maintain-course',
        label: 'Mevcut çizgiyi sürdür',
        description: 'Mevcut devlet politikasını değiştirmeden süreci devam ettir.',
        result: '',
        effects: [
          { type: 'CHANGE_VARIABLE', key: 'stability', delta: -2 },
          { type: 'CHANGE_VARIABLE', key: 'foreignRelations', delta: -3 },
        ],
      },
    };
  }

  if (/kanun|yasa|kararname|vatandaş|kamu hizmet|polis|mahkeme|hukuk|yasak/.test(context)) {
    return {
      prompt: '',
      speaker: 'Hukuk ve kurumlar',
      left: {
        idSuffix: 'protect-procedure',
        label: 'Hukuki sınırları koru',
        description: 'İşlemin mevcut hukuk ve kurumsal denetim sınırları içinde kalmasını savun.',
        result: '',
        effects: [
          { type: 'CHANGE_VARIABLE', key: 'institutionalInfluence', delta: 4 },
          { type: 'CHANGE_VARIABLE', key: 'stability', delta: -1 },
        ],
      },
      right: {
        idSuffix: 'accept-policy',
        label: 'Politikayı uygula',
        description: 'Yeni politikayı mevcut devlet mekanizması içinde uygulamaya geçir.',
        result: '',
        effects: [
          { type: 'CHANGE_VARIABLE', key: 'stability', delta: 2 },
          { type: 'CHANGE_VARIABLE', key: 'institutionalInfluence', delta: -3 },
        ],
      },
    };
  }

  if (/ekonomi|işsiz|emek|sendika|çiftlik|işletme|buhran|enflasyon/.test(context)) {
    return {
      prompt: '',
      speaker: 'İç politika',
      left: {
        idSuffix: 'social-relief',
        label: 'Toplumsal yükü azalt',
        description: 'Ekonomik ve toplumsal baskıyı azaltacak önlemlere öncelik ver.',
        result: '',
        effects: [
          { type: 'CHANGE_VARIABLE', key: 'publicSupport', delta: 3 },
          { type: 'CHANGE_VARIABLE', key: 'stability', delta: 1 },
        ],
      },
      right: {
        idSuffix: 'institutional-control',
        label: 'Merkezi politikayı sürdür',
        description: 'Ekonomik ve toplumsal alanı merkezi devlet politikasıyla yönet.',
        result: '',
        effects: [
          { type: 'CHANGE_VARIABLE', key: 'institutionalInfluence', delta: 2 },
          { type: 'CHANGE_VARIABLE', key: 'publicSupport', delta: -2 },
        ],
      },
    };
  }

  return {
    prompt: '',
    speaker: 'Siyasi gündem',
    left: {
      idSuffix: 'moderate-response',
      label: 'Temkinli hareket et',
      description: 'Gelişmenin etkilerini sınırlı ve kademeli bir siyasi tepkiyle karşıla.',
      result: '',
      effects: [
        { type: 'CHANGE_VARIABLE', key: 'stability', delta: 2 },
        { type: 'CHANGE_VARIABLE', key: 'institutionalInfluence', delta: 1 },
      ],
    },
    right: {
      idSuffix: 'assertive-response',
      label: 'Daha hızlı hareket et',
      description: 'Gelişmeye daha hızlı ve merkezi bir siyasi tepki ver.',
      result: '',
      effects: [
        { type: 'CHANGE_VARIABLE', key: 'institutionalInfluence', delta: 2 },
        { type: 'CHANGE_VARIABLE', key: 'stability', delta: -2 },
      ],
    },
  };
}
