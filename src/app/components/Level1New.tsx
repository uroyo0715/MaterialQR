import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

export function Level1New() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* スマホフレーム風のコンテナ */}
      <div className="w-full max-w-sm bg-white shadow-2xl overflow-hidden" style={{ aspectRatio: '9/19.5' }}>
        {/* 椅子の画像 */}
        <div className="relative h-[55%] bg-gray-50">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1648994517760-19afc8c7ba00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b29kZW4lMjBjaGFpcnxlbnwxfHx8fDE3NzAwMjkwNzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Modern Wooden Chair"
            className="w-full h-full object-cover"
          />
        </div>

        {/* コンテンツエリア（スクロール可能） */}
        <div className="h-[45%] flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {/* 日付とステータス */}
            <div className="flex justify-between text-xs text-gray-500 mb-4">
              <span>01.JANUARY</span>
              <span>Status: NEW (Lv.1)</span>
            </div>

            {/* タイトル */}
            <h2 className="text-lg mb-3 text-gray-900" style={{ fontFamily: 'serif' }}>
              Story: About This Chair
            </h2>

            {/* 説明文 */}
            <p className="text-sm text-gray-700 leading-relaxed mb-5" style={{ fontFamily: 'serif' }}>
              This oak isassemble for assembly A unique piece of his oak, wit designed to last a lifetime an bring comfort and elegance to your space. Handcrafted by skilled artisans, this chair embodies timeless quality.
            </p>

            {/* 詳細情報 */}
            <div className="border-t border-gray-200 pt-4 mb-5">
              <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-3" style={{ fontFamily: 'serif' }}>
                Product Information
              </h3>
              <dl className="space-y-2.5 text-sm" style={{ fontFamily: 'serif' }}>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Wood Type</dt>
                  <dd className="text-gray-900">Solid Oak</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Designer</dt>
                  <dd className="text-gray-900">XXX</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Manufactured</dt>
                  <dd className="text-gray-900">January 2026</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Finish</dt>
                  <dd className="text-gray-900">Natural Oil</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Warranty</dt>
                  <dd className="text-gray-900">5 Years</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* ボタン */}
          <div className="px-6 pb-5">
            <button 
              className="w-full bg-gray-900 text-white py-3.5 text-sm transition-colors duration-200 hover:bg-gray-800"
              style={{ fontFamily: 'serif', letterSpacing: '0.05em' }}
            >
              Register Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}