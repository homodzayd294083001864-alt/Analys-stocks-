import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { AnalysisResult } from '../types';
import {
  X,
  Sparkles,
  Bot,
  Copy,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';

interface AiReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: AnalysisResult;
}

export const AiReportModal: React.FC<AiReportModalProps> = ({
  isOpen,
  onClose,
  analysis
}) => {
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const setup = analysis.steps.step4.setup;

  const handleGenerateReport = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/smc-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stockSymbol: analysis.stock.symbol,
          stockName: analysis.stock.nameAr,
          price: analysis.lastPrice,
          trend: analysis.steps.step1.trendAr,
          entry: setup?.entryPrice,
          stopLoss: setup?.stopLoss,
          tp1: setup?.takeProfit1,
          tp2: setup?.takeProfit2,
          tp3: setup?.takeProfit3,
          rrRatio: setup?.riskRewardRatio,
          obLow: analysis.steps.step3.activeOrderBlock?.low,
          obHigh: analysis.steps.step3.activeOrderBlock?.high,
          fvgBottom: analysis.steps.step3.activeFVG?.bottom,
          fvgTop: analysis.steps.step3.activeFVG?.top
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'فشل توليد التقرير بواسطة Gemini.');
      }

      setReport(data.report);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'تعذر الاتصال بالخادم لتوليد التقرير الذكي.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!report) return;
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-purple-500/30 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                التقرير المؤسساتي الفائق الذكاء (Gemini SMC AI)
              </h2>
              <p className="text-xs text-slate-400">
                تحليل معمق لسهم {analysis.stock.symbol} ({analysis.stock.nameAr}) بذكاء Gemini
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!report && !loading && !error && (
            <div className="text-center py-12 space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto">
                <Bot className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">
                  إنشاء تقرير مؤسساتي شامل للسهم
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  يقوم نموذج Gemini 3.6 Flash بصياغة تقرير تحليلي منسق باللغة العربية بأسلوب صناديق التحوط يغطي الاتجاه، الخريطة الهيكلية، أدوات المال الذكي، وإدارة المخاطر.
                </p>
              </div>

              <button
                onClick={handleGenerateReport}
                className="w-full py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-purple-500/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>توليد التقرير المؤسساتي للـ {analysis.stock.symbol} الآن</span>
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center py-16 space-y-4">
              <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-400 rounded-full animate-spin mx-auto"></div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-purple-200">
                  جاري صياغة التقرير المؤسساتي بواسطة Gemini AI...
                </p>
                <p className="text-xs text-slate-400">
                  فحص أطر الـ 4H والـ 1H وتكتيكات 5M في ثوانٍ معدودة
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-rose-950/30 border border-rose-500/40 rounded-xl space-y-3 text-xs text-rose-300">
              <div className="flex items-center gap-2 font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>حدث خطأ أثناء الاتصال بالنموذج الذكي:</span>
              </div>
              <p>{error}</p>
              <button
                onClick={handleGenerateReport}
                className="px-4 py-2 bg-rose-900/60 hover:bg-rose-800 text-white rounded-lg transition-all font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>إعادة المحاولة</span>
              </button>
            </div>
          )}

          {report && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-xs text-purple-300 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  تم التوليد بنجاح بواسطة Gemini 3.6 Flash
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">تم النسخ</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>نسخ النص</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleGenerateReport}
                    className="px-3 py-1.5 bg-purple-900/40 hover:bg-purple-800/60 text-purple-200 text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>تحديث التقرير</span>
                  </button>
                </div>
              </div>

              {/* Report Text Display Box */}
              <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl text-xs leading-relaxed text-slate-200 font-sans space-y-4 prose prose-invert max-w-none">
                <Markdown>{report}</Markdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
