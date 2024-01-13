const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2")

const tradeSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, "User ID is required"] },
    time: { type: Number },
    investment: { type: Number },
    calculatedResult: { type: Number},
    tradeResult: { type: String , default: 'Pending'},
    countdownDuration: { type: Number },
    countdownRemaining: { type: Number },
    expirationTime: { type: String },
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
tradeSchema.plugin(mongoosePaginate)

const Trade = mongoose.model("Trade", tradeSchema);
module.exports = {Trade}