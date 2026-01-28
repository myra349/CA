import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
  className: String,
  subjects: [{ name: String, date: String, time: String }],
  labs: [{ name: String, date: String }]
});

export default mongoose.model("Exam", examSchema);

