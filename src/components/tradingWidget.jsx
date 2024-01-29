import React, { useEffect, useRef, useState } from 'react';
import { RiPencilFill } from "react-icons/ri";
import { LuChevronRight } from "react-icons/lu";
import { IoCloseOutline } from "react-icons/io5";
import '../styles/trading.css';
import { createChart, LineStyle } from 'lightweight-charts';
import io from 'socket.io-client';
import Select from 'react-select';
import Exchange from '../images/exchange.png'
import axios from 'axios';
import { CirclesWithBar } from 'react-loader-spinner'
React.StrictMode = React.Fragment;

const ForexCandlestickChart = () => {
  const [candlestickSeries, setCandlestickSeries] = useState(null);
  const [display, setDisplay] = useState(null);
  const [c, setc] = useState(null);
  const [crosshairData, setCrosshairData] = useState({ time: '', seriesPrices: [] });
  const [userTradingPair, setUserTradingPair] = useState('EUR-USD');

  //indicators
  const[ showIndicators, setShowIndicators] = useState(false)
  const toggleIndicators = () => {
    setShowIndicators(!showIndicators);
  };

  const [loading, setLoading] = useState(false);

  const historicalTradingPair = userTradingPair.slice(0, 3)+ userTradingPair.slice(4, 7); 

  const chartRef = useRef(null);

  //create chart
  useEffect(() => {
    const chartContainer = document.getElementById('chartContainer')

    if(!loading){
      const chart = createChart(document.getElementById('chart'), {
        width: '100%', 
        height: '100%', 
      });

      window.onresize = function() {
        chart.applyOptions({ 
            width: chartContainer.offsetWidth, 
            height: chartContainer.offsetHeight 
        });
    }
      chart.applyOptions({
        layout: {
          background: { color: "#1c1f2d00" },
          textColor: "white",
        },
        grid: {
          vertLines: { color: "#2e3342" },
          horzLines: { color: "#2e3342" },
        },
        crosshair: {
          vertLine: {
            width: 0.3,
            style: LineStyle.Solid,
            color: "#ffffffa0",
            labelBackgroundColour: "#9B7DFF",
          },
          horzLine: {
            width: 0.3,
            style: LineStyle.Solid,
            color: "#ffffffa0",
          },
        },
                                  
        priceScale: {
            autoScale: true
        },
        localization: {
          locale: 'en-US',
          type: 'price',
          minMove: '0.0001',
          precision: 4,
          priceFormatter:  (price) => {
              if (price < 0.001) return parseFloat(price).toFixed(4)
              else if (price >= 0.001 && price < 1) return parseFloat(price).toFixed(4)
              else return parseFloat(price).toFixed(4)
          }
        },
      });

      setc(chart)
  
      const candlestick = chart.addCandlestickSeries();
      setCandlestickSeries(candlestick);

      chartRef.current = chart;

      new ResizeObserver(entries => {
        if (entries.length === 0 || entries[0].target !== chartContainer) { return; }
        const newRect = entries[0].contentRect;
        chart.applyOptions({ height: newRect.height, width: newRect.width });
      }).observe(chartContainer);
  
      chart.timeScale().applyOptions({
        timeVisible: true,
        secondsVisible: false,
      });
    }
      window.addEventListener('resize', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize);
      };

  }, []);

  const handleResize = () => {
    // re-layout the chart on window resize
    chartRef.current.resize(
      document.getElementById('chart').clientWidth,
      document.getElementById('chart').clientHeight
    );
  };
  
  const socket = io(process.env.REACT_APP_SERVER_DOMAIN, { transports: ['websocket'] }); 
    useEffect(() => {
      if (socket || socket.connected) {
        socket.on('forexData', (realTimeData) => {
          try {
            socket.emit('updateTradingPair', userTradingPair);
            if (!loading){
            candlestickSeries.update({
              time: realTimeData.timestamp - 300,
              open: realTimeData.open - 0.001,
              high: realTimeData.high - 0.001,
              low: realTimeData.low - 0.001,
              close: realTimeData.close - 0.001,
            })
            setDisplay({
              time: realTimeData.timestamp - 300,
              open: realTimeData.open - 0.001,
              high: realTimeData.high - 0.001,
              low: realTimeData.low - 0.001,
              close: realTimeData.close - 0.001,
            })

          };
          } catch (error) {
            console.error(error)
          } 
        });
      }
  
      return () => {
        if (socket) {
          socket.off('forexData');
        }
      };
    }, [ userTradingPair, candlestickSeries, socket ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.polygon.io/v2/aggs/ticker/C:${historicalTradingPair}/range/1/hour/2023-12-20/2024-01-30?adjusted=true&sort=desc&limit=50000&apiKey=rrUQn7NpmfCtAOSHsiRRwsHw1kpYn2wW`
        );
        const data = response.data.results.map((item) => ({
          time: ((item.t/1000)-300),
          open: item.o,
          high: item.h,
          low: item.l,
          close: item.c,
        })).sort((a, b) => a.time - b.time);
        
        candlestickSeries.setData(data);

        c.subscribeCrosshairMove((param) => {
          
          if(param.time){
            const time = param?.time

          // Extracting open, high, low, and close values from seriesData
          const seriesData = param?.seriesData;
          const seriesPrices = seriesData ? {
            open: seriesData.get(seriesData.keys().next().value).open,
            high: seriesData.get(seriesData.keys().next().value).high,
            low: seriesData.get(seriesData.keys().next().value).low,
            close: seriesData.get(seriesData.keys().next().value).close,
          } : {};

            setCrosshairData({
              time: time,
              seriesPrices: seriesPrices || [],
            });
          }
          
        });
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }finally{
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };

    fetchData();
  }, [userTradingPair, candlestickSeries ]);

  const handleTradingPairChange = (newTradingPair) => {
    setUserTradingPair(newTradingPair);
    socket.emit('updateTradingPair', newTradingPair);
  };

  //select options 
  const currencyOptions = [
    { value: "EUR-USD", label: "EUR/USD" },
    { value: "EUR-GBP", label: "EUR/GBP" },
    { value: "EUR-CHF", label: "EUR/CHF" },
    { value: "EUR-JPY", label: "EUR/JPY" },
    { value: "EUR-CAD", label: "EUR/CAD" },
    { value: "EUR-AUD", label: "EUR/AUD" },
    { value: "EUR-NZD", label: "EUR/NZD" },
  
    { value: "GBP-USD", label: "GBP/USD" },
    { value: "GBP-CHF", label: "GBP/CHF" },
    { value: "GBP-JPY", label: "GBP/JPY" },
    { value: "GBP-CAD", label: "GBP/CAD" },
    { value: "GBP-AUD", label: "GBP/AUD" },
    { value: "GBP-NZD", label: "GBP/NZD" },
  
    { value: "CHF-JPY", label: "CHF/JPY" },
  
    { value: "XAU-USD", label: "XAU/USD" },
  
    { value: "USD-JPY", label: "USD/JPY" },
    { value: "USD-CHF", label: "USD/CHF" },
    { value: "USD-CAD", label: "USD/CAD" },
  
    { value: "CAD-JPY", label: "CAD/JPY" },
    { value: "CAD-CHF", label: "CAD/CHF" },
  
    { value: "AUD-USD", label: "AUD/USD" },
    { value: "AUD-CHF", label: "AUD/CHF" },
    { value: "AUD-JPY", label: "AUD/JPY" },
    { value: "AUD-NZD", label: "AUD/NZD" },
    { value: "AUD-CAD", label: "AUD/CAD" },
  
    { value: "NZD-USD", label: "NZD/USD" },
    { value: "NZD-CHF", label: "NZD/CHF" },
    { value: "NZD-JPY", label: "NZD/JPY" },
    { value: "NZD-CAD", label: "NZD/CAD" },

  ];
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: '#2b3040',
      width: 200, 
      border: 'none',
      height: 40, 
      color: "white",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
     background: '#2b3040',
     width: "200",
    }),
    option: (provided, state) => ({
      ...provided,
      zIndex: 9999,
      width: 200,
      borderRadius: '4px',
      fontSize:'13px',
      backgroundColor: state.isSelected ? '#515666' : state.isFocused ? '#2b3040' : '#2b3040',
      color: state.isSelected ? 'white' : 'white',
      cursor: 'pointer',
    }),
      input: (provided) => ({
      ...provided,
      color: 'white',
      fontWeight:"300",
      fontSize: '14px',
      outline: 'none',
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: 'white',
      fontWeight:"900",
      fontSize: '14px',
    }),
  };
  const customStylesmb = {
    control: (provided, state) => ({
      ...provided,
      background: '#2b3040',
      width: 150, 
      height: 20,
      border: 'none',
      height: 40, 
      color: "white",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
     background: '#2b3040',
     width: "200",
    }),
    option: (provided, state) => ({
      ...provided,
      zIndex: 9999,
      width: 200,
      borderRadius: '4px',
      fontSize:'10px',
      backgroundColor: state.isSelected ? '#515666' : state.isFocused ? '#2b3040' : '#2b3040',
      color: state.isSelected ? 'white' : 'white',
      cursor: 'pointer',
    }),
      input: (provided) => ({
      ...provided,
      color: 'white',
      height:'15px',
      fontWeight:"300",
      fontSize: '10px',
      outline: 'none',
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: 'white',
      fontWeight:"900",
      fontSize: '11px',
    }),
  };

  const open = display?.open.toFixed(4)
  const high = display?.open.toFixed(4)
  const low = display?.open.toFixed(4)
  const close = display?.open.toFixed(4)

  return (
    <div className="tradingview-widget-container">

      <div className="display-values">
        <p>O <span>{crosshairData.seriesPrices.open ? crosshairData.seriesPrices.open : open}</span></p>
        <p>H <span>{crosshairData.seriesPrices.high ? crosshairData.seriesPrices.high : high}</span></p>
        <p>L <span>{crosshairData.seriesPrices.low ? crosshairData.seriesPrices.low : low}</span></p>
        <p>C <span>{crosshairData.seriesPrices.close ? crosshairData.seriesPrices.close : close}</span></p>
      </div>
      
        <div className={`indicators ${showIndicators ? 'open-indicators' : 'closed-indicators'}`}>
          <div className="indicators-text"><h5>INDICATORS</h5><span onClick={toggleIndicators}><IoCloseOutline size={25} color="gray"/></span></div>
          
          <ul>
            <li onClick={toggleIndicators}>Moving average<LuChevronRight/></li>
            <li onClick={toggleIndicators}>Bollinger Bands<LuChevronRight/></li>
            <li onClick={toggleIndicators}>RSI<LuChevronRight/></li>
            <li onClick={toggleIndicators}>Stochastic Oscillator<LuChevronRight/></li>
            <li onClick={toggleIndicators}>ATR<LuChevronRight/></li>
            <li onClick={toggleIndicators}>Ichimoku Cloud<LuChevronRight/></li>
          </ul>

        </div>

      <div className="App-header">
        <button type='button'><RiPencilFill/></button>
        <h1><img src={Exchange} />{userTradingPair} Chart</h1>
        <div className='trading-widget-select'>
        <Select
          styles={customStyles}
          options={currencyOptions}
          onChange={(selectedOption) => handleTradingPairChange(selectedOption.value)}
          value={currencyOptions.find(option => option.value === userTradingPair)}
        />
        </div>
        <div className='trading-widget-select-mb'>
        <Select
          styles={customStylesmb}
          options={currencyOptions}
          onChange={(selectedOption) => handleTradingPairChange(selectedOption.value)}
          value={currencyOptions.find(option => option.value === userTradingPair)}
        />
        </div>
        <main id='chartContainer' className='chartContainer'>

          {loading &&
                  <div className='box-chart-loading'>
                  <div className="CirclesWithBar">
                  <CirclesWithBar
                       height="50"
                       width="50"
                       color="#4fa94d"
                       outerCircleColor="#4fa94d"
                       innerCircleColor="#4fa94d"
                       barColor="#4fa94d"
                       ariaLabel="circles-with-bar-loading"
                       wrapperStyle={{}}
                       wrapperClass=""
                       visible={true}
                  />
                  </div>   
                  </div>
          }
            <div id="chart"></div>
      </main>
      </div>
     </div>
  );
};

export default ForexCandlestickChart;




