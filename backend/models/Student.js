import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  rollNo: String,
  name: String,
  className: String,
  section: String,
  subjects: [String],
  labs: [String],
  hallTicketEligible: Boolean
});

export default mongoose.model("Student", studentSchema);

