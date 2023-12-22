const mongoose = require("mongoose");

const depositmethodSchema = mongoose.Schema({
    image: String,
    name: String,
    number: String,
    user: String,
    description: String,
    qrcode: String,
    calc: Number,
  });
  
  //
  const DepositMethod = mongoose.model("DepositMethod", depositmethodSchema);
  module.exports = {DepositMethod}
  