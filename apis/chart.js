const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

app.get('/cryptodata', async (req, res) => {
  try {
    // Fetch API
    const response = await axios.get('https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=CNY&apikey=demo');
    const cryptodata = response.data;

   //delay
    setTimeout(() => {
      res.json(cryptodata);
    }, 5 * 60 * 1000); 
  } catch (error) {
    console.error('Error fetching cryptocurrency data:', error);
    res.status(500).json({ error: 'Failed to fetch cryptocurrency data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
