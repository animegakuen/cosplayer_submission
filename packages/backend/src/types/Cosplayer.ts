export interface Cosplayer {
  characterName: string;
  confirmed: boolean; // Whether they have showed up to confirm their entry.
  document: string;
  email: string;
  images: string[];
  name: string; // Their identifier
  nickname: string;
  order?: number;
  origin: string; // Character's origin (i.e. Genshin Impact)
  phoneNumber: string;
}
