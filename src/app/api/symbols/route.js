export async function GET() {
  const res = await fetch('https://api.binance.com/api/v3/exchangeInfo');
  const data = await res.json();
  
  if (!res.ok) {
    return new Response(JSON.stringify({ error: 'Failed to fetch symbols' }), { status: 500 });
  }
  
  // Extract trading pairs (symbols)
  const symbols = data.symbols
    .filter((symbol) => symbol.status === 'TRADING') // Filter out non-trading pairs
    .map((symbol) => symbol.symbol); // Extract the symbol name (e.g., BTCUSDT)
  
  return Response.json({ symbols });
}
