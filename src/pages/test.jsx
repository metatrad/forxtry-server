
import React, { useEffect,useRef, useState } from 'react';
import { createChart, LineStyle } from 'lightweight-charts';
import axios from 'axios';
import io from 'socket.io-client';
React.StrictMode = React.Fragment;


function App() {
  const [candlestickSeries, setCandlestickSeries] = useState(null);
  const [userTradingPair, setUserTradingPair] = useState('EUR-USD'); // Default trading pair
  
  const socket = io(process.env.REACT_APP_SERVER_DOMAIN, { transports: ['websocket'] }); // Replace with your server URL

    useEffect(() => {
      
      socket.on('forexData', (realTimeData) => {
        // Update the chart with real-time data
        candlestickSeries.update({
          time: realTimeData.timestamp,
          open: realTimeData.open,
          high: realTimeData.high,
          low: realTimeData.low,
          close: realTimeData.close,
        });
      });
  
      return () => {
        socket.disconnect();
      };
    }, [candlestickSeries]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.polygon.io/v2/aggs/ticker/C:${userTradingPair}/range/5/minute/2023-01-09/2024-01-30?adjusted=true&sort=desc&limit=2000&apiKey=rrUQn7NpmfCtAOSHsiRRwsHw1kpYn2wW`
        );

        const data = response.data.results.map((item) => ({
          time: item.t/1000,
          open: item.o,
          high: item.h,
          low: item.l,
          close: item.c,
        })).sort((a, b) => a.time - b.time);

        const chart = createChart(document.getElementById('chart'), {
          width: 800,
          height: 400,
        });

        chart.applyOptions({
          layout: {
            background: { color: "#1c1f2d00" },
            textColor: "white",
          },
          grid: {
            vertLines: { color: "#444" },
            horzLines: { color: "#444" },
          },
          crosshair: {
            vertLine: {
              width: 1,
              style: LineStyle.Solid,
              color: "#C3BCDB44",
              labelBackgroundColour: "#9B7DFF",
            },
            horzLine: {
              color: "#C3BCDB44",
            },
          },
          priceFormat: {
            type: 'custom',
            minMove: '0.00000001',
            formatter: (price) => {
                if (price < 0.001) return parseFloat(price).toFixed(8)
                else if (price >= 0.001 && price < 1) return parseFloat(price).toFixed(6)
                else return parseFloat(price)
            }
          },                                         
          priceScale: {
              autoScale: true
          },
          localization: {
              locale: 'en-US',
              priceFormatter:  (price) => {
                  if (price < 0.001) return parseFloat(price).toFixed(8)
                  else if (price >= 0.001 && price < 1) return parseFloat(price).toFixed(6)
                  else return parseFloat(price)
              }
          },
        });

        const candlestick = chart.addCandlestickSeries();
        candlestick.setData(data);
        setCandlestickSeries(candlestick);

        chart.timeScale().applyOptions({
          timeVisible: true,
          secondsVisible: false,
        });

        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userTradingPair]);

  const handleTradingPairChange = (newTradingPair) => {
    setUserTradingPair(newTradingPair);

    // // Notify the server about the updated trading pair
    // const socket = io(process.env.REACT_APP_SERVER_DOMAIN, { transports: ['websocket'] });
    socket.emit('updateTradingPair', newTradingPair);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>{userTradingPair} Candlestick Chart</h1>
        <div>
          <label>Trading Pair:</label>
          <select onChange={(e) => handleTradingPairChange(e.target.value)} value={userTradingPair}>
            <option value="EUR-USD">EUR/USD</option>
            <option value="EUR-GBP">EUR/GBP</option>
            <option value="EUR-CHF">EUR/CHF</option>
            <option value="EUR-JPY">EUR/JPY</option>
            <option value="EUR-CAD">EUR/CAD</option>
            <option value="EUR-AUD">EUR/AUD</option>
            <option value="EUR-NZD">EUR/NZD</option>

            <option value="GBP-USD">GBP/USD</option>
            <option value="GBP-CHF">GBP/CHF</option>
            <option value="GBP-JPY">GBP/JPY</option>
            <option value="GBP-CAD">GBP/CAD</option>
            <option value="GBP-AUD">GBP/AUD</option>
            <option value="GBP-NZD">GBP/NZD</option>

            <option value="CHF-JPY">CHF/JPY</option>

            <option value="XAU-USD">XAU/USD</option>

            <option value="USD-JPY">USD/JPY</option>
            <option value="USD-CHF">USD/CHF</option>
            <option value="USD-CAD">USD/CAD</option>
            
            <option value="CAD-JPY">CAD/JPY</option>
            <option value="CAD-CHF">CAD/CHF</option>

            <option value="AUD-USD">AUD/USD</option>
            <option value="AUD-CHF">AUD/CHF</option>
            <option value="AUD-JPY">AUD/JPY</option>
            <option value="AUD-NZD">AUD/NZD</option>
            <option value="AUD-CAD">AUD/CAD</option>

            <option value="NZD-USD">NZD/USD</option>
            <option value="NZD-CHF">NZD/CHF</option>
            <option value="NZD-JPY">NZD/JPY</option>
            <option value="NZD-CAD">NZD/CAD</option>

            {/* Add other trading pairs as needed */}
          </select>
        </div>
      </header>
      <main>
        <div id="chart"></div>
      </main>
    </div>
  );
}

export default App;
