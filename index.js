const http = require('http');
const express = require("express");
const { errorHandler, notFound } = require("./middleware/errorMiddleware")
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const socketIo = require('socket.io');
const WebSocket = require('ws');
const {createUserctrl, fetchUsersctrl, loginUserctrl,updateUsersctrl, userProfilectrl, updateProfilectrl, verifyOtpCtrl,forgotPasswordctrl, getfpctrl, postfpctrl} = require("./apis/userapi")
const { depositctrl, fetchdepositctrl, singledepositctrl, updateDepositctrl, deleteDepositctrl } = require("./apis/deposit")
const { withdrawalctrl, fetchwithdrawalctrl, singlewithdrawalctrl , updatewithdrawalctrl, deletewithdrawalctrl } = require("./apis/withdrawalapi")
const { postdepositMethodctrl, fetchdepositMethodctrl } = require("./apis/depositmethodapi")
const { tradectrl, tradebalctrl, tradelosectrl } = require('./apis/tradesapi')
const { demotradectrl, demotradebalctrl} = require('./apis/demoTradeapi')
const {percctrl, fetchpercctrl, updatepercctrl } = require('./apis/percapi')
const { authMiddleware } = require("./middleware/auth");
const { accountStatsctrl } = require("./apis/accountStats")
const multer = require('multer');
const app = express();

app.set("view engine","ejs")
app.use(express.urlencoded({ extended: false }))
app.use(express.static('trading'));

const corsOptions = {
  origin: 'http://localhost:3000', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "10mb" }));
app.use(express.json());
dotenv.config()

const server = http.createServer(app);

const socketIO = require('socket.io');

const io = socketIO(server);

app.set('io', io);

let lastFetchedData = null;
const polygonApiKey = 'rrUQn7NpmfCtAOSHsiRRwsHw1kpYn2wW';
let tradingPair = 'EUR-USD'; // Default trading pair

io.on('connection', (socket) => {
  console.log('Client connected');
    // Send the last fetched data to the newly connected client
    if (lastFetchedData) {
      socket.emit('forexCandlesticks', [lastFetchedData]);
    }

  const polygonWsUrl = 'wss://socket.polygon.io/forex';
  const polygonWs = new WebSocket(polygonWsUrl);

  // Authenticate with Polygon.io
  polygonWs.onopen = () => {
    console.log('WebSocket connection established with Polygon.io');
    const authMessage = JSON.stringify({ action: 'auth', params: polygonApiKey });
    polygonWs.send(authMessage);

    // Subscribe to Forex pair (e.g., EUR/USD)
    const subscribeMessage = JSON.stringify({ action: 'subscribe', params: `CAS.${tradingPair}` });
    polygonWs.send(subscribeMessage);

  };
  // Handle real-time data from Polygon.io
  polygonWs.onmessage = (event) => {
    const messages = JSON.parse(event.data);

    if (Array.isArray(messages)) {
      messages.forEach((message) => {
        if (message.ev === 'CAS') {
          const realTimeData = {
            timestamp: parseFloat((message.e/1000)),
            open: parseFloat(message.o),
            high: parseFloat(message.h), 
            low: parseFloat(message.l),
            close: parseFloat(message.c),
          };
    
          // Emit real-time data to connected clients
          io.emit('forexData', realTimeData);
        }
      });
    }
  };

  // Handle disconnection
  socket.on('disconnect', () => {
    if (polygonWs.readyState === WebSocket.OPEN) {
      console.log('Closing WebSocket connection');
      polygonWs.close();
    }
    console.log('Client disconnected');
  });
  // Handle WebSocket errors
  polygonWs.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
  // Receive user preferences or selections for trading pair
  socket.on('updateTradingPair', (newTradingPair) => {
    if (newTradingPair !== tradingPair) {
      tradingPair = newTradingPair;

      // Update the WebSocket subscription only if the trading pair has changed
      const subscribeMessage = JSON.stringify({ action: 'subscribe', params: `CAS.${tradingPair}` });
      polygonWs.send(subscribeMessage);
    }
  });
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const PORT = process.env.PORT || 5000;

//mongodb connecton
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("connected to database"))
  .catch((err) => console.log(err));

//api
app.get("/", (req, res) => {
  res.send("server is running");
});

//percentage win/loss
app.post("/perc",authMiddleware, percctrl);
app.get("/admintransaction",authMiddleware, fetchpercctrl);
app.get("/trading",authMiddleware, fetchpercctrl);
app.put("/admintransactions/:id",authMiddleware, updatepercctrl);


app.get("/chartdata",authMiddleware, updatepercctrl);

//signup and login
app.post("/signup", createUserctrl);
app.post("/login",loginUserctrl);
app.post("/otp",verifyOtpCtrl);
app.post("/forgot-password",  forgotPasswordctrl);
app.get("/reset-password/:id/:token",getfpctrl);
app.post("/reset-password/:id/:token",postfpctrl);

//handle users
app.get("/adminusers",authMiddleware, fetchUsersctrl);
app.get("/profile",authMiddleware, userProfilectrl);
app.put("/account",authMiddleware, updateProfilectrl);
app.put("/adminusers/:id",authMiddleware, updateUsersctrl);

//trading
app.post("/tradingcreate",authMiddleware, tradectrl);
app.post("/trading",authMiddleware, tradebalctrl);
app.post("/tradelost",authMiddleware, tradelosectrl);

app.post("/democreate",authMiddleware, demotradectrl);
app.post("/demo",authMiddleware, demotradebalctrl);

//deposit
app.post("/depositmenu",authMiddleware,depositctrl);
app.get("/depositmenu",authMiddleware,fetchdepositctrl);
app.get("/depositmenu/:id",authMiddleware,singledepositctrl);
app.put("/admindeposit/:id",authMiddleware,updateDepositctrl);
app.delete("/depositmenu/:id",authMiddleware,deleteDepositctrl);

//withdrawal
app.post("/withdrawal",authMiddleware,withdrawalctrl);
app.get("/withdrawal",authMiddleware,fetchwithdrawalctrl);
app.get("/withdrawal/:id",authMiddleware,singlewithdrawalctrl);
app.put("/adminwithdrawal/:id",authMiddleware,updatewithdrawalctrl);
app.delete("/withdrawal/:id",authMiddleware,deletewithdrawalctrl);


//api deposit method
app.post("/admindeposit", postdepositMethodctrl);

//fetch deposit method
app.get("/admindeposit", fetchdepositMethodctrl);

//account stats
app.get("/admin",accountStatsctrl)


//error
app.use(notFound)
app.use(errorHandler)

//server is running
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
