const expressAsyncHandler = require("express-async-handler");
const { Demo } = require("../schema/demoTradeSchema");
const { User } = require("../schema/userSchema");

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
