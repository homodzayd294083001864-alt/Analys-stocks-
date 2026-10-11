import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { INITIAL_STOCKS_LIST } from './data/stocks';
import { Stock, Timeframe, Candle } from './types';
import { Language } from './translations';
import { analyzeSMCStrategy } from './utils/smcEngine';
import { fetchLiveQuotes, fetchLiveChartData, mergeLiveQuotesIntoStocks } from './services/yahooFinance';
import { Header } from './components/Header';
import { AndroidPwaInstall } from './components/AndroidPwaInstall';
import { Sidebar } from './components/Sidebar';
import { SMCChart } from './components/SMCChart';
import { StepByStepAnalysis } from './components/StepByStepAnalysis';
import { TradeSetupPanel } from './components/TradeSetupPanel';
import { InstitutionalScaleOutPanel } from './components/InstitutionalScaleOutPanel';
import { MarketScreenerModal } from './components/MarketScreenerModal';
import { AiReportModal } from './components/AiReportModal';
import { StrategyGuideModal } from './components/StrategyGuideModal';
import { AddStockModal } from './components/AddStockModal';

export default function App() {
  // Language state (default Arabic, toggleable to English)
  const [lang, setLang] = useState<Language>('ar');

  // Custom stocks added by user, persisted in localStorage
  const [customStocks, setCustomStocks] = useState<Stock[]>(() => {
    try {
      const saved = localStorage.getItem('smc_custom_stocks_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Combined stock list (Default 400 + Custom added stocks)
  const baseStocksList = useMemo(() => {
    const existingSymbols = new Set(INITIAL_STOCKS_LIST.map(s => s.symbol));
    const validCustoms = customStocks.filter(c => !existingSymbols.has(c.symbol));
    return [...validCustoms, ...INITIAL_STOCKS_LIST];
  }, [customStocks]);

  const [stocksList, setStocksList] = useState<Stock[]>(baseStocksList);

  useEffect(() => {
    setStocksList(baseStocksList);
  }, [baseStocksList]);

  // Selected stock state (default to NVDA)
  const [selectedStock, setSelectedStock] = useState<Stock>(
    INITIAL_STOCKS_LIST[0] || {
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      nameAr: 'إنفيديا',
      industry: 'SemiConductors',
      price: 128.5,
      change: 3.56,
      changePercent: 2.85,
      volume: '45.2M',
      marketCap: '3.15T',
      sector: 'TECH',
      sectorAr: 'التكنولوجيا والذكاء الاصطناعي',
      high52: 140,
      low52: 80,
      volatility: 4
    }
  );

  // Timeframe state
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('4H');

  // Favorites state with localStorage persistence
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('smc_favorites_v1');
      return saved ? JSON.parse(saved) : ['NVDA', 'AAPL', 'GOOG', 'TSLA', 'MSFT', 'AMZN'];
    } catch {
      return ['NVDA', 'AAPL', 'GOOG', 'TSLA', 'MSFT', 'AMZN'];
    }
  });

  // Live Sync states
  const [isLiveSyncing, setIsLiveSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  const [liveChartCandles, setLiveChartCandles] = useState<{
    candles4H: Candle[];
    candles1H: Candle[];
    candles5M: Candle[];
  } | null>(null);

  // Automated Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [activeStepProgress, setActiveStepProgress] = useState<number>(4);

  // Modals state
  const [isScreenerOpen, setIsScreenerOpen] = useState<boolean>(false);
  const [isAiReportOpen, setIsAiReportOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isAddStockOpen, setIsAddStockOpen] = useState<boolean>(false);

  // Toggle Language
  const handleToggleLang = () => {
    setLang(prev => (prev === 'ar' ? 'en' : 'ar'));
  };

  // Add Custom Stock handler
  const handleAddCustomStock = (newStock: Stock) => {
    setCustomStocks(prev => {
      const updated = [newStock, ...prev.filter(s => s.symbol !== newStock.symbol)];
      try {
        localStorage.setItem('smc_custom_stocks_v1', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    setSelectedStock(newStock);
  };

  // Fetch Live Stock Quotes from Yahoo Finance
  const handleRefreshLiveQuotes = useCallback(async () => {
    setIsLiveSyncing(true);
    try {
      // Top symbols to fetch immediately
      const topSymbols = [
        selectedStock.symbol,
        'NVDA', 'AAPL', 'GOOG', 'GOOGL', 'TSLA', 'MSFT', 'AMZN', 'META', 'NFLX', 'AMD',
        ...customStocks.map(s => s.symbol),
        ...favorites
      ];
      const uniqueSymbols = Array.from(new Set(topSymbols));

      const liveQuotes = await fetchLiveQuotes(uniqueSymbols);
      if (Object.keys(liveQuotes).length > 0) {
        setStocksList(prev => mergeLiveQuotesIntoStocks(prev, liveQuotes));

        if (liveQuotes[selectedStock.symbol]) {
          const q = liveQuotes[selectedStock.symbol];
          setSelectedStock(prev => ({
            ...prev,
            price: q.price,
            change: q.change,
            changePercent: q.changePercent,
            volume: q.volume || prev.volume,
            marketCap: q.marketCap || prev.marketCap,
            high52: q.high52 || prev.high52,
            low52: q.low52 || prev.low52,
            isLiveYahoo: true
          }));
        }

        setLastSyncTime(
          new Date().toLocaleTimeString(lang === 'ar' ? 'ar-EG' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLiveSyncing(false);
    }
  }, [selectedStock.symbol, favorites, customStocks, lang]);

  // Fetch Live Candlestick Chart Data when selectedStock changes
  useEffect(() => {
    let isMounted = true;
    async function loadChartData() {
      setIsLiveSyncing(true);
      const chartRes = await fetchLiveChartData(selectedStock.symbol);
      if (isMounted && chartRes && chartRes.candles5M.length > 0) {
        setLiveChartCandles({
          candles4H: chartRes.candles4H,
          candles1H: chartRes.candles1H,
          candles5M: chartRes.candles5M
        });

        if (chartRes.meta?.price) {
          const livePrice = chartRes.meta.price;
          const prevClose = chartRes.meta.prevClose || livePrice;
          const change = livePrice - prevClose;
          const changePercent = prevClose ? (change / prevClose) * 100 : 0;

          setSelectedStock(prev => ({
            ...prev,
            price: Number(livePrice.toFixed(2)),
            change: Number(change.toFixed(2)),
            changePercent: Number(changePercent.toFixed(2)),
            high52: chartRes.meta?.high52 ? Number(chartRes.meta.high52.toFixed(2)) : prev.high52,
            low52: chartRes.meta?.low52 ? Number(chartRes.meta.low52.toFixed(2)) : prev.low52,
            isLiveYahoo: true
          }));
        }

        setLastSyncTime(
          new Date().toLocaleTimeString(lang === 'ar' ? 'ar-EG' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })
        );
      } else if (isMounted) {
        setLiveChartCandles(null); // Fallback to synthetic if offline
      }
      if (isMounted) setIsLiveSyncing(false);
    }

    loadChartData();
    return () => { isMounted = false; };
  }, [selectedStock.symbol, lang]);

  // Initial live quotes fetch
  useEffect(() => {
    handleRefreshLiveQuotes();
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('smc_favorites_v1', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  const handleToggleFavorite = (symbol: string) => {
    setFavorites(prev =>
      prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]
    );
  };

  // Run SMC Analysis Engine for selected stock with live Yahoo candles
  const analysis = useMemo(() => {
    return analyzeSMCStrategy(selectedStock, liveChartCandles || undefined);
  }, [selectedStock, liveChartCandles]);

  // Handle "Run Automated Analysis" Button Click
  const handleRunAutoAnalysis = () => {
    setIsAnalyzing(true);
    setActiveStepProgress(0);

    // Step 1: 4H Trend
    setTimeout(() => {
      setActiveStepProgress(1);
      setSelectedTimeframe('4H');
    }, 600);

    // Step 2: 4H Round Numbers
    setTimeout(() => {
      setActiveStepProgress(2);
    }, 1200);

    // Step 3: 1H SMC Setups
    setTimeout(() => {
      setActiveStepProgress(3);
      setSelectedTimeframe('1H');
    }, 1800);

    // Step 4: 5M Execution Trigger
    setTimeout(() => {
      setActiveStepProgress(4);
      setSelectedTimeframe('5M');
      setIsAnalyzing(false);
    }, 2400);
  };

  const activeSignalsCount = useMemo(() => {
    return stocksList.filter(s => s.change >= 0 || s.symbol.charCodeAt(0) % 2 === 0).length;
  }, [stocksList]);

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none ${lang === 'ar' ? 'dir-rtl' : 'dir-ltr'}`}>
      {/* Android PWA Installation Banner */}
      <AndroidPwaInstall />

      {/* Top Header */}
      <Header
        onOpenScreener={() => setIsScreenerOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenAiReport={() => setIsAiReportOpen(true)}
        onOpenAddStock={() => setIsAddStockOpen(true)}
        activeSignalsCount={activeSignalsCount}
        onRefreshLiveQuotes={handleRefreshLiveQuotes}
        isLiveSyncing={isLiveSyncing}
        lastSyncTime={lastSyncTime}
        selectedStockSymbol={selectedStock.symbol}
        selectedStockPrice={selectedStock.price}
        selectedStockChangePercent={selectedStock.changePercent}
        lang={lang}
        onToggleLang={handleToggleLang}
      />

      {/* Main Container Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-7xl w-full mx-auto">
        {/* Left Sidebar (Stocks Navigator & Search) */}
        <Sidebar
          stocks={stocksList}
          selectedSymbol={selectedStock.symbol}
          onSelectStock={setSelectedStock}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onOpenAddStock={() => setIsAddStockOpen(true)}
          lang={lang}
        />

        {/* Right Main Stage Content Area */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto space-y-6 bg-slate-950">
          {/* Section 1: Candlestick Multi-Timeframe Chart */}
          <SMCChart
            analysis={analysis}
            selectedTimeframe={selectedTimeframe}
            onSelectTimeframe={setSelectedTimeframe}
            lang={lang}
          />

          {/* Section 2: Step-By-Step SMC Automated Analysis */}
          <StepByStepAnalysis
            analysis={analysis}
            selectedTimeframe={selectedTimeframe}
            onSelectTimeframe={setSelectedTimeframe}
            onRunAutoAnalysis={handleRunAutoAnalysis}
            isAnalyzing={isAnalyzing}
            activeStepProgress={activeStepProgress}
          />

          {/* Section 3: Institutional Scale-Out Strategy & Auto-Breakeven Risk Engine */}
          <InstitutionalScaleOutPanel analysis={analysis} />

          {/* Section 4: Trade Execution Card & Risk Calculator */}
          <TradeSetupPanel analysis={analysis} />
        </main>
      </div>

      {/* Modals */}
      <AddStockModal
        isOpen={isAddStockOpen}
        onClose={() => setIsAddStockOpen(false)}
        onAddStock={handleAddCustomStock}
        lang={lang}
      />

      <MarketScreenerModal
        isOpen={isScreenerOpen}
        onClose={() => setIsScreenerOpen(false)}
        stocks={stocksList}
        onSelectStock={setSelectedStock}
      />

      <AiReportModal
        isOpen={isAiReportOpen}
        onClose={() => setIsAiReportOpen(false)}
        analysis={analysis}
      />

      <StrategyGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
