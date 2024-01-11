// const expressAsyncHandler = require("express-async-handler");
// const { Trade } = require("../schema/tradeSchema");
// const { User } = require('../schema/userSchema')

// const tradectrl = expressAsyncHandler(async (req, res) => {
//   const { time , investment, result, calculatedResult, tradeResult } = req.body;
//   const { id } = req?.params;


//   try {
//     const user = await User.findById(req?.user?._id,);

//     if (user.balance < investment ) {
//       throw new Error("Insufficient balance");
//     }
//       user.balance -= investment;

//       await user.save();
//       const trading = await Trade.create({
//         user: req?.user?._id,
//         time,
//         result,
//         investment,
//         calculatedResult,
//       });

//       const updateprofile = await User.findByIdAndUpdate(
//         id,
//         {
//           balance: req?.body?.balance,
//           demoBalance: req?.body?.demoBalance,
//         },
//         {
//           new: true,
//           runValidators: true,
//         }
//       );
  
//       res.json({trading,updateprofile, balance: user.balance, alert: true})

//   } catch (error) {
//     console.error("Error placing trade:", error);
//     res.status(500).json({ message: "Insufficient balance", alert: false });
//   }
// });





// const express = require('express');
// const axios = require('axios');
// const cors = require('cors');

// const app = express();
// const PORT = process.env.PORT || 3001;

// app.use(cors());

// app.get('/cryptodata', async (req, res) => {
//   try {
//     // Fetch API
//     const response = await axios.get('https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=CNY&apikey=demo');
//     const cryptodata = response.data;

//    //delay
//     setTimeout(() => {
//       res.json(cryptodata);
//     }, 5 * 60 * 1000); 
//   } catch (error) {
//     console.error('Error fetching cryptocurrency data:', error);
//     res.status(500).json({ error: 'Failed to fetch cryptocurrency data' });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
