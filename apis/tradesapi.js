const expressAsyncHandler = require("express-async-handler");
var { io } = require('../index')
const { Trade } = require("../schema/tradeSchema");
const { User } = require("../schema/userSchema");

// const emitTradeUpdate = (tradeId, updatedTradeResult) => {
//   io.emit(`updateTradeResult:${tradeId}`, updatedTradeResult);
// };

const performTradeActions = async (trading, io) => {
  console.log(`Trade ${trading._id} - Countdown reached zero`);
  trading.status = 'Completed';
  
  await trading.save();

  // emitTradeUpdate(trading._id, trading.tradeResult);
  console.log(`Trade ${trading._id} - Actions performed`);
};

const startCountdown = (trading) => {
  const durationInMinutes = trading.time;
  const expirationTime = new Date(Date.now() + durationInMinutes * 60000);
  // Save the expiration time in the database
  trading.expirationTime = expirationTime;
  trading.save();
  console.log("initiated")
  // Schedule a task to perform actions when the countdown reaches zero
  setTimeout(async () => {
    await performTradeActions(trading,io);
  }, durationInMinutes * 60000);
};


const tradectrl = expressAsyncHandler(async (req, res) => {
  const { time, investment, result, calculatedResult, tradeId, tradeResult,expirationTime } = req.body;
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
    startCountdown(trading);
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
const tradebalctrl = expressAsyncHandler(async (req, res) => {
  const { time, tradeResult, investment, calculatedResult } = req?.body;
  console.log("Inside tradebalctrl");
  console.log(req?.body);
  try {
    const user = await User.findById(req?.user?._id);
    user.balance += calculatedResult;
    // Find and update the trade with the given time
    const trade = await Trade.findOneAndUpdate(
      { user: req?.user?._id, time, tradeResult: "Pending" },
      { tradeResult: "Won" },
      { new: true } // Return the updated document
    );
    // Save the user and trade changes
    await Promise.all([user.save(), trade.save()]);
    // await user.save();
    res.json({ balance: user.balance, alert: true });
  } catch (error) {
    console.error("Error placing trade:", error);
    res.status(500).json({ message: "Server error", alert: false });
  }
});

const tradelosectrl = expressAsyncHandler(async (req, res) => {
  const { time, tradeResult, investment, calculatedResult } = req?.body;
  console.log("Inside tradebalctrl");
  console.log(req?.body);
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

// fetch all trades
const fetchtradectrl = expressAsyncHandler(async (req, res) => {
  const { page } = req?.query;
  try {
    const trading = await Trade.paginate(
      {},
      {
        limit: 10,
        page: Number(page),
        populate: "user",
        sort: { createdAt: -1 },
      }
    );
    res.json(trading);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", alert: false });
  }
});

// fetch single trade
const singletradectrl = expressAsyncHandler(async (req, res) => {
  const { id } = req?.params;
  try {
    const trading = await Trade.findById(id);
    res.json(trading);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", alert: false });
  }
});

//update
const updatetradectrl = expressAsyncHandler(async (req, res) => {
  const { id } = req?.params;
  const { investment } = req.body;
  const { up } = req.body;
  const { down } = req.body;
  const { time } = req.body;
  const { result } = req.body;
  const { payout } = req.body;
  try {
    const trading = await Trade.findByIdAndUpdate(
      id,
      {
        investment,
        up,
        down,
        time,
        result,
        payout,
      },
      { new: true }
    );
    res.json(trading);
  } catch (error) {
    console.error(error);
    res.json(error);
  }
});

//delete
const deletetradectrl = expressAsyncHandler(async (req, res) => {
  const { id } = req?.params;
  try {
    const trading = await Trade.findByIdAndDelete(id);
    res.json(trading);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", alert: false });
  }
});

module.exports = {
  tradectrl,
  fetchtradectrl,
  singletradectrl,
  updatetradectrl,
  deletetradectrl,
  tradebalctrl,
  tradelosectrl,
};
