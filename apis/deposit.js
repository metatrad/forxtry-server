const expressAsyncHandler = require("express-async-handler");
const { User } = require('../schema/userSchema')
const { Deposit } = require("../schema/depositSchema");
 
//create deposit
const depositctrl = expressAsyncHandler(async (req, res) => {
  const { type, method, amount, status } = req.body;

  try { 
    const deposit = await Deposit.create({
      user: req?.user?._id,
      type,
      method,
      amount,
      status,
    });

      res.json({deposit, message: "created", alert: true})
    
    

  } catch (error) {
    console.error("Error depositing funds:", error);
    res.status(500).json({ message: "Server error", alert: false });
  }
});

// fetch all deposit
const fetchdepositctrl = expressAsyncHandler(async (req, res) => {
  const {page} = req?.query;
  try {
    const deposit = await Deposit.paginate({}, {limit: 10, page: Number(page), populate: ["user", "method"],sort: { createdAt: -1 },});
    res.json(deposit)

  } catch (error) {
    res.status(500).json({ message: "Server error", alert: false });
  }
});

// fetch single deposit
const singledepositctrl = expressAsyncHandler(async (req, res) => {
  const {id} = req?.params;
  try {
    const deposit = await Deposit.findById(id);
    res.json(deposit)

  } catch (error) {
    res.status(500).json({ message: "Server error", alert: false });
  }
});

//update
const updateDepositctrl = expressAsyncHandler(async(req,res)=>{
  const {id} = req?.params;
  const { amount, method, status } = req.body;
  try {

    const deposit = await Deposit.findById(id);

    if (deposit.status === 'Pending' && status === 'approved') {
      const user = await User.findById(deposit.user);
      user.balance += parseFloat(amount);
      await user.save();
    }
 
    const updatedDeposit = await Deposit.findByIdAndUpdate(id, {
      amount, method, status
    }, {new: true})
    res.json(updatedDeposit)
  } catch (error) {
    res.json(error)
  }
})

//delete
const deleteDepositctrl = expressAsyncHandler(async (req, res) => {
  const {id} = req?.params;
  try {
    const deposit = await Deposit.findByIdAndDelete(id);
    res.json(deposit)

  } catch (error) {
    res.status(500).json({ message: "Server error", alert: false });
  }
});


module.exports = { depositctrl, fetchdepositctrl, singledepositctrl, updateDepositctrl, deleteDepositctrl };
