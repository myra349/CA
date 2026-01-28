import React, { useMemo, useState } from "react";

/* ===================== UTIL ===================== */
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/* ===================== NAMES ===================== */
const firstNames = [
  "Aarav","Vihaan","Aditya","Rahul","Karthik","Sneha","Ananya","Pooja","Rohan","Neeraj",
  "Suresh","Mahesh","Ramesh","Kiran","Sai","Vamsi","Harsha","Nikhil","Praveen","Manoj",
  "Deepika","Divya","Kavya","Bhavya","Akhila","Tejaswini","Navya","Keerthi","Shreya","Meghana"
];

const lastNames = [
  "Reddy","Naidu","Rao","Sharma","Verma","Gupta","Patel","Iyer","Chowdary","Singh",
  "Mehta","Agarwal","Kulkarni","Joshi","Das","Ghosh","Mishra","Pandey","Yadav","Malhotra"
];

const randomName = () =>
  firstNames[rand(0, firstNames.length - 1)] +
  " " +
  lastNames[rand(0, lastNames.length - 1)];

/* ===================== DATA ===================== */
const generateStudents = () =>
  Array.from({ length: 100 }, (_, i) => {
    const semFee = 50000;
    const busFee = Math.random() < 0.5 ? 15000 : 0;
    const hostelFee = Math.random() < 0.4 ? 60000 : 0;

    const totalFee = semFee + busFee + hostelFee;
    const paid = rand(20000, totalFee);
    const due = Math.max(0, totalFee - paid);

    const attendance = due > 0 ? rand(50, 70) : rand(75, 95);
    const daysLate = due > 0 ? rand(0, 60) : 0;
    const fine = daysLate > 30 ? 1000 : 0;

    let risk = "SAFE";
    if (due > 40000 && attendance < 65) risk = "HIGH";
    else if (due > 20000 || attendance < 70) risk = "MEDIUM";

    const blocked = due > 0 && attendance < 65;

    return {
      id: `S${1000 + i}`,
      name: randomName(),
      totalFee, paid, due, fine, attendance, risk, blocked,
      installments: rand(1, 3),
    };
  });

/* ===================== COMPONENT ===================== */
export default function StudentFeeAttendanceIntelligence() {
  const [students] = useState(generateStudents());
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const filtered = useMemo(() => {
    return students.filter(s => {
      if (
        search &&
        !s.name.toLowerCase().includes(search.toLowerCase()) &&
        !s.id.toLowerCase().includes(search.toLowerCase())
      ) return false;

      if (filter === "DUE" && s.due === 0) return false;
      if (filter === "PAID" && s.due > 0) return false;
      if (filter === "HIGH" && s.risk !== "HIGH") return false;
      if (filter === "BLOCKED" && !s.blocked) return false;

      return true;
    });
  }, [students, search, filter]);

  const summary = useMemo(() => {
    let paid = 0, due = 0, blocked = 0, highRisk = 0, collection = 0;
    students.forEach(s => {
      collection += s.paid;
      if (s.due === 0) paid++;
      else due++;
      if (s.blocked) blocked++;
      if (s.risk === "HIGH") highRisk++;
    });
    return { paid, due, blocked, highRisk, collection };
  }, [students]);

  return (
    <div style={{
      minHeight:"100vh",
      background:"radial-gradient(circle at top, #020617, #000)",
      color:"#e5e7eb",
      padding:40,
      fontFamily:"Poppins, Segoe UI, sans-serif"
    }}>

      {/* HEADER */}
      <h1 style={{
        textAlign:"center",
        fontSize:64,
        marginBottom:40,
        color:"#7dd3fc",
        textShadow:"0 0 25px rgba(56,189,248,.8)"
      }}>
        🎓 Student Fee & Attendance Intelligence
      </h1>

      {/* SUMMARY CARDS */}
      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(5,1fr)",
        gap:25,
        marginBottom:30
      }}>
        {[
          {label:"Paid", value:summary.paid, color:"#22c55e"},
          {label:"Due", value:summary.due, color:"#ef4444"},
          {label:"High Risk", value:summary.highRisk, color:"#eab308"},
          {label:"Blocked", value:summary.blocked, color:"#94a3b8"},
          {label:"Collection", value:"₹"+summary.collection.toLocaleString(), color:"#38bdf8"},
        ].map((b,i)=>(
          <div key={i} style={{
            background:"rgba(2,6,23,.9)",
            borderRadius:22,
            padding:28,
            textAlign:"center",
            border:"1px solid #1e293b",
            boxShadow:"0 0 25px rgba(56,189,248,.15)"
          }}>
            <div style={{ fontSize:18, opacity:.7 }}>{b.label}</div>
            <div style={{
              fontSize:36,
              fontWeight:900,
              color:b.color,
              textShadow:"0 0 12px rgba(255,255,255,.15)"
            }}>
              {b.value}
            </div>
          </div>
        ))}
      </div>

      {/* CONTROLS */}
      <div style={{ display:"flex", gap:20, marginBottom:20 }}>
        <input
          placeholder="Search by name or ID"
          value={search}
          onChange={e=>setSearch(e.target.value)}
          style={{
            flex:1,
            fontSize:42,
            padding:14,
            borderRadius:14,
            background:"#020617",
            border:"1px solid #1e293b",
            color:"#e5e7eb",
            outline:"none"
          }}
        />
        <select
          value={filter}
          onChange={e=>setFilter(e.target.value)}
          style={{
            fontSize:42,
            padding:14,
            borderRadius:14,
            background:"#020617",
            border:"1px solid #1e293b",
            color:"#e5e7eb"
          }}
        >
          <option value="ALL">All</option>
          <option value="DUE">Due</option>
          <option value="PAID">Paid</option>
          <option value="HIGH">High Risk</option>
          <option value="BLOCKED">Blocked</option>
        </select>
      </div>

      {/* TABLE */}
      <div style={{
        background:"rgba(2,6,23,.95)",
        borderRadius:24,
        overflow:"hidden",
        border:"1px solid #1e293b",
        boxShadow:"0 20px 60px rgba(0,0,0,.6)"
      }}>
        <div style={{
          display:"grid",
          gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",
          padding:20,
          fontSize:40,
          fontWeight:800,
          color:"#7dd3fc",
          borderBottom:"1px solid #1e293b"
        }}>
          <span>Name</span><span>Attendance</span><span>Due</span><span>Risk</span><span>Status</span>
        </div>

        {filtered.map(s=>(
          <div key={s.id} onClick={()=>setSelected(s)} style={{
            display:"grid",
            gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",
            padding:18,
            fontSize:40,
            cursor:"pointer",
            borderBottom:"1px solid #020617",
            background: s.blocked ? "rgba(239,68,68,.12)" : s.due>0 ? "rgba(234,179,8,.12)" : "transparent",
            transition:".2s"
          }}>
            <span style={{ fontWeight:600 }}>{s.name}</span>
            <span>{s.attendance}%</span>
            <span>₹{s.due + s.fine}</span>
            <span>{s.risk}</span>
            <span style={{
              fontWeight:900,
              color: s.blocked ? "#ef4444" : s.due>0 ? "#eab308" : "#22c55e"
            }}>
              {s.blocked ? "🚫 BLOCKED" : s.due>0 ? "⚠ DUE" : "✅ PAID"}
            </span>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selected && (
        <div style={{
          position:"fixed",
          inset:0,
          background:"rgba(0,0,0,.8)",
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          backdropFilter:"blur(6px)"
        }}>
          <div style={{
            background:"#020617",
            padding:40,
            borderRadius:26,
            minWidth:520,
            fontSize:42,
            border:"1px solid #1e293b",
            boxShadow:"0 0 40px rgba(56,189,248,.25)"
          }}>
            <h2 style={{ fontSize:56, color:"#7dd3fc" }}>{selected.name}</h2>

            <p><b>ID:</b> {selected.id}</p>
            <p><b>Attendance:</b> {selected.attendance}%</p>
            <p><b>Total Fee:</b> ₹{selected.totalFee}</p>
            <p><b>Paid:</b> ₹{selected.paid}</p>
            <p><b>Due:</b> ₹{selected.due}</p>
            <p><b>Fine:</b> ₹{selected.fine}</p>
            <p><b>Installments:</b> {selected.installments}</p>
            <p><b>Risk:</b> {selected.risk}</p>
            <p><b>Status:</b> {selected.blocked ? "🚫 Hall Ticket Blocked" : "✅ OK"}</p>

            <button
              onClick={() => setSelected(null)}
              style={{
                marginTop:20,
                padding:"12px 22px",
                borderRadius:14,
                border:"none",
                background:"linear-gradient(90deg,#2563eb,#38bdf8)",
                color:"white",
                fontSize:40,
                cursor:"pointer"
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

