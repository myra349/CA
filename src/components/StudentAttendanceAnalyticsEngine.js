import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ================= NAME GENERATOR ================= */
const firstNames = [
  "Aarav","Vihaan","Aditya","Arjun","Sai","Karthik","Rohit","Nikhil","Manoj","Siddharth",
  "Ananya","Sneha","Pooja","Kavya","Divya","Ishita","Keerthi","Aishwarya","Bhavya","Meghana"
];
const lastNames = [
  "Reddy","Kumar","Sharma","Verma","Naidu","Patel","Gupta","Singh","Iyer","Chowdary",
  "Rao","Mehta","Joshi","Agarwal","Malhotra","Kapoor","Nair","Menon","Das","Ghosh"
];

const rand = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

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

  const navigate = useNavigate();

  const [students, setStudents] = useState(generateStudents());
  const [selected, setSelected] = useState(null);
  const [edit, setEdit] = useState(null);

  // 👉 admin switch (future lo role based cheyyachu)
  const [adminMode, setAdminMode] = useState(true);

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

  /* ================= ADMIN SAVE ================= */

  const saveStudent = () => {

    if(!adminMode){
      alert("Read only mode");
      return;
    }

    setStudents(prev =>
      prev.map(s => (s.id === edit.id ? edit : s))
    );

    const updated = { ...edit, analysis: analyzeStudent(edit) };
    setSelected(updated);

    alert("Student updated successfully!");
  };

  /* ================= ADMIN DELETE ================= */

  const deleteStudent = () => {

    if(!adminMode) return;

    if(!window.confirm("Delete this student record?")) return;

    setStudents(prev => prev.filter(s => s.id !== selected.id));
    setSelected(null);
  };

  return (
    <div className="engine">

      {/* TOP BAR */}
      <div className="top-bar">

        <button
          className="back-btn"
          onClick={() =>
            navigate("/dashboard",{ state:{ openDept:"academics" } })
          }
        >
          ⬅ Back to Dashboard
        </button>

        <div className="title">
          Student Academic Intelligence System
        </div>

        <div className="admin-switch">
          <label>
            <input
              type="checkbox"
              checked={adminMode}
              onChange={e => setAdminMode(e.target.checked)}
            />
            Admin Mode
          </label>
        </div>

      </div>


      {/* DASHBOARD */}
      <div className="summary">
        <div className="box total">Total Students<br />{summary.total}</div>
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
              <h3 className="student-name">{s.name}</h3>
              <p>ID: {s.id} • {s.department} • Sem {s.semester}</p>
              <p>Attendance: {s.attendance}% • GPA: {s.gpa}</p>
              <p>Backlogs: {s.backlogs} • Final: {s.final}</p>
              <p><b>Risk:</b> {a.level} ({a.risk})</p>
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

            <h3>📊 Academic Data</h3>

            <div className="form-grid">

              <label>
                Attendance
                <input
                  type="number"
                  disabled={!adminMode}
                  value={edit.attendance}
                  onChange={e=>setEdit({...edit, attendance:+e.target.value})}
                />
              </label>

              <label>
                GPA
                <input
                  type="number"
                  step="0.1"
                  disabled={!adminMode}
                  value={edit.gpa}
                  onChange={e=>setEdit({...edit, gpa:+e.target.value})}
                />
              </label>

              <label>
                Backlogs
                <input
                  type="number"
                  disabled={!adminMode}
                  value={edit.backlogs}
                  onChange={e=>setEdit({...edit, backlogs:+e.target.value})}
                />
              </label>

              <label>
                Mid Marks
                <input
                  type="number"
                  disabled={!adminMode}
                  value={edit.mid}
                  onChange={e=>setEdit({...edit, mid:+e.target.value})}
                />
              </label>

              <label>
                Final Marks
                <input
                  type="number"
                  disabled={!adminMode}
                  value={edit.final}
                  onChange={e=>setEdit({...edit, final:+e.target.value})}
                />
              </label>

              <label>
                Activities
                <input
                  type="number"
                  disabled={!adminMode}
                  value={edit.activities}
                  onChange={e=>setEdit({...edit, activities:+e.target.value})}
                />
              </label>

            </div>

            <hr />

            <p><b>Risk Score:</b> {selected.analysis.risk}</p>
            <p><b>Risk Level:</b> {selected.analysis.level}</p>

            <div className="btn-row">

              {adminMode && (
                <button onClick={saveStudent}>Save Changes</button>
              )}

              {adminMode && (
                <button className="danger" onClick={deleteStudent}>
                  Delete Student
                </button>
              )}

              <button className="close" onClick={()=>setSelected(null)}>
                Close
              </button>

            </div>

          </div>
        </div>
      )}

      {/* ================= CSS ================= */}
      <style>{`
      *{box-sizing:border-box}

      .engine{
        min-height:100vh;
        background:#020617;
        color:#e5e7eb;
        padding:25px 40px 60px;
        font-family:Inter,Segoe UI,Arial;
      }

      .top-bar{
        display:flex;
        align-items:center;
        justify-content:space-between;
        margin-bottom:18px;
      }

      .title{
        font-size:68px;
        font-weight:800;
        color:#38bdf8;
      }

      .admin-switch{
        font-size:64px;
        color:#a5f3fc;
      }

      .back-btn{
        background:#020617;
        color:#cbd5f5;
        border:1px solid #1e293b;
        padding:8px 14px;
        border-radius:8px;
        cursor:pointer;
      }

      .summary{
        display:grid;
        grid-template-columns:repeat(6,2fr);
        gap:36px;
        font-size:56px
        margin:20px 0 30px;
      }

      .box{
        padding:14px;
        border-radius:14px;
        text-align:center;
        font-size:16px;
        font-weight:700;
        background:#020617;
        border:1px solid #1e293b;
      }

      .box.total{border-left:5px solid #38bdf8}
      .box.high{border-left:5px solid #ef4444}
      .box.medium{border-left:5px solid #facc15}
      .box.low{border-left:5px solid #22c55e}

      .grid{
        max-height:65vh;
        overflow-y:auto;
        display:grid;
        grid-template-columns:repeat(auto-fill,minmax(260px,1fr));
        gap:14px;
        padding-right:6px;
      }

      .card{
        background:linear-gradient(135deg,#cffafe,#67e8f9,#22d3ee);
        padding:14px;
        border-radius:14px;
        cursor:pointer;
        transition:.25s;
        color:#020617;
      }

      .card:hover{
        transform:translateY(-4px);
        box-shadow:0 0 18px rgba(59,130,246,.5);
      }

      .student-name{
        font-size:15px;
        font-weight:800;
        margin-bottom:4px;
        background: linear-gradient(90deg, #0ea5e9, #22d3ee);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .modal{
        position:fixed;
        inset:0;
        background:rgba(0,0,0,.7);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:1000;
      }

      .modal-box{
        background:#020617;
        padding:22px;
        width:520px;
        max-height:80vh;
        overflow-y:auto;
        border-radius:18px;
        box-shadow:0 0 30px rgba(56,189,248,.4);
      }

      .form-grid{
        display:grid;
        grid-template-columns:repeat(2,1fr);
        gap:10px;
        margin-top:12px;
      }

      label{
        display:flex;
        flex-direction:column;
        font-size:13px;
      }

      input{
        padding:6px 8px;
        border-radius:8px;
        border:1px solid #1e293b;
        background:#0b1020;
        color:white;
      }

      input:disabled{
        opacity:.6;
      }

      .btn-row{
        display:flex;
        gap:10px;
        margin-top:16px;
        flex-wrap:wrap;
      }

      button{
        padding:8px 14px;
        border:none;
        border-radius:8px;
        background:#2563eb;
        color:white;
        cursor:pointer;
      }

      button.close{background:#475569}
      button.danger{background:#7f1d1d}

      .grid::-webkit-scrollbar,
      .modal-box::-webkit-scrollbar{width:6px}

      .grid::-webkit-scrollbar-thumb,
      .modal-box::-webkit-scrollbar-thumb{
        background:linear-gradient(#38bdf8,#22c55e);
        border-radius:10px;
      }
      `}</style>

    </div>
  );
}
