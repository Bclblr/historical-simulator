export interface CampaignConversation {
  speaker: string;
  role?: string;
  line: string;
  portraitUri?: string;
}

const conversations: Record<string, CampaignConversation> = {
  'de-1919-dap-founded': {
    speaker: 'Anton Drexler',
    role: 'DAP kurucularından',
    line: 'Münih’te küçük bir siyasi çevre kurduk. İşçiler arasında örgütlenmek istiyoruz. Toplantılarımıza yakından bakmak ister misin?',
  },
  'de-1919-hitler-attends-dap': {
    speaker: 'Yüzbaşı Karl Mayr',
    role: 'Reichswehr görevlisi',
    line: 'Münih’te Alman İşçi Partisi adında küçük bir grup toplantı yapıyor. Toplantıya git ve çevreyi gözlemle.',
  },
  'de-1919-hitler-joins-dap': {
    speaker: 'Anton Drexler',
    role: 'DAP yöneticisi',
    line: 'Geçen toplantıdaki çıkışın dikkatimi çekti. Partimize katılmanı istiyorum. Ne dersin?',
  },
  'de-1919-first-dap-speech': {
    speaker: 'Anton Drexler',
    role: 'DAP yöneticisi',
    line: 'Bu akşam salonda konuşmanı istiyorum. İnsanlara nasıl sesleneceğine sen karar ver.',
  },
  'de-1920-party-program': {
    speaker: 'Anton Drexler',
    role: 'Parti başkanı',
    line: 'Yeni parti programını açıklayacağız. Çizgiyi daha geniş bir kitleye mi açalım, yoksa mevcut radikal programı mı koruyalım?',
  },
  'de-1920-voelkischer-beobachter': {
    speaker: 'Parti yönetiminden bir temsilci',
    role: 'Basın görüşmesi',
    line: 'Bir gazeteyi parti çevresine kazandırma fırsatı var. Yayın çizgisini doğrudan yönetim mi belirlesin?',
  },
  'de-1921-leadership-struggle': {
    speaker: 'Anton Drexler',
    role: 'Parti başkanı',
    line: 'Parti yönetimi üzerindeki anlaşmazlık büyüyor. Yetkileri paylaşarak devam edebiliriz; aksi hâlde açık bir liderlik mücadelesi başlayacak.',
  },
  'de-1921-hitler-returns-with-conditions': {
    speaker: 'Parti komitesi temsilcisi',
    role: 'Yönetim toplantısı',
    line: 'Geri dönmeni istiyoruz. Fakat parti komitesi yetkilerini korumak istiyor. Ortak yönetimi kabul edecek misin?',
  },
  'de-1932-july-election': {
    speaker: 'Gregor Strasser',
    role: 'Parti yöneticisi',
    line: 'Reichstag’ın en büyük grubuyuz. Bundan sonra daha geniş siyasi destek mi arayacağız, yoksa mevcut tabanı mı sıkılaştıracağız?',
  },
  'de-1933-reichstag-fire': {
    speaker: 'İçişleri görevlisi',
    role: 'Acil görüşme',
    line: 'Reichstag yandı. Olağanüstü önlemler masada. Hukuki inceleme mi isteyelim, yoksa dosyayı hızla ilerletelim mi?',
  },
  'de-1936-rhineland': {
    speaker: 'Dışişleri görevlisi',
    role: 'Diplomatik görüşme',
    line: 'Ren bölgesi yüzünden dış baskı artıyor. Müzakere kanallarını açık tutabiliriz. Nasıl ilerleyelim?',
  },
  'de-1939-poland-invasion': {
    speaker: 'Dış politika danışmanı',
    role: 'Kriz görüşmesi',
    line: 'Polonya krizi Avrupa çapında savaşa dönüşebilir. Gerilimi sınırlayacak diplomatik bir çıkış arayalım mı?',
  },
  'de-1941-barbarossa': {
    speaker: 'Dış politika danışmanı',
    role: 'Doğu Avrupa krizi',
    line: 'Sovyetler Birliği ile çatışmanın genişlemesi bütün savaşın yönünü değiştirecek. Tırmanmayı sınırlamaya çalışalım mı?',
  },
};

export function getCampaignConversation(
  eventId: string,
  fallbackSpeaker: string,
  fallbackLine: string,
): CampaignConversation {
  const exact = conversations[eventId];
  if (exact) return exact;

  const speakerByContext =
    /dış|diplom|pakt|uluslararası/i.test(fallbackSpeaker) ? 'Dışişleri danışmanı' :
    /hukuk|kurum|içişleri/i.test(fallbackSpeaker) ? 'Hükûmet hukuk danışmanı' :
    /kriz|asker/i.test(fallbackSpeaker) ? 'Kabine danışmanı' :
    /parti|siyasi/i.test(fallbackSpeaker) ? 'Parti yöneticisi' :
    fallbackSpeaker || 'Danışman';

  return {
    speaker: speakerByContext,
    role: 'Görüşme',
    line: fallbackLine,
  };
}
