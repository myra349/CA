import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

/* 🔗 MongoDB Atlas Connection */
mongoose.connect("PASTE_YOUR_ATLAS_CONNECTION_STRING_HERE")
  .then(()=>console.log("MongoDB Connected"))
  .catch(err=>console.log(err));

/* 📦 Schema */
const hallTicketSchema = new mongoose.Schema({
  name: String,
  roll: String,
  class: String,
  semester: String,
  subjects: [String],
  feePaid: Boolean,
  createdAt: { type: Date, default: Date.now }
});

const HallTicket = mongoose.model("HallTicket", hallTicketSchema);

/* 🚀 API */
app.post("/api/hallticket", async (req,res)=>{
  try{
    const data = await HallTicket.create(req.body);
    res.json({ success:true, data });
  }catch(err){
    res.status(500).json({ success:false, error: err.message });
  }
});

app.listen(5000, ()=>console.log("Server running on http://localhost:5000"));
