const mongoose = require("mongoose");

const userVerificaionSchema = mongoose.Schema({
    userId: { type: String },
    uniqueString: String,
    createdAt: Date,
    expiresAt: Date,
  },
  {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    }
});

  const UserVerification = mongoose.model("UserVerification", userVerificaionSchema);
  module.exports = {UserVerification};