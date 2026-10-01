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
  'de-1933-hitler-chancellor': {
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

export function getGermany1933DecisionContent(eventId: string): ScenarioDecisionContent {
  return decisions[eventId] ?? {
    prompt: 'Bu tarihsel gelişme için kurumunuzdan bir idari tutum belirlemeniz isteniyor. Nasıl ilerleyeceksiniz?',
    speaker: 'Kabine Sekreterliği',
    left: {
      idSuffix: 'review',
      label: 'Ek değerlendirme iste',
      description: 'Karar öncesinde ek kurumsal ve hukuki değerlendirme talep et.',
      result: 'Dosya yeniden değerlendirmeye alındı. Kurumsal inceleme ağırlığı arttı.',
      effects: [{ type: 'CHANGE_VARIABLE', key: 'institutionalInfluence', delta: 3 }],
    },
    right: {
      idSuffix: 'proceed',
      label: 'Dosyayı ilerlet',
      description: 'Dosyayı mevcut idari süreç içinde bir sonraki aşamaya gönder.',
      result: 'Dosya ilerletildi. İşlem hızı arttı ancak ek inceleme yapılmadı.',
      effects: [{ type: 'CHANGE_VARIABLE', key: 'stability', delta: 2 }],
    },
  };
}
