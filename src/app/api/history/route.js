export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol') || 'BTCUSDT';
  const interval = searchParams.get('interval') || '1h';
  const limit = searchParams.get('limit') || '50';
  
  const res = await fetch(
    `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
  );
  const data = await res.json();
  
  const formatted = data.map((d) => ({
    time: new Date(d[0]).toLocaleString(),
    price: parseFloat(d[4]), // Close price
  }));
  
  return Response.json(formatted);
}
