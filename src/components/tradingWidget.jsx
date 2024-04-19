import React, { useEffect, useRef, memo } from 'react';

function ForexCandlestickChart() {
  const container = useRef();

  useEffect(
    () => {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "autosize": true,
          "symbol": "FX:EURUSD",
          "interval": "30",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "3",
          "locale": "en",
          "enable_publishing": false,
          "backgroundColor": "rgb(27, 30, 44)",
          "gridColor": "rgba(42, 46, 57, 0)",
          "hide_legend": true,
          "allow_symbol_change": true,
          "save_image": false,
          "calendar": false,
          "hide_volume": true,
          "support_host": "https://www.tradingview.com"
        }`;
      container.current.appendChild(script);
    },
    []
  );

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: "90%", width: "100%" }}>
      <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
    </div>
  );
}

export default memo(ForexCandlestickChart);
