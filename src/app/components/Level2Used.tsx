import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

export function Level2Used() {
  return (
    <div className="min-h-screen bg-amber-100 flex items-center justify-center p-4">
      {/* スマホフレーム風のコンテナ */}
      <div 
        className="w-full max-w-sm shadow-2xl overflow-hidden" 
        style={{ 
          aspectRatio: '9/19.5',
          background: 'linear-gradient(to bottom, #faf8f3, #f5f1e8)',
        }}
      >
        {/* 椅子の画像 */}
        <div className="relative h-[55%] bg-amber-50/50">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1648994517760-19afc8c7ba00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b29kZW4lMjBjaGFpcnxlbnwxfHx8fDE3NzAwMjkwNzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Used Wooden Chair"
            className="w-full h-full object-cover"
            style={{ filter: 'sepia(0.15) saturate(1.1) brightness(0.95) contrast(1.05)' }}
          />
        </div>

        {/* コンテンツエリア（スクロール可能） */}
        <div className="h-[45%] flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {/* 日付とステータス */}
            <div className="flex justify-between text-xs text-amber-800 mb-4">
              <span>15.MARCH</span>
              <span>Status: USED (Lv.2)</span>
            </div>

            {/* タイトル */}
            <h2 className="text-lg mb-3 text-amber-950" style={{ fontFamily: 'serif' }}>
              Story: The Craftsman's Secret
            </h2>

            {/* 説明文 */}
            <p className="text-sm text-amber-900 leading-relaxed mb-5" style={{ fontFamily: 'serif' }}>
              With a unique patina technique to the wood's natural grain and these years, crafted by artisan wood master. This chair has developed its own personality and the experience of his teachings through which the history of craftsman the unique quality.
            </p>

            {/* 詳細情報 */}
            <div className="border-t border-amber-900/20 pt-4 mb-5">
              <h3 className="text-xs uppercase tracking-wider text-amber-800 mb-3" style={{ fontFamily: 'serif' }}>
                Time Passage
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
                  <dt className="text-amber-900">Years Used</dt>
                  <dd className="text-amber-950">Approx. 2 Years</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-amber-900">Wood Tone</dt>
                  <dd className="text-amber-950">Rich Amber Patina</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-amber-900">Seat Comfort</dt>
                  <dd className="text-amber-950">Body-Fitted</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-amber-900">Condition</dt>
                  <dd className="text-amber-950">Excellent</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* ボタン */}
          <div className="px-6 pb-5">
            <button 
              className="w-full bg-amber-800 text-white py-3.5 text-sm transition-colors duration-200 hover:bg-amber-900"
              style={{ fontFamily: 'serif', letterSpacing: '0.05em' }}
            >
              Maintenance Tips
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}