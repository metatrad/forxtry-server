import React, { useEffect, useRef } from 'react';
import Tradebtns from './trade-btns';
import '../styles/trading.css';

let tvScriptLoadingPromise;

export default function TradingViewWidget() {
  const onLoadScriptRef = useRef();

  useEffect(() => {
    onLoadScriptRef.current = createWidget;

    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement('script');
        script.id = 'tradingview-widget-loading-script';
        script.src = 'https://s3.tradingview.com/tv.js';
        script.type = 'text/javascript';
        script.onload = resolve;

        document.head.appendChild(script);
      });
    }

    tvScriptLoadingPromise.then(() => {
      //setTimeout 
      setTimeout(() => {
        if (onLoadScriptRef.current) {
          onLoadScriptRef.current();
        }
      },500);
    });

    return () => (onLoadScriptRef.current = null);

    function createWidget() {
      if (document.getElementById('tradingview_ee15e') && 'TradingView' in window) {
        new window.TradingView.widget({
          autosize: true,
          symbol: 'USD',
          timezone: 'UTC',
          theme: 'dark',
          interval: '5',
          style: '1',
          locale: 'en',
          gridColor: 'rgba(240, 243, 250, 0.07)',
          allow_symbol_change: true,
          popup_width: '1000',
          popup_height: '650',
          container_id: 'tradingview_ee15e',
        });
      }
    }
  }, []);

  return (
    <div className='tradingview-widget-container' style={{ height: '88.5vh', width: '100%' }}>
      <div id='tradingview_ee15e' style={{ height: 'calc(100%)', width: '100%' }} />
      <div>
        <Tradebtns />
      </div>
    </div>
  );
}
