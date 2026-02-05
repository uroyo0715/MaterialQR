export type Language = 'ja' | 'en';

type LocalizedString = { ja: string; en: string };

interface VariationData {
  url: string;      // 機能1: 樹種によって変化するURL
  musicId: string;  // 機能3: 木材の印象によって変化する音楽ID
}

interface ProductData {
  name: LocalizedString;
  variations: Record<string, VariationData>; 
}

export const masterDatabase: Record<string, ProductData> = {
    "ITEM_001": {
        name: {
            ja: "Chair 009",
            en: "Chair 009"
        },
        variations: {
            sugi: { 
                url: "https://www.fun.ac.jp/",
                musicId: "SONG_001" 
            },
            kurumi: { 
                url: "https://hy-ma.com/",
                musicId: "SONG_001" 
            },
            kiri: { 
                url: "https://jlc3dp.com/jp/3d-printing-quote",
                musicId: "SONG_001" 
            },
            default: { 
                url: "https://chatgpt.com/", 
                musicId: "SONG_001" 
            }
        }
    }
};