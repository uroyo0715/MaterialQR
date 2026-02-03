import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

export function Level3Vintage() {
  return (
    <div className="min-h-screen bg-amber-200 flex items-center justify-center p-4">
      {/* スマホフレーム風のコンテナ */}
      <div 
        className="w-full max-w-sm shadow-2xl overflow-hidden" 
        style={{ 
          aspectRatio: '9/19.5',
          background: 'linear-gradient(135deg, #e8dcc5 0%, #d4c4a8 50%, #c4ad89 100%)',
          backgroundImage: `
            linear-gradient(135deg, #e8dcc5 0%, #d4c4a8 50%, #c4ad89 100%),
            url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")
          `,
          backgroundBlendMode: 'multiply',
        }}
      >
        {/* 椅子の画像（セピア調） */}
        <div className="relative h-[55%]" style={{ background: '#d4c4a8' }}>
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1648994517760-19afc8c7ba00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b29kZW4lMjBjaGFpcnxlbnwxfHx8fDE3NzAwMjkwNzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Vintage Wooden Chair"
            className="w-full h-full object-cover"
            style={{ filter: 'sepia(0.6) contrast(1.15) brightness(0.85) saturate(0.7) hue-rotate(-5deg)' }}
          />
          {/* 古い写真の汚れ効果 */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 70% 20%, rgba(139,69,19,0.2) 0%, transparent 40%)',
            }}
          />
        </div>

        {/* コンテンツエリア（スクロール可能） */}
        <div className="h-[45%] flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {/* 日付とステータス */}
            <div className="flex justify-between text-xs text-amber-900 mb-4">
              <span>08.AUGUST</span>
              <span>Status: VINTAGE (Lv.3)</span>
            </div>

            {/* タイトル */}
            <h2 className="text-lg mb-3 text-amber-950" style={{ fontFamily: 'serif' }}>
              Story: Thank You for the Journey
            </h2>

            {/* 説明文 */}
            <p className="text-sm text-amber-950 leading-relaxed mb-5" style={{ fontFamily: 'serif' }}>
              We logged the oak eloquent you with of our life and the hope you love the stories held of our family's chair. The chair that travel with personal history, ready for a timeless again.
            </p>

            {/* 詳細情報 */}
            <div className="border-t border-amber-950/30 pt-4 mb-5">
              <h3 className="text-xs uppercase tracking-wider text-amber-900 mb-3" style={{ fontFamily: 'serif' }}>
                Vintage Heritage
              </h3>
              <dl className="space-y-2.5 text-sm" style={{ fontFamily: 'serif' }}>
                <div className="flex justify-between">
                  <dt className="text-amber-900">Wood Type</dt>
                  <dd className="text-amber-950">Solid Oak</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-amber-900">Designer</dt>
                  <dd className="text-amber-950">XXX</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-amber-900">Manufactured</dt>
                  <dd className="text-amber-950">January 2016</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-amber-900">Years Used</dt>
                  <dd className="text-amber-950">Over 10 Years</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-amber-900">Aging Beauty</dt>
                  <dd className="text-amber-950">Deep Amber Hue</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-amber-900">Character</dt>
                  <dd className="text-amber-950">Unique Luster</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-amber-900">Value</dt>
                  <dd className="text-amber-950">One-of-a-Kind</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* ボタン */}
          <div className="px-6 pb-5">
            <button 
              className="w-full text-white py-3.5 text-sm transition-all duration-200 hover:brightness-110"
              style={{ 
                fontFamily: 'serif', 
                letterSpacing: '0.05em',
                background: 'linear-gradient(to bottom, #92400e, #78350f)',
              }}
            >
              Share Your Story
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}