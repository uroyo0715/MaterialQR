import { ImageWithFallback } from "./figma/ImageWithFallback";
import { translations, Language } from "../../data/locales";

export function Level3Vintage({ lang }: { lang: Language }) {
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-amber-200 flex items-center justify-center p-4">
      <div className="w-full max-w-sm shadow-2xl overflow-hidden" 
        style={{ 
          aspectRatio: '9/19.5',
          background: 'linear-gradient(135deg, #e8dcc5 0%, #d4c4a8 50%, #c4ad89 100%)',
          backgroundBlendMode: 'multiply',
        }}
      >
        <div className="relative h-[55%]" style={{ background: '#d4c4a8' }}>
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1648994517760-19afc8c7ba00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b29kZW4lMjBjaGFpcnxlbnwxfHx8fDE3NzAwMjkwNzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Vintage Wooden Chair"
            className="w-full h-full object-cover"
            style={{ filter: 'sepia(0.6) contrast(1.15) brightness(0.85) saturate(0.7) hue-rotate(-5deg)' }}
          />
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 70% 20%, rgba(139,69,19,0.2) 0%, transparent 40%)' }} />
        </div>
        <div className="h-[45%] flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="flex justify-between text-xs text-amber-900 mb-4">
              <span>08.AUGUST</span>
              <span>{t.lv3_status}</span>
            </div>
            <h2 className="text-lg mb-3 text-amber-950" style={{ fontFamily: 'serif' }}>{t.lv3_story_title}</h2>
            <p className="text-sm text-amber-950 leading-relaxed mb-5" style={{ fontFamily: 'serif' }}>{t.lv3_story_text}</p>
            <div className="border-t border-amber-950/30 pt-4 mb-5">
              <h3 className="text-xs uppercase tracking-wider text-amber-900 mb-3" style={{ fontFamily: 'serif' }}>{t.lv3_info_title}</h3>
              <dl className="space-y-2.5 text-sm" style={{ fontFamily: 'serif' }}>
                <div className="flex justify-between">
                  <dt className="text-amber-900">{t.label_wood_type}</dt>
                  <dd className="text-amber-950">{t.val_wood_oak}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-amber-900">{t.label_years_used}</dt>
                  <dd className="text-amber-950">{t.val_years_10}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-amber-900">{t.label_aging_beauty}</dt>
                  <dd className="text-amber-950">{t.val_tone_amber_deep}</dd>
                </div>
              </dl>
            </div>
          </div>
          <div className="px-6 pb-5">
            <button className="w-full text-white py-3.5 text-sm transition-all duration-200 hover:brightness-110" style={{ fontFamily: 'serif', letterSpacing: '0.05em', background: 'linear-gradient(to bottom, #92400e, #78350f)' }}>{t.lv3_button}</button>
          </div>
        </div>
      </div>
    </div>
  );
}