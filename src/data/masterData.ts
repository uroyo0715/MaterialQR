type LocalizedString = { ja: string; en: string };

interface VariationData {
  url: string;
  musicId: string;
}

interface ProductData {
  name: LocalizedString;
  variations: {
    sugi: VariationData;
    kurumi: VariationData;
    kiri: VariationData;
    default: VariationData;
  };
}

export const masterDatabase: Record<string, ProductData> = {
    // QRコードの中身は "ITEM_001" (ダブルクォートなし) で作成
    "ITEM_001": {
        name: {
            ja: "ヴィンテージ オークチェア",
            en: "Vintage Oak Chair"
        },
        variations: {
            sugi: { 
                url: "https://example.com/new", 
                musicId: "SONG_001" 
            },
            kurumi: { 
                url: "https://example.com/used", 
                musicId: "SONG_001" 
            },
            kiri: { 
                url: "https://example.com/vintage", 
                musicId: "SONG_001" 
            },
            default: { 
                url: "https://example.com", 
                musicId: "SONG_001" 
            }
        }
    }
};