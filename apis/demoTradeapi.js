const expressAsyncHandler = require("express-async-handler");
const { Demo } = require("../schema/demoTradeSchema");
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
    user.demoBalance += trading.calculatedResult; 
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

//demotrade
const demotradectrl = expressAsyncHandler(async (req, res) => {
  const { time, investment, result, calculatedResult, tradeResult } = req.body;

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
    });
        // Start the countdown
        startCountdown(trading);

    res.json({ trading, demoBalance: user.demoBalance, alert: true });
  } catch (error) {
    console.error("Error placing trade:", error);
    res.status(500).json({ message: "Server error", alert: false });
  }
});

//update trade bal
const demotradebalctrl = expressAsyncHandler(async (req, res) => {
  const { time, investment, result, calculatedResult } = req?.body;

  try {
    const user = await User.findById(req?.user?._id);

    user.demoBalance += calculatedResult;

    res.json({ demoBalance: user.demoBalance, alert: true });
  } catch (error) {
    console.error("Error placing trade:", error);
    res.status(500).json({ message: "Server error", alert: false });
  }
});


module.exports = {
  demotradectrl,
  demotradebalctrl,
};
