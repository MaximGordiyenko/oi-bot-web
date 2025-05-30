interface OHLCProps {
  symbol: string;
  interval: string;
  limit?: number;
}

export const getBinanceOHLC = async ({symbol, interval, limit = 100}: OHLCProps) => {
  const res = await fetch(
    `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
  );
  if (!res.ok) throw new Error('Failed to fetch Binance data');
  return res.json();
};
