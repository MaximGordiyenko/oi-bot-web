"use client";
import { useState, useEffect } from 'react';
import Script from 'next/script';
import { particlesConfig } from '@/constants';
import './styles.css';

export default function Home() {
  const [particlesLoaded, setParticlesLoaded] = useState(false);
  
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
        <div id="particles-js" className="particles-container"></div>
        <div className="content">
          <h1>Let track crypto together with OI-Bot</h1>
          <p>Bot essential for traders aiming to assess market sentiment and liquidity</p>
          <div className="buttons-container">
            <a
              href="https://t.me/OINotifierBot"
              target="_blank"
              rel="noopener noreferrer"
              className="telegram-button">
              <svg className="telegram-icon" width="80" height="80" viewBox="0 0 120 120" fill="none"
                   xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd"
                      d="M131.366 61.8802L77.0413 76.3255L65.7404 131.855L131.366 61.8802Z" fill="#662D91"/>
                <path fillRule="evenodd" clipRule="evenodd"
                      d="M33.5345 35.3968L77.0413 76.3255L131.366 61.8802L33.5345 35.3968Z" fill="#9E1F63"/>
                <path fillRule="evenodd" clipRule="evenodd"
                      d="M65.7404 131.855L77.0413 76.3255L33.5345 35.3968L65.7404 131.855Z" fill="#FF5000"/>
                <path fillRule="evenodd" clipRule="evenodd"
                      d="M59.8558 60.301L72.3976 99.144L99.4573 70.365L59.8558 60.301Z" fill="white" stroke="#FF5000"
                      strokeWidth="3.24779"/>
              </svg>
              Chat with our Bot
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
