export type Timeframe = '4H' | '1H' | '5M';

export type SectorType = 
  | 'TECH'
  | 'FINANCE'
  | 'HEALTHCARE'
  | 'CONSUMER'
  | 'ENERGY'
  | 'INDUSTRIAL'
  | 'AUTO_EV'
  | 'COMMUNICATION'
  | 'REAL_ESTATE'
  | 'CRYPTO_FINTECH'
  | 'ETF';

export interface Stock {
  symbol: string;
  name: string;
  nameAr: string;
  sector: SectorType;
  sectorAr: string;
  industry: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap: string;
  high52: number;
  low52: number;
  volatility: number; // 1 to 5
  isLiveYahoo?: boolean;
}

export interface Candle {
  timestamp: number;
  dateStr: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  isBullish: boolean;
}

export interface SupplyDemandZone {
  id: string;
  type: 'SUPPLY' | 'DEMAND';
  priceHigh: number;
  priceLow: number;
  timeframe: '4H' | '1H';
  strength: 'STRONG' | 'MODERATE' | 'WEAK';
  summaryAr: string;
}

export interface RoundNumberLevel {
  price: number;
  label: string;
  type: 'MAJOR' | 'MINOR';
  distancePercent: number;
  isReactionZone: boolean;
}

export interface BOSPattern {
  id: string;
  type: 'BULLISH' | 'BEARISH';
  price: number;
  index: number;
  timeframe: '1H' | '4H';
  labelAr: string;
  dateStr: string;
}

export interface OrderBlock {
  id: string;
  type: 'BULLISH' | 'BEARISH';
  high: number;
  low: number;
  index: number;
  timeframe: '1H' | '4H';
  mitigated: boolean;
  strengthPercent: number;
  dateStr: string;
  labelAr: string;
}

export interface FairValueGap {
  id: string;
  type: 'BULLISH' | 'BEARISH';
  top: number;
  bottom: number;
  midpoint: number;
  index: number;
  timeframe: '1H' | '5M';
  filled: boolean;
  fillPercent: number;
  dateStr: string;
  labelAr: string;
}

export interface LiquidityZone {
  id: string;
  type: 'EQH' | 'EQL' | 'TRENDLINE' | 'SWEEP';
  price: number;
  labelAr: string;
  status: 'UNSWEPT' | 'SWEPT';
  index: number;
}

export interface ConfirmationCandle {
  type: 'BULLISH_ENGULFING' | 'BEARISH_ENGULFING' | 'PINBAR_REJECTION' | 'CHOCH_5M';
  index: number;
  price: number;
  timeStr: string;
  labelAr: string;
  confirmed: boolean;
}

export type TradeSignalType = 'BUY' | 'SELL' | 'NEUTRAL';

export interface TradeSetup {
  signal: TradeSignalType;
  signalTitleAr: string;
  entryPrice: number;
  stopLoss: number;
  takeProfit1: number;
  takeProfit2: number;
  takeProfit3: number;
  riskRewardRatio: number;
  stopLossPipsPercent: number;
  targetPipsPercent: number;
  triggerZoneType: string;
  confirmationTypeAr: string;
  reasonAr: string;
  
  // Institutional Execution & Risk Automation Fields
  totalPositionShares?: number; // e.g. 400 shares for GOOG
  chochBreakoutPrice?: number; // e.g. $353.47
  candle5MClosedAboveChoch?: boolean;
  falseBreakoutFilterPassed?: boolean;
  autoBreakevenPrice?: number; // Move SL to Entry $353.47 at TP1
  tp1SharesToClose?: number; // 50% (200 shares)
  tp2SharesToClose?: number; // 30% (120 shares)
  tp3SharesToClose?: number; // 20% (80 shares)
}

export interface Step1Trend {
  trend: 'BULLISH' | 'BEARISH' | 'SIDEWAYS';
  trendAr: string;
  summaryAr: string;
  higherHighsCount: number;
  higherLowsCount: number;
  majorSupplyZone: SupplyDemandZone;
  majorDemandZone: SupplyDemandZone;
}

export interface Step2Map {
  roundNumbers: RoundNumberLevel[];
  closestRoundNumber: RoundNumberLevel;
  keyLevelsAr: string[];
  fib382: number;
  fib500: number;
  fib618: number;
}

export interface Step3SMC {
  bosList: BOSPattern[];
  orderBlocks: OrderBlock[];
  activeOrderBlock?: OrderBlock;
  fvgs: FairValueGap[];
  activeFVG?: FairValueGap;
  liquidityPools: LiquidityZone[];
  summaryAr: string;
}

export interface Step4Trigger {
  signal: TradeSignalType;
  triggerStatusAr: string;
  confirmationCandle?: ConfirmationCandle;
  setup?: TradeSetup;
  isTriggered: boolean;
}

export interface StepByStepAnalysis {
  step1: Step1Trend;
  step2: Step2Map;
  step3: Step3SMC;
  step4: Step4Trigger;
}

export interface AnalysisResult {
  stock: Stock;
  lastPrice: number;
  priceChange: number;
  priceChangePercent: number;
  analysisDateStr: string;
  steps: StepByStepAnalysis;
  candles4H: Candle[];
  candles1H: Candle[];
  candles5M: Candle[];
}

export interface ScreenerItem {
  stock: Stock;
  trend: 'BULLISH' | 'BEARISH' | 'SIDEWAYS';
  signal: TradeSignalType;
  rrRatio: number;
  activeSetupType: string;
  lastUpdated: string;
}
