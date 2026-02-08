import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ===================== INITIAL DATA ===================== */

const initialData = [
  {
    sem: "Semester 1",
    cr: "Akhil Kumar",
    subjects: [
      { name: "Engineering Mathematics-I", faculty: "Dr. S. Rao" },
      { name: "Engineering Physics", faculty: "Dr. Sharma" },
      { name: "Programming in C", faculty: "Ms. Priya" },
      { name: "Basic Electrical Engg", faculty: "Mr. Ramesh" },
      { name: "English Communication", faculty: "Ms. Anjali" },
      { name: "C Programming Lab", faculty: "Ms. Priya" }
    ]
  },
  {
    sem: "Semester 2",
    cr: "Sneha Reddy",
    subjects: [
      { name: "Engineering Mathematics-II", faculty: "Dr. S. Rao" },
      { name: "Data Structures", faculty: "Mr. Naveen" },
      { name: "Python Programming", faculty: "Ms. Kavya" },
      { name: "Digital Logic Design", faculty: "Mr. Suresh" },
      { name: "Environmental Science", faculty: "Ms. Anjali" },
      { name: "Python Lab", faculty: "Ms. Kavya" }
    ]
  },
  {
    sem: "Semester 3",
    cr: "Rahul Verma",
    subjects: [
      { name: "Discrete Mathematics", faculty: "Dr. S. Rao" },
      { name: "OOP Java", faculty: "Mr. Naveen" },
      { name: "Operating Systems", faculty: "Mr. Ramesh" },
      { name: "DBMS", faculty: "Ms. Swathi" },
      { name: "Software Engineering", faculty: "Mr. Kiran" },
      { name: "Java & DBMS Lab", faculty: "Ms. Swathi" }
    ]
  },
  {
    sem: "Semester 4",
    cr: "Pooja Singh",
    subjects: [
      { name: "Computer Networks", faculty: "Mr. Suresh" },
      { name: "DAA", faculty: "Dr. Sharma" },
      { name: "Computer Organization", faculty: "Mr. Ramesh" },
      { name: "TOC", faculty: "Dr. Sharma" },
      { name: "Web Technologies", faculty: "Ms. Kavya" },
      { name: "Web & CN Lab", faculty: "Ms. Kavya" }
    ]
  }
];

/* ===================== COMPONENT ===================== */

export default function SubjectsCurriculum(){

  const navigate = useNavigate();

  const [data, setData] = useState(initialData);
  const [open, setOpen] = useState(null);
  const [adminMode, setAdminMode] = useState(true);

  /* ============ UPDATE SUBJECT FIELD ============ */

  const updateSubject = (semIndex, subIndex, field, value) => {
    setData(prev => {
      const copy = structuredClone(prev);
      copy[semIndex].subjects[subIndex][field] = value;
      return copy;
    });
  };

  /* ============ ADD SUBJECT ============ */

  const addSubject = (semIndex) => {
    setData(prev => {
      const copy = structuredClone(prev);
      copy[semIndex].subjects.push({
        name: "New Subject",
        faculty: "Faculty Name"
      });
      return copy;
    });
  };

  /* ============ DELETE SUBJECT ============ */

  const deleteSubject = (semIndex, subIndex) => {
    if(!window.confirm("Delete this subject?")) return;

    setData(prev => {
      const copy = structuredClone(prev);
      copy[semIndex].subjects.splice(subIndex,1);
      return copy;
    });
  };

  /* ============ UPDATE CR ============ */

  const updateCR = (semIndex, value) => {
    setData(prev => {
      const copy = structuredClone(prev);
      copy[semIndex].cr = value;
      return copy;
    });
  };

  /* ===================== UI ===================== */

  return (
    <div className="sc-root">

      {/* TOP BAR */}
      <div className="sc-top">
        <button
          className="sc-back"
          onClick={() =>
            navigate("/dashboard", { state:{ openDept:"academics" }})
          }
        >
          ⬅ Back to Dashboard
        </button>

        <div className="sc-title">
          Subjects & Curriculum Control
        </div>

        <div className="sc-admin">
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

      <div className="sc-subtitle">
        Semester wise subjects, labs & faculty allocation
      </div>

      {data.map((sem, idx) => (
        <div key={idx} className="sc-card">

          <div
            className="sc-header"
            onClick={() => setOpen(open === idx ? null : idx)}
          >
            <div className="sc-sem">{sem.sem}</div>
            <div className="sc-cr">
              Class Rep :
              {adminMode ? (
                <input
                  value={sem.cr}
                  onChange={e => updateCR(idx, e.target.value)}
                  onClick={e => e.stopPropagation()}
                />
              ) : (
                <span>{sem.cr}</span>
              )}
            </div>
          </div>

          {open === idx && (
            <div className="sc-body">

              <table className="sc-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Subject / Lab</th>
                    <th>Faculty</th>
                    {adminMode && <th>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {sem.subjects.map((s, i) => (
                    <tr key={i}>
                      <td>{i+1}</td>

                      <td>
                        {adminMode ? (
                          <input
                            value={s.name}
                            onChange={e =>
                              updateSubject(idx, i, "name", e.target.value)
                            }
                          />
                        ) : (
                          s.name
                        )}
                      </td>

                      <td>
                        {adminMode ? (
                          <input
                            value={s.faculty}
                            onChange={e =>
                              updateSubject(idx, i, "faculty", e.target.value)
                            }
                          />
                        ) : (
                          s.faculty
                        )}
                      </td>

                      {adminMode && (
                        <td>
                          <button
                            className="sc-del"
                            onClick={() => deleteSubject(idx, i)}
                          >
                            ✖
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              {adminMode && (
                <div className="sc-add-wrap">
                  <button
                    className="sc-add"
                    onClick={() => addSubject(idx)}
                  >
                    ➕ Add Subject / Lab
                  </button>
                </div>
              )}

            </div>
          )}

        </div>
      ))}

      {/* INLINE CSS */}
      <style>{css}</style>
    </div>
  );
}


/* ===================== CSS ===================== */

const css = `
.sc-root{
  min-height:100vh;
  background:#020617;
  color:#e5e7eb;
  padding:40px 60px 80px;
  font-family:Inter,Segoe UI,Arial;
}

/* TOP BAR */
.sc-top{
  display:flex;
  align-items:center;
  justify-content:space-between;
  margin-bottom:20px;
}

.sc-title{
  font-size:72px;
  font-weight:900;
  color:#38bdf8;
  letter-spacing:1px;
}

.sc-back{
  background:#020617;
  color:#cbd5f5;
  border:2px solid #1e293b;
  padding:10px 18px;
  border-radius:12px;
  cursor:pointer;
  font-size:46px;
  transition:.2s;
}
.sc-back:hover{
  border-color:#38bdf8;
  color:white;
}

.sc-admin label{
  display:flex;
  gap:8px;
  align-items:center;
  font-size:55px;
  color:#a5f3fc;
}

/* SUBTITLE */
.sc-subtitle{
  font-size:66px;
  color:#94a3b8;
  margin-bottom:30px;
}

/* CARD */
.sc-card{
  border:1px solid #1e293b;
  border-radius:18px;
  margin-bottom:18px;
  overflow:hidden;
  background:#020617;
  box-shadow:0 10px 25px rgba(0,0,0,.25);
}

/* HEADER */
.sc-header{
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:18px 22px;
  cursor:pointer;
  background:linear-gradient(135deg,#020617,#020617,#020617);
  transition:.25s;
}
.sc-header:hover{
  background:#020617;
}

.sc-sem{
  font-size:60px;
  font-weight:700;
}

.sc-cr{
  display:flex;
  align-items:left;
  gap:8px;
  font-size:54px;
  color:#cbd5f5;
}
.sc-cr input{
  background:#020617;
  border:1px solid #1e293b;
  color:white;
  padding:6px 10px;
  border-radius:8px;
  font-size:54px;
}

/* BODY */
.sc-body{
  padding:22px;
  animation:fadeIn .25s ease;
}

@keyframes fadeIn{
  from{opacity:0;transform:translateY(-6px)}
  to{opacity:1;transform:translateY(0)}
}

/* TABLE */
.sc-table{
  width:100%;
  border-collapse:collapse;
}

.sc-table th,
.sc-table td{
  padding:10px 12px;
  border-bottom:1px solid #1e293b;
  font-size:44px;
}

.sc-table th{
  color:#38bdf8;
  text-align:left;
  font-weight:700;
}

.sc-table input{
  width:100%;
  background:#020617;
  border:1px solid #1e293b;
  color:white;
  padding:6px 8px;
  border-radius:6px;
  font-size:54px;
}

/* ACTION */
.sc-del{
  background:#450a0a;
  border:none;
  color:#fecaca;
  padding:6px 10px;
  border-radius:6px;
  cursor:pointer;
}
.sc-del:hover{
  background:#7f1d1d;
}

/* ADD */
.sc-add-wrap{
  text-align:right;
  margin-top:16px;
}
.sc-add{
  background:linear-gradient(135deg,#38bdf8,#22d3ee);
  border:none;
  padding:10px 16px;
  border-radius:10px;
  font-weight:700;
  cursor:pointer;
  font-size:50px;
}

/* RESPONSIVE */
@media(max-width:900px){
  .sc-root{ padding:20px; }
  .sc-title{ font-size:68px; }
}
`;
