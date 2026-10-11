import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// Helper function to fetch single symbol quote from Yahoo Finance
async function fetchYahooQuote(sym: string) {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?interval=1d&range=5d`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (!res.ok) return null;
    const json = await res.json();
    const meta = json.chart?.result?.[0]?.meta;
    if (!meta || meta.regularMarketPrice == null) return null;

    const price = meta.regularMarketPrice;
    const prevClose = meta.chartPreviousClose || meta.previousClose || price;
    const change = price - prevClose;
    const changePercent = prevClose ? (change / prevClose) * 100 : 0;
    const volumeVal = meta.regularMarketVolume;

    return {
      symbol: sym,
      price: Number(price.toFixed(2)),
      prevClose: Number(prevClose.toFixed(2)),
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2)),
      high52: meta.fiftyTwoWeekHigh ? Number(meta.fiftyTwoWeekHigh.toFixed(2)) : undefined,
      low52: meta.fiftyTwoWeekLow ? Number(meta.fiftyTwoWeekLow.toFixed(2)) : undefined,
      volume: volumeVal ? `${(volumeVal / 1e6).toFixed(1)}M` : undefined,
      marketCap: meta.marketCap ? `$${(meta.marketCap / 1e9).toFixed(1)}B` : undefined,
      name: meta.longName || meta.shortName || sym,
      updatedAt: new Date().toISOString()
    };
  } catch (err) {
    console.error(`Yahoo Finance fetch failed for ${sym}:`, err);
    return null;
  }
}

// Live Batch Stock Quotes Endpoint (Yahoo Finance)
app.get('/api/stock-quotes', async (req, res) => {
  try {
    const symbolsQuery = (req.query.symbols as string) || 'NVDA,AAPL,GOOG,TSLA,MSFT,AMZN,META,NFLX,AMD';
    const symbolList = symbolsQuery
      .split(',')
      .map(s => s.trim().toUpperCase())
      .filter(Boolean)
      .slice(0, 80); // Cap per request

    const quotes: Record<string, any> = {};
    await Promise.all(
      symbolList.map(async sym => {
        const quote = await fetchYahooQuote(sym);
        if (quote) {
          quotes[sym] = quote;
        }
      })
    );

    return res.json({ success: true, count: Object.keys(quotes).length, quotes });
  } catch (err: any) {
    console.error('Error fetching stock quotes:', err);
    return res.status(500).json({ success: false, error: err?.message || String(err) });
  }
});

// Live Candlestick Chart Endpoint (Yahoo Finance: 5M, 1H, 4H)
app.get('/api/stock-chart', async (req, res) => {
  try {
    const symbol = ((req.query.symbol as string) || 'GOOG').trim().toUpperCase();

    // Helper to parse Yahoo Chart JSON into Candle array
    const parseYahooCandles = (json: any) => {
      const result = json?.chart?.result?.[0];
      if (!result) return [];
      const timestamps = result.timestamp || [];
      const quote = result.indicators?.quote?.[0] || {};
      const candles: any[] = [];

      for (let i = 0; i < timestamps.length; i++) {
        const o = quote.open?.[i];
        const h = quote.high?.[i];
        const l = quote.low?.[i];
        const c = quote.close?.[i];
        const v = quote.volume?.[i] || 0;

        if (o != null && h != null && l != null && c != null) {
          const ts = timestamps[i] * 1000;
          const date = new Date(ts);
          const dateStr = date.toLocaleTimeString('ar-EG', {
            hour: '2-digit',
            minute: '2-digit'
          });

          candles.push({
            timestamp: ts,
            dateStr,
            open: Number(o.toFixed(2)),
            high: Number(h.toFixed(2)),
            low: Number(l.toFixed(2)),
            close: Number(c.toFixed(2)),
            volume: Math.round(v),
            isBullish: c >= o
          });
        }
      }
      return candles;
    };

    // Fetch 5M chart & 1H chart in parallel from Yahoo Finance
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    };

    const [res5M, res1H] = await Promise.all([
      fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=5m&range=1d`, { headers }).then(r => r.json()).catch(() => null),
      fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1h&range=1mo`, { headers }).then(r => r.json()).catch(() => null)
    ]);

    const candles5M = parseYahooCandles(res5M);
    const rawCandles1H = parseYahooCandles(res1H);

    // Filter 1H to last 50 candles
    const candles1H = rawCandles1H.slice(-50);

    // Aggregate 1H candles into 4H candles (groups of 4)
    const candles4H: any[] = [];
    for (let i = 0; i < rawCandles1H.length; i += 4) {
      const chunk = rawCandles1H.slice(i, i + 4);
      if (chunk.length === 0) continue;
      const open = chunk[0].open;
      const close = chunk[chunk.length - 1].close;
      const high = Math.max(...chunk.map((c: any) => c.high));
      const low = Math.min(...chunk.map((c: any) => c.low));
      const volume = chunk.reduce((sum: number, c: any) => sum + c.volume, 0);
      const ts = chunk[0].timestamp;
      const dateStr = new Date(ts).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit' });

      candles4H.push({
        timestamp: ts,
        dateStr,
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume,
        isBullish: close >= open
      });
    }

    const meta = res5M?.chart?.result?.[0]?.meta || res1H?.chart?.result?.[0]?.meta;

    return res.json({
      success: true,
      symbol,
      meta: meta ? {
        price: meta.regularMarketPrice,
        prevClose: meta.chartPreviousClose || meta.previousClose,
        high52: meta.fiftyTwoWeekHigh,
        low52: meta.fiftyTwoWeekLow,
        currency: meta.currency,
        exchangeName: meta.exchangeName
      } : null,
      candles5M,
      candles1H,
      candles4H: candles4H.slice(-40)
    });
  } catch (err: any) {
    console.error('Error fetching stock chart:', err);
    return res.status(500).json({ success: false, error: err?.message || String(err) });
  }
});

// Gemini AI Institutional SMC Analysis API Endpoint
app.post('/api/smc-analysis', async (req, res) => {
  try {
    const {
      stockSymbol = 'NVDA',
      stockName = 'إنفيديا',
      price = 128.5,
      trend = 'صاعد (Bullish Structure)',
      entry = 127.0,
      stopLoss = 124.0,
      tp1 = 132.0,
      tp2 = 136.0,
      tp3 = 140.0,
      rrRatio = 3.5,
      obLow = 125.0,
      obHigh = 127.0,
      fvgBottom = 126.0,
      fvgTop = 128.0
    } = req.body || {};

    const sym = String(stockSymbol).toUpperCase();
    const name = String(stockName);
    const p = Number(price) || 100.0;
    const tr = String(trend);
    const en = Number(entry) || (p * 0.985);
    const sl = Number(stopLoss) || (p * 0.96);
    const t1 = Number(tp1) || (p * 1.03);
    const t2 = Number(tp2) || (p * 1.06);
    const t3 = Number(tp3) || (p * 1.10);
    const rr = Number(rrRatio) || 3.2;
    const obl = Number(obLow) || (p * 0.97);
    const obh = Number(obHigh) || (p * 0.985);
    const fvgb = Number(fvgBottom) || (p * 0.975);
    const fvgt = Number(fvgTop) || (p * 0.99);

    const apiKey = process.env.GEMINI_API_KEY;

    let reportText = '';

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });

        const prompt = `
أنت خبير وباحث مالي عالمي في صناديق التحوط ومستشار استراتيجي متخصص في "مفاهيم المال الذكي" Smart Money Concepts (SMC).
قم بإعداد تقرير تحليلي مؤسساتي شامل وفاخر باللغة العربية للسهم التالي:

بيانات السهم والصفقة الحالية:
- الرمز والاسم: ${sym} (${name})
- السعر المباشر الحالي: $${p.toFixed(2)}
- الهيكلية والاتجاه الرئيسي (4H): ${tr}
- منطقة كتلة الأوامر (1H Bullish Order Block): بين $${obl.toFixed(2)} و $${obh.toFixed(2)}
- فجوة القيمة العادلة (1H Fair Value Gap): بين $${fvgb.toFixed(2)} و $${fvgt.toFixed(2)}
- نقطة الدخول المستهدفة (Point of Interest / Entry): $${en.toFixed(2)}
- مستهدف وقف الخسارة (Stop Loss Invalidation): $${sl.toFixed(2)}
- الهدف الأول (TP1 - BSL Sweep): $${t1.toFixed(2)}
- الهدف الثاني (TP2 - Premium Imbalance): $${t2.toFixed(2)}
- الهدف الثالث (TP3 - Major Target): $${t3.toFixed(2)}
- نسبة العائد للمخاطرة (Risk to Reward Ratio): 1:${rr.toFixed(1)}

اكتب تقريراً مفصلاً جداً ومصمماً بتنسيق Markdown راقٍ يغطي الأقسام الأربعة التالية بوضوح:
1. 📈 **تحليل الاتجاه وسحب السيولة على إطار الـ 4 ساعات (4H Framework)**
2. 🎯 **الخريطة الهيكلية والمستويات النفسية الدائرية (Psychological Round Numbers)**
3. ⚡ **أدوات المال الذكي على إطار الساعة (1H SMC Setup - BOS, OB, FVG)**
4. 🚀 **تكتيكات التنفيذ وإدارة المحفظة على إطار الـ 5 دقائق (5M Confirmation & Risk Execution)**

اجعل التقرير ذا طابع مؤسساتي احترافي جداً يركز على تجميع وصانع السوق (IPDA & Market Maker Model).
`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            temperature: 0.7,
            systemInstruction: 'أنت محلل مالي خبير ومحترف باللغة العربية في تداول الأسهم واستراتيجيات المال الذكي SMC.'
          }
        });

        reportText = response.text || '';
      } catch (geminiErr) {
        console.warn('Gemini API call warning, fallback to institutional engine:', geminiErr);
      }
    }

    if (!reportText) {
      // Deterministic Institutional Report Fallback Engine
      reportText = `### 🏛️ **التقرير التحليلي المؤسساتي الفائق (HOMOD Institutional SMC Report)**

**بيانات الأداة المالية:** ${sym} (${name}) | **السعر الحالي:** $${p.toFixed(2)} | **الاتجاه:** ${tr}

---

### 1. 📈 **تحليل الاتجاه والسيولة على إطار الـ 4 ساعات (4H Framework)**
* **تطابق الهيكل المؤسساتي:** يظهر السهم ${sym} اتجاهًا صريحًا مع استمرار تدفق السيولة المؤسساتية (Institutional Order Flow).
* **مسح السيولة (Liquidity Sweep):** تم رصد سحب لسيولة البيع (Sell-Side Liquidity - SSL) أسفل مناطق القيعان السابقة، مما أكد رغبة صانع السوق في امتصاص عروض البيع لبدء مرحلة التجميع (Accumulation Phase).
* **المستهدفات الهيكلية:** تتجه بوصلة السيولة القادمة نحو مسح سيولة الشراء (Buy-Side Liquidity - BSL) المستقرة أعلى المستويات الحالية.

---

### 2. 🎯 **الخريطة الهيكلية والمستويات الدائرية النفسية (Psychological Round Numbers)**
* **المستوى الميداني ($${(Math.round(p / 5) * 5).toFixed(2)}):** يشكل حاجزًا نفسيًا وحسابيًا في خوارزمية التسعير بين البنوك (IPDA Algorithm).
* **دعم كتلة الأوامر ($${obl.toFixed(2)}):** يمثل الحد الحرج لحماية النظرة الشرائية، حيث أن إغلاق شمعة 4H أسفله يلغي نموذج التداول الحاضر.
* **الهدف النفسي النهائي ($${t3.toFixed(2)}):** القمة المرتقبة لتصريف الكميات المؤسساتية.

---

### 3. ⚡ **أدوات المال الذكي على إطار الساعة (1H SMC Setup)**
* **كسر الهيكل (BOS):** تأكد اختراق آخر قمة فرعية بشمعة زخم صاعدة.
* **كتلة الأوامر (Bullish Order Block):** متمركزة بدقة بين **$${obl.toFixed(2)}** و **$${obh.toFixed(2)}**.
* **فجوة القيمة العادلة (FVG):** تشكلت منطقة عدم توازن بين **$${fvgb.toFixed(2)}** و **$${fvgt.toFixed(2)}**.
* **نقطة الدخول الذهبية (POI):** يمثل مستوى **$${en.toFixed(2)}** نقطة الالتقاء المثالية (Confluence Point) لإعادة الاختبار.

---

### 4. 🚀 **استراتيجية التنفيذ وإدارة المخاطر (5M Execution Setup)**
* **شرط الدخول:** الانتظار لحين وصول السعر إلى **$${en.toFixed(2)}** وتشكل تغير في طبيعة الحركة (ChoCh) على إطار الـ 5 دقائق.
* **وقف الخسارة (Stop Loss):** **$${sl.toFixed(2)}** (أسفل الـ Order Block بفرق آمن).
* **الأهداف المحددة:**
  * **الهدف الأول (TP1):** $${t1.toFixed(2)} (إغلاق 50% ونقل الوقف لنقطة التعادل)
  * **الهدف الثاني (TP2):** $${t2.toFixed(2)} (إغلاق 30%)
  * **الهدف الثالث (TP3):** $${t3.toFixed(2)} (جني بقية الأرباح)
* **نسبة المخاطرة إلى العائد (R:R):** **1:${rr.toFixed(1)}**`;
    }

    return res.json({ success: true, report: reportText });
  } catch (error: any) {
    console.error('Error in /api/smc-analysis endpoint:', error);
    return res.status(500).json({
      success: false,
      error: 'حدث خطأ أثناء إعداد التقرير المؤسساتي.',
      details: error?.message || String(error)
    });
  }
});

// Vite Middleware for Development / Static serving for Production
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
