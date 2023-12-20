const express = require("express");
const {errorHandler, notFound} = require("./middleware/errorMiddleware")
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const {createUserctrl, fetchUsersctrl, loginUserctrl,updateUsersctrl, userProfilectrl, updateProfilectrl } = require("./apis/userapi")
const { depositctrl, fetchdepositctrl, singledepositctrl, updateDepositctrl, deleteDepositctrl } = require("./apis/deposit")
const { withdrawalctrl, fetchwithdrawalctrl, singlewithdrawalctrl , updatewithdrawalctrl, deletewithdrawalctrl } = require("./apis/withdrawalapi")
const {postdepositMethodctrl, fetchdepositMethodctrl } = require("./apis/depositmethodapi")
const { authMiddleware } = require("./middleware/auth");
const {accountStatsctrl} = require("./apis/accountStats")
const multer = require('multer');
const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.json());
dotenv.config()

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

//signup
app.post("/signup", createUserctrl);
app.post("/login",loginUserctrl);

//handle users
app.get("/adminusers",authMiddleware, fetchUsersctrl);
app.get("/profile",authMiddleware, userProfilectrl);
app.put("/account",authMiddleware, updateProfilectrl);
app.put("/adminusers/:id",authMiddleware, updateUsersctrl);

//login

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
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
