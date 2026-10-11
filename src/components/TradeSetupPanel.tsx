import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import {
  DollarSign,
  Calculator,
  ShieldAlert,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  CheckCircle,
  Copy,
  Sparkles
} from 'lucide-react';

interface TradeSetupPanelProps {
  analysis: AnalysisResult;
}

export const TradeSetupPanel: React.FC<TradeSetupPanelProps> = ({ analysis }) => {
  const [capital, setCapital] = useState<number>(10000); // $10,000 default account size
  const [riskPercent, setRiskPercent] = useState<number>(1.0); // 1.0% risk per trade
  const [copied, setCopied] = useState(false);

  const setup = analysis.steps.step4.setup;
  if (!setup) return null;

  const isBuy = setup.signal === 'BUY';
  const entry = setup.entryPrice;
  const sl = setup.stopLoss;

  // Position sizing calculations
  const riskAmountDollars = (capital * riskPercent) / 100;
  const priceRiskPerShare = Math.abs(entry - sl) || 0.1;
  const sharesToBuy = Math.floor(riskAmountDollars / priceRiskPerShare);
  const totalPositionCost = sharesToBuy * entry;

  const profitTP1 = sharesToBuy * Math.abs(setup.takeProfit1 - entry);
  const profitTP2 = sharesToBuy * Math.abs(setup.takeProfit2 - entry);
  const profitTP3 = sharesToBuy * Math.abs(setup.takeProfit3 - entry);

  const handleCopySetup = () => {
    const text = `
⚡ **صفقة SMC متكاملة لسهم ${analysis.stock.symbol}** ⚡
- نوع الصفقة: ${isBuy ? 'شراء (BUY 🟢)' : 'بيع (SELL 🔴)'}
- سعر الدخول (Entry): $${setup.entryPrice}
- وقف الخسارة (SL): $${setup.stopLoss} (${setup.stopLossPipsPercent}%)
- الهدف الأول (TP1): $${setup.takeProfit1}
- الهدف الثاني (TP2): $${setup.takeProfit2}
- الهدف الثالث (TP3): $${setup.takeProfit3}
- نسبة المخاطرة للعائد (R:R): 1:${setup.riskRewardRatio}
- الحساب المقترح: ${sharesToBuy} أسهم ($${totalPositionCost.toFixed(0)}) عند مخاطرة $${riskAmountDollars.toFixed(0)}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-5 text-slate-100">
      {/* Top Header & Copy Button */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isBuy ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400 animate-pulse'
            }`}
          ></div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            بطاقة الصفقة وحاسبة إدارة المخاطر (Risk Calculator)
          </h2>
        </div>

        <button
          onClick={handleCopySetup}
          className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer font-medium"
        >
          {copied ? (
            <>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">تم النسخ!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>نسخ إعدادات الصفقة</span>
            </>
          )}
        </button>
      </div>

      {/* Primary Trade Signal Badge Banner */}
      <div
        className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4 ${
          isBuy
            ? 'bg-gradient-to-r from-emerald-950/40 via-teal-950/20 to-slate-950 border-emerald-500/40'
            : 'bg-gradient-to-r from-rose-950/40 via-red-950/20 to-slate-950 border-rose-500/40'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-slate-950 font-bold text-lg ${
              isBuy ? 'bg-emerald-400' : 'bg-rose-500'
            }`}
          >
            {isBuy ? (
              <ArrowUpRight className="w-7 h-7 stroke-[2.5]" />
            ) : (
              <ArrowDownRight className="w-7 h-7 stroke-[2.5]" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-white font-mono">
                {isBuy ? 'إشارة شراء مؤكدة (BUY)' : 'إشارة بيع مؤكدة (SELL)'}
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-300">
                1 : {setup.riskRewardRatio} R:R
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">{setup.reasonAr}</p>
          </div>
        </div>

        {/* Targets Summary Grid */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div>
            <span className="text-[10px] text-slate-400 block">وقف الخسارة SL</span>
            <span className="text-rose-400 font-bold">${setup.stopLoss}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">الدخول Entry</span>
            <span className="text-cyan-300 font-bold">${setup.entryPrice}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">الهدف TP2</span>
            <span className="text-emerald-400 font-bold">${setup.takeProfit2}</span>
          </div>
        </div>
      </div>

      {/* Position Sizing Calculator Inputs */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span>حساب كمية الأسهم ودرجة المخاطرة التلقائية:</span>
          </h3>
          <span className="text-[11px] text-slate-400">
            حجم الحساب الحالي $10,000 (يمكنك تغييره)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Capital Input */}
          <div className="space-y-1">
            <label className="text-slate-400 text-[11px] block">
              رأس المال المخصص للتداول ($):
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
              <input
                type="number"
                value={capital}
                onChange={e => setCapital(Number(e.target.value) || 1000)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pr-9 pl-3 py-2 text-slate-100 font-mono font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Risk % Input */}
          <div className="space-y-1">
            <label className="text-slate-400 text-[11px] block">
              نسبة المخاطرة القصوى لكل صفقة (%):
            </label>
            <div className="relative">
              <Percent className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
              <input
                type="number"
                step="0.25"
                value={riskPercent}
                onChange={e => setRiskPercent(Number(e.target.value) || 0.5)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pr-9 pl-3 py-2 text-slate-100 font-mono font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Calculated Results Box */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono pt-2 border-t border-slate-800/80">
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 font-sans block">
              أقصى خسارة مسموحة ($)
            </span>
            <span className="text-sm font-bold text-rose-400">
              ${riskAmountDollars.toFixed(2)}
            </span>
          </div>

          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 font-sans block">
              عدد الأسهم الموصى به
            </span>
            <span className="text-sm font-bold text-cyan-300">
              {sharesToBuy} سهم
            </span>
          </div>

          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 font-sans block">
              إجمالي قيمة الشراء
            </span>
            <span className="text-sm font-bold text-slate-200">
              ${totalPositionCost.toFixed(2)}
            </span>
          </div>

          <div className="bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-500/30">
            <span className="text-[10px] text-emerald-300 font-sans block">
              الربح المتوقع عند TP2
            </span>
            <span className="text-sm font-bold text-emerald-400">
              +${profitTP2.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
