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
  'de-1919-hitler-attends-dap': {
    prompt: '', speaker: 'Siyasi çevre',
    left: { idSuffix: 'observe-group', label: 'Mesafeyi koru', description: 'Küçük siyasi çevreyi dışarıdan izlemeyi sürdür.', result: '', effects: [{ type: 'CHANGE_VARIABLE', key: 'stability', delta: 2 }, { type: 'CHANGE_VARIABLE', key: 'institutionalInfluence', delta: -2 }] },
    right: { idSuffix: 'engage-group', label: 'Toplantılara katıl', description: 'Grubun toplantılarına düzenli katılarak siyasi çevreyle bağ kur.', result: '', effects: [{ type: 'CHANGE_VARIABLE', key: 'institutionalInfluence', delta: 2 }, { type: 'CHANGE_VARIABLE', key: 'publicSupport', delta: 1 }] },
  },
  'de-1919-hitler-joins-dap': {
    prompt: '', speaker: 'Parti çevresi',
    left: { idSuffix: 'remain-member', label: 'Arka planda kal', description: 'Üyeliği sürdür ancak parti yönetiminde hemen rol arama.', result: '', effects: [{ type: 'CHANGE_VARIABLE', key: 'stability', delta: 2 }, { type: 'CHANGE_VARIABLE', key: 'institutionalInfluence', delta: -1 }] },
    right: { idSuffix: 'seek-active-role', label: 'Aktif rol üstlen', description: 'Toplantı ve örgüt çalışmalarında daha görünür bir rol üstlen.', result: '', effects: [{ type: 'CHANGE_VARIABLE', key: 'institutionalInfluence', delta: 3 }, { type: 'CHANGE_VARIABLE', key: 'stability', delta: -1 }] },
  },
  'de-1919-first-dap-speech': {
    prompt: '', speaker: 'Toplantı salonu',
    left: { idSuffix: 'measured-speech', label: 'Ölçülü konuş', description: 'Daha geniş bir dinleyici kitlesine ulaşabilecek ölçülü bir siyasi konuşma yap.', result: '', effects: [{ type: 'CHANGE_VARIABLE', key: 'publicSupport', delta: 2 }, { type: 'CHANGE_VARIABLE', key: 'stability', delta: 1 }] },
    right: { idSuffix: 'confrontational-speech', label: 'Sert muhalefet yap', description: 'Mevcut siyasi düzene karşı daha sert ve çatışmacı bir konuşma çizgisi izle.', result: '', effects: [{ type: 'CHANGE_VARIABLE', key: 'institutionalInfluence', delta: 2 }, { type: 'CHANGE_VARIABLE', key: 'stability', delta: -2 }] },
  },
  'de-1920-party-program': {
    prompt: '', speaker: 'Program komitesi',
    left: { idSuffix: 'broaden-program', label: 'Programı genişlet', description: 'Ekonomik ve sosyal talepleri daha geniş seçmen gruplarına hitap edecek biçimde öne çıkar.', result: '', effects: [{ type: 'CHANGE_VARIABLE', key: 'publicSupport', delta: 3 }, { type: 'CHANGE_VARIABLE', key: 'institutionalInfluence', delta: -1 }] },
    right: { idSuffix: 'retain-radical-program', label: 'Radikal çizgiyi koru', description: 'Programdaki radikal milliyetçi ve dışlayıcı çizgiyi değiştirmeden koru.', result: '', effects: [{ type: 'CHANGE_VARIABLE', key: 'institutionalInfluence', delta: 2 }, { type: 'CHANGE_VARIABLE', key: 'publicSupport', delta: -2 }, { type: 'CHANGE_VARIABLE', key: 'stability', delta: -2 }] },
  },
  'de-1920-voelkischer-beobachter': {
    prompt: '', speaker: 'Parti basını',
    left: { idSuffix: 'editorial-distance', label: 'Editoryal alan bırak', description: 'Gazetenin partiyle bağını korurken editoryal karar alanını tamamen merkezileştirme.', result: '', effects: [{ type: 'CHANGE_VARIABLE', key: 'publicSupport', delta: 1 }, { type: 'CHANGE_VARIABLE', key: 'institutionalInfluence', delta: -1 }] },
    right: { idSuffix: 'central-party-paper', label: 'Merkezi yayın organı yap', description: 'Gazeteyi parti yönetiminin doğrudan siyasi yayın organı hâline getir.', result: '', effects: [{ type: 'CHANGE_VARIABLE', key: 'institutionalInfluence', delta: 3 }, { type: 'CHANGE_VARIABLE', key: 'stability', delta: -1 }] },
  },
  'de-1921-leadership-struggle': {
    prompt: '', speaker: 'Parti yönetimi',
    left: { idSuffix: 'negotiate-leadership', label: 'Uzlaşma ara', description: 'Mevcut yönetimle yetki paylaşımı ve örgüt yapısı üzerinde uzlaşma ara.', result: '', effects: [{ type: 'CHANGE_VARIABLE', key: 'stability', delta: 4 }, { type: 'CHANGE_VARIABLE', key: 'institutionalInfluence', delta: -2 }] },
    right: { idSuffix: 'challenge-leadership', label: 'Liderliğe meydan oku', description: 'Parti içindeki desteğini kullanarak yönetim değişikliği talep et.', result: '', effects: [{ type: 'CHANGE_VARIABLE', key: 'institutionalInfluence', delta: 4 }, { type: 'CHANGE_VARIABLE', key: 'stability', delta: -3 }] },
  },
  'de-1921-hitler-returns-with-conditions': {
    prompt: '', speaker: 'Parti komitesi',
    left: { idSuffix: 'shared-authority', label: 'Yetki paylaşımını kabul et', description: 'Parti komitesiyle ortak karar modelini kabul ederek liderlik krizini yatıştır.', result: '', effects: [{ type: 'CHANGE_VARIABLE', key: 'stability', delta: 4 }, { type: 'CHANGE_VARIABLE', key: 'institutionalInfluence', delta: -3 }] },
    right: { idSuffix: 'demand-chairmanship', label: 'Başkanlığı talep et', description: 'Parti liderliğini üstlenmek için geniş karar yetkisi talep et.', result: '', effects: [{ type: 'CHANGE_VARIABLE', key: 'institutionalInfluence', delta: 5 }, { type: 'CHANGE_VARIABLE', key: 'stability', delta: -3 }] },
  },
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

function variantFor(eventId: string, count: number): number {
  let hash = 0;
  for (let i = 0; i < eventId.length; i += 1) hash = (hash * 31 + eventId.charCodeAt(i)) >>> 0;
  return hash % count;
}

function choice(
  idSuffix: string,
  label: string,
  description: string,
  effects: DecisionEffect[],
): ScenarioDecisionChoice {
  return { idSuffix, label, description, result: '', effects };
}

export function getGermany1933DecisionContent(
  eventId: string,
  eventTitle = '',
  eventSummary = '',
): ScenarioDecisionContent {
  const exact = decisions[eventId];
  if (exact) return exact;

  const context = `${eventTitle} ${eventSummary}`.toLocaleLowerCase('tr-TR');

  if (/yahudi|ayrım|dışlan|kısırlaştır|toplama kamp|pogrom|katliam|ırkçı/.test(context)) {
    const variants: ScenarioDecisionContent[] = [
      { prompt: '', speaker: 'Hükûmet hukuk danışmanı',
        left: choice('challenge-discriminatory-policy','İtirazı kayda geçir','Ayrımcı uygulamaya hukuki ve kurumsal itirazı resmî kayda geçir.',[{type:'CHANGE_VARIABLE',key:'institutionalInfluence',delta:3},{type:'CHANGE_VARIABLE',key:'stability',delta:-1}]),
        right: choice('seek-limitation','Uygulamayı sınırla','Politikanın kapsamını daraltacak hukuki ve idari sınırlar ara.',[{type:'CHANGE_VARIABLE',key:'stability',delta:1},{type:'CHANGE_VARIABLE',key:'institutionalInfluence',delta:2}]) },
      { prompt: '', speaker: 'Adalet Bakanlığı görevlisi',
        left: choice('request-court-review','Yargı incelemesi iste','Düzenlemenin hukuki dayanağının bağımsız biçimde incelenmesini talep et.',[{type:'CHANGE_VARIABLE',key:'institutionalInfluence',delta:4},{type:'CHANGE_VARIABLE',key:'stability',delta:-2}]),
        right: choice('document-objections','İtirazları belgelet','Kurumların ve etkilenen kesimlerin itirazlarını dosyada görünür tut.',[{type:'CHANGE_VARIABLE',key:'publicSupport',delta:2},{type:'CHANGE_VARIABLE',key:'institutionalInfluence',delta:2}]) },
    ];
    return variants[variantFor(eventId, variants.length)];
  }

  if (/seçim|reichstag|oy|referandum|plebisit/.test(context)) {
    const variants: ScenarioDecisionContent[] = [
      { prompt:'', speaker:'Seçim danışmanı',
        left:choice('seek-cross-party-talks','Diğer gruplarla görüş','Parlamentodaki diğer gruplarla sınırlı iş birliği zemini ara.',[{type:'CHANGE_VARIABLE',key:'institutionalInfluence',delta:2},{type:'CHANGE_VARIABLE',key:'stability',delta:2}]),
        right:choice('focus-electorate','Seçmene dön','Yeni parlamento pazarlığı yerine seçmen desteğini büyütmeye odaklan.',[{type:'CHANGE_VARIABLE',key:'publicSupport',delta:4},{type:'CHANGE_VARIABLE',key:'institutionalInfluence',delta:-1}]) },
      { prompt:'', speaker:'Parlamento danışmanı',
        left:choice('accept-parliamentary-compromise','Uzlaşma zemini ara','Mecliste çoğunluk sağlayacak sınırlı bir program üzerinde görüş.',[{type:'CHANGE_VARIABLE',key:'stability',delta:3},{type:'CHANGE_VARIABLE',key:'publicSupport',delta:1}]),
        right:choice('remain-opposition','Muhalefette kal','Hükûmet pazarlığına girmeden siyasi muhalefeti sürdür.',[{type:'CHANGE_VARIABLE',key:'publicSupport',delta:2},{type:'CHANGE_VARIABLE',key:'institutionalInfluence',delta:-2}]) },
      { prompt:'', speaker:'Yerel teşkilat temsilcisi',
        left:choice('invest-local-network','Yerel örgütlere yönel','Ulusal pazarlık yerine yerel siyasi ağları güçlendirmeye kaynak ayır.',[{type:'CHANGE_VARIABLE',key:'publicSupport',delta:3},{type:'CHANGE_VARIABLE',key:'stability',delta:1}]),
        right:choice('prioritize-reichstag','Reichstag’a odaklan','Siyasi enerjiyi parlamento grubunun etkisini artırmaya yönelt.',[{type:'CHANGE_VARIABLE',key:'institutionalInfluence',delta:3},{type:'CHANGE_VARIABLE',key:'publicSupport',delta:-1}]) },
    ];
    return variants[variantFor(eventId, variants.length)];
  }

  if (/parti|dap|nsdap|lider|örgüt|konferans|strasser|gençli/.test(context)) {
    const variants: ScenarioDecisionContent[] = [
      { prompt:'', speaker:'Parti komitesi üyesi',
        left:choice('share-organizational-power','Yetkiyi paylaş','Yerel yöneticilere daha fazla karar alanı bırak.',[{type:'CHANGE_VARIABLE',key:'stability',delta:3},{type:'CHANGE_VARIABLE',key:'institutionalInfluence',delta:-2}]),
        right:choice('tighten-headquarters','Merkezi güçlendir','Örgütsel kararları genel merkezde daha sıkı koordine et.',[{type:'CHANGE_VARIABLE',key:'institutionalInfluence',delta:3},{type:'CHANGE_VARIABLE',key:'stability',delta:-2}]) },
      { prompt:'', speaker:'Bölge teşkilatı temsilcisi',
        left:choice('consult-regions','Bölgeleri dinle','Bölge örgütlerinin taleplerini karar sürecine daha fazla kat.',[{type:'CHANGE_VARIABLE',key:'publicSupport',delta:2},{type:'CHANGE_VARIABLE',key:'stability',delta:2}]),
        right:choice('enforce-common-line','Ortak çizgi iste','Bütün teşkilatlardan aynı örgütsel çizgiyi izlemesini talep et.',[{type:'CHANGE_VARIABLE',key:'institutionalInfluence',delta:3},{type:'CHANGE_VARIABLE',key:'publicSupport',delta:-1}]) },
      { prompt:'', speaker:'Parti mali işler görevlisi',
        left:choice('prioritize-membership','Üyeliği büyüt','Kaynakları yeni üye ve yerel toplantılara yönelt.',[{type:'CHANGE_VARIABLE',key:'publicSupport',delta:3},{type:'CHANGE_VARIABLE',key:'institutionalInfluence',delta:-1}]),
        right:choice('professionalize-office','Merkezi büroyu kur','Kaynakları profesyonel bir genel merkez yapısına yönelt.',[{type:'CHANGE_VARIABLE',key:'institutionalInfluence',delta:3},{type:'CHANGE_VARIABLE',key:'stability',delta:1}]) },
    ];
    return variants[variantFor(eventId, variants.length)];
  }

  if (/pakt|anlaşma|dış politika|milletler cemiyeti|avusturya|saar|münih|uluslararası/.test(context)) {
    const variants: ScenarioDecisionContent[] = [
      { prompt:'', speaker:'Dışişleri danışmanı',
        left:choice('open-bilateral-talks','İkili görüşme aç','Karşı tarafla doğrudan diplomatik görüşme kanalı aç.',[{type:'CHANGE_VARIABLE',key:'foreignRelations',delta:4},{type:'CHANGE_VARIABLE',key:'stability',delta:1}]),
        right:choice('seek-multilateral-forum','Çok taraflı görüş','Konuyu daha geniş bir uluslararası görüşme zeminine taşı.',[{type:'CHANGE_VARIABLE',key:'foreignRelations',delta:3},{type:'CHANGE_VARIABLE',key:'institutionalInfluence',delta:1}]) },
      { prompt:'', speaker:'Büyükelçilik temsilcisi',
        left:choice('offer-compromise','Taviz paketi sun','Krizi düşürecek sınırlı bir diplomatik uzlaşma öner.',[{type:'CHANGE_VARIABLE',key:'foreignRelations',delta:4},{type:'CHANGE_VARIABLE',key:'publicSupport',delta:-1}]),
        right:choice('delay-decision','Kararı ertele','Yeni bilgi gelene kadar bağlayıcı adımı ertele.',[{type:'CHANGE_VARIABLE',key:'stability',delta:2},{type:'CHANGE_VARIABLE',key:'foreignRelations',delta:1}]) },
      { prompt:'', speaker:'Dışişleri müsteşarı',
        left:choice('reassure-neighbors','Komşulara güvence ver','Komşu devletlerin kaygılarını azaltacak diplomatik güvence hazırla.',[{type:'CHANGE_VARIABLE',key:'foreignRelations',delta:4},{type:'CHANGE_VARIABLE',key:'institutionalInfluence',delta:-1}]),
        right:choice('keep-options-open','Seçenekleri açık tut','Bağlayıcı taahhüt vermeden görüşmeleri sürdür.',[{type:'CHANGE_VARIABLE',key:'institutionalInfluence',delta:2},{type:'CHANGE_VARIABLE',key:'foreignRelations',delta:-1}]) },
    ];
    return variants[variantFor(eventId, variants.length)];
  }

  if (/savaş|işgal|asker|ordu|taarruz|muharebe|cephe|silah|ren bölgesi/.test(context)) {
    const variants: ScenarioDecisionContent[] = [
      { prompt:'', speaker:'Kabine danışmanı',
        left:choice('pursue-deescalation','Tırmanmayı durdur','Askerî gerilimin büyümesini sınırlayacak siyasi seçenekleri araştır.',[{type:'CHANGE_VARIABLE',key:'foreignRelations',delta:3},{type:'CHANGE_VARIABLE',key:'stability',delta:2}]),
        right:choice('request-diplomatic-channel','Diplomatik kanal aç','Krizi askerî genişleme yerine doğrudan görüşmeye taşı.',[{type:'CHANGE_VARIABLE',key:'foreignRelations',delta:4},{type:'CHANGE_VARIABLE',key:'institutionalInfluence',delta:1}]) },
      { prompt:'', speaker:'Dış politika danışmanı',
        left:choice('seek-ceasefire-contact','Temas ara','Çatışmanın kapsamını azaltabilecek temas imkânlarını araştır.',[{type:'CHANGE_VARIABLE',key:'foreignRelations',delta:4},{type:'CHANGE_VARIABLE',key:'stability',delta:1}]),
        right:choice('prioritize-defense','Savunmaya çekil','Yeni genişleme yerine mevcut sınırların savunulmasına öncelik ver.',[{type:'CHANGE_VARIABLE',key:'stability',delta:3},{type:'CHANGE_VARIABLE',key:'publicSupport',delta:-1}]) },
      { prompt:'', speaker:'Sivil idare temsilcisi',
        left:choice('protect-civilian-administration','Sivil idareyi koru','Kriz kararlarında sivil kurumların çalışmasını sürdürmeye öncelik ver.',[{type:'CHANGE_VARIABLE',key:'stability',delta:3},{type:'CHANGE_VARIABLE',key:'institutionalInfluence',delta:2}]),
        right:choice('request-political-review','Siyasi inceleme iste','Yeni askerî adımlardan önce kabine düzeyinde siyasi değerlendirme talep et.',[{type:'CHANGE_VARIABLE',key:'institutionalInfluence',delta:3},{type:'CHANGE_VARIABLE',key:'foreignRelations',delta:2}]) },
    ];
    return variants[variantFor(eventId, variants.length)];
  }

  if (/kanun|yasa|kararname|vatandaş|kamu hizmet|polis|mahkeme|hukuk|yasak/.test(context)) {
    const variants: ScenarioDecisionContent[] = [
      { prompt:'', speaker:'Hükûmet hukuk danışmanı',
        left:choice('request-constitutional-review','Anayasal inceleme iste','Düzenlemenin yetki ve temel hak sınırlarını incelet.',[{type:'CHANGE_VARIABLE',key:'institutionalInfluence',delta:4},{type:'CHANGE_VARIABLE',key:'stability',delta:-1}]),
        right:choice('narrow-administration','Kapsamı daralt','İdari uygulamanın kapsamını mümkün olduğunca sınırlı tut.',[{type:'CHANGE_VARIABLE',key:'stability',delta:2},{type:'CHANGE_VARIABLE',key:'institutionalInfluence',delta:2}]) },
      { prompt:'', speaker:'Adalet Bakanlığı görevlisi',
        left:choice('require-written-basis','Yazılı gerekçe iste','Her uygulama için açık hukuki dayanak ve yazılı gerekçe talep et.',[{type:'CHANGE_VARIABLE',key:'institutionalInfluence',delta:4},{type:'CHANGE_VARIABLE',key:'stability',delta:1}]),
        right:choice('send-to-committee','Komisyona gönder','Düzenlemeyi uygulamadan önce kurumlar arası komisyona gönder.',[{type:'CHANGE_VARIABLE',key:'stability',delta:2},{type:'CHANGE_VARIABLE',key:'institutionalInfluence',delta:2}]) },
      { prompt:'', speaker:'Kamu idaresi görevlisi',
        left:choice('preserve-appeal','İtiraz yolunu koru','İşlemden etkilenenler için idari itiraz yolunu açık tut.',[{type:'CHANGE_VARIABLE',key:'publicSupport',delta:2},{type:'CHANGE_VARIABLE',key:'institutionalInfluence',delta:3}]),
        right:choice('audit-implementation','Uygulamayı denetle','Yerel uygulamaların hukuki sınırları aşıp aşmadığını denetlet.',[{type:'CHANGE_VARIABLE',key:'institutionalInfluence',delta:3},{type:'CHANGE_VARIABLE',key:'stability',delta:2}]) },
    ];
    return variants[variantFor(eventId, variants.length)];
  }

  if (/ekonomi|işsiz|emek|sendika|çiftlik|işletme|buhran|enflasyon/.test(context)) {
    const variants: ScenarioDecisionContent[] = [
      { prompt:'', speaker:'Ekonomi danışmanı',
        left:choice('target-unemployment','İşsizliğe odaklan','Kaynakları doğrudan işsizliği azaltacak programlara yönelt.',[{type:'CHANGE_VARIABLE',key:'publicSupport',delta:3},{type:'CHANGE_VARIABLE',key:'stability',delta:2}]),
        right:choice('stabilize-budget','Bütçeyi dengele','Kısa vadeli destek yerine kamu maliyesini istikrara kavuşturmaya öncelik ver.',[{type:'CHANGE_VARIABLE',key:'institutionalInfluence',delta:2},{type:'CHANGE_VARIABLE',key:'publicSupport',delta:-1}]) },
      { prompt:'', speaker:'Çalışma Bakanlığı görevlisi',
        left:choice('protect-labor-dialogue','Çalışma diyaloğunu koru','İşçi ve işveren temsilcileriyle kurumsal müzakereyi sürdür.',[{type:'CHANGE_VARIABLE',key:'stability',delta:3},{type:'CHANGE_VARIABLE',key:'publicSupport',delta:2}]),
        right:choice('fund-public-works','Kamu işlerini artır','İstihdam için kamu altyapı harcamalarını artır.',[{type:'CHANGE_VARIABLE',key:'publicSupport',delta:3},{type:'CHANGE_VARIABLE',key:'institutionalInfluence',delta:1}]) },
      { prompt:'', speaker:'Maliye görevlisi',
        left:choice('support-households','Haneleri destekle','Ekonomik krizin haneler üzerindeki baskısını azaltacak destek hazırla.',[{type:'CHANGE_VARIABLE',key:'publicSupport',delta:4},{type:'CHANGE_VARIABLE',key:'stability',delta:1}]),
        right:choice('support-local-government','Yerel bütçeleri destekle','Kriz yükünü taşıyan yerel yönetimlere mali destek aktar.',[{type:'CHANGE_VARIABLE',key:'stability',delta:3},{type:'CHANGE_VARIABLE',key:'institutionalInfluence',delta:1}]) },
    ];
    return variants[variantFor(eventId, variants.length)];
  }

  const general: ScenarioDecisionContent[] = [
    { prompt:'', speaker:'Kabine danışmanı',
      left:choice('request-more-information','Daha fazla bilgi iste','Karardan önce ilgili kurumlardan ek bilgi ve değerlendirme iste.',[{type:'CHANGE_VARIABLE',key:'institutionalInfluence',delta:2},{type:'CHANGE_VARIABLE',key:'stability',delta:1}]),
      right:choice('delegate-review','Danışmana bırak','Konuyu uzman bir danışmana inceletip sonraki görüşmeye taşı.',[{type:'CHANGE_VARIABLE',key:'stability',delta:2},{type:'CHANGE_VARIABLE',key:'institutionalInfluence',delta:1}]) },
    { prompt:'', speaker:'Yerel yönetim temsilcisi',
      left:choice('hear-local-view','Yerel görüşü dinle','Karardan önce yerel kurumların değerlendirmesini al.',[{type:'CHANGE_VARIABLE',key:'publicSupport',delta:2},{type:'CHANGE_VARIABLE',key:'stability',delta:1}]),
      right:choice('convene-cabinet','Kabineyi topla','Konuyu tek başına kararlaştırmak yerine kabine gündemine taşı.',[{type:'CHANGE_VARIABLE',key:'institutionalInfluence',delta:2},{type:'CHANGE_VARIABLE',key:'stability',delta:2}]) },
    { prompt:'', speaker:'Siyasi danışman',
      left:choice('seek-public-feedback','Kamu tepkisini ölç','Yeni adım atmadan önce toplumdaki tepkiyi değerlendirmeye çalış.',[{type:'CHANGE_VARIABLE',key:'publicSupport',delta:3},{type:'CHANGE_VARIABLE',key:'institutionalInfluence',delta:-1}]),
      right:choice('seek-institutional-consensus','Kurumlarla uzlaş','İlgili devlet kurumları arasında ortak bir yaklaşım oluşturmaya çalış.',[{type:'CHANGE_VARIABLE',key:'institutionalInfluence',delta:3},{type:'CHANGE_VARIABLE',key:'stability',delta:1}]) },
  ];
  return general[variantFor(eventId, general.length)];
}
