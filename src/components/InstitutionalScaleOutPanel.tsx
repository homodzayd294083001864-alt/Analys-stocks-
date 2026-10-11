import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Layers,
  Sparkles,
  TrendingUp,
  Sliders,
  DollarSign,
  PieChart,
  Lock,
  ArrowRightLeft,
  ChevronRight
} from 'lucide-react';

interface InstitutionalScaleOutPanelProps {
  analysis: AnalysisResult;
}

export const InstitutionalScaleOutPanel: React.FC<InstitutionalScaleOutPanelProps> = ({
  analysis
}) => {
  const isGoog = analysis.stock.symbol === 'GOOG' || analysis.stock.symbol === 'GOOGL';
  const setup = analysis.steps.step4.setup;

  // Interactive share count state (default 400 shares for GOOG, customizable)
  const [totalShares, setTotalShares] = useState<number>(setup?.totalPositionShares || 400);

  // False breakout 5M candle close simulation state
  const [is5MCandleClosed, setIs5MCandleClosed] = useState<boolean>(true);

  // Auto-Breakeven trigger simulation state
  const [isTp1Hit, setIsTp1Hit] = useState<boolean>(true);

  if (!setup) return null;

  const entry = setup.entryPrice;
  const initialSl = setup.stopLoss;
  const tp1 = setup.takeProfit1;
  const tp2 = setup.takeProfit2;
  const tp3 = setup.takeProfit3;

  // Share allocations (50% / 30% / 20%)
  const tp1Shares = Math.round(totalShares * 0.50);
  const tp2Shares = Math.round(totalShares * 0.30);
  const tp3Shares = totalShares - tp1Shares - tp2Shares; // remaining runner shares (20%)

  // Profit calculations per tier
  const tp1GainPerShare = Math.max(0, tp1 - entry);
  const tp2GainPerShare = Math.max(0, tp2 - entry);
  const tp3GainPerShare = Math.max(0, tp3 - entry);

  const profitTp1 = tp1Shares * tp1GainPerShare;
  const profitTp2 = tp2Shares * tp2GainPerShare;
  const profitTp3 = tp3Shares * tp3GainPerShare;
  const totalMaxProfit = profitTp1 + profitTp2 + profitTp3;

  // Initial risk before TP1
  const initialRiskPerShare = Math.abs(entry - initialSl);
  const totalInitialRiskDollars = totalShares * initialRiskPerShare;

  return (
    <div className="bg-slate-950 border-2 border-amber-500/30 rounded-2xl p-5 md:p-6 shadow-2xl space-y-6 text-slate-100 relative overflow-hidden">
      {/* Subtle Background Glow Accent */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <Zap className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white flex items-center gap-2 font-sans">
                نظام الخروج التدريجي والتنفيذ الآلي (Scale-Out & Auto-Breakeven Engine)
              </h2>
              {isGoog && (
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full font-mono uppercase">
                  تحديث GOOG المخصص
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              مخصص لسهم <strong className="text-amber-300 font-mono">{analysis.stock.symbol} ({analysis.stock.nameAr})</strong> ومصمم للعمل بمرونة كاملة مع أي سهم آخر
            </p>
          </div>
        </div>

        {/* Dynamic Share Count Selector */}
        <div className="bg-slate-900 border border-slate-700/80 p-2 rounded-xl flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-slate-300">حجم المحفظة:</span>
          <div className="relative">
            <input
              type="number"
              value={totalShares}
              onChange={e => setTotalShares(Math.max(1, Number(e.target.value) || 100))}
              className="w-24 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs font-mono font-bold text-amber-300 text-center focus:outline-none focus:border-amber-400"
            />
          </div>
          <span className="text-xs text-slate-400 font-mono">سهم</span>
        </div>
      </div>

      {/* Feature 1: False Breakout Filter (5M CHoCH Confirmation) */}
      <div className="bg-slate-900/80 border border-indigo-500/30 rounded-xl p-4 space-y-3 relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                1. فلترة الشموع الكاذبة (False Breakout Filter) - إطار 5 دقائق (5M CHoCH)
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                حظر تفعيل الدخول عند <span className="text-cyan-300 font-mono font-bold">${entry}</span> حتى تأكيد إغلاق شمعة 5M كاملة فوق كاسر الهيكل CHoCH
              </p>
            </div>
          </div>

          {/* Interactive Simulation Switch */}
          <button
            onClick={() => setIs5MCandleClosed(!is5MCandleClosed)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
              is5MCandleClosed
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60'
                : 'bg-rose-950/60 border-rose-500/50 text-rose-300 hover:bg-rose-900/60'
            }`}
          >
            {is5MCandleClosed ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>إغلاق 5M مؤكد فوق CHoCH (الدخول نشط)</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>محاولة كسر كاذب (ذيل فقط) - الدخول مجمد</span>
              </>
            )}
          </button>
        </div>

        {/* Filter Details Box */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <span className="text-[10px] text-slate-400 font-sans block">سعر نقطة الدخول (Entry):</span>
            <span className="text-cyan-300 font-bold">${entry}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-sans block">حالة شمعة الـ 5M الحالية:</span>
            <span className={is5MCandleClosed ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
              {is5MCandleClosed ? `إغلاق شمعة فوق $${entry} ✅` : `اختراق كاذب (Wick Sweep) ⚠️`}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-sans block">القرار البرمجي التلقائي:</span>
            <span className={is5MCandleClosed ? 'text-emerald-300 font-bold' : 'text-rose-400 font-bold'}>
              {is5MCandleClosed ? 'تأكيد التنفيذ (Order Executed)' : 'إلغاء الأمر لحين الإغلاق'}
            </span>
          </div>
        </div>
      </div>

      {/* Feature 2: Auto-Breakeven Risk Automation */}
      <div className="bg-slate-900/80 border border-emerald-500/30 rounded-xl p-4 space-y-3 relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                2. الأتمتة الكاملة لإدارة المخاطر (Auto-Breakeven at TP1)
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                نقل امر وقف الخسارة (SL) تلقائياً إلى سعر الدخول (<span className="text-cyan-300 font-mono font-bold">${entry}</span>) فور وصول السعر للهدف الأول TP1 (<span className="text-emerald-300 font-mono font-bold">${tp1}</span>)
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsTp1Hit(!isTp1Hit)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
              isTp1Hit
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{isTp1Hit ? 'محاكاة: تم تحريك الوقف للتعادل $353.47 ✅' : 'محاكاة: الوقف الأولي $320.00'}</span>
          </button>
        </div>

        {/* Risk Transition Visualizer */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-rose-950/60 border border-rose-500/40 text-center">
              <span className="text-[9px] text-rose-300 font-sans block">الوقف الأولي (Initial SL)</span>
              <span className="text-rose-400 font-bold">${initialSl}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
            <div className={`p-2 rounded border text-center transition-all ${
              isTp1Hit
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold ring-2 ring-emerald-500/30'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}>
              <span className="text-[9px] font-sans block">الوقف التلقائي الجسري (Auto-Breakeven SL)</span>
              <span>${entry} (مخاطرة $0.00)</span>
            </div>
          </div>

          <div className="text-left font-sans">
            <span className="text-[10px] text-slate-400 block">درجة أمان رأس المال:</span>
            <span className={`text-xs font-bold font-mono ${isTp1Hit ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isTp1Hit ? '100% صفقة خالية من المخاطر (Risk-Free)' : `المخاطرة الأولية: $${totalInitialRiskDollars.toFixed(2)}`}
            </span>
          </div>
        </div>
      </div>

      {/* Feature 3: Scale-Out Strategy Execution Matrix (50% / 30% / 20%) */}
      <div className="space-y-3 relative z-10">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-amber-300 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-amber-400" />
            <span>3. استراتيجية الخروج التدريجي (Scale-Out Matrix - {totalShares} سهم):</span>
          </h3>
          <span className="text-xs text-emerald-400 font-mono font-bold">
            إجمالي الأرباح المستهدفة: +${totalMaxProfit.toFixed(2)}
          </span>
        </div>

        {/* 3 Targets Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Target 1 - 50% Scale Out */}
          <div className="bg-slate-900/90 border-2 border-emerald-500/40 rounded-xl p-4 space-y-3 relative overflow-hidden group hover:border-emerald-400 transition-all">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-xs font-black text-emerald-400 font-mono">الهدف الأول (TP1)</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                إغلاق 50%
              </span>
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-slate-300">
                <span>سعر الهدف:</span>
                <span className="text-emerald-300 font-bold">${tp1}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>عدد الأسهم المبيعة:</span>
                <span className="text-amber-300 font-bold">{tp1Shares} سهم</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>الربح المحقق عند TP1:</span>
                <span className="text-emerald-400 font-extrabold">+${profitTp1.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>تفعيل الـ Auto-Breakeven تلقائياً على باقي الأسهم</span>
            </div>
          </div>

          {/* Target 2 - 30% Scale Out */}
          <div className="bg-slate-900/90 border-2 border-cyan-500/40 rounded-xl p-4 space-y-3 relative overflow-hidden group hover:border-cyan-400 transition-all">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-xs font-black text-cyan-400 font-mono">الهدف الثاني (TP2)</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                إغلاق 30%
              </span>
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-slate-300">
                <span>سعر الهدف:</span>
                <span className="text-cyan-300 font-bold">${tp2}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>عدد الأسهم المبيعة:</span>
                <span className="text-amber-300 font-bold">{tp2Shares} سهم</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>الربح المحقق عند TP2:</span>
                <span className="text-cyan-400 font-extrabold">+${profitTp2.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>تفعيل التوقف المتحرك (Trailing Stop)</span>
            </div>
          </div>

          {/* Target 3 - 20% Runner Liquidation */}
          <div className="bg-slate-900/90 border-2 border-amber-500/40 rounded-xl p-4 space-y-3 relative overflow-hidden group hover:border-amber-400 transition-all">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-xs font-black text-amber-400 font-mono">الهدف النهائي (TP3)</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                إغلاق المتبقي 20%
              </span>
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-slate-300">
                <span>سعر الهدف:</span>
                <span className="text-amber-300 font-bold">${tp3}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>عدد أسهم الـ Runner:</span>
                <span className="text-amber-300 font-bold">{tp3Shares} سهم</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>الربح المحقق عند TP3:</span>
                <span className="text-amber-400 font-extrabold">+${profitTp3.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>تصفية المركز 100% بأعلى ربح ممكن</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
