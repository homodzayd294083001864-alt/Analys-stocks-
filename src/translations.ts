export type Language = 'ar' | 'en';

export const TRANSLATIONS = {
  ar: {
    // Header
    appName: 'HOMOD SMC TRADER',
    appBadge: 'التحليل المؤسساتي الفائق',
    liveConnect: 'ربط مباشر ياهو فاينانس (Yahoo Finance Live API)',
    lastUpdate: 'آخر تحديث مباشر',
    refreshQuotes: 'تحديث الأسعار المباشرة',
    screenerBtn: 'مسح حركة السوق',
    strategyGuideBtn: 'دليل استراتيجية SMC',
    aiReportBtn: 'تقرير Gemini الذكي',
    addStockBtn: 'إضافة سهم جديد',

    // Sidebar
    searchPlaceholder: 'ابحث برمز السهم أو الاسم (مثل: NVDA, AAPL, GOOG)...',
    allSectors: 'جميع القطاعات',
    allStocks: 'جميع الأسهم',
    favorites: 'المفضلة',
    customStocks: 'الأسهم المضافة',
    noStocksFound: 'لا توجد أسهم تطابق شروط البحث الحالية.',
    addCustomStockPrompt: 'أضف أي سهم جديد عبر الزر أعلاه ليتم ربطه بـ Yahoo Finance بلمسة واحدة!',

    // Chart
    liveBadge: 'ياهو فاينانس مباشر',
    autoAnalysisBtn: 'تشغيل التحليل المؤسساتي التلقائي',
    timeframe4H: 'إطار الـ 4 ساعات (4H)',
    timeframe1H: 'إطار الساعة (1H)',
    timeframe5M: 'إطار الـ 5 دقائق (5M)',
    priceLabel: 'السعر الحالي',
    changeLabel: 'التغير اليومي',
    high52: 'أعلى 52 أسبوع',
    low52: 'أدنى 52 أسبوع',
    volume: 'الحجم',

    // Steps Analysis
    step1Title: 'الخطوة 1: الاتجاه والمناطق الكبرى (4H)',
    step2Title: 'الخطوة 2: الأرقام الدائرية المستهدفة (4H)',
    step3Title: 'الخطوة 3: أدوات المال الذكي (1H SMC Setup)',
    step4Title: 'الخطوة 4: شمعة التأكيد والإشارة (5M Entry Trigger)',
    trendBullish: 'اتجاه صاعد مؤسساتي (Bullish Structure)',
    trendBearish: 'اتجاه هابط مؤسساتي (Bearish Structure)',
    trendSideways: 'اتجاه عرضي (Consolidation Zone)',
    demandZone: 'منطقة طلب كبرى (HTF Demand)',
    supplyZone: 'منطقة عرض كبرى (HTF Supply)',
    roundNumbers: 'الأرقام الدائرية النفسية',
    orderBlock: 'كتلة الأوامر (Order Block)',
    fvg: 'فجوة القيمة العادلة (Fair Value Gap)',
    bos: 'اختراق هيكل السوق (BOS)',

    // Trade Setup
    tradeSetupTitle: 'حاسبة وخطة تنفيذ الصفقة المؤسساتية (Risk-Reward Execution)',
    signalBuy: 'صفقة شراء مؤسساتية (LONG BUY)',
    signalSell: 'صفقة بيع مؤسساتية (SHORT SELL)',
    signalNeutral: 'محايد - انتظار التأكيد',
    entryPrice: 'سعر الدخول المقترح',
    stopLoss: 'وقف الخسارة (Stop Loss)',
    tp1: 'الهدف الأول (TP1)',
    tp2: 'الهدف الثاني (TP2)',
    tp3: 'الهدف الثالث (TP3)',
    rrRatio: 'نسبة المخاطرة إلى العائد (R:R)',
    portfolioCapital: 'رأس مال المحفظة ($)',
    riskPercentage: 'نسبة المخاطرة لكل صفقة (%)',
    calculatedShares: 'عدد الأسهم الموصى بها',
    totalRiskDollar: 'قيمة المخاطرة بالدولار',

    // Modals
    screenerTitle: 'ماكينة مسح صفقات المال الذكي (SMC Market Screener)',
    screenerDesc: 'تصفية الـ 400 سهم واستخراج الفرص القائمة فوراً',
    aiReportTitle: 'التقرير المؤسساتي الفائق الذكاء (Gemini SMC AI)',
    strategyGuideTitle: 'دليل استراتيجية المال الذكي (SMC 4 Timeframes Guide)',
    close: 'إغلاق',
    generateReport: 'توليد التقرير الذكي الآن',

    // Add Stock Modal
    addStockTitle: 'إضافة سهم جديد إلى HOMOD SMC',
    tickerSymbol: 'رمز السهم (Ticker)',
    investmentSector: 'القطاع الاستثماري',
    fetchStockBtn: 'فحص جلب السهم',
    confirmAddBtn: 'تأكيد إضافة السهم'
  },
  en: {
    // Header
    appName: 'HOMOD SMC TRADER',
    appBadge: 'PRO Institutional Suite',
    liveConnect: 'Yahoo Finance Live API Connected',
    lastUpdate: 'Last Live Sync',
    refreshQuotes: 'Refresh Live Quotes',
    screenerBtn: 'Market Screener',
    strategyGuideBtn: 'SMC Guide',
    aiReportBtn: 'Gemini AI Report',
    addStockBtn: 'Add Custom Stock',

    // Sidebar
    searchPlaceholder: 'Search symbol or name (e.g. NVDA, AAPL, GOOG)...',
    allSectors: 'All Sectors',
    allStocks: 'All Stocks',
    favorites: 'Favorites',
    customStocks: 'Custom Added Stocks',
    noStocksFound: 'No stocks found matching search filters.',
    addCustomStockPrompt: 'Add any custom ticker above to sync with Yahoo Finance instantly!',

    // Chart
    liveBadge: 'Yahoo Finance Live',
    autoAnalysisBtn: 'Run Auto SMC Analysis',
    timeframe4H: '4-Hour Frame (4H)',
    timeframe1H: '1-Hour Frame (1H)',
    timeframe5M: '5-Min Frame (5M)',
    priceLabel: 'Current Price',
    changeLabel: 'Daily Change',
    high52: '52w High',
    low52: '52w Low',
    volume: 'Volume',

    // Steps Analysis
    step1Title: 'Step 1: 4H Trend & HTF Zones',
    step2Title: 'Step 2: Round Numbers & Magnet Levels (4H)',
    step3Title: 'Step 3: Smart Money Tools (1H SMC Setup)',
    step4Title: 'Step 4: 5M Confirmation Trigger & Execution',
    trendBullish: 'Bullish Institutional Structure',
    trendBearish: 'Bearish Institutional Structure',
    trendSideways: 'Consolidation / Sideways',
    demandZone: 'HTF Demand Zone',
    supplyZone: 'HTF Supply Zone',
    roundNumbers: 'Psychological Round Numbers',
    orderBlock: 'Institutional Order Block (OB)',
    fvg: 'Fair Value Gap (FVG)',
    bos: 'Break of Structure (BOS)',

    // Trade Setup
    tradeSetupTitle: 'Institutional Trade Setup & Position Sizing Calculator',
    signalBuy: 'LONG BUY SETUP',
    signalSell: 'SHORT SELL SETUP',
    signalNeutral: 'NEUTRAL - Waiting Confirmation',
    entryPrice: 'Entry Price',
    stopLoss: 'Stop Loss (SL)',
    tp1: 'Take Profit 1 (TP1)',
    tp2: 'Take Profit 2 (TP2)',
    tp3: 'Take Profit 3 (TP3)',
    rrRatio: 'Risk to Reward Ratio (R:R)',
    portfolioCapital: 'Portfolio Capital ($)',
    riskPercentage: 'Risk Per Trade (%)',
    calculatedShares: 'Recommended Share Size',
    totalRiskDollar: 'Total Risk ($)',

    // Modals
    screenerTitle: 'SMC Institutional Market Screener',
    screenerDesc: 'Scan 400+ stocks for high probability SMC setups in real-time',
    aiReportTitle: 'Gemini AI Institutional SMC Report',
    strategyGuideTitle: 'Smart Money Concepts 4-Timeframe Guide',
    close: 'Close',
    generateReport: 'Generate AI Report Now',

    // Add Stock Modal
    addStockTitle: 'Add Custom Stock to HOMOD SMC',
    tickerSymbol: 'Ticker Symbol',
    investmentSector: 'Investment Sector',
    fetchStockBtn: 'Verify & Fetch Stock',
    confirmAddBtn: 'Confirm & Add Stock'
  }
};
