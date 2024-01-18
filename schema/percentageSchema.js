const mongoose = require("mongoose");

const percSchema = mongoose.Schema({
    perc: {type : Number , default: 0},
    demoperc: {type : Number , default: 0}
})

const Perc = mongoose.model("Perc", percSchema);
module.exports = {Perc}