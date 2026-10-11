import React from 'react';
import {
  X,
  BookOpen,
  Layers,
  Target,
  Zap,
  TrendingUp,
  ShieldCheck,
  Award
} from 'lucide-react';

interface StrategyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StrategyGuideModal: React.FC<StrategyGuideModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                دليل استراتيجية المال الذكي المؤسساتية (SMC 4 Timeframes Guide)
              </h2>
              <p className="text-xs text-slate-400">
                كيف تتداول كالبنوك وصناديق التحوط عبر الأطر الزمنية المتعددة
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

        {/* Guide Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs leading-relaxed text-slate-300">
          {/* Introduction Card */}
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-2">
            <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              ما هي استراتيجية المال الذكي (Smart Money Concepts - SMC)؟
            </h3>
            <p>
              استراتيجية المال الذكي قائمة على فهم تتبع حركة كبار الفاعلين في السوق (البنوك وصناديق التحوط والمؤسسات المالية) عبر دراسة السيولة، كتل الأوامر (Order Blocks)، وفجوات القيمة العادلة (Fair Value Gaps)، بدلاً من المؤشرات التقليدية المتأخرة.
            </p>
          </div>

          {/* 4 Steps Detailed Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Step 1 */}
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-300 font-mono font-bold flex items-center justify-center text-xs">
                  1
                </span>
                <h4 className="text-sm font-bold text-white">
                  الخطوة الأولى: إطار الـ 4 ساعات (4H Trend & HTF Zones)
                </h4>
              </div>
              <p className="text-slate-400">
                نقوم بتحليل الاتجاه العام (Higher Timeframe Bias). إذا كانت الشموع تسجل قيعان متصاعدة HH/HL فإن الاتجاه صاعد، وإذا كانت تسجل قمم وقيعان متناقصة LH/LL فإن الاتجاه هابط. كما يتم رسم منافذ مناطق الطلب والعرض الكبرى (Major Supply & Demand).
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-yellow-500/20 text-yellow-300 font-mono font-bold flex items-center justify-center text-xs">
                  2
                </span>
                <h4 className="text-sm font-bold text-white">
                  الخطوة الثانية: الأرقام الدائرية النفسية (Round Numbers)
                </h4>
              </div>
              <p className="text-slate-400">
                تضع المؤسسات المالية ملايين الأوامر المعلقة عند الأرقام الدائرية مثل ($100, $150, $200). هذه المستويات تعمل كمغناطيس ارتدادي حاد للسعر.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-cyan-500/20 text-cyan-300 font-mono font-bold flex items-center justify-center text-xs">
                  3
                </span>
                <h4 className="text-sm font-bold text-white">
                  الخطوة الثالثة: إطار الساعة (1H SMC Setup: BOS, OB, FVG)
                </h4>
              </div>
              <p className="text-slate-400">
                نحدد اختراق هيكل السوق (Break of Structure - BOS)، وكتلة الأوامر المؤسساتية (Order Block) التي سبقت الانطلاقة، وفجوة القيمة العادلة غير الممتلئة (Fair Value Gap - FVG).
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-purple-500/20 text-purple-300 font-mono font-bold flex items-center justify-center text-xs">
                  4
                </span>
                <h4 className="text-sm font-bold text-white">
                  الخطوة الرابعة: إطار 5 دقائق (5M Entry Trigger & Execution)
                </h4>
              </div>
              <p className="text-slate-400">
                عند عودة السعر لمنطقة OB أو FVG على إطار الساعة، ننتظر شمعة تأكيد وتغيير الطابع (CHoCH / Engulfing) على إطار الـ 5 دقائق للدخول بدقة عالية وقف خسارة ضيق ونسبة مخاطرة للعائد ممتازة (1:3 إلى 1:5 R:R).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
