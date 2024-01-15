const expressAsyncHandler = require("express-async-handler");
const { DepositMethod } = require("../schema/depositmethodSchema")

//upload deposit method
const postdepositMethodctrl = expressAsyncHandler(async(req,res)=>{
    const data = await DepositMethod(req.body);
    const datasave = await data.save();
    res.send({ message: "Uploaded successfully" });
})

//fetch deposit method
const fetchdepositMethodctrl = expressAsyncHandler(async(req,res)=>{
    const data = await DepositMethod.find({});
    res.send(JSON.stringify(data));
})

// fetch all withdrawals
const fetchmethodctrl = expressAsyncHandler(async (req, res) => {
    const {page} = req?.query;
    try {
      const withdrawal = await DepositMethod.paginate({}, {limit: 10, page: Number(page), populate: "user",sort: { createdAt: -1 }});
      res.json(withdrawal)
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", alert: false });
    }
  });
  
  //update
  const updatemethodctrl = expressAsyncHandler(async(req,res)=>{

    const {id} = req?.params;
    const { image } = req.body;
    const { number } = req.body;
    const { name } = req.body;
    const { amount } = req.body;
    const { user } = req.body;
    const { qrcode } = req.body;
    const { description } = req.body;
    const { calc } = req.body;
    try {
      const method = await DepositMethod.findByIdAndUpdate(id, {
        amount, number, user, name, image, qrcode, description, calc
      }, {new: true})
      res.json(method)
    } catch (error) {
      console.error(error);
      res.json(error)
    }
  })
  
  //delete
  const deletemethodctrl = expressAsyncHandler(async (req, res) => {
    const {id} = req?.params;
    try {
      const method = await DepositMethod.findByIdAndDelete(id);
      if (!id) {
        return res.status(404).json({ message: 'Item not found' });
      }
      res.json(method)
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", alert: false });
    }
  });

module.exports = {postdepositMethodctrl, fetchdepositMethodctrl,fetchmethodctrl,updatemethodctrl,deletemethodctrl }