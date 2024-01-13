const expressAsyncHandler = require("express-async-handler");
const { Trade } = require("../schema/tradeSchema");
const { User } = require("../schema/userSchema");
const { Perc } = require('../schema/percentageSchema')
const schedule = require("node-schedule");

const performTradeActions = async (trading) => {

  try {
  const percRecord = await Perc.findOne();

  if (!percRecord) {
    console.log('Perc record not found')
    throw new Error("Perc record not found"); 
  }
  const perc = percRecord.perc;

  console.log(`Trade ${trading._id} - Countdown reached zero`);
  trading.status = 'Completed';

  const tradeResults = Math.random() < perc ? "Win" : "Loss";

  if (tradeResults === "Win") {
    trading.tradeResult =  "Won"
  }
  if (tradeResults === "Loss") {
    trading.tradeResult =  "Lost"
  }
  await trading.save();
  const user = await User.findById(trading.user);

  if (tradeResults === 'Win') {
    user.balance += trading.calculatedResult; 
  }
  await user.save();
  console.log(`Trade ${trading._id} - Actions performed`);
  console.log(`Trade ${trading._id} - ${trading.tradeResult}`);
    
  } catch (error) {
    console.log(error)
  }

};

const startCountdown = (trading) => {
  const durationInMinutes = trading.time;
  const expirationTime = new Date(Date.now() + durationInMinutes * 60000);
  trading.expirationTime = expirationTime;
  trading.save();
  console.log("initiated")

  schedule.scheduleJob(expirationTime, async () => {
    await performTradeActions(trading);
  });
};

const tradectrl = expressAsyncHandler(async (req, res) => {
  const { time, investment, result, calculatedResult, tradeId, } = req.body;
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
  try {
    const user = await User.findById(req?.user?._id);

    await Promise.all([user.save()]);
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
  updateExpctrl,
};
