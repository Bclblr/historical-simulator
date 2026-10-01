export interface CampaignEventImage {
  uri: string;
  credit: string;
}

const images: Record<string, CampaignEventImage> = {
  'de-1919-hitler-attends-dap': {
    uri: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/DAP-Memberslist.jpg?width=900',
    credit: 'Berlin Document Center / Wikimedia Commons',
  },
  'de-1919-hitler-joins-dap': {
    uri: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/DAP-Memberslist.jpg?width=900',
    credit: 'Berlin Document Center / Wikimedia Commons',
  },
  'de-1920-party-program': {
    uri: 'https://www.nsdoku.de/fileadmin/09_Lernen_Entdecken/Lernforum_Bibliothek/Lexikon/4_04_009_01.jpg',
    credit: 'NS-Dokumentationszentrum München',
  },
  'de-1933-reichstag-fire': {
    uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Reichstag_fire_1933.jpg/800px-Reichstag_fire_1933.jpg',
    credit: 'Wikimedia Commons',
  },
  'de-1945-berlin-battle': {
    uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Reichstag_after_the_allied_bombing_of_Berlin.jpg/800px-Reichstag_after_the_allied_bombing_of_Berlin.jpg',
    credit: 'Wikimedia Commons',
  },
};

export function getCampaignEventImage(eventId: string): CampaignEventImage | null {
  return images[eventId] ?? null;
}
