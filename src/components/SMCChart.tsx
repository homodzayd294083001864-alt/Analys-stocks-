import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Candle,
  Timeframe,
  AnalysisResult,
  Stock
} from '../types';
import { TRANSLATIONS, Language } from '../translations';
import {
  Clock,
  Eye,
  EyeOff,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Info
} from 'lucide-react';

interface SMCChartProps {
  analysis: AnalysisResult;
  selectedTimeframe: Timeframe;
  onSelectTimeframe: (tf: Timeframe) => void;
  lang?: Language;
}

export const SMCChart: React.FC<SMCChartProps> = ({
  analysis,
  selectedTimeframe,
  onSelectTimeframe
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Overlay visual toggles
  const [showSupplyDemand, setShowSupplyDemand] = useState(true);
  const [showRoundNumbers, setShowRoundNumbers] = useState(true);
  const [showBOS, setShowBOS] = useState(true);
  const [showOrderBlock, setShowOrderBlock] = useState(true);
  const [showFVG, setShowFVG] = useState(true);
  const [showLiquidity, setShowLiquidity] = useState(true);
  const [showTradeSetup, setShowTradeSetup] = useState(true);

  // Active hover candlestick index
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Select candles according to timeframe
  const candles = useMemo(() => {
    if (selectedTimeframe === '4H') return analysis.candles4H;
    if (selectedTimeframe === '1H') return analysis.candles1H;
    return analysis.candles5M;
  }, [analysis, selectedTimeframe]);

  // Compute price min/max bounds for SVG scaling
  const { minPrice, maxPrice, priceRange } = useMemo(() => {
    if (!candles || candles.length === 0) {
      return { minPrice: 100, maxPrice: 110, priceRange: 10 };
    }
    let minP = Math.min(...candles.map(c => c.low));
    let maxP = Math.max(...candles.map(c => c.high));

    // Include trade setup levels if enabled
    const setup = analysis.steps.step4.setup;
    if (setup && showTradeSetup) {
      minP = Math.min(minP, setup.stopLoss, setup.entryPrice);
      maxP = Math.max(maxP, setup.takeProfit3, setup.takeProfit2);
    }

    const pad = (maxP - minP) * 0.08 || 1;
    return {
      minPrice: minP - pad,
      maxPrice: maxP + pad,
      priceRange: maxP - minP + pad * 2
    };
  }, [candles, analysis, showTradeSetup]);

  const activeCandle = hoverIndex !== null && candles[hoverIndex] ? candles[hoverIndex] : candles[candles.length - 1];

  // Map price to SVG Y Coordinate
  const chartHeight = 380;
  const getY = (price: number) => {
    return chartHeight - ((price - minPrice) / priceRange) * chartHeight;
  };

  const setup = analysis.steps.step4.setup;

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
      {/* Chart Top Control Header Bar */}
      <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Stock Info & Timeframe Tabs */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono font-extrabold text-base text-white">
              {analysis.stock.symbol}
            </span>
            <span className="text-slate-400 font-mono text-xs">
              ${analysis.lastPrice.toFixed(2)}
            </span>
            <span
              className={`font-mono text-xs font-semibold ${
                analysis.priceChange >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {analysis.priceChange >= 0 ? '+' : ''}
              {analysis.priceChangePercent.toFixed(2)}%
            </span>
            {analysis.stock.isLiveYahoo && (
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] px-2 py-0.5 rounded-full font-sans font-bold flex items-center gap-1 shadow-sm shadow-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                ياهو فاينانس مباشر
              </span>
            )}
          </div>

          <div className="h-4 w-px bg-slate-800"></div>

          {/* Timeframe Selector Pills */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => onSelectTimeframe('4H')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
                selectedTimeframe === '4H'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>4H</span>
              <span className="text-[10px] opacity-80">(الاتجاه)</span>
            </button>
            <button
              onClick={() => onSelectTimeframe('1H')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
                selectedTimeframe === '1H'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>1H</span>
              <span className="text-[10px] opacity-80">(أدوات SMC)</span>
            </button>
            <button
              onClick={() => onSelectTimeframe('5M')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
                selectedTimeframe === '5M'
                  ? 'bg-purple-500 text-slate-950 font-bold shadow-md shadow-purple-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>5M</span>
              <span className="text-[10px] opacity-80">(تأكيد وتفعيل)</span>
            </button>
          </div>
        </div>

        {/* Right: Layer Visual Toggles */}
        <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
          <button
            onClick={() => setShowSupplyDemand(!showSupplyDemand)}
            className={`px-2 py-1 rounded border transition-all cursor-pointer ${
              showSupplyDemand
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
            title="إخفاء/إظهار مناطق العرض والطلب"
          >
            عرض/طلب
          </button>
          <button
            onClick={() => setShowRoundNumbers(!showRoundNumbers)}
            className={`px-2 py-1 rounded border transition-all cursor-pointer ${
              showRoundNumbers
                ? 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
            title="إخفاء/إظهار الأرقام الدائرية النفسية"
          >
            أرقام دائرية
          </button>
          <button
            onClick={() => setShowOrderBlock(!showOrderBlock)}
            className={`px-2 py-1 rounded border transition-all cursor-pointer ${
              showOrderBlock
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
            title="إخفاء/إظهار كتل الأوامر Order Blocks"
          >
            Order Block
          </button>
          <button
            onClick={() => setShowFVG(!showFVG)}
            className={`px-2 py-1 rounded border transition-all cursor-pointer ${
              showFVG
                ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
            title="إخفاء/إظهار فجوات القيمة FVG"
          >
            FVG
          </button>
          <button
            onClick={() => setShowTradeSetup(!showTradeSetup)}
            className={`px-2 py-1 rounded border transition-all cursor-pointer ${
              showTradeSetup
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-semibold'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
            title="إخفاء/إظهار خريطة الدخول ووقف الخسارة والهدف"
          >
            الهدف والوقف
          </button>
        </div>
      </div>

      {/* Active Candlestick Stats Legend Bar */}
      {activeCandle && (
        <div className="bg-slate-900/60 px-4 py-1.5 border-b border-slate-800/60 text-[11px] font-mono flex items-center justify-between gap-4 text-slate-400 overflow-x-auto">
          <div className="flex items-center gap-4">
            <span>التاريخ: <strong className="text-slate-200">{activeCandle.dateStr}</strong></span>
            <span>افتتاح: <strong className="text-slate-200">${activeCandle.open.toFixed(2)}</strong></span>
            <span>أعلى: <strong className="text-emerald-400">${activeCandle.high.toFixed(2)}</strong></span>
            <span>أدنى: <strong className="text-rose-400">${activeCandle.low.toFixed(2)}</strong></span>
            <span>إغلاق: <strong className={activeCandle.isBullish ? 'text-emerald-400' : 'text-rose-400'}>${activeCandle.close.toFixed(2)}</strong></span>
            <span>الحجم: <strong className="text-slate-200">{activeCandle.volume.toLocaleString()}</strong></span>
          </div>

          <div className="text-amber-400/90 text-[11px] flex items-center gap-1">
            <Info className="w-3 h-3" />
            <span>حرّك المؤشر فوق الشموع لمعاينة التفاصيل</span>
          </div>
        </div>
      )}

      {/* Main Interactive Candlestick SVG Chart Stage */}
      <div
        ref={containerRef}
        className="relative w-full h-[380px] bg-slate-950 select-none overflow-hidden"
        onMouseLeave={() => setHoverIndex(null)}
      >
        <svg
          className="w-full h-full overflow-visible"
          viewBox={`0 0 1000 ${chartHeight}`}
          preserveAspectRatio="none"
        >
          {/* Subtle Horizontal Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = chartHeight * pct;
            const pVal = maxPrice - priceRange * pct;
            return (
              <g key={i}>
                <line
                  x1="0"
                  y1={y}
                  x2="1000"
                  y2={y}
                  stroke="#1e293b"
                  strokeWidth="1"
                  strokeDasharray="3,3"
                />
                <text
                  x="992"
                  y={y - 4}
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="end"
                >
                  ${pVal.toFixed(2)}
                </text>
              </g>
            );
          })}

          {/* Layer 1: Psychological Round Numbers */}
          {showRoundNumbers &&
            analysis.steps.step2.roundNumbers.map((rn, idx) => {
              const y = getY(rn.price);
              if (y < 0 || y > chartHeight) return null;
              return (
                <g key={`rn_${idx}`}>
                  <line
                    x1="0"
                    y1={y}
                    x2="1000"
                    y2={y}
                    stroke="#eab308"
                    strokeWidth="1"
                    strokeDasharray="6,4"
                    opacity="0.4"
                  />
                  <rect
                    x="10"
                    y={y - 9}
                    width="65"
                    height="16"
                    rx="3"
                    fill="#1e1b4b"
                    stroke="#eab308"
                    strokeWidth="0.5"
                  />
                  <text
                    x="14"
                    y={y + 3}
                    fill="#fef08a"
                    fontSize="9"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {rn.label} (دائري)
                  </text>
                </g>
              );
            })}

          {/* Layer 2: 4H Supply & Demand Zones */}
          {showSupplyDemand && (
            <>
              {/* Supply Zone */}
              <g>
                <rect
                  x="0"
                  y={getY(analysis.steps.step1.majorSupplyZone.priceHigh)}
                  width="1000"
                  height={Math.max(
                    6,
                    getY(analysis.steps.step1.majorSupplyZone.priceLow) -
                      getY(analysis.steps.step1.majorSupplyZone.priceHigh)
                  )}
                  fill="#ef4444"
                  opacity="0.12"
                />
                <line
                  x1="0"
                  y1={getY(analysis.steps.step1.majorSupplyZone.priceHigh)}
                  x2="1000"
                  y2={getY(analysis.steps.step1.majorSupplyZone.priceHigh)}
                  stroke="#ef4444"
                  strokeWidth="1"
                  strokeDasharray="4,2"
                  opacity="0.6"
                />
                <text
                  x="20"
                  y={getY(analysis.steps.step1.majorSupplyZone.priceHigh) + 12}
                  fill="#fca5a5"
                  fontSize="10"
                  fontWeight="bold"
                >
                  منطقة عرض رئيسية (4H Supply Zone)
                </text>
              </g>

              {/* Demand Zone */}
              <g>
                <rect
                  x="0"
                  y={getY(analysis.steps.step1.majorDemandZone.priceHigh)}
                  width="1000"
                  height={Math.max(
                    6,
                    getY(analysis.steps.step1.majorDemandZone.priceLow) -
                      getY(analysis.steps.step1.majorDemandZone.priceHigh)
                  )}
                  fill="#10b981"
                  opacity="0.12"
                />
                <line
                  x1="0"
                  y1={getY(analysis.steps.step1.majorDemandZone.priceLow)}
                  x2="1000"
                  y2={getY(analysis.steps.step1.majorDemandZone.priceLow)}
                  stroke="#10b981"
                  strokeWidth="1"
                  strokeDasharray="4,2"
                  opacity="0.6"
                />
                <text
                  x="20"
                  y={getY(analysis.steps.step1.majorDemandZone.priceLow) - 4}
                  fill="#6ee7b7"
                  fontSize="10"
                  fontWeight="bold"
                >
                  منطقة طلب رئيسية (4H Demand Zone)
                </text>
              </g>
            </>
          )}

          {/* Layer 3: 1H Order Block (OB) Box */}
          {showOrderBlock && analysis.steps.step3.activeOrderBlock && (
            <g>
              <rect
                x="150"
                y={getY(analysis.steps.step3.activeOrderBlock.high)}
                width="850"
                height={Math.max(
                  8,
                  getY(analysis.steps.step3.activeOrderBlock.low) -
                    getY(analysis.steps.step3.activeOrderBlock.high)
                )}
                fill={
                  analysis.steps.step3.activeOrderBlock.type === 'BULLISH'
                    ? '#059669'
                    : '#dc2626'
                }
                opacity="0.25"
                rx="2"
                stroke={
                  analysis.steps.step3.activeOrderBlock.type === 'BULLISH'
                    ? '#10b981'
                    : '#ef4444'
                }
                strokeWidth="1.5"
                strokeDasharray="5,3"
              />
              <text
                x="160"
                y={getY(analysis.steps.step3.activeOrderBlock.high) + 14}
                fill={
                  analysis.steps.step3.activeOrderBlock.type === 'BULLISH'
                    ? '#34d399'
                    : '#f87171'
                }
                fontSize="10"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                {analysis.steps.step3.activeOrderBlock.labelAr}
              </text>
            </g>
          )}

          {/* Layer 4: 1H Fair Value Gap (FVG) Shaded Box */}
          {showFVG && analysis.steps.step3.activeFVG && (
            <g>
              <rect
                x="300"
                y={getY(analysis.steps.step3.activeFVG.top)}
                width="700"
                height={Math.max(
                  6,
                  getY(analysis.steps.step3.activeFVG.bottom) -
                    getY(analysis.steps.step3.activeFVG.top)
                )}
                fill="#06b6d4"
                opacity="0.18"
                stroke="#22d3ee"
                strokeWidth="1"
              />
              <text
                x="310"
                y={getY(analysis.steps.step3.activeFVG.top) + 12}
                fill="#67e8f9"
                fontSize="9"
                fontWeight="bold"
              >
                فجوة FVG ($${analysis.steps.step3.activeFVG.bottom} - $
                {analysis.steps.step3.activeFVG.top})
              </text>
            </g>
          )}

          {/* Layer 5: Trade Setup Lines (Entry, SL, TP1, TP2, TP3) */}
          {showTradeSetup && setup && (
            <g>
              {/* Entry Price Line */}
              <line
                x1="0"
                y1={getY(setup.entryPrice)}
                x2="1000"
                y2={getY(setup.entryPrice)}
                stroke="#38bdf8"
                strokeWidth="2"
              />
              <rect
                x="880"
                y={getY(setup.entryPrice) - 10}
                width="110"
                height="20"
                rx="4"
                fill="#0284c7"
              />
              <text
                x="935"
                y={getY(setup.entryPrice) + 4}
                fill="#ffffff"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
              >
                نقطة الدخول: ${setup.entryPrice}
              </text>

              {/* Stop Loss Line */}
              <line
                x1="0"
                y1={getY(setup.stopLoss)}
                x2="1000"
                y2={getY(setup.stopLoss)}
                stroke="#ef4444"
                strokeWidth="2"
                strokeDasharray="4,2"
              />
              <rect
                x="880"
                y={getY(setup.stopLoss) - 10}
                width="110"
                height="20"
                rx="4"
                fill="#b91c1c"
              />
              <text
                x="935"
                y={getY(setup.stopLoss) + 4}
                fill="#ffffff"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
              >
                وقف الخسارة: ${setup.stopLoss}
              </text>

              {/* Take Profit 2 Line */}
              <line
                x1="0"
                y1={getY(setup.takeProfit2)}
                x2="1000"
                y2={getY(setup.takeProfit2)}
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray="4,2"
              />
              <rect
                x="880"
                y={getY(setup.takeProfit2) - 10}
                width="110"
                height="20"
                rx="4"
                fill="#047857"
              />
              <text
                x="935"
                y={getY(setup.takeProfit2) + 4}
                fill="#ffffff"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
              >
                الهدف الثاني: ${setup.takeProfit2}
              </text>
            </g>
          )}

          {/* Render Candlesticks */}
          {candles.map((candle, idx) => {
            const numCandles = candles.length;
            const candleWidth = 700 / numCandles;
            const x = 50 + idx * (candleWidth + 3);

            const yOpen = getY(candle.open);
            const yClose = getY(candle.close);
            const yHigh = getY(candle.high);
            const yLow = getY(candle.low);

            const isBull = candle.isBullish;
            const color = isBull ? '#10b981' : '#ef4444';

            const bodyTop = Math.min(yOpen, yClose);
            const bodyHeight = Math.max(2, Math.abs(yOpen - yClose));

            return (
              <g
                key={idx}
                onMouseEnter={() => setHoverIndex(idx)}
                className="cursor-pointer group"
              >
                {/* Wick */}
                <line
                  x1={x + candleWidth / 2}
                  y1={yHigh}
                  x2={x + candleWidth / 2}
                  y2={yLow}
                  stroke={color}
                  strokeWidth="1.2"
                />

                {/* Candle Body */}
                <rect
                  x={x}
                  y={bodyTop}
                  width={Math.max(3, candleWidth)}
                  height={bodyHeight}
                  fill={isBull ? '#10b981' : '#ef4444'}
                  rx="1"
                  stroke={color}
                  strokeWidth="0.5"
                  className="group-hover:opacity-80 transition-opacity"
                />

                {/* Highlight active trigger candle on 5M */}
                {selectedTimeframe === '5M' && idx === numCandles - 1 && (
                  <circle
                    cx={x + candleWidth / 2}
                    cy={bodyTop}
                    r="8"
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="2"
                    className="animate-ping"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Floating Timeframe Badge */}
        <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur border border-slate-800 text-slate-300 text-[11px] font-mono px-2.5 py-1 rounded-lg shadow-lg flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            إطار الـ{' '}
            <strong className="text-white">
              {selectedTimeframe === '4H'
                ? '4 ساعات (الاتجاه العالي)'
                : selectedTimeframe === '1H'
                ? 'ساعة واحدة (أدوات المال الذكي)'
                : '5 دقائق (تأكيد وإشارات التداول)'}
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
};
