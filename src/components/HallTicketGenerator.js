import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ====== SUBJECT DATA ====== */
const semesters = {
  Sem1: ["Maths","Physics","C","English","Chemistry","Lab1"],
  Sem2: ["DS","OOP","Stats","Python","EVS","Lab2"],
  Sem3: ["OS","DBMS","CN","Java","SE","Lab3"],
  Sem4: ["AI","ML","Web","COA","TOC","Lab4"]
};

export default function HallTicketGenerator(){

  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [cls, setCls] = useState("");
  const [sem, setSem] = useState("");
  const [feePaid, setFeePaid] = useState(false);

  const subjects = sem ? semesters[sem] : [];

  const generatePDF = () => {
    if(!name || !roll || !cls || !sem){
      alert("Fill all details");
      return;
    }
    if(!feePaid){
      alert("Fee not paid. Hall Ticket blocked.");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("VISTAR NETRA UNIVERSITY", 105, 15, { align: "center" });
    doc.setFontSize(16);
    doc.text("HALL TICKET", 105, 25, { align: "center" });

    doc.line(10, 30, 200, 30);

    doc.setFontSize(12);
    doc.text(`Student Name : ${name}`, 14, 45);
    doc.text(`Roll Number  : ${roll}`, 14, 55);
    doc.text(`Class        : ${cls}`, 14, 65);
    doc.text(`Semester     : ${sem}`, 14, 75);
    doc.text(`Fee Status   : PAID`, 14, 85);

    autoTable(doc, {
      startY: 95,
      head: [["S.No", "Subject Name"]],
      body: subjects.map((s, i) => [i+1, s]),
      styles: { fontSize: 12 },
      headStyles: { fillColor: [56,189,248] }
    });

    doc.text("Controller of Examinations", 130, 270);
    doc.text("Signature", 160, 276);

    doc.save(`HallTicket_${roll}.pdf`);
  };

  return (
    <div style={{
      minHeight:"100vh",
      padding:50,
      background:"radial-gradient(circle at top, #020617, #000)",
      color:"white"
    }}>

      <h1 style={{
        fontSize:56,
        fontWeight:900,
        color:"#38bdf8",
        marginBottom:10
      }}>
        🎫 Hall Ticket Generator
      </h1>

      <p style={{ color:"#94a3b8", fontSize:22, marginBottom:30 }}>
        Controller of Examinations Secure Portal
      </p>

      <div style={{
        maxWidth:700,
        background:"#020617",
        border:"2px solid #1e293b",
        borderRadius:20,
        padding:30,
        boxShadow:"0 0 60px rgba(56,189,248,.15)"
      }}>

        <Input label="Student Name" value={name} set={setName} />
        <Input label="Roll Number" value={roll} set={setRoll} />
        <Input label="Class" value={cls} set={setCls} />

        <div style={{ marginTop:14 }}>
          <label style={lbl}>Semester</label>
          <select value={sem} onChange={e=>setSem(e.target.value)} style={inp}>
            <option value="">Select Semester</option>
            {Object.keys(semesters).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div style={{ marginTop:20, fontSize:20 }}>
          <label>
            <input type="checkbox" checked={feePaid} onChange={e=>setFeePaid(e.target.checked)} />
            {" "} Fee Paid
          </label>
        </div>

        <div style={{ marginTop:30 }}>
          <button
            onClick={generatePDF}
            disabled={!feePaid}
            style={{
              padding:"16px 36px",
              fontSize:22,
              borderRadius:14,
              border:"none",
              cursor: feePaid ? "pointer" : "not-allowed",
              background: feePaid
                ? "linear-gradient(90deg,#22c55e,#4ade80)"
                : "#475569",
              color:"#020617",
              fontWeight:900,
              boxShadow: feePaid ? "0 0 40px rgba(34,197,94,.5)" : "none"
            }}
          >
            ⬇ Download Hall Ticket
          </button>

          {!feePaid && (
            <p style={{ marginTop:12, color:"#ef4444" }}>
              ❌ Fee not paid. Hall Ticket locked.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

/* SMALL COMPONENTS */
function Input({ label, value, set }){
  return (
    <div style={{ marginTop:14 }}>
      <label style={lbl}>{label}</label>
      <input value={value} onChange={e=>set(e.target.value)} style={inp}/>
    </div>
  );
}

const lbl = { fontSize:18, color:"#94a3b8" };

const inp = {
  width:"100%",
  padding:14,
  marginTop:6,
  fontSize:18,
  borderRadius:10,
  border:"2px solid #1e293b",
  background:"#0b1020",
  color:"white"
};

