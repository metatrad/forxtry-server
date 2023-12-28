const expressAsyncHandler = require("express-async-handler");
const { Trade } = require("../schema/tradeSchema");
const { User } = require('../schema/userSchema')

const tradectrl = expressAsyncHandler(async (req, res) => {
  const { time , investment, result, calculatedResult, tradeResult } = req.body;

  try {
    const user = await User.findById(req?.user?._id,);

    if (user.balance < investment ) {
      throw new Error("Insufficient balance");
      return res.status(400).json({ message: 'Insufficient balance', alert: false });
    }
      user.balance -= investment;

      await user.save();
      const trading = await Trade.create({
        user: req?.user?._id,
        time,
        result,
        investment,
        calculatedResult,
      });
  
      res.json({trading, balance: user.balance, alert: true})

  } catch (error) {
    console.error("Error placing trade:", error);
    res.status(500).json({ message: "Server error", alert: false });
  }
});

//update trade bal
const tradebalctrl = expressAsyncHandler(async (req, res) => {
  const { time , investment, result, calculatedResult, } = req?.body;

  try {
    const user = await User.findById(req?.user?._id,);

    user.balance += calculatedResult;    

    await user.save();
    const trading = await Trade.create({
      user: req?.user?._id,
      time,
      result,
      investment,
      calculatedResult,
    });
  
      res.json({trading, balance: user.balance, alert: true})

  } catch (error) {
    console.error("Error placing trade:", error);
    res.status(500).json({ message: "Server error", alert: false });
  }
});

//demotrade
const demotradectrl = expressAsyncHandler(async (req, res) => {

  const { time , investment, result, calculatedResult, tradeResult } = req.body;

  try {
    const user = await User.findById(req?.user?._id,);

    if (user.demoBalance < investment ) {
      throw new Error("Insufficient balance");
      return res.status(400).json({ message: 'Insufficient balance', alert: false });
    }
      user.demoBalance -= investment;
      await user.save();
      const trading = await Trade.create({
        user: req?.user?._id,
        time,
        result,
        investment,
        calculatedResult,
      });
  
      res.json({trading, demoBalance: user.demoBalance, alert: true})

  } catch (error) {
    console.error("Error placing trade:", error);
    res.status(500).json({ message: "Server error", alert: false });
  }
});

//update trade bal
const demotradebalctrl = expressAsyncHandler(async (req, res) => {
  const { time , investment, result, calculatedResult, } = req?.body;

  try {
    const user = await User.findById(req?.user?._id,);

    user.demoBalance += calculatedResult;
    
    await user.save();
    const trading = await Trade.create({
      user: req?.user?._id,
      time,
      result,
      investment,
      calculatedResult,
    });
  
      res.json({trading, demoBalance: user.demoBalance, alert: true})

  } catch (error) {
    console.error("Error placing trade:", error);
    res.status(500).json({ message: "Server error", alert: false });
  }
});



// fetch all trades
const fetchtradectrl = expressAsyncHandler(async (req, res) => {
  const {page} = req?.query;
  try {
    const trading = await Trade.paginate({}, {limit: 10, page: Number(page), populate: "user",sort: { createdAt: -1 },});
    res.json(trading)

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", alert: false });
  }
});

// fetch single trade
const singletradectrl = expressAsyncHandler(async (req, res) => {
  const {id} = req?.params;
  try {
    const trading = await Trade.findById(id);
    res.json(trading)

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", alert: false });
  }
});

//update
const updatetradectrl = expressAsyncHandler(async(req,res)=>{
  const {id} = req?.params;
  const { investment } = req.body;
  const { up } = req.body;
  const { down } = req.body;
  const { time } = req.body;
  const { result } = req.body;
  const { payout } = req.body;
  try {
    const trading = await Trade.findByIdAndUpdate(id, {
      investment, up,down, time, result,payout
    }, {new: true})
    res.json(trading)
  } catch (error) {
    console.error(error);
    res.json(error)
  }
})

//delete
const deletetradectrl = expressAsyncHandler(async (req, res) => {
  const {id} = req?.params;
  try {
    const trading = await Trade.findByIdAndDelete(id);
    res.json(trading)

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", alert: false });
  }
});


module.exports = { tradectrl, fetchtradectrl, singletradectrl , updatetradectrl, deletetradectrl, tradebalctrl, demotradectrl, demotradebalctrl };