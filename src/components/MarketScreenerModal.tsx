import React, { useState, useMemo } from 'react';
import { Stock, SectorType } from '../types';
import { analyzeSMCStrategy } from '../utils/smcEngine';
import {
  X,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface MarketScreenerModalProps {
  isOpen: boolean;
  onClose: () => void;
  stocks: Stock[];
  onSelectStock: (stock: Stock) => void;
}

export const MarketScreenerModal: React.FC<MarketScreenerModalProps> = ({
  isOpen,
  onClose,
  stocks,
  onSelectStock
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'BUY' | 'SELL'>('ALL');
  const [sectorFilter, setSectorFilter] = useState<SectorType | 'ALL'>('ALL');

  if (!isOpen) return null;

  // Run quick SMC screening across all 400 stocks
  const screenedList = useMemo(() => {
    return stocks
      .map(stock => {
        const analysis = analyzeSMCStrategy(stock);
        const setup = analysis.steps.step4.setup;
        return {
          stock,
          trend: analysis.steps.step1.trend,
          signal: setup?.signal || 'NEUTRAL',
          entry: setup?.entryPrice || stock.price,
          sl: setup?.stopLoss || 0,
          tp2: setup?.takeProfit2 || 0,
          rrRatio: setup?.riskRewardRatio || 2.0,
          ob: analysis.steps.step3.activeOrderBlock
        };
      })
      .filter(item => {
        const matchesSearch =
          item.stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.stock.nameAr.includes(searchTerm);

        const matchesSector = sectorFilter === 'ALL' || item.stock.sector === sectorFilter;

        let matchesFilter = true;
        if (filterType === 'BUY') matchesFilter = item.signal === 'BUY';
        if (filterType === 'SELL') matchesFilter = item.signal === 'SELL';

        return matchesSearch && matchesSector && matchesFilter;
      });
  }, [stocks, searchTerm, filterType, sectorFilter]);

  const buyCount = screenedList.filter(i => i.signal === 'BUY').length;
  const sellCount = screenedList.filter(i => i.signal === 'SELL').length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Filter className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                ماسح الفرص لـ 400 سهم أمريكي (SMC Screener)
              </h2>
              <p className="text-xs text-slate-400">
                فحص فوري لإشارات الشراء والبيع والنسبة العالية للعائد للمخاطرة R:R
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 bg-slate-900/40 border-b border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="تصفية السهم بالرمز أو الاسم..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pr-9 pl-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Quick Filter Buttons */}
            <div className="flex items-center gap-1.5 font-mono">
              <button
                onClick={() => setFilterType('ALL')}
                className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  filterType === 'ALL'
                    ? 'bg-slate-800 text-white border-slate-600 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                الكل ({screenedList.length})
              </button>
              <button
                onClick={() => setFilterType('BUY')}
                className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                  filterType === 'BUY'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                شراء ({buyCount})
              </button>
              <button
                onClick={() => setFilterType('SELL')}
                className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                  filterType === 'SELL'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
                بيع ({sellCount})
              </button>
            </div>
          </div>
        </div>

        {/* Stock List Results Table */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {screenedList.map((item, idx) => {
              const isBuy = item.signal === 'BUY';
              return (
                <div
                  key={`${item.stock.symbol}_${idx}`}
                  onClick={() => {
                    onSelectStock(item.stock);
                    onClose();
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer hover:scale-[1.01] flex flex-col justify-between space-y-3 ${
                    isBuy
                      ? 'bg-gradient-to-b from-slate-900 to-emerald-950/20 border-emerald-500/30 hover:border-emerald-500'
                      : 'bg-gradient-to-b from-slate-900 to-rose-950/20 border-rose-500/30 hover:border-rose-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-base text-white">
                          {item.stock.symbol}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                          {item.stock.sectorAr.split(' ')[0]}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate max-w-[160px]">
                        {item.stock.nameAr}
                      </p>
                    </div>

                    <span
                      className={`text-xs px-2.5 py-1 rounded-lg font-bold font-mono flex items-center gap-1 ${
                        isBuy
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {isBuy ? 'BUY 🟢' : 'SELL 🔴'}
                    </span>
                  </div>

                  {/* Pricing and Levels */}
                  <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 grid grid-cols-3 gap-2 text-center font-mono text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block">السعر</span>
                      <strong className="text-white">${item.stock.price.toFixed(2)}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">الدخول</span>
                      <strong className="text-cyan-300">${item.entry}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">R:R</span>
                      <strong className="text-amber-400">1:{item.rrRatio}</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1 text-slate-300 font-mono">
                      <Zap className="w-3 h-3 text-emerald-400" />
                      تأكيد 5M
                    </span>
                    <span className="text-emerald-400 font-medium hover:underline flex items-center gap-1">
                      افتح التحليل التفصيلي
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
