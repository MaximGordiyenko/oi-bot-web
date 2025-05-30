import { WebSocket } from 'ws';

const DEFAULT_RECONNECT_DELAY = 5000;
const MAX_RECONNECT_ATTEMPTS = 5;

// Pure function to process liquidation data
const processLiquidationData = (data) => {
  if (!data || !data.s || !data.S || !data.p || !data.q || !data.T) {
    console.error('Invalid liquidation data received:', data);
    return null;
  }

  try {
    return {
      symbol: data.s,
      side: data.S,
      price: parseFloat(data.p),
      quantity: parseFloat(data.q),
      timestamp: data.T,
      type: 'LIQUIDATION'
    };
  } catch (error) {
    console.error('Error processing liquidation data:', error);
    return null;
  }
};

// Function to aggregate liquidations by symbol
const aggregateLiquidations = (liquidations) => {
  if (!Array.isArray(liquidations)) {
    console.error('Invalid liquidations array received');
    return {};
  }

  return liquidations.reduce((acc, liquidation) => {
    if (!liquidation || !liquidation.symbol || !liquidation.side || !liquidation.quantity) {
      console.error('Invalid liquidation entry:', liquidation);
      return acc;
    }

    const { symbol, side, quantity } = liquidation;
    if (!acc[symbol]) {
      acc[symbol] = {
        long: 0,
        short: 0,
        total: 0,
        lastUpdate: Date.now()
      };
    }
    
    if (side === 'BUY') {
      acc[symbol].long += quantity;
    } else {
      acc[symbol].short += quantity;
    }
    acc[symbol].total += quantity;
    acc[symbol].lastUpdate = Date.now();
    
    return acc;
  }, {});
};

const aggregateLiquidationData = (liquidations) => {
  if (!Array.isArray(liquidations)) {
    console.error('Invalid liquidations array received');
    return {};
  }

  return liquidations.reduce((acc, liquidation) => {
    if (!liquidation || !liquidation.symbol || !liquidation.side || !liquidation.quantity) {
      console.error('Invalid liquidation entry:', liquidation);
      return acc;
    }

    const { symbol, side, quantity } = liquidation;
    if (!acc[symbol]) {
      acc[symbol] = {
        long: 0,
        short: 0,
        total: 0,
        lastUpdate: Date.now()
      };
    }
    
    if (side === 'BUY') {
      acc[symbol].long += quantity;
    } else {
      acc[symbol].short += quantity;
    }
    acc[symbol].total += quantity;
    acc[symbol].lastUpdate = Date.now();
    
    return acc;
  }, {});
};

// WebSocket connection manager
const createLiquidationWebSocket = (symbols, onData) => {
  let ws = null;
  let reconnectAttempts = 0;
  let reconnectTimeout = null;

  const connect = () => {
    try {
      ws = new WebSocket('wss://fstream.binance.com/ws');
      
      ws.onopen = () => {
        console.log('Connected to Binance WebSocket');
        reconnectAttempts = 0;
        subscribeToLiquidations();
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.e === 'forceOrder') {
            const processedData = processLiquidationData(data);
            if (processedData) {
              onData(processedData);
            }
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
        scheduleReconnect();
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      scheduleReconnect();
    }
  };

  const scheduleReconnect = () => {
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      const delay = DEFAULT_RECONNECT_DELAY * Math.pow(2, reconnectAttempts);
      console.log(`Scheduling reconnect attempt ${reconnectAttempts + 1} in ${delay}ms`);
      
      reconnectTimeout = setTimeout(() => {
        reconnectAttempts++;
        connect();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  };

  const subscribeToLiquidations = () => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not ready for subscription');
      return;
    }

    try {
      const subscriptionMessage = {
        method: 'SUBSCRIBE',
        params: symbols.map(symbol => `${symbol.toLowerCase()}@forceOrder`),
        id: Date.now()
      };
      ws.send(JSON.stringify(subscriptionMessage));
    } catch (error) {
      console.error('Error subscribing to liquidations:', error);
    }
  };

  const cleanup = () => {
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
    }
    if (ws) {
      ws.close();
    }
  };

  // Start initial connection
  connect();

  return {
    close: cleanup,
    reconnect: () => {
      cleanup();
      reconnectAttempts = 0;
      connect();
    }
  };
};

export {
  processLiquidationData,
  aggregateLiquidationData,
  createLiquidationWebSocket
}; 