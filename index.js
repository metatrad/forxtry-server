const http = require('http');
const express = require("express");
const { errorHandler, notFound } = require("./middleware/errorMiddleware")
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { Trade } = require("./schema/tradeSchema");
const { Demo } = require("./schema/demoTradeSchema");
const { User } = require("./schema/userSchema");
const { Perc } = require('./schema/percentageSchema');
const schedule = require("node-schedule");
const {createUserctrl, fetchUsersctrl,  fetchPendingUsersctrl, fetchVerifiedUsersctrl, loginUserctrl,deleteUserCtrl,updateUsersctrl, userProfilectrl, updateProfilectrl, verifyOtpCtrl,forgotPasswordctrl, getfpctrl, postfpctrl} = require("./apis/userapi")
const { depositctrl, fetchdepositctrl,fetchVerifiedDepositctrl, singledepositctrl, updateDepositctrl, deleteDepositctrl } = require("./apis/deposit")
const { withdrawalctrl,withdrawalotp, fetchwithdrawalctrl,fetchVerifiedwithdrawalctrl, singlewithdrawalctrl , updatewithdrawalctrl, deletewithdrawalctrl } = require("./apis/withdrawalapi")
const { postdepositMethodctrl, fetchdepositMethodctrl,fetchmethodctrl,updatemethodctrl,deletemethodctrl  } = require("./apis/depositmethodapi")
const {percctrl, fetchpercctrl, updatepercctrl } = require('./apis/percapi')
const { authMiddleware } = require("./middleware/auth");
const { accountStatsctrl } = require("./apis/accountStats")
const multer = require('multer');
const app = express();

app.set("view engine","ejs")
app.use(express.urlencoded({ extended: false }))
app.use(express.static('trading'));

const corsOptions = {
  origin: 'https://forxtry.com/', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "10mb" }));
app.use(express.json());
dotenv.config()

const server = http.createServer(app);

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

//trading
const performTradeActions = async (trading) => {
  try {
    const user = await User.findById(trading.user);
    const percRecord = await Perc.findOne();
  if (!percRecord) {
    throw new Error("Perc record not found"); 
  }
  const perc = percRecord.perc;
  trading.status = 'Completed';
  const tradeResults = Math.random() < perc ? "Win" : "Loss";
  if (tradeResults === "Win") {
    trading.tradeResult =  "Won"
    user.balance+=trading.calculatedResult
  }
  if (tradeResults === "Loss") {
    trading.tradeResult =  "Lost"
  }
  await trading.save();
  await user.save();
  } catch (error) {
    console.log(error)
  }
};

const startCountdown = (trading, calculatedResult) => {
  const durationInMinutes = trading.time;
  const expirationTime = new Date(Date.now() + durationInMinutes * 60000);
  trading.expirationTime = expirationTime;
  trading.save();
  schedule.scheduleJob(expirationTime, async () => {
    await performTradeActions(trading, calculatedResult);
  });
};

app.post("/tradingcreate",authMiddleware , async (req, res) => {
  const { time, investment, result, calculatedResult, tradeId, } = req?.body;
  const { id } = req?.params;
  try {
    const user = await User.findById(req?.user?._id);
    if (user.balance < investment) {
      throw new Error("Insufficient balance");
    }
    user.balance -= investment;
    await user.save();
    const trading = await Trade.create({
      user: req?.user?._id,
      time,
      result,
      investment,
      calculatedResult,
      tradeId,
    });
    // Start the countdown
    startCountdown(trading, calculatedResult);

    const updateprofile = await User.findByIdAndUpdate(
      id,
      {
        balance: req?.body?.balance,
        demoBalance: req?.body?.demoBalance,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.json({ trading,tradeId: trading._id, updateprofile, balance: user.balance, alert: true, });
  } catch (error) {
    console.error("Error placing trade:", error);
    res.status(500).json({ message: "Insufficient balance", alert: false });
  }
});

//update trade bal
app.post("/trading",authMiddleware,async (req, res) => {
  console.log("Inside tradebalctrl");
  try {
    const user = await User.findById(req?.user?._id);
    console.log(user)
    // Retrieve calculatedResult from the trade with the given tradeId
    const tradeId = req?.body?.tradeId;
    const trade = await Trade.findOne({});
    if (!trade) {
      throw new Error("Trade not found");
    }
    const calculatedResult = trade.calculatedResult;
    console.log('Calculated Result:', calculatedResult);
    user.balance += 10;
    await user.save();
    // await user.save();
    res.json({ balance: user.balance, alert: true });
  } catch (error) {
    console.error("Error updating balance:", error);
    res.status(500).json({ message: "Server error", alert: false });
  }
});

app.post("/tradelost",authMiddleware , async (req, res) => {
  const { time } = req?.body;
  console.log("Inside tradebalctrl");
  try {
    const user = await User.findById(req?.user?._id);
    // Find and update the trade with the given time
    const trade = await Trade.findOneAndUpdate(
      { user: req?.user?._id, time, tradeResult: "Pending" },
      { tradeResult: "Lost" },
      { new: true } // Return the updated document
    );
    // Save the user and trade changes
    await Promise.all([user.save(), trade.save()]);
    // await user.save();
    res.json({ alert: true });
  } catch (error) {
    console.error("loss error:", error);
    res.status(500).json({ message: "Server error", alert: false });
  }
});




//demo trading
const performDemoTradeActions = async (trading) => {
  try {
  const user = await User.findById(trading.user);
  const percRecord = await Perc.findOne();
  if (!percRecord) {
    console.log('Perc record not found')
    throw new Error("Perc record not found"); 
  }
  const demoperc = percRecord.demoperc;
  console.log(`Trade ${trading._id} - Countdown reached zero`);
  trading.status = 'Completed';
  const tradeResults = Math.random() < demoperc ? "Win" : "Loss";
  if (tradeResults === "Win") {
    trading.tradeResult =  "Won"
    user.demoBalance+=trading.calculatedResult
  }
  if (tradeResults === "Loss") {
    trading.tradeResult =  "Lost"
  }
  await trading.save();
  await user.save();
  console.log(`Trade ${trading._id} - Actions performed`);
  console.log(`Trade ${trading._id} - ${trading.tradeResult}`);
  } catch (error) {
    console.log(error)
  }
};
const startDemoCountdown = (trading, calculatedResult) => {
  const durationInMinutes = trading.time;
  const expirationTime = new Date(Date.now() + durationInMinutes * 60000);
  trading.expirationTime = expirationTime;
  trading.save();
  schedule.scheduleJob(expirationTime, async () => {
    await performDemoTradeActions(trading, calculatedResult);
  });
};

app.post("/democreate",authMiddleware, async (req, res) => {
  const { time, investment, result, calculatedResult, tradeId, } = req?.body;
  const { id } = req?.params;
  try {
    const user = await User.findById(req?.user?._id);
    if (user.demoBalance < investment) {
      throw new Error("Insufficient balance");
    }
    user.demoBalance -= investment;
    await user.save();
    const trading = await Demo.create({
      user: req?.user?._id,
      time,
      result,
      investment,
      calculatedResult,
      tradeId,
    });
    // Start the countdown
    startDemoCountdown(trading, calculatedResult);
    const updateprofile = await User.findByIdAndUpdate(
      id,
      {
        balance: req?.body?.balance,
        demoBalance: req?.body?.demoBalance,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.json({ trading,tradeId: trading._id, updateprofile, demoBalance: user.demoBalance, alert: true, });
  } catch (error) {
    console.error("Error placing trade:", error);
    res.status(500).json({ message: "Insufficient balance", alert: false });
  }
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
app.delete("/deleteuser",authMiddleware, deleteUserCtrl);
app.post("/forgot-password",  forgotPasswordctrl);
app.get("/reset-password/:id/:token",getfpctrl);
app.post("/reset-password/:id/:token",postfpctrl);

//handle users
app.get("/adminusers",authMiddleware, fetchUsersctrl);
app.get("/adminuserspending",authMiddleware, fetchPendingUsersctrl);
app.get("/adminusersverified",authMiddleware, fetchVerifiedUsersctrl);
app.get("/profile",authMiddleware, userProfilectrl);
app.put("/account",authMiddleware, updateProfilectrl);
app.put("/adminusers/:id",authMiddleware, updateUsersctrl);

//deposit
app.post("/depositmenu",authMiddleware,depositctrl);
app.get("/depositmenu",authMiddleware,fetchdepositctrl);
app.get("/depositmenuverified",authMiddleware,fetchVerifiedDepositctrl);
app.get("/depositmenu/:id",authMiddleware,singledepositctrl);
app.put("/admindeposit/:id",authMiddleware,updateDepositctrl);
app.delete("/depositmenu/:id",authMiddleware,deleteDepositctrl);

//withdrawal
app.post("/withdrawal",authMiddleware,withdrawalctrl);
app.post("/withdrawalotp",authMiddleware,withdrawalotp);
app.get("/withdrawal",authMiddleware,fetchwithdrawalctrl);
app.get("/withdrawalverified",authMiddleware,fetchVerifiedwithdrawalctrl);
app.get("/withdrawal/:id",authMiddleware,singlewithdrawalctrl);
app.put("/adminwithdrawal/:id",authMiddleware,updatewithdrawalctrl);
app.delete("/withdrawal/:id",authMiddleware,deletewithdrawalctrl);


//api deposit method
app.post("/admindeposit", postdepositMethodctrl);
//fetch deposit method
app.get("/admindeposit", fetchdepositMethodctrl);
//admin deposit method
app.get("/admindepositall", fetchmethodctrl);
app.put("/admindepositupdate/:id", updatemethodctrl);
app.delete("/admindepositdelete/:id", deletemethodctrl);



//account stats
app.get("/admin",accountStatsctrl)


//error
app.use(notFound)
app.use(errorHandler)

//server is running
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
