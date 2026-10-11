import { Stock, Candle } from '../types';

export interface LiveQuote {
  symbol: string;
  price: number;
  prevClose: number;
  change: number;
  changePercent: number;
  high52?: number;
  low52?: number;
  volume?: string;
  marketCap?: string;
  name?: string;
  updatedAt: string;
}

export interface LiveChartData {
  success: boolean;
  symbol: string;
  meta?: {
    price?: number;
    prevClose?: number;
    high52?: number;
    low52?: number;
    currency?: string;
    exchangeName?: string;
  };
  candles5M: Candle[];
  candles1H: Candle[];
  candles4H: Candle[];
}

/**
 * Fetch live real-time quotes from Yahoo Finance via Express backend API proxy
 */
export async function fetchLiveQuotes(symbols: string[]): Promise<Record<string, LiveQuote>> {
  try {
    const symbolString = symbols.join(',');
    const response = await fetch(`/api/stock-quotes?symbols=${encodeURIComponent(symbolString)}`);
    if (!response.ok) return {};
    const data = await response.json();
    if (data.success && data.quotes) {
      return data.quotes;
    }
    return {};
  } catch (err) {
    console.error('Failed to fetch live stock quotes:', err);
    return {};
  }
}

/**
 * Fetch live real-time chart candlestick data (5M, 1H, 4H) from Yahoo Finance via Express API proxy
 */
export async function fetchLiveChartData(symbol: string): Promise<LiveChartData | null> {
  try {
    const response = await fetch(`/api/stock-chart?symbol=${encodeURIComponent(symbol)}`);
    if (!response.ok) return null;
    const data = await response.json();
    if (data.success) {
      return data;
    }
    return null;
  } catch (err) {
    console.error(`Failed to fetch live chart data for ${symbol}:`, err);
    return null;
  }
}

/**
 * Merge live Yahoo Finance quotes into local stock list
 */
export function mergeLiveQuotesIntoStocks(stocks: Stock[], liveQuotes: Record<string, LiveQuote>): Stock[] {
  if (!liveQuotes || Object.keys(liveQuotes).length === 0) return stocks;

  return stocks.map(stock => {
    const quote = liveQuotes[stock.symbol];
    if (!quote) return stock;

    return {
      ...stock,
      price: quote.price,
      change: quote.change,
      changePercent: quote.changePercent,
      volume: quote.volume || stock.volume,
      marketCap: quote.marketCap || stock.marketCap,
      high52: quote.high52 || stock.high52,
      low52: quote.low52 || stock.low52,
      isLiveYahoo: true
    };
  });
}
