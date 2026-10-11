import React from 'react';
import { TRANSLATIONS, Language } from '../translations';
import homodLogo from '../assets/images/homod_smc_logo_1786331763744.jpg';
import {
  Activity,
  Filter,
  Sparkles,
  BookOpen,
  ShieldCheck,
  RefreshCw,
  Globe,
  PlusCircle,
  Languages,
  Smartphone
} from 'lucide-react';

interface HeaderProps {
  onOpenScreener: () => void;
  onOpenGuide: () => void;
  onOpenAiReport: () => void;
  onOpenAddStock: () => void;
  activeSignalsCount: number;
  onRefreshLiveQuotes?: () => void;
  isLiveSyncing?: boolean;
  lastSyncTime?: string;
  selectedStockSymbol?: string;
  selectedStockPrice?: number;
  selectedStockChangePercent?: number;
  lang: Language;
  onToggleLang: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenScreener,
  onOpenGuide,
  onOpenAiReport,
  onOpenAddStock,
  activeSignalsCount,
  onRefreshLiveQuotes,
  isLiveSyncing,
  lastSyncTime,
  selectedStockSymbol,
  selectedStockPrice,
  selectedStockChangePercent,
  lang,
  onToggleLang
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <header className="bg-slate-950 border-b border-slate-800 text-slate-100 sticky top-0 z-30 shadow-2xl">
      {/* Live Financial Market Ticker Tape */}
      <div className="bg-slate-900/90 text-xs py-1.5 px-4 border-b border-slate-800/80 overflow-x-auto no-scrollbar flex items-center justify-between gap-6 whitespace-nowrap">
        <div className="flex items-center gap-6">
          <span className="text-slate-400 flex items-center gap-1.5 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-300 font-bold">{t.liveConnect}</span>
          </span>

          <span className="hidden md:flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-2 py-0.5 rounded-full text-[10px] font-bold">
            <Smartphone className="w-3 h-3 text-amber-400" />
            <span>متوافق مع أندرويد (Android PWA Ready)</span>
          </span>

          {selectedStockSymbol && selectedStockPrice && (
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              <span className="text-amber-300 font-bold font-mono">{selectedStockSymbol}</span>
              <span className="text-white font-mono font-bold">${selectedStockPrice.toFixed(2)}</span>
              <span className={`font-mono text-xs ${selectedStockChangePercent && selectedStockChangePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {selectedStockChangePercent && selectedStockChangePercent >= 0 ? '+' : ''}
                {selectedStockChangePercent?.toFixed(2)}%
              </span>
            </div>
          )}

          {lastSyncTime && (
            <span className="text-slate-500 text-[10px] font-mono">
              {t.lastUpdate}: {lastSyncTime}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-slate-400 text-[11px]">
          {onRefreshLiveQuotes && (
            <button
              onClick={onRefreshLiveQuotes}
              disabled={isLiveSyncing}
              className="px-2.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 text-cyan-400 ${isLiveSyncing ? 'animate-spin' : ''}`} />
              <span>{t.refreshQuotes}</span>
            </button>
          )}

          {/* Language Selector Switch */}
          <button
            onClick={onToggleLang}
            className="px-2.5 py-0.5 bg-indigo-900/40 hover:bg-indigo-800/60 text-indigo-200 border border-indigo-500/40 rounded text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Languages className="w-3.5 h-3.5 text-indigo-300" />
            <span>{lang === 'ar' ? 'English (EN)' : 'العربية (AR)'}</span>
          </button>

          <span className="bg-slate-800/80 px-2 py-0.5 rounded text-amber-300 flex items-center gap-1 font-mono">
            <ShieldCheck className="w-3 h-3 text-amber-400" />
            SMC 4 Timeframes
          </span>
        </div>
      </div>

      {/* Main Terminal Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Logo & Status */}
        <div className="flex items-center gap-3.5">
          <div className="relative group cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-slate-900 border-2 border-amber-400/60 shadow-xl shadow-amber-500/10 p-0.5 overflow-hidden flex items-center justify-center relative transition-transform duration-300 group-hover:scale-105">
              <img
                src={homodLogo}
                alt="HOMOD SMC TRADER Logo"
                className="w-full h-full object-cover rounded-lg"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback vector logo if image fails
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-transparent to-emerald-500/20 pointer-events-none rounded-lg"></div>
            </div>
            <span className="absolute -bottom-1 -right-1 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-mono text-[9px] font-black px-1.5 py-0.2 rounded-md shadow-md ring-1 ring-slate-950">
              PRO
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-1.5 font-sans">
                HOMOD <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-emerald-400 bg-clip-text text-transparent font-mono font-extrabold">SMC TRADER</span>
              </h1>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 font-mono shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                {t.appBadge}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {lang === 'ar'
                ? 'المنصة المؤسساتية الفائقة المربوطة بـ Yahoo Finance بـ 4 أطر زمنية'
                : 'HOMOD Institutional SMC Terminal with 4 Timeframes Live API'}
            </p>
          </div>
        </div>

        {/* Quick Actions & Navigation */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Prominent Language Switcher Button */}
          <button
            onClick={onToggleLang}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-indigo-600/30 ring-2 ring-indigo-400/30"
            title={lang === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
          >
            <Languages className="w-4 h-4 text-indigo-200" />
            <span>{lang === 'ar' ? 'English (EN)' : 'العربية (AR)'}</span>
          </button>

          {/* Add Stock Button */}
          <button
            onClick={onOpenAddStock}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-600/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.addStockBtn}</span>
          </button>

          {/* Active Signals Pill / Screener */}
          <button
            onClick={onOpenScreener}
            className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/70 text-xs px-3 py-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer group"
          >
            <Filter className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>{t.screenerBtn}</span>
            <span className="bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[11px] px-1.5 py-0.5 rounded">
              {activeSignalsCount}
            </span>
          </button>

          {/* AI Report Button */}
          <button
            onClick={onOpenAiReport}
            className="bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-slate-900 hover:from-purple-800/50 hover:to-slate-800 text-purple-200 border border-purple-500/30 text-xs px-3.5 py-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer shadow-sm shadow-purple-900/30"
          >
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            <span className="font-medium">{t.aiReportBtn}</span>
          </button>

          {/* SMC Strategy Guide */}
          <button
            onClick={onOpenGuide}
            className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/60 text-xs px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>{t.strategyGuideBtn}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
