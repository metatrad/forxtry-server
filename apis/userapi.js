const expressAsyncHandler = require("express-async-handler");
const { User } = require("../schema/userSchema");
const { generateToken } = require("../middleware/generateToken");
const multer = require("multer");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


//email handler
const nodemailer = require("nodemailer")

//unique id
const { v4: uuidv4 } = require("uuid");

//env variables
require("dotenv").config();

//nodemailer transport
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "metatrader498@gmail.com",
    pass: "jzfqfuvvszdqorvi"
  }
});

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
    <h2>Your OTP for Login</h2>
    <p style="color: #333; font-size: 16px;">Dear User,</p>
    <p style="color: #555; font-size: 16px;">Your OTP for login is: <span style="font-weight: bold; color: #007bff; font-size: 24px;">${otp}</span></p>
    <p style="color: #777; font-size: 16px;">Note: This OTP is valid for 5 minutes.</p>
  `;

  const mailOptions = {
    from: "Earn broker",
    to: email,
    subject: 'Your OTP for Login',
    html: htmlContent
  };

  await transporter.sendMail(mailOptions);
};

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//signup
const createUserctrl = expressAsyncHandler(async (req, res) => {
  const {
    email,
    status,
    password,
    isAdmin,
    firstName,
    lastName,
    country,
    phone,
    balance,
    demoBalance,
    address,
    dob,
    image,
    verification,
  } = req?.body;
  const oldUser = await User.findOne({ email });

  if (oldUser) throw new Error("Email is already registered");

  try {
    const user = await User.create({
      email,
      password,
      isAdmin,
      balance,
      demoBalance,
      image,
      firstName,
      lastName,
      country,
      phone,
      address,
      status,
      dob,
      verification,
      verified: false,
    });
    res
      .status(200)
      .json({ user, message: "Signed up successfully", alert: true });
  } catch (error) {
    res.send({ message: "Unable to sign up", alert: false });
  }
});

//login
const loginUserctrl = expressAsyncHandler(async (req, res) => {
  const { email, password } = req?.body;

  const userFound = await User.findOne({ email });

  if (userFound && (await userFound?.isPasswordMatch(password))) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP and expiration in the database
    const otpExpiration = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes
    await User.findOneAndUpdate(
      { email },
      { $set: { otp, otpExpiration } },
      { upsert: true }
    );

    // Send the OTP via email
    await sendOtpEmail(email, otp);

    // Respond to the client
    res.json({
      message: "Login successful. OTP sent to your email.",
      alert: true,
    });
  } else {
    res.status(401);
    throw new Error("Invalid login details");
  }
});

// OTP verification controller
const verifyOtpCtrl = expressAsyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const userFound = await User.findOne({ email });


  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.otp && user.otpExpiration && new Date() < new Date(user.otpExpiration) && user.otp === otp) {
    // OTP is valid
    await User.findOneAndUpdate(
      { email },
      { $set: { otp: null, otpExpiration: null } }
    );

    res.json({
      _id: userFound?._id,
      email: userFound?.email,
      isAdmin: userFound?.isAdmin,
      image: userFound?.image,
      balance: userFound?.balance,
      demoBalance: userFound?.demoBalance,
      firstName: userFound?.firstName,
      lastName: userFound?.lastName,
      dob: userFound?.dob,
      verification: userFound?.verification,
      country: userFound?.country,
      phone: userFound?.phone,
      address: userFound?.address,
      status: userFound?.status,
      token: generateToken(userFound?._id),
      message: "Logged in",
      alert: true,
    });

  } else {
    res.status(401);
    throw new Error("Invalid OTP");
  }
});

//forgot password
const forgotPasswordctrl = expressAsyncHandler(async(req, res)=>{
  const { email } = req?.body;
  try {
    const oldUser = await User.findOne({ email });
    if(!oldUser){
      return res.send("User not found");
    }
    const secret = process.env.JWT_KEY + oldUser?.password;
    const token = jwt.sign({email: oldUser?.email, id: oldUser?._id}, secret,{expiresIn:"5m",});
    const link = `https://https-github-com-habismartin-trading.onrender.com/reset-password/${oldUser?.id}/${token}`;

    //nodemailer transport
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "metatrader498@gmail.com",
        pass: "jzfqfuvvszdqorvi"
      }
    });

    const htmlContent = `
    <h2>Reset password link</h2>
    <p style="color: #333; font-size: 16px;">Dear User,</p>
    <p style="color: #555; font-size: 16px;">Click this link to reset your password: <span style="font-weight: 200; color: #007bff; font-size: 15px;">${link}</span></p>
    <p style="color: #777; font-size: 16px;">Note: This link is valid for 5 minutes.</p>
    `;

    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: 'Reset password',
      html: htmlContent,
    };
  
    await transporter.sendMail(mailOptions);

    res.send("Sent");
  } catch (error) {
    console.log(error)
  }
})

const getfpctrl = expressAsyncHandler(async(req, res)=>{
  const { id, token } = req?.params;
  const oldUser = await User.findOne({ _id: id });
  if(!oldUser){
    return res.send("User not found");
  }
  const secret = process.env.JWT_KEY + oldUser?.password;
  try {
    const verify = jwt.verify(token, secret);
    res.render("index", {email:verify.email, status:"Not verified"})
  } catch (error) {
    console.log(error)
    res.send("Not verified")
  }
})

const postfpctrl = expressAsyncHandler(async(req, res)=>{
  const { id, token } = req?.params;
  const { password } = req.body;
  const oldUser = await User.findOne({ _id: id });
  if(!oldUser){
    return res.send("User not found");
  }
  const secret = process.env.JWT_KEY + oldUser?.password;
  try {
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 10)
    await User.updateOne(
      {
        _id:id,
      },
      {
        $set: {
          password: encryptedPassword,
        },
      }
    )
    // res.send({ status: "Password Updated" })

    res.render("index", { email: verify.email, status:"verified" })
  } catch (error) {
    console.log(error)
    res.send({status: "Something went wrong"})
  }
})

//fetch all users
const fetchUsersctrl = expressAsyncHandler(async (req, res) => {
  const { page } = req?.query;
  try {
    const users = await User.paginate(
      {},
      { limit: 10, page: Number(page), sort: { createdAt: -1 } }
    );
    res.json(users);
  } catch (error) {
    res.json(error);
  }
});

//update
//update user profile
const updateUsersctrl = expressAsyncHandler(async (req, res) => {
  const { id } = req?.params;
  try {
    const updateprofile = await User.findByIdAndUpdate(
      id,
      {
        email: req?.body?.email,
        isAdmin: req?.body?.isAdmin,
        balance: req?.body?.balance,
        demoBalance: req?.body?.demoBalance,
        status: req?.body?.status,
        image: req?.body?.image,
        firstName: req?.body?.firstName,
        lastName: req?.body?.lastName,
        country: req?.body?.country,
        phone: req?.body?.phone,
        address: req?.body?.address,
        dob: req?.body?.dob,
        verification: req?.body?.verification,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.json(updateprofile);
  } catch (error) {
    console.error(error);
    res.json(error);
  }
});

//user profile
const userProfilectrl = expressAsyncHandler(async (req, res) => {
  try {
    const profile = await User.findById(req?.user?._id)
      .populate({
        path: 'deposit',
        options: { sort: { createdAt: -1 } },
      })
      .populate({
        path: 'withdrawal',
        options: { sort: { createdAt: -1 } },
      })
      .populate({
        path: 'trade', 
        options: { sort: { createdAt: -1 } },
      })
      .populate({
        path: 'demo', 
        options: { sort: { createdAt: -1 } },
      });

    res.json(profile);
  } catch (error) {
    res.json(error);
  }
});


//update user profile
const updateProfilectrl = expressAsyncHandler(async (req, res) => {
  try {
    const profile = await User.findByIdAndUpdate(
      req?.user?._id,
      {
        email: req?.body?.email,
        isAdmin: req?.body?.isAdmin,
        image: req?.body?.image,
        balance: req?.body?.balance,
        demoBalance: req?.body?.demoBalance,
        firstName: req?.body?.firstName,
        lastName: req?.body?.lastName,
        country: req?.body?.country,
        status: req?.body?.status,
        phone: req?.body?.phone,
        address: req?.body?.address,
        dob: req?.body?.dob,
        verification: req?.body?.verification,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.json(profile);
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  createUserctrl,
  fetchUsersctrl,
  loginUserctrl,
  updateUsersctrl,
  userProfilectrl,
  updateProfilectrl,
  verifyOtpCtrl,
  forgotPasswordctrl,
  getfpctrl,
  postfpctrl,
};
