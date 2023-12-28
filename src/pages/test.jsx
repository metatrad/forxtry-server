import React, { useEffect, useState } from 'react';
import TradingViewWidget, { Themes } from 'react-tradingview-widget';

const CryptoChart = () => {
  const [cryptocurrencyData, setCryptocurrencyData] = useState([]);

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/cryptodata');
        const data = await response.json();
        setCryptocurrencyData(data);
      } catch (error) {
        console.error('Error fetching cryptocurrency data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <TradingViewWidget
        symbol="BTCUSD" 
        theme={Themes.DARK} 
        interval="5" 
        data={cryptocurrencyData} 
      />
    </div>
  );
};

export default CryptoChart;

// import React, { useEffect } from 'react';
// import { createChart } from 'lightweight-charts';

// const TradingViewChart = () => {
//   useEffect(() => {
//     // Configure TradingView widget
//     const widget = createChart(document.getElementById('tradingview-chart'), {
//       width: window.innerWidth,
//       height: 500,
//       localization: {
//         timeFormatter: (businessDayOrTimestamp) => {
//           return new Date(businessDayOrTimestamp * 1000).toLocaleDateString();
//         },
//       },
//       // Add more configuration options as needed
//     });

//     // Create a new line series
//     const series = widget.addLineSeries();

//     // Fetch data from your custom endpoint
//     fetch('http://localhost:5000/cryptodata')
//       .then((response) => response.json())
//       .then((data) => {
//         // Add data to the series
//         series.setData(data);
//       })
//       .catch((error) => console.error('Error fetching data:', error));
//   }, []);

//   return <div id="tradingview-chart" style={{ width: '100%', height: '500px' }}></div>;
// };

// export default TradingViewChart;
