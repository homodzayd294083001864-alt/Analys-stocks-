import React, { useState, useMemo } from 'react';
import { Stock, SectorType } from '../types';
import { TRANSLATIONS, Language } from '../translations';
import { SECTOR_LABELS_AR } from '../data/stocks';
import {
  Search,
  Star,
  TrendingUp,
  TrendingDown,
  PlusCircle,
  Plus
} from 'lucide-react';

interface SidebarProps {
  stocks: Stock[];
  selectedSymbol: string;
  onSelectStock: (stock: Stock) => void;
  favorites: string[];
  onToggleFavorite: (symbol: string) => void;
  onOpenAddStock: () => void;
  lang: Language;
}

const SECTOR_LABELS_EN: Record<SectorType, string> = {
  TECH: 'Tech & AI',
  FINANCE: 'Finance',
  HEALTHCARE: 'Healthcare',
  CONSUMER: 'Consumer',
  ENERGY: 'Energy',
  INDUSTRIAL: 'Industrial',
  AUTO_EV: 'EV & Auto',
  COMMUNICATION: 'Telecom',
  REAL_ESTATE: 'Real Estate',
  CRYPTO_FINTECH: 'Crypto & Fintech',
  ETF: 'ETFs'
};

export const Sidebar: React.FC<SidebarProps> = ({
  stocks,
  selectedSymbol,
  onSelectStock,
  favorites,
  onToggleFavorite,
  onOpenAddStock,
  lang
}) => {
  const t = TRANSLATIONS[lang];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<SectorType | 'ALL'>('ALL');
  const [signalFilter, setSignalFilter] = useState<'ALL' | 'BUY' | 'SELL' | 'FAVORITES' | 'CUSTOM'>('ALL');
  const [sortBy, setSortBy] = useState<'VOLUME' | 'CHANGE' | 'SYMBOL'>('CHANGE');

  // Filter & Sort stocks
  const filteredStocks = useMemo(() => {
    return stocks
      .filter(s => {
        // Search term matching (symbol, name, arabic name)
        const matchesSearch =
          s.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.nameAr.includes(searchTerm);

        // Sector filter
        const matchesSector = selectedSector === 'ALL' || s.sector === selectedSector;

        // Signal / Favorites / Custom filter
        let matchesSignal = true;
        if (signalFilter === 'FAVORITES') {
          matchesSignal = favorites.includes(s.symbol);
        } else if (signalFilter === 'BUY') {
          matchesSignal = s.change >= 0;
        } else if (signalFilter === 'SELL') {
          matchesSignal = s.change < 0;
        }

        return matchesSearch && matchesSector && matchesSignal;
      })
      .sort((a, b) => {
        if (sortBy === 'CHANGE') return Math.abs(b.changePercent) - Math.abs(a.changePercent);
        if (sortBy === 'VOLUME') return parseFloat(b.volume) - parseFloat(a.volume);
        return a.symbol.localeCompare(b.symbol);
      });
  }, [stocks, searchTerm, selectedSector, signalFilter, sortBy, favorites]);

  const sectorsList: Array<{ key: SectorType | 'ALL'; labelAr: string; labelEn: string }> = [
    { key: 'ALL', labelAr: `الكل (${stocks.length})`, labelEn: `All (${stocks.length})` },
    { key: 'TECH', labelAr: 'التكنولوجيا والذكاء الاصطناعي', labelEn: 'Tech & AI' },
    { key: 'FINANCE', labelAr: 'المالية والبنوك', labelEn: 'Financials' },
    { key: 'HEALTHCARE', labelAr: 'الرعاية الصحية', labelEn: 'Healthcare' },
    { key: 'CONSUMER', labelAr: 'السلع والتجزئة', labelEn: 'Consumer Goods' },
    { key: 'ENERGY', labelAr: 'الطاقة والنفط', labelEn: 'Energy & Oil' },
    { key: 'INDUSTRIAL', labelAr: 'الصناعة والدفاع', labelEn: 'Industrials' },
    { key: 'AUTO_EV', labelAr: 'السيارات الكهربائية', labelEn: 'EV & Automotive' },
    { key: 'COMMUNICATION', labelAr: 'الاتصالات والترفيه', labelEn: 'Telecom & Media' },
    { key: 'REAL_ESTATE', labelAr: 'العقارات والمنافع', labelEn: 'Real Estate' },
    { key: 'CRYPTO_FINTECH', labelAr: 'الكريبتو والفينتك', labelEn: 'Crypto & Fintech' },
    { key: 'ETF', labelAr: 'صناديق ETF', labelEn: 'Sector ETFs' }
  ];

  return (
    <aside className="w-full lg:w-80 bg-slate-950 border-r border-slate-800 flex flex-col h-full text-slate-200">
      {/* Search Bar & Add Stock Button */}
      <div className="p-3 border-b border-slate-800/80 bg-slate-900/60 space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pr-9 pl-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute left-3 top-2.5 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          <button
            onClick={onOpenAddStock}
            className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center shrink-0"
            title={t.addStockBtn}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Signal Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
          <button
            onClick={() => setSignalFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
              signalFilter === 'ALL'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {lang === 'ar' ? `الكل (${stocks.length})` : `All (${stocks.length})`}
          </button>
          <button
            onClick={() => setSignalFilter('BUY')}
            className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              signalFilter === 'BUY'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            {lang === 'ar' ? 'إشارات شراء' : 'Bullish'}
          </button>
          <button
            onClick={() => setSignalFilter('SELL')}
            className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              signalFilter === 'SELL'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-semibold'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            {lang === 'ar' ? 'إشارات بيع' : 'Bearish'}
          </button>
          <button
            onClick={() => setSignalFilter('FAVORITES')}
            className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              signalFilter === 'FAVORITES'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            {t.favorites} ({favorites.length})
          </button>
        </div>

        {/* Sector Filter Dropdown / Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 text-[11px]">
          {sectorsList.map(sec => (
            <button
              key={sec.key}
              onClick={() => setSelectedSector(sec.key)}
              className={`px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap transition-all cursor-pointer ${
                selectedSector === sec.key
                  ? 'bg-slate-800 text-white font-medium border border-slate-600'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {lang === 'ar' ? sec.labelAr : sec.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Stocks Counter & Sorting Header */}
      <div className="px-3 py-2 bg-slate-900/40 border-b border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
        <span className="font-mono font-medium">
          {lang === 'ar' ? (
            <>تم العثور على <strong className="text-emerald-400">{filteredStocks.length}</strong> سهم</>
          ) : (
            <>Found <strong className="text-emerald-400">{filteredStocks.length}</strong> stocks</>
          )}
        </span>

        <div className="flex items-center gap-1">
          <span className="text-[10px]">{lang === 'ar' ? 'ترتيب:' : 'Sort:'}</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="bg-slate-900 text-slate-300 border border-slate-800 rounded px-1.5 py-0.5 text-[11px] focus:outline-none"
          >
            <option value="CHANGE">{lang === 'ar' ? 'نسبة التغير %' : 'Change %'}</option>
            <option value="VOLUME">{lang === 'ar' ? 'السيولة/الحجم' : 'Volume'}</option>
            <option value="SYMBOL">{lang === 'ar' ? 'الرمز أ-ي' : 'Symbol A-Z'}</option>
          </select>
        </div>
      </div>

      {/* Stock List Scroll Area */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
        {filteredStocks.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <p className="text-slate-400 text-xs">{t.noStocksFound}</p>
            <button
              onClick={onOpenAddStock}
              className="px-4 py-2 bg-emerald-600/80 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 mx-auto cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.addStockBtn}</span>
            </button>
          </div>
        ) : (
          filteredStocks.map((stock, idx) => {
            const isSelected = stock.symbol === selectedSymbol;
            const isFav = favorites.includes(stock.symbol);
            const isPositive = stock.change >= 0;

            return (
              <div
                key={`${stock.symbol}_${idx}`}
                onClick={() => onSelectStock(stock)}
                className={`p-3 transition-all cursor-pointer hover:bg-slate-900/80 flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-slate-900 border-r-4 border-emerald-500 shadow-inner'
                    : ''
                }`}
              >
                {/* Left side: Symbol, Name, Sector Tag */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onToggleFavorite(stock.symbol);
                    }}
                    className="text-slate-600 hover:text-amber-400 transition-colors p-0.5"
                    title={lang === 'ar' ? 'إضافة للمفضلة' : 'Add to Favorites'}
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${
                        isFav ? 'text-amber-400 fill-amber-400' : ''
                      }`}
                    />
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-sm text-slate-100 group-hover:text-emerald-400">
                        {stock.symbol}
                      </span>
                      {stock.isLiveYahoo && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" title="أسعار رسمية مباشرة من ياهو فاينانس"></span>
                      )}
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-medium">
                        {lang === 'ar' ? stock.sectorAr.split(' ')[0] : (SECTOR_LABELS_EN[stock.sector] || stock.sector)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate max-w-[140px]" title={lang === 'ar' ? stock.nameAr : stock.name}>
                      {lang === 'ar' ? stock.nameAr : stock.name}
                    </p>
                  </div>
                </div>

                {/* Right side: Price & Change & Signal Badge */}
                <div className="text-left font-mono">
                  <div className="text-xs font-bold text-slate-100">
                    ${stock.price.toFixed(2)}
                  </div>
                  <div
                    className={`text-[11px] font-semibold flex items-center justify-end gap-0.5 ${
                      isPositive ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isPositive ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span>
                      {isPositive ? '+' : ''}
                      {stock.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};
