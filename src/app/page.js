"use client";
import { useState, useEffect } from 'react';
import Script from 'next/script';
import { WechatWorkOutlined } from '@ant-design/icons';
import { FloatButton, Select, Flex, Typography } from 'antd';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { particlesConfig, botListFeatures, botLabFeature } from '@/constants';
import { Widget } from '@/components/Widget';
import ScrollingTextBlock from '@/components/ScrollingTextBlock';
import List from '@/components/List';
import './styles.css';

export const dynamic = 'force-dynamic';

export default function Home() {
  const [particlesLoaded, setParticlesLoaded] = useState(false);
  const [symbols, setSymbols] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const [price, setPrice] = useState(null);
  const [history, setHistory] = useState([]);
  const [interval, setInterval] = useState('1h');
  
  const intervals = ['1m', '1h', '1d'];
  
  // Fetch symbols once on mount
  useEffect(() => {
    const fetchSymbols = async () => {
      const res = await fetch('/api/symbols');
      const data = await res.json();
      
      const usdtPairs = data.symbols.filter((symbol) =>
        symbol.endsWith('USDT')
      );
      
      setSymbols(usdtPairs);
    };
    
    fetchSymbols().then(r => r);
  }, []);
  
  // Fetch price when selectedSymbol changes
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await fetch(`/api/price?symbol=${selectedSymbol}`);
        if (!res.ok) throw new Error('Failed to fetch price');
        const data = await res.json();
        setPrice(data.price);
      } catch (error) {
        console.error('Error fetching price:', error);
      }
    };
    
    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/history?symbol=${selectedSymbol}&interval=${interval}`);
        if (!res.ok) throw new Error('Failed to fetch history');
        const data = await res.json();
        setHistory(data);
      } catch (error) {
        console.error('Error fetching price:', error);
      }
    };
    
    fetch("https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=5")
      .then(res => res.json())
      .then(console.log)
      .catch(console.error);
    
    
    
    if (selectedSymbol) {
      fetchPrice().then(r => r);
      fetchHistory().then(r => r);
    }
  }, [selectedSymbol, interval]);
  
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
          
          <Widget defaultPosition={{ x: -600, y: -300 }} width={200}>
            <Flex vertical={true} gap={20} align="start">
              <Typography.Title level={4} style={{ color: 'white' }}>Select Crypto</Typography.Title>
              <Flex vertical={true} gap={10} align="start">
                <Select
                  defaultValue="BTCUSDT"
                  style={{ width: 160 }}
                  onChange={(value) => setSelectedSymbol(value)} // value is the string like "ETHUSDT"
                  options={symbols?.map((el) => ({ value: el, label: el }))}
                />
                🪙 {price ? `$${parseFloat(price).toFixed(4)}` : 'Loading...'}
              </Flex>
            </Flex>
          </Widget>
          
          <Widget defaultPosition={{ x: -300, y: -300 }} width={400}>
            <ResponsiveContainer width="100%" height="100%">
              {intervals.map((int) => (
                <button
                  key={int}
                  onClick={() => setInterval(int)}
                  className={`pr-2 text-sm font-medium border-none ${
                    interval === int
                      ? 'text-teal-400'
                      : 'text-gray-400 hover:text-gray-100'
                  } transition`}>
                  {int}
                </button>
              ))}
              <LineChart data={history}>
                <XAxis dataKey="time" tickFormatter={(time) => new Date(time).toLocaleTimeString()}
                       tick={{ fontSize: 10 }}/>
                <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10 }} minTickGap={20}/>
                <Tooltip
                  labelFormatter={(value) =>
                    new Date(value).toLocaleString('en-US', {
                      weekday: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false
                    })
                  }
                  formatter={(value) => [`$${value.toFixed(2)}`, 'Price']}
                />
                <Line type="monotone" dataKey="price" stroke="#19DAACD6" strokeWidth={2} dot={false}/>
              </LineChart>
            </ResponsiveContainer>
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
