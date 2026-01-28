import mongoose from "mongoose";

const feeSchema = new mongoose.Schema({
  rollNo: String,
  totalFee: Number,
  paid: Number,
  due: Number,
  lastPaidDate: String
});

export default mongoose.model("Fee", feeSchema);


