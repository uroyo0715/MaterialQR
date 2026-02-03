export type Language = 'ja' | 'en';

export const translations = {
  ja: {
    app_title: "QR Texture App",
    mode_select: "モード選択",
    mode_url: "🔗 URL変化",
    mode_aging: "🌲 経年変化",
    mode_music: "🎵 音楽変化",
    camera_permission: "※カメラの使用許可が必要です",
    
    scan_guide: "対象とQRを枠に入れて\nボタンを押してください",
    scan_analyzing: "解析中...",
    scan_back: "ホームへ戻る",
    scan_cancel: "キャンセル",
    scan_rescan: "再スキャン",
    scan_open_page: "ページを開く",
    scan_item_unknown: "未登録のアイテムです",
    scan_qr_missing: "QRコードが見つかりません",
    
    music_waiting: "QRコードをかざしてください",
    music_playing: "再生中",
    music_detected: "検知",
    
    // Level 1
    lv1_status: "状態: 新品 (Lv.1)",
    lv1_story_title: "ストーリー: この椅子について",
    lv1_story_text: "最高級のオーク材を使用し、職人の手によって組み立てられました。あなたの生活に寄り添い、共に時を刻む準備ができています。",
    lv1_info_title: "製品情報",
    lv1_button: "製品登録する",
    
    // Level 2
    lv2_status: "状態: ユーズド (Lv.2)",
    lv2_story_title: "ストーリー: 職人の秘密",
    lv2_story_text: "木目の美しさを引き出す独自の仕上げと数年の時を経て、この椅子は独自の個性を持ち始めました。職人の手仕事と時間の経過が、唯一無二の品質を生み出しています。",
    lv2_info_title: "時の経過",
    lv2_button: "メンテナンスのヒント",
    
    // Level 3
    lv3_status: "状態: ヴィンテージ (Lv.3)",
    lv3_story_title: "ストーリー: 旅路への感謝",
    lv3_story_text: "家族の歴史と共に時を刻み、深い味わいと物語を宿したこの椅子。世界に一つだけのヴィンテージとして、次の世代へと受け継がれる準備ができています。",
    lv3_info_title: "ヴィンテージの価値",
    lv3_button: "ストーリーを共有する",

    // 共通ラベル・値
    label_wood_type: "樹種",
    label_designer: "デザイナー",
    label_manufactured: "製造年月",
    label_finish: "仕上げ",
    label_warranty: "保証期間",
    label_years_used: "使用年数",
    label_wood_tone: "色合い",
    label_seat_comfort: "座り心地",
    label_condition: "状態",
    label_aging_beauty: "経年美",
    label_character: "特徴",
    label_value: "価値",

    val_wood_oak: "オーク無垢材",
    val_years_2: "約 2年",
    val_years_10: "10年以上",
    val_tone_amber: "豊かな飴色",
    val_tone_amber_deep: "深い飴色",
    val_comfort_body: "体にフィット",
    val_cond_excellent: "良好",
    val_char_luster: "独特の艶",
    val_value_unique: "一点もの",
  },
  en: {
    app_title: "QR Texture App",
    mode_select: "Select Mode",
    mode_url: "🔗 URL Mode",
    mode_aging: "🌲 Aging Mode",
    mode_music: "🎵 Music Mode",
    camera_permission: "*Camera permission required",

    scan_guide: "Place Item & QR in frame\nand press button",
    scan_analyzing: "Analyzing...",
    scan_back: "Back to Home",
    scan_cancel: "Cancel",
    scan_rescan: "Rescan",
    scan_open_page: "Open Page",
    scan_item_unknown: "Item not registered",
    scan_qr_missing: "QR Code not found",

    music_waiting: "Scan QR Code",
    music_playing: "Now Playing",
    music_detected: "Detected",

    // Level 1
    lv1_status: "Status: NEW (Lv.1)",
    lv1_story_title: "Story: About This Chair",
    lv1_story_text: "Crafted from the finest oak by skilled artisans. It is ready to accompany you and mark time together in your life.",
    lv1_info_title: "Product Information",
    lv1_button: "Register Product",

    // Level 2
    lv2_status: "Status: USED (Lv.2)",
    lv2_story_title: "Story: The Craftsman's Secret",
    lv2_story_text: "With a unique patina technique to the wood's natural grain and these years, crafted by artisan wood master. This chair has developed its own personality and the unique quality.",
    lv2_info_title: "Time Passage",
    lv2_button: "Maintenance Tips",

    // Level 3
    lv3_status: "Status: VINTAGE (Lv.3)",
    lv3_story_title: "Story: Thank You for the Journey",
    lv3_story_text: "We logged the oak eloquent you with of our life and the hope you love the stories held of our family's chair. The chair that travel with personal history, ready for a timeless again.",
    lv3_info_title: "Vintage Heritage",
    lv3_button: "Share Your Story",

    // Labels & Values
    label_wood_type: "Wood Type",
    label_designer: "Designer",
    label_manufactured: "Manufactured",
    label_finish: "Finish",
    label_warranty: "Warranty",
    label_years_used: "Years Used",
    label_wood_tone: "Wood Tone",
    label_seat_comfort: "Seat Comfort",
    label_condition: "Condition",
    label_aging_beauty: "Aging Beauty",
    label_character: "Character",
    label_value: "Value",

    val_wood_oak: "Solid Oak",
    val_years_2: "Approx. 2 Years",
    val_years_10: "Over 10 Years",
    val_tone_amber: "Rich Amber Patina",
    val_tone_amber_deep: "Deep Amber Hue",
    val_comfort_body: "Body-Fitted",
    val_cond_excellent: "Excellent",
    val_char_luster: "Unique Luster",
    val_value_unique: "One-of-a-Kind",
  }
};