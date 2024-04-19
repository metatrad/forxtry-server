const expressAsyncHandler = require("express-async-handler");
const { Withdrawal } = require("../schema/withdrawalSchema");
const { User } = require('../schema/userSchema')
//email handler
const nodemailer = require("nodemailer")

//unique id
const { v4: uuidv4 } = require("uuid");

//env variables
require("dotenv").config();

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "metatrader498@gmail.com",
    pass: "jzfqfuvvszdqorvi"
  }
})

//testing transporter
transporter.verify((error,success)=>{
  if (error) {
  } else {
    console.log('ready for message')
  }
})

const sendOtpEmail = async (email, otp) => {
  
  // HTML content with inline styles
  const htmlContent = `
  <h2>Your OTP for Withdrawal</h2>
  <p style="color: #000; font-size: 16px;">Dear User,</p>
  <p style="color: #000; font-size: 16px;">Your OTP for Withdrawal is: <span style="font-weight: bold; color: #0ad539; font-size: 24px;">${otp}</span></p>
  <p style="color: #777; font-size: 16px;">Note: This OTP is valid for 5 minutes.</p>
`;

const mailOptions = {
  from: "Forxtry",
  to: email,
  subject: 'Your OTP for Withdrawal',
  html: htmlContent,
};

await transporter.sendMail(mailOptions);
};

const withdrawalotp = expressAsyncHandler(async (req, res) => {

  const { email } = req?.body;

  const userFound = await User.findOne({ email });

  if (userFound) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP and expiration in the database
    const otpExpiration = new Date(Date.now() + 5 * 60 * 1000);
    await User.findOneAndUpdate(
      { email },
      { $set: { otp, otpExpiration } },
      { upsert: true }
    );
    // Send the OTP via email
    await sendOtpEmail(email, otp);
    res.json({
      message: "OTP sent to your email.",
      alert: true,
    });
  } else {
    res.status(401);
    throw new Error("No user found");
  }

});


const withdrawalctrl = expressAsyncHandler(async (req, res) => {
  const { type , amount, number, account, name, status, otp } = req.body;

  try {
    const user = await User.findById(req?.user?._id);

    if(otp && otp!==user.otp){
      return res.status(400).json({ message: 'Invalid Otp', alert: false });
    }

    if (user.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance', alert: false });
    }
      user.balance -= amount;
      await user.save();
      const withdrawal = await Withdrawal.create({
        user: req?.user?._id,
        type,
        amount,
        number,
        account,
        name,
        status,
      });

      const response = {
        withdrawal,
        balance: user.balance,
        alert: true,
      };
  
      res.json(response)

  } catch (error) {
    console.error("Error withdrawing funds:", error);
    res.status(500).json({ message: "Server error", alert: false });
  }
});

// fetch all withdrawals
const fetchwithdrawalctrl = expressAsyncHandler(async (req, res) => {
  const {page} = req?.query;
  try {
    const withdrawal = await Withdrawal.paginate({ status: { $regex: new RegExp("Pending", "i") } }, {limit: 10, page: Number(page), populate: "user",sort: { createdAt: -1 }});
    res.json(withdrawal)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", alert: false });
  }
});
const fetchVerifiedwithdrawalctrl = expressAsyncHandler(async (req, res) => {
  const {page} = req?.query;
  try {
    const withdrawal = await Withdrawal.paginate({ status: { $regex: new RegExp("Approved", "i") } },  {limit: 10, page: Number(page), populate: "user",sort: { createdAt: -1 }});
    res.json(withdrawal)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", alert: false });
  }
});

// fetch single withdrawal
const singlewithdrawalctrl = expressAsyncHandler(async (req, res) => {
  const {id} = req?.params;
  try {
    const withdrawal = await Withdrawal.findById(id);
    res.json(withdrawal)

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", alert: false });
  }
});

//update
const updatewithdrawalctrl = expressAsyncHandler(async(req,res)=>{
  const {id} = req?.params;
  const { amount } = req.body;
  const { number } = req.body;
  const { account } = req.body;
  const { name } = req.body;
  const { status } = req.body;
  try {
    const withdrawal = await Withdrawal.findByIdAndUpdate(id, {
      amount, number, account, name,status
    }, {new: true})
    res.json(withdrawal)
  } catch (error) {
    console.error(error);
    res.json(error)
  }
})

//delete
const deletewithdrawalctrl = expressAsyncHandler(async (req, res) => {
  const {id} = req?.params;
  try {
    const withdrawal = await Withdrawal.findByIdAndDelete(id);
    res.json(withdrawal)

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", alert: false });
  }
});


module.exports = { withdrawalctrl, fetchwithdrawalctrl,fetchVerifiedwithdrawalctrl, singlewithdrawalctrl , updatewithdrawalctrl, deletewithdrawalctrl,withdrawalotp };