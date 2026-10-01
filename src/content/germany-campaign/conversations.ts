export interface CampaignConversation {
  speaker: string;
  role?: string;
  line: string;
  portraitUri?: string;
}

const conversations: Record<string, CampaignConversation> = {
  'career-1919-mayr-assignment': { speaker: 'Yüzbaşı Karl Mayr', role: 'Eski birlik bağlantın', line: 'Savaş bitti ama ordunun siyasi çevreleri takip edecek adamlara ihtiyacı var. Bir süre benimle çalışmak ister misin?' },
  'career-1919-civilian-future': { speaker: 'Friedrich', role: 'Eski asker arkadaşın', line: 'Bu geçici görevler sonsuza kadar sürmez. Sana düzenli bir iş bulabilirim. Sivil hayata dönmeyi düşünmüyor musun?' },
  'career-1919-beerhall-contact': { speaker: 'Georg', role: 'Yeni tanıştığın örgütçü', line: 'Bu akşam küçük bir siyasi grup buluşuyor. Büyük isimler yok; sadece tartışma. Benimle gelir misin?' },
  'career-1919-money-problem': { speaker: 'Anna', role: 'Pansiyon görevlisi', line: 'Bu ay hesabın yine gecikti. Düzenli para kazanacağın bir iş bulmalısın. Yoksa bu toplantılar sana para mı kazandıracak?' },
  'career-1919-small-speech': { speaker: 'Georg', role: 'Toplantı düzenleyicisi', line: 'İnsanlar seni dinliyor. Bu akşam birkaç dakika konuş. Ama ne kadar öne çıkacağına sen karar ver.' },
  'career-1919-newspaper-contact': { speaker: 'Ernst Keller', role: 'Yerel gazeteci', line: 'Bu küçük siyasi toplantılar hakkında bir yazı hazırlıyorum. Bana konuşursan adını da anabilirim. İster misin?' },
  'career-1920-organizer-offer': { speaker: 'Anton Drexler', role: 'Parti yöneticisi', line: 'Toplantılara gelen insan sayısı artıyor. Program kadar organizasyon da önemli. Bu işi üstlenir misin?' },
  'career-1920-rival-organizer': { speaker: 'Otto', role: 'Parti örgütçüsü', line: 'Her toplantıda senin sözün geçmeye başladı. Bu örgüt tek kişinin çevresinde dönmemeli. Yetkileri paylaşalım mı?' },
  'career-1920-donor-meeting': { speaker: 'Bay Hartmann', role: 'İş insanı', line: 'Salon ve baskı masraflarınıza yardım edebilirim. Karşılığında önemli toplantılarda beni de dinlemenizi isterim.' },
  'career-1921-leadership-allies': { speaker: 'Yakın parti yöneticisi', role: 'Siyasi müttefikin', line: 'Yönetimde değişim isteyenler var. Seni destekleyebilirim. Ama başa geçersen komiteyle yetki paylaşacak mısın?' },
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
