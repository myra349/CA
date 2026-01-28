import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import Student from "./models/Student.js";
import Fee from "./models/Fee.js";
import Exam from "./models/Exam.js";

const app = express();
app.use(cors());
app.use(express.json());

/* ================== MONGODB CONNECT ================== */
mongoose.connect("mongodb://127.0.0.1:27017/hallticketDB")
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ Mongo Error:", err));

/* ================== TEST ROUTE ================== */
app.get("/", (req, res) => {
  res.send("🚀 Hall Ticket Backend Running Successfully");
});

/* ================== ADD DUMMY DATA ================== */
app.get("/add-dummy", async (req, res) => {
  try {
    await Student.deleteMany();
    await Fee.deleteMany();
    await Exam.deleteMany();

    const students = [
      {
        rollNo: "AI001",
        name: "Ravi",
        className: "BTech-AI-2",
        section: "A",
        subjects: ["Maths", "DS", "DBMS"],
        labs: ["DS Lab", "DBMS Lab"],
        hallTicketEligible: true
      },
      {
        rollNo: "AI002",
        name: "Sita",
        className: "BTech-AI-2",
        section: "A",
        subjects: ["Maths", "DS", "DBMS"],
        labs: ["DS Lab", "DBMS Lab"],
        hallTicketEligible: false
      },
      {
        rollNo: "AI003",
        name: "Kiran",
        className: "BTech-AI-2",
        section: "B",
        subjects: ["Maths", "AI", "OS"],
        labs: ["AI Lab"],
        hallTicketEligible: true
      }
    ];

    const fees = [
      { rollNo: "AI001", totalFee: 50000, paid: 50000, due: 0, lastPaidDate: "2025-12-01" },
      { rollNo: "AI002", totalFee: 50000, paid: 40000, due: 10000, lastPaidDate: "2025-10-01" },
      { rollNo: "AI003", totalFee: 50000, paid: 50000, due: 0, lastPaidDate: "2025-11-20" }
    ];

    const exams = {
      className: "BTech-AI-2",
      subjects: [
        { name: "Maths", date: "2026-03-10", time: "10:00-1:00" },
        { name: "DS", date: "2026-03-12", time: "10:00-1:00" },
        { name: "DBMS", date: "2026-03-14", time: "10:00-1:00" }
      ],
      labs: [
        { name: "DS Lab", date: "2026-03-16" },
        { name: "DBMS Lab", date: "2026-03-18" }
      ]
    };

    await Student.insertMany(students);
    await Fee.insertMany(fees);
    await Exam.create(exams);

    res.json({ message: "✅ Dummy data inserted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================== GET STUDENT BY ROLL NO ================== */
app.get("/api/student/:rollNo", async (req, res) => {
  try {
    const student = await Student.findOne({ rollNo: req.params.rollNo });
    const fee = await Fee.findOne({ rollNo: req.params.rollNo });

    if (!student) {
      return res.json({ found: false, message: "❌ Student not found" });
    }

    res.json({ found: true, student, fee });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================== CHECK HALL TICKET ELIGIBILITY ================== */
app.get("/api/hallticket/check/:rollNo", async (req, res) => {
  try {
    const student = await Student.findOne({ rollNo: req.params.rollNo });
    const fee = await Fee.findOne({ rollNo: req.params.rollNo });

    if (!student || !fee) {
      return res.json({ allowed: false, message: "Student data not found" });
    }

    if (fee.due > 0 || student.hallTicketEligible === false) {
      return res.json({
        allowed: false,
        message: "❌ Fee due or not approved. Admin will be notified."
      });
    }

    const exam = await Exam.findOne({ className: student.className });

    res.json({
      allowed: true,
      message: "✅ Hall Ticket can be downloaded",
      student,
      exam
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================== SERVER START ================== */
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});

