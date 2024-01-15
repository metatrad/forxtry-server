const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2")

const depositmethodSchema = mongoose.Schema({
    image: String,
    name: String,
    number: String,
    user: String,
    description: String,
    qrcode: String,
    calc: Number,
  },{
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    }
})
//pagination
depositmethodSchema.plugin(mongoosePaginate)
  
//
const DepositMethod = mongoose.model("DepositMethod", depositmethodSchema);
module.exports = {DepositMethod}
  