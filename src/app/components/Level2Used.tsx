// src/app/components/Level2Used.tsx
import { ProcessedUsedImage } from "./ProcessedUsedImage"; // 新規作成したコンポーネント
import { translations, Language } from "../../data/locales";

export function Level2Used({ lang }: { lang: Language }) {
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-amber-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm shadow-2xl overflow-hidden" style={{ aspectRatio: '9/19.5', background: 'linear-gradient(to bottom, #faf8f3, #f5f1e8)' }}>
        <div className="relative h-[55%] bg-amber-50/50 overflow-hidden">
          <ProcessedUsedImage
            src="/assets/images/Prototype.png" // assetから読み込み
            alt="Used Wooden Chair"
            // object-contain に変更し、translate-y-10 で位置調整
            className="w-full h-full object-contain translate-y-10"
          />
        </div>
        <div className="h-[45%] flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="flex justify-between text-xs text-amber-800 mb-4">
              <span>15.MARCH</span>
              <span>{t.lv2_status}</span>
            </div>
            <h2 className="text-lg mb-3 text-amber-950" style={{ fontFamily: 'serif' }}>{t.lv2_story_title}</h2>
            <p className="text-sm text-amber-900 leading-relaxed mb-5" style={{ fontFamily: 'serif' }}>{t.lv2_story_text}</p>
            <div className="border-t border-amber-900/20 pt-4 mb-5">
              <h3 className="text-xs uppercase tracking-wider text-amber-800 mb-3" style={{ fontFamily: 'serif' }}>{t.lv2_info_title}</h3>
              <dl className="space-y-2.5 text-sm" style={{ fontFamily: 'serif' }}>
                <div className="flex justify-between">
                  <dt className="text-amber-900">{t.label_wood_type}</dt>
                  <dd className="text-amber-950">{t.val_wood_oak}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-amber-900">{t.label_years_used}</dt>
                  <dd className="text-amber-950">{t.val_years_2}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-amber-900">{t.label_wood_tone}</dt>
                  <dd className="text-amber-950">{t.val_tone_amber}</dd>
                </div>
              </dl>
            </div>
          </div>
          <div className="px-6 pb-5">
            <button className="w-full bg-amber-800 text-white py-3.5 text-sm transition-colors duration-200 hover:bg-amber-900" style={{ fontFamily: 'serif', letterSpacing: '0.05em' }}>{t.lv2_button}</button>
          </div>
        </div>
      </div>
    </div>
  );
}