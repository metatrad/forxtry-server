const expressAsyncHandler = require("express-async-handler");
const {Perc} = require('../schema/percentageSchema')


const percctrl = expressAsyncHandler(async (req, res) => {

  const { perc, demoperc } = req.body;

  try {
      const percs = await Perc.create({
        perc,
        demoperc,
      });
  
      res.json({percs, message: "updated", alert: true})

  } catch (error) {
    console.error("Error updating", error);
    res.status(500).json({ message: "Server error", alert: false });
  }
});

// fetch perc
const fetchpercctrl = expressAsyncHandler(async (req, res) => {
  const {page} = req?.query;
  try {
    const percs = await Perc.find({});
    res.json(percs)

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", alert: false });
  }
});

//update perc profile
const updatepercctrl = expressAsyncHandler( async (req,res)=>{
  const {id} = req?.params;

  try {
    const updateperc = await Perc.findByIdAndUpdate(id, {
      perc: req?.body?.perc,
      demoperc: req?.body?.demoperc,
    },
    {
      new: true,
      runValidators: true,
    });
    res.json(updateperc)
  } catch (error) {
    console.error(error)
    res.json(error)
  }
})



module.exports = { percctrl, fetchpercctrl, updatepercctrl };