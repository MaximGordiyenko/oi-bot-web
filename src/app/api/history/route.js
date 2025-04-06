export async function GET(request) {
  try {
    console.log("Request URL:", request.url);
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol') || 'BTCUSDT';
    const interval = searchParams.get('interval') || '1h';
    const limit = searchParams.get('limit') || '50';
    
    console.log('Params:', { symbol, interval, limit });
    
    const res = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
    );
    
    if (!res.ok) {
      console.error(`Failed to fetch from Binance: ${res.statusText}`);
      throw new Error(`Failed to fetch from Binance: ${res.statusText}`);
    }
    
    const data = await res.json();
    
    // Check if data is empty or malformed
    if (!data || !Array.isArray(data)) {
      throw new Error("Invalid data format received from Binance");
    }
    
    const formatted = data.map((d) => ({
      time: new Date(d[0]).toLocaleString(),
      price: parseFloat(d[4]) // Close price
    }));
    
    return Response.json(formatted);
    
  } catch (error) {
    console.error('Error in price-history API route:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
