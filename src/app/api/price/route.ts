import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol') || 'BTCUSDT';
  
  const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
  const data = await res.json();
  
  return Response.json({ price: data.price });
}
