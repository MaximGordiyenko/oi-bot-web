"use client";
import { useState, useEffect } from 'react';
import Script from 'next/script';
import { WechatWorkOutlined, DragOutlined } from '@ant-design/icons';
import { FloatButton, Flex, Typography } from 'antd';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { particlesConfig, botListFeatures, botLabFeature, tooltips } from '@/constants';
import List from '@/components/List';
import { Widget } from '@/components/Widget';
import ScrollingTextBlock from '@/components/ScrollingTextBlock';
import { SelectCoinWidget } from '@/components/SelectCoinWidget.tsx';
import { getBinanceOHLC } from '@/lib/binance.ts';
import OpenHighLowCloseTable from '@/components/tables/OpenHighLowCloseTable.tsx';
import { AiOutlineDownload, AiTwotoneQuestionCircle } from 'react-icons/ai';
import './styles.css';

export const dynamic = 'force-dynamic';

export default function Home() {
  const [particlesLoaded, setParticlesLoaded] = useState(false);
  const [symbols, setSymbols] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const [price, setPrice] = useState(null);
  const [interval, setInterval] = useState('1d');
  const [limit, setLimit] = useState(100);
  const [data, setData] = useState([]);

  const intervals = ['1M', '1w', '1d', '1h', '30m', '15m', '5m'];
  
  // Fetch symbols once on mount
  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        const res = await fetch('https://api.binance.com/api/v3/exchangeInfo');
        const data = await res.json();
        const symbols = data.symbols
          .filter((symbol) => symbol.status === 'TRADING') // Filter out non-trading pairs
          .map((symbol) => symbol.symbol); // Extract the symbol name (e.g., BTCUSDT)
        
        const usdtPairs = symbols.filter((symbol) =>
          symbol.endsWith('USDT')
        );
        
        setSymbols(usdtPairs);
      } catch (error) {
        throw new Error('Failed to fetch price');
      }
    };
    
    fetchSymbols().then(r => r);
  }, []);
  
  const loadChartData = async () => {
    const raw = await getBinanceOHLC({
      symbol: selectedSymbol,
      interval: interval,
      limit: limit
    });
    
    const chartData = raw.map((d) => ({
      time: d[0],
      price: parseFloat(d[4]) // Close price
    }));
    
    setHistory(chartData);
  };
  
  const fetchCsvData = async () => {
    const raw = await getBinanceOHLC({
      symbol: selectedSymbol,
      interval: interval,
      limit: limit
    });
    
    const candles = raw.map((c, idx) => ({
      key: `${idx}`,
      time: new Date(c[0]).toISOString().slice(0, 10),
      open: parseFloat(c[1]).toFixed(4),
      high: parseFloat(c[2]).toFixed(4),
      low: parseFloat(c[3]).toFixed(4),
      close: parseFloat(c[4]).toFixed(4)
    }));
    
    setData(candles);
  };
  
  const exportCsv = async () => {
    const raw = await getBinanceOHLC({
      symbol: selectedSymbol,
      interval: interval,
      limit: limit
    });
    
    const candles = raw?.map(c => ({
      time: c[0],
      open: c[1],
      high: c[2],
      low: c[3],
      close: c[4]
    }));
    
    // Convert to CSV
    const headers = ['time', 'open', 'high', 'low', 'close'];
    const csvRows = [
      headers.join(','), // header row
      ...candles.map(c => [c.time, c.open, c.high, c.low, c.close].join(','))
    ];
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Trigger file download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${selectedSymbol}_${interval}_history.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Fetch price when selectedSymbol changes
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${selectedSymbol}`);
        const data = await res.json();
        setPrice(data.price);
      } catch (error) {
        console.error('Error fetching price:', error);
      }
    };
    fetchCsvData().then(r => r);
    loadChartData().then(r => r);
    
    if (selectedSymbol) {
      fetchPrice().then(r => r);
      loadChartData().then(r => r);
    }
  }, [selectedSymbol, interval, limit]);
  
  useEffect(() => {
    // Initialize particlesJS after script has loaded
    if (particlesLoaded && typeof window !== 'undefined' && window.particlesJS) {
      window.particlesJS('particles-js', particlesConfig);
    }
  }, [particlesLoaded]);
  
  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/particles.js/2.0.0/particles.min.js"
        onLoad={() => setParticlesLoaded(true)}
      />
      
      <main className="landing-page">
        <ScrollingTextBlock/>
        <div id="particles-js" className="particles-container"/>
        <div className="content">
          
          <Widget defaultPosition={{ x: -600, y: -300 }} width={200}
                  widgetIcons={
                    <>
                      <AiTwotoneQuestionCircle className="export-icon"/>
                      <DragOutlined className="draggable-icon"/>
                    </>
                  }>
            <SelectCoinWidget
              symbols={symbols}
              setSelectedSymbol={setSelectedSymbol}
              price={price}
              limit={limit}
              setLimit={setLimit}
            />
          </Widget>
          
          <Widget defaultPosition={{ x: -300, y: -300 }} width={400}>
            <ResponsiveContainer width="100%" height="100%">
              {intervals.map((int) => (
                <button
                  key={int}
                  onClick={() => setInterval(int)}
                  className={`pr-2 text-sm font-medium border-none ${interval === int
                    ? 'text-teal-400'
                    : 'text-gray-400 hover:text-gray-100'
                  } transition`}>
                  {int}
                </button>
              ))}
              <LineChart data={history}>
                <XAxis
                  dataKey="time"
                  tickFormatter={(timestamp) => {
                    const date = new Date(Number(timestamp));
                    switch (interval) {
                      case '1M':
                        return format(date, 'MMM yyyy');
                      case '1d':
                        return format(date, 'dd/MM');
                      case '1h':
                      case '30m':
                      case '15m':
                      case '5m':
                        return format(date, 'HH:mm');
                      default:
                        return format(date, 'dd/MM HH:mm');
                    }
                  }}
                  tick={{ fontSize: 10 }}
                />
                <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10 }} minTickGap={20}/>
                <Tooltip
                  labelFormatter={(timestamp) => {
                    const date = new Date(Number(timestamp));
                    switch (interval) {
                      case '1M':
                        return format(date, 'MMMM yyyy');
                      case '1d':
                        return format(date, 'dd/MM/yyyy');
                      default:
                        return format(date, 'dd/MM/yyyy HH:mm');
                    }
                  }}
                  formatter={(value) => {
                    const currentPrice = value;
                    const previousPrice = history[0]?.price || currentPrice;
                    const arrow = currentPrice > previousPrice ? '⬆' : currentPrice < previousPrice ? '⬇' : '';
                    return [`$${value.toFixed(2)} ${arrow}`];
                  }}
                  contentStyle={{ fontSize: '14px', textAlign: 'left' }}
                />
                <Line type="monotone" dataKey="price" stroke="#19DAACD6" strokeWidth={2} dot={false}/>
              </LineChart>
            </ResponsiveContainer>
          </Widget>
          
          {/* Add Seasonality Chart Widget */}
          <Widget defaultPosition={{ x: 200, y: -300 }} width={400} height={200}>
          </Widget>
          
          <Widget defaultPosition={{ x: 100, y: 0 }} width={200} height={300}>
            <Flex vertical={true} gap={20} align="start">
              <Typography.Title level={4} style={{ color: 'white' }}>🔥Release:</Typography.Title>
              <List list={botListFeatures}/>
            </Flex>
          </Widget>
          
          <Widget defaultPosition={{ x: 400, y: 0 }} width={200} height={300}>
            <Flex vertical={true} gap={20} align="start">
              <Typography.Title level={4} style={{ color: 'white' }}>🧪Develop :</Typography.Title>
              <List list={botLabFeature}/>
            </Flex>
          </Widget>
          
          <Widget defaultPosition={{ x: -600, y: 0 }} width={500} height={300}
                  widgetIcons={
                    <>
                      <AiOutlineDownload className="export-icon" onClick={() => exportCsv()}/>
                      <DragOutlined className="draggable-icon"/>
                    </>
                  }>
            <OpenHighLowCloseTable data={data}/>
          </Widget>
        
        </div>
        
        <FloatButton
          icon={<WechatWorkOutlined/>}
          type="primary"
          href="https://t.me/OINotifierBot"
          target="_blank"
          tooltip={<div>Run Bot</div>}
          style={{ insetInlineEnd: 24 }}
        />
      
      </main>
    </>
  );
}
