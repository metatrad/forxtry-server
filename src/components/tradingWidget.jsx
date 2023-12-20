import React, { useEffect, useRef, useState } from 'react';
import { IoMdArrowRoundUp } from "react-icons/io";
import { IoMdArrowRoundDown } from "react-icons/io";
import { PiDiamondsFourDuotone } from "react-icons/pi";
import { TbTriangleSquareCircle } from "react-icons/tb";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import { GiTrade } from "react-icons/gi";
import '../styles/trading.css'

let tvScriptLoadingPromise;

export default function TradingViewWidget() {

  const [prediction, setPrediction] = useState(null);
  const [result, setResult] = useState(null);

  const handlePrediction = (selectedPrediction) => {
    setPrediction(selectedPrediction);

    // Simulated trading logic
    const randomOutcome = Math.random() < 0.5 ? 'Up' : 'Down';
    setResult(randomOutcome === selectedPrediction ? 'Win' : 'Loss');
  };

  const[switchOptions, setSwitchOptions] = useState()

  const handleSwitch =()=>{
    setSwitchOptions ((prev)=>!prev)
  }
  const onLoadScriptRef = useRef();

  useEffect(
    () => {
      onLoadScriptRef.current = createWidget;

      if (!tvScriptLoadingPromise) {
        tvScriptLoadingPromise = new Promise((resolve) => {
          const script = document.createElement('script');
          script.id = 'tradingview-widget-loading-script';
          script.src = 'https://app.requestly.io/delay/1200000/s3.tradingview.com/tv.js';
          script.type = 'text/javascript';
          script.onload = resolve;

          document.head.appendChild(script);
        });
      }

      tvScriptLoadingPromise.then(() => onLoadScriptRef.current && onLoadScriptRef.current());

      return () => onLoadScriptRef.current = null;

      function createWidget() {
        if (document.getElementById('tradingview_ee15e') && 'TradingView' in window) {
          new window.TradingView.widget({
            autosize: true,
            symbol: "NASDAQ:AAPL",
            timezone: "Etc/UTC",
            theme: "dark",
            style: "1",
            locale: "en",
            // enable_publishing: true,
            gridColor: "rgba(240, 243, 250, 0.07)",
            // withdateranges: true,
            // range: "YTD",
            // hide_side_toolbar: false,
            allow_symbol_change: true,
            // details: true,
            // hotlist: true,
            // calendar: true,
            // show_popup_button: true,
            popup_width: "1000",
            popup_height: "650",
            container_id: "tradingview_ee15e"
          });
        }
      }
    },
    []
  );

  const handleSubmit = (e) =>{
    e.preventDefault()
  }

  return (
    <div className='tradingview-widget-container' style={{ height: "88.5vh", width: "100%" }}>
      <div id='tradingview_ee15e' style={{ height: "calc(100%)", width: "100%" }} />

      <div className="place-trades">
        <div className="buttons">
 
          <form action="" onSubmit={handleSubmit}>
            <h1><GiTrade/>Place trade</h1>

            <div className="inputs-trade-wrapper">
            <div>
            <label htmlFor="time">Timer</label>
            <input type="timer" name='time' id='time'/>
            </div>
            <div>
            <label htmlFor="investment">Investment</label>
            <input type="number" name='investment' id='investment'/>
            </div>
            </div>

            <p className='payout-text-mb'>Your payout: <h6>N5,000</h6></p>
            <div className="trade-btns-wrapper">
            <button onClick={() => handlePrediction('Up')} className='trade-btn even'>Up <IoMdArrowRoundUp className='icon'/></button>
            <p className='payout-text-dt'>Your payout: <h6>N5,000</h6></p>
            <button onClick={() => handlePrediction('Down')} className='trade-btn odd'>Down <IoMdArrowRoundDown className='icon'/></button>
            {prediction && (
             <p>Your prediction: <strong>{prediction}</strong></p>
             )}
             {result && (<p>Result: <strong>{result}</strong></p>
             )}
            </div>
          </form> 
        </div>
      </div>
    </div>
  );
}




