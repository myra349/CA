import React, { useMemo, useState } from "react";

/* ================= NAME GENERATOR ================= */
const firstNames = [
  "Aarav","Vihaan","Aditya","Arjun","Sai","Karthik","Rohit","Nikhil","Manoj","Siddharth",
  "Ananya","Sneha","Pooja","Kavya","Divya","Ishita","Keerthi","Aishwarya","Bhavya","Meghana"
];
const lastNames = [
  "Reddy","Kumar","Sharma","Verma","Naidu","Patel","Gupta","Singh","Iyer","Chowdary",
  "Rao","Mehta","Joshi","Agarwal","Malhotra","Kapoor","Nair","Menon","Das","Ghosh"
];
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomName = () =>
  `${firstNames[rand(0, firstNames.length - 1)]} ${lastNames[rand(0, lastNames.length - 1)]}`;

/* ================= STUDENT GENERATOR ================= */
const generateStudents = () =>
  Array.from({ length: 200 }, (_, i) => ({
    id: `S${String(i + 1).padStart(4, "0")}`,
    name: randomName(),
    department: ["CSE","AI&DS","ECE","EEE","MECH"][rand(0,4)],
    semester: rand(3, 8),
    attendance: rand(55, 95),
    gpa: +(5 + Math.random() * 4).toFixed(2),
    backlogs: rand(0, 3),
    mid: rand(15, 30),
    final: rand(40, 90),
    activities: rand(0, 10),
  }));

/* ================= AI RISK ENGINE ================= */
function analyzeStudent(s) {
  let risk = 0;
  let reasons = [];

  if (s.attendance < 70) { risk += 30; reasons.push("low attendance"); }
  if (s.gpa < 6.5) { risk += 25; reasons.push("low GPA"); }
  if (s.backlogs >= 2) { risk += 25; reasons.push("multiple backlogs"); }
  if (s.final < 55) { risk += 20; reasons.push("poor final exam performance"); }

  let level =
    risk >= 70 ? "High" :
    risk >= 40 ? "Medium" : "Low";

  return {
    risk,
    level,
    summary:
      `${s.name} shows ${reasons.join(", ") || "good academic consistency"}. 
Based on attendance, GPA, exams and backlog history, this student requires ${level.toLowerCase()} academic attention.`
  };
}

/* ================= MAIN COMPONENT ================= */
export default function StudentAcademicIntelligence() {
  const [students, setStudents] = useState(generateStudents());
  const [selected, setSelected] = useState(null);
  const [edit, setEdit] = useState(null);

  /* ===== DASHBOARD SUMMARY ===== */
  const summary = useMemo(() => {
    let high = 0, medium = 0, low = 0;
    students.forEach(s => {
      const { level } = analyzeStudent(s);
      if (level === "High") high++;
      else if (level === "Medium") medium++;
      else low++;
    });
    return { high, medium, low, total: students.length };
  }, [students]);

  const openStudent = (s) => {
    setSelected({ ...s, analysis: analyzeStudent(s) });
    setEdit({ ...s });
  };

  const saveStudent = () => {
    setStudents(prev =>
      prev.map(s => (s.id === edit.id ? edit : s))
    );
    const updated = { ...edit, analysis: analyzeStudent(edit) };
    setSelected(updated);
    alert("Student updated successfully!");
  };

  return (
    <div className="engine">
      <h1>🎓 Student Academic Intelligence System</h1>

      {/* DASHBOARD */}
      <div className="summary">
        <div className="box total">Total<br />{summary.total}</div>
        <div className="box high">High Risk<br />{summary.high}</div>
        <div className="box medium">Medium Risk<br />{summary.medium}</div>
        <div className="box low">Low Risk<br />{summary.low}</div>
      </div>

      {/* STUDENT LIST */}
      <div className="grid">
        {students.map(s => {
          const a = analyzeStudent(s);
          return (
            <div
              key={s.id}
              className={`card ${a.level}`}
              onClick={() => openStudent(s)}
            >
              <h3>{s.name}</h3>
              <p>ID: {s.id} • {s.department}</p>
              <p>Attendance: {s.attendance}% • GPA: {s.gpa}</p>
              <p>Backlogs: {s.backlogs} • Final: {s.final}</p>
              <p><b>Risk: {a.level}</b> ({a.risk})</p>
            </div>
          );
        })}
      </div>

      {/* FULL REPORT + ADMIN EDIT */}
      {selected && (
        <div className="modal">
          <div className="modal-box">
            <h2>{selected.name} ({selected.id})</h2>
            <p>{selected.analysis.summary}</p>

            <h3>📊 Academic Data (Admin Editable)</h3>

            <div className="form-grid">
              <label>Attendance <input type="number" value={edit.attendance} onChange={e=>setEdit({...edit, attendance:+e.target.value})} /></label>
              <label>GPA <input type="number" step="0.1" value={edit.gpa} onChange={e=>setEdit({...edit, gpa:+e.target.value})} /></label>
              <label>Backlogs <input type="number" value={edit.backlogs} onChange={e=>setEdit({...edit, backlogs:+e.target.value})} /></label>
              <label>Mid Marks <input type="number" value={edit.mid} onChange={e=>setEdit({...edit, mid:+e.target.value})} /></label>
              <label>Final Marks <input type="number" value={edit.final} onChange={e=>setEdit({...edit, final:+e.target.value})} /></label>
              <label>Activities <input type="number" value={edit.activities} onChange={e=>setEdit({...edit, activities:+e.target.value})} /></label>
            </div>

            <hr />
            <p><b>Risk Score:</b> {selected.analysis.risk}</p>
            <p><b>Risk Level:</b> {selected.analysis.level}</p>

            <div className="btn-row">
              <button onClick={saveStudent}>Save Changes</button>
              <button className="close" onClick={()=>setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CSS ================= */}
      <style>{`
      body{margin:0}
      .engine{
        min-height:100vh;
        padding:30px;
        background:#0f172a;
        color:#e5e7eb;
        font-family:Segoe UI, sans-serif;
      }
      h1{text-align:center;color:#93c5fd;font-size:42px}

      .summary{
        display:grid;
        grid-template-columns:repeat(4,1fr);
        gap:20px;
        max-width:1200px;
        margin:20px auto;
      }
      .box{
        padding:22px;
        border-radius:18px;
        text-align:center;
        font-size:52px;
        font-weight:700;
        background:#020617;
      }
      .box.total{border-left:6px solid #38bdf8}
      .high{border-left:6px solid #ef4444}
      .medium{border-left:6px solid #facc15}
      .low{border-left:6px solid #22c55e}

      .grid{
        max-height:65vh;
        overflow-y:auto;
        display:grid;
        grid-template-columns:repeat(auto-fill,minmax(420px,1fr));
        gap:20px;
        padding-right:10px;
      }
      .card{
        background:#020617;
        padding:18px;
        font-sizze:40px;
        border-radius:18px;
        cursor:pointer;
        transition:.3s;
      }
      .card:hover{
        transform:translateY(-6px);
        box-shadow:0 0 25px rgba(59,130,246,.5);
      }

      .modal{
        position:fixed;
        inset:0;
        font-size:35px;
        background:rgba(0,0,0,.7);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:1000;
      }
      .modal-box{
        background:#020617;
        padding:30px;
        width:800px;
        max-height:85vh;
        overflow-y:auto;
        border-radius:22px;
        box-shadow:0 0 40px rgba(56,189,248,.4);
      }
      .form-grid{
        display:grid;
        grid-template-columns:repeat(2,1fr);
        gap:12px;
        margin-top:10px;
      }
      label{
        display:flex;
        flex-direction:column;
        font-size:14px;
      }
      input{
        padding:10px;
        border-radius:10px;
        border:none;
        background:#1e293b;
        color:white;
      }
      .btn-row{
        display:flex;
        gap:12px;
        margin-top:20px;
      }
      button{
        padding:12px 20px;
        border:none;
        border-radius:12px;
        background:#2563eb;
        color:white;
        cursor:pointer;
      }
      button.close{background:#7f1d1d}

      .grid::-webkit-scrollbar,
      .modal-box::-webkit-scrollbar{width:8px}
      .grid::-webkit-scrollbar-thumb,
      .modal-box::-webkit-scrollbar-thumb{
        background:linear-gradient(#38bdf8,#22c55e);
        border-radius:10px;
      }
      `}</style>
    </div>
  );
}
