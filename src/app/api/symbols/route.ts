import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const res = await fetch('https://api.binance.com/api/v3/exchangeInfo');
  const data = await res.json();
  
  if (!res.ok) {
    return new Response(JSON.stringify({ error: 'Failed to fetch symbols' }), { status: 500 });
  }
  
  // Extract trading pairs (symbols)
  const symbols = data.symbols
    .filter((symbol: any) => symbol.status === 'TRADING') // Filter out non-trading pairs
    .map((symbol: any) => symbol.symbol); // Extract the symbol name (e.g., BTCUSDT)
  
  return new Response(JSON.stringify({ symbols }));
}
