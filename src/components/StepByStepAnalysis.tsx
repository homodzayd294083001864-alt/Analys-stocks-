import React, { useState } from 'react';
import { AnalysisResult, Timeframe } from '../types';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Layers,
  Target,
  Zap,
  ShieldAlert,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';

interface StepByStepAnalysisProps {
  analysis: AnalysisResult;
  selectedTimeframe: Timeframe;
  onSelectTimeframe: (tf: Timeframe) => void;
  onRunAutoAnalysis: () => void;
  isAnalyzing: boolean;
  activeStepProgress: number; // 0 to 4
}

export const StepByStepAnalysis: React.FC<StepByStepAnalysisProps> = ({
  analysis,
  selectedTimeframe,
  onSelectTimeframe,
  onRunAutoAnalysis,
  isAnalyzing,
  activeStepProgress
}) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(4); // default open step 4

  const steps = analysis.steps;
  const setup = steps.step4.setup;

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-5 text-slate-100">
      {/* Top Banner & "Run Automated Analysis" Action Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              محرك التحليل الذكي للـ 4 خطوات (SMC Engine)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            فحص أوتوماتيكي متكامل للسهم عبر 4 أطر زمنية متسلسلة بدقة عالية
          </p>
        </div>

        {/* The Mandatory "تشغيل التحليل الآلي" Button */}
        <button
          onClick={onRunAutoAnalysis}
          disabled={isAnalyzing}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2.5 shadow-lg ${
            isAnalyzing
              ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-400 border-t-emerald-400 rounded-full animate-spin"></div>
              <span>جاري الفحص الآلي للخطوات...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-slate-950" />
              <span>تشغيل التحليل الآلي للـ 4 خطوات</span>
            </>
          )}
        </button>
      </div>

      {/* Progress Stepper Bar */}
      {isAnalyzing && (
        <div className="space-y-2 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="flex justify-between text-xs font-medium text-slate-300">
            <span>تقدم محرك التحليل الآلي:</span>
            <span className="text-emerald-400 font-mono">
              الخطوة {activeStepProgress} من 4 (
              {Math.min(100, activeStepProgress * 25)}%)
            </span>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-500"
              style={{ width: `${activeStepProgress * 25}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* 4 Step Cards Accordion / List */}
      <div className="space-y-4">
        {/* ================= STEP 1: 4H TREND ================= */}
        <div
          className={`border rounded-xl transition-all ${
            activeStepProgress >= 1 || !isAnalyzing
              ? 'border-slate-800 bg-slate-900/60'
              : 'border-slate-800/40 opacity-50 bg-slate-950'
          }`}
        >
          <div
            onClick={() => onSelectTimeframe('4H')}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-900/90 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold flex items-center justify-center text-xs font-mono">
                01
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">
                    الخطوة الأولى (إطار 4 ساعات - فحص الاتجاه العام)
                  </h3>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      steps.step1.trend === 'BULLISH'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    اتجاه {steps.step1.trendAr}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  قمم وقيعان إطار 4H لتحديد المسار العام ومناطق العرض والطلب
                </p>
              </div>
            </div>

            <button
              onClick={e => {
                e.stopPropagation();
                setExpandedStep(expandedStep === 1 ? null : 1);
              }}
              className="text-slate-400 hover:text-white p-1"
            >
              {expandedStep === 1 ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Step 1 Expanded Details */}
          {expandedStep === 1 && (
            <div className="px-4 pb-4 pt-1 border-t border-slate-800/80 space-y-3 text-xs">
              <p className="text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800/60">
                {steps.step1.summaryAr}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Supply Zone Box */}
                <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-3 space-y-1">
                  <div className="text-rose-400 font-bold flex items-center gap-1.5 text-xs">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>منطقة العرض الرئيسية (4H Supply Zone)</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    $
                    {steps.step1.majorSupplyZone.priceLow.toFixed(2)} - $
                    {steps.step1.majorSupplyZone.priceHigh.toFixed(2)}
                  </p>
                </div>

                {/* Demand Zone Box */}
                <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-3 space-y-1">
                  <div className="text-emerald-400 font-bold flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>منطقة الطلب الرئيسية (4H Demand Zone)</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    $
                    {steps.step1.majorDemandZone.priceLow.toFixed(2)} - $
                    {steps.step1.majorDemandZone.priceHigh.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================= STEP 2: 4H MAP & ROUND NUMBERS ================= */}
        <div
          className={`border rounded-xl transition-all ${
            activeStepProgress >= 2 || !isAnalyzing
              ? 'border-slate-800 bg-slate-900/60'
              : 'border-slate-800/40 opacity-50 bg-slate-950'
          }`}
        >
          <div
            onClick={() => onSelectTimeframe('4H')}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-900/90 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-bold flex items-center justify-center text-xs font-mono">
                02
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">
                    الخطوة الثانية (إطار 4 ساعات - الخريطة الهيكلية والأرقام الدائرية)
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  تحديد المستويات النفسية الدائرية (Round Numbers) ومستويات الفيبوناتشي
                </p>
              </div>
            </div>

            <button
              onClick={e => {
                e.stopPropagation();
                setExpandedStep(expandedStep === 2 ? null : 2);
              }}
              className="text-slate-400 hover:text-white p-1"
            >
              {expandedStep === 2 ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Step 2 Expanded Details */}
          {expandedStep === 2 && (
            <div className="px-4 pb-4 pt-1 border-t border-slate-800/80 space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Round Numbers mapping */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-amber-400 font-bold text-xs flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" />
                    <span>المستويات النفسية الدائرية (Psychological Levels):</span>
                  </div>
                  <div className="space-y-1">
                    {steps.step2.roundNumbers.map((rn, idx) => (
                      <div
                        key={idx}
                        className={`flex justify-between items-center px-2 py-1 rounded text-[11px] font-mono ${
                          rn.isReactionZone
                            ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                            : 'bg-slate-900 text-slate-400'
                        }`}
                      >
                        <span>{rn.label}</span>
                        <span>
                          {rn.isReactionZone ? '🎯 منطقة ارتداد حادة' : `${rn.distancePercent}%`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fibonacci levels */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-cyan-400 font-bold text-xs flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    <span>مستويات فيبوناتشي والتوازن (Equilibrium):</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-300">
                    <li className="flex justify-between py-1 border-b border-slate-800/60">
                      <span>المنطقة الذهبية (61.8% Fib):</span>
                      <strong className="font-mono text-cyan-300">
                        ${steps.step2.fib618}
                      </strong>
                    </li>
                    <li className="flex justify-between py-1 border-b border-slate-800/60">
                      <span>توازن التداول (50.0% Equilibrium):</span>
                      <strong className="font-mono text-slate-200">
                        ${steps.step2.fib500}
                      </strong>
                    </li>
                    <li className="flex justify-between py-1">
                      <span>دعم التراجع السريع (38.2% Fib):</span>
                      <strong className="font-mono text-slate-400">
                        ${steps.step2.fib382}
                      </strong>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================= STEP 3: 1H SMC SETUPS ================= */}
        <div
          className={`border rounded-xl transition-all ${
            activeStepProgress >= 3 || !isAnalyzing
              ? 'border-slate-800 bg-slate-900/60'
              : 'border-slate-800/40 opacity-50 bg-slate-950'
          }`}
        >
          <div
            onClick={() => onSelectTimeframe('1H')}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-900/90 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold flex items-center justify-center text-xs font-mono">
                03
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">
                    الخطوة الثالثة (إطار الساعة 1H - أدوات المال الذكي SMC)
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  فحص اختراق الهيكل (BOS)، كتلة الأوامر (OB)، وفجوة القيمة (FVG)
                </p>
              </div>
            </div>

            <button
              onClick={e => {
                e.stopPropagation();
                setExpandedStep(expandedStep === 3 ? null : 3);
              }}
              className="text-slate-400 hover:text-white p-1"
            >
              {expandedStep === 3 ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Step 3 Expanded Details */}
          {expandedStep === 3 && (
            <div className="px-4 pb-4 pt-1 border-t border-slate-800/80 space-y-3 text-xs">
              <p className="text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800/60">
                {steps.step3.summaryAr}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* BOS Box */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-blue-400 font-bold text-xs">
                    BOS (اختراق الهيكل)
                  </div>
                  <p className="text-slate-300 font-mono text-[11px]">
                    {steps.step3.bosList.length > 0
                      ? steps.step3.bosList[0].labelAr
                      : 'تم تأكيد الكسر الصاعد'}
                  </p>
                </div>

                {/* Order Block Box */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-emerald-400 font-bold text-xs">
                    Order Block (كتلة الأوامر)
                  </div>
                  <p className="text-slate-300 font-mono text-[11px]">
                    $
                    {steps.step3.activeOrderBlock?.low.toFixed(2)} - $
                    {steps.step3.activeOrderBlock?.high.toFixed(2)}
                  </p>
                </div>

                {/* Fair Value Gap Box */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-cyan-400 font-bold text-xs">
                    FVG (فجوة القيمة العادلة)
                  </div>
                  <p className="text-slate-300 font-mono text-[11px]">
                    $
                    {steps.step3.activeFVG?.bottom.toFixed(2)} - $
                    {steps.step3.activeFVG?.top.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================= STEP 4: 5M EXECUTION TRIGGER ================= */}
        <div
          className={`border rounded-xl transition-all ${
            activeStepProgress >= 4 || !isAnalyzing
              ? 'border-purple-500/40 bg-purple-950/10'
              : 'border-slate-800/40 opacity-50 bg-slate-950'
          }`}
        >
          <div
            onClick={() => onSelectTimeframe('5M')}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-900/90 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold flex items-center justify-center text-xs font-mono">
                04
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">
                    الخطوة الرابعة (إطار 5 دقائق - تفعيل وتأكيد صفقة الدخول)
                  </h3>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      setup?.signal === 'BUY'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    إشارة {setup?.signal === 'BUY' ? 'شراء BUY 🟢' : 'بيع SELL 🔴'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  شمعة التأكيد على 5M لحساب نقطة الدخول، وقف الخسارة، والهدف
                </p>
              </div>
            </div>

            <button
              onClick={e => {
                e.stopPropagation();
                setExpandedStep(expandedStep === 4 ? null : 4);
              }}
              className="text-slate-400 hover:text-white p-1"
            >
              {expandedStep === 4 ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Step 4 Expanded Details */}
          {expandedStep === 4 && setup && (
            <div className="px-4 pb-4 pt-1 border-t border-purple-900/40 space-y-3 text-xs">
              <div className="bg-purple-950/30 border border-purple-500/30 p-3 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-400 animate-pulse" />
                  <span className="font-bold text-slate-200">
                    {steps.step4.triggerStatusAr}
                  </span>
                </div>
                <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  R:R = 1 : {setup.riskRewardRatio}
                </span>
              </div>

              {/* Exact Execution Grid Parameters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-center">
                <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 block font-sans">
                    سعر الدخول (Entry)
                  </span>
                  <strong className="text-sm text-cyan-300 font-bold block">
                    ${setup.entryPrice.toFixed(2)}
                  </strong>
                </div>

                <div className="bg-rose-950/20 border border-rose-500/30 p-2.5 rounded-xl space-y-1">
                  <span className="text-[10px] text-rose-300 block font-sans">
                    وقف الخسارة (Stop Loss)
                  </span>
                  <strong className="text-sm text-rose-400 font-bold block">
                    ${setup.stopLoss.toFixed(2)}
                  </strong>
                </div>

                <div className="bg-emerald-950/20 border border-emerald-500/30 p-2.5 rounded-xl space-y-1">
                  <span className="text-[10px] text-emerald-300 block font-sans">
                    الهدف الأول (TP1)
                  </span>
                  <strong className="text-sm text-emerald-400 font-bold block">
                    ${setup.takeProfit1.toFixed(2)}
                  </strong>
                </div>

                <div className="bg-emerald-950/20 border border-emerald-500/30 p-2.5 rounded-xl space-y-1">
                  <span className="text-[10px] text-emerald-300 block font-sans">
                    الهدف الثاني (TP2)
                  </span>
                  <strong className="text-sm text-emerald-300 font-bold block">
                    ${setup.takeProfit2.toFixed(2)}
                  </strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
