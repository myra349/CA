import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ================= DATA ================= */

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const periods = [1, 2, 3, 4, 5, 6];

const facultyList = [
  "Dr. Suresh Rao","Dr. Anitha Sharma","Prof. Ramesh Kumar","Prof. Kavitha Reddy",
  "Dr. Naveen Gupta","Dr. Sunitha Iyer","Prof. Mahesh Naidu","Dr. Priya Verma",
  "Dr. Kiran Patel","Prof. Lakshmi Devi","Dr. Arjun Singh","Dr. Meena Kapoor"
];

/* 👉 Each semester = 5 subjects + 3 labs */
const semesters = {
  Sem1: [
    "Mathematics I",
    "Physics",
    "C Programming",
    "English",
    "Chemistry",
    "C Programming Lab",
    "Physics Lab",
    "Chemistry Lab"
  ],
  Sem2: [
    "Data Structures",
    "OOP",
    "Statistics",
    "Python",
    "EVS",
    "Data Structures Lab",
    "OOP Lab",
    "Python Lab"
  ],
  Sem3: [
    "Operating Systems",
    "DBMS",
    "Computer Networks",
    "Java",
    "Software Engineering",
    "OS Lab",
    "DBMS Lab",
    "Networks Lab"
  ],
  Sem4: [
    "Artificial Intelligence",
    "Machine Learning",
    "Web Technologies",
    "COA",
    "TOC",
    "AI Lab",
    "ML Lab",
    "Web Technologies Lab"
  ]
};

/* ================= COMPONENT ================= */

export default function SmartTimetablePro() {

  const navigate = useNavigate();

  const [classes, setClasses] = useState({});
  const [currentClass, setCurrentClass] = useState("");

  const [semester, setSemester] = useState("");
  const [className, setClassName] = useState("");
  const [classTeacher, setClassTeacher] = useState("");
  const [crName, setCrName] = useState("");

  const [selectedDay, setSelectedDay] = useState("Mon");
  const [selectedPeriod, setSelectedPeriod] = useState(1);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");

  /* ============ CREATE CLASS ============ */
  const createClass = () => {
    if (!semester || !className || !classTeacher || !crName) {
      alert("Fill all fields");
      return;
    }

    setClasses(prev => {
      const newObj = structuredClone(prev || {});
      if (!newObj[className]) {
        newObj[className] = {
          semester,
          teacher: classTeacher,
          cr: crName,
          timetable: {}
        };
      }
      return newObj;
    });

    setCurrentClass(className);
    alert("Class Created & Selected");
  };

  /* ============ ASSIGN PERIOD (LAB = 3 HOURS) ============ */
  const assignPeriod = () => {
    if (!currentClass) return alert("Select class");
    if (!selectedSubject || !selectedFaculty) return alert("Select subject & faculty");

    setClasses(prev => {
      const newClasses = structuredClone(prev || {});

      if (!newClasses[currentClass]) return prev;

      if (!newClasses[currentClass].timetable) {
        newClasses[currentClass].timetable = {};
      }

      if (!newClasses[currentClass].timetable[selectedDay]) {
        newClasses[currentClass].timetable[selectedDay] = {};
      }

      const tt = newClasses[currentClass].timetable[selectedDay];
      const isLab = selectedSubject.toLowerCase().includes("lab");

      if (isLab) {

        if (selectedPeriod > 4) {
          alert("Lab needs 3 continuous periods");
          return prev;
        }

        if (tt[selectedPeriod] || tt[selectedPeriod+1] || tt[selectedPeriod+2]) {
          alert("One of the lab slots is already filled");
          return prev;
        }

        tt[selectedPeriod]   = { subject: selectedSubject, faculty: selectedFaculty };
        tt[selectedPeriod+1] = { subject: selectedSubject, faculty: selectedFaculty };
        tt[selectedPeriod+2] = { subject: selectedSubject, faculty: selectedFaculty };

      } else {

        if (tt[selectedPeriod]) {
          alert("Already assigned");
          return prev;
        }

        tt[selectedPeriod] = { subject: selectedSubject, faculty: selectedFaculty };
      }

      return newClasses;
    });
  };

  /* ============ AUTO GENERATE (LAB = 3 HOURS) ============ */
  const autoGenerate = () => {
    if (!currentClass) return alert("Select class");

    setClasses(prev => {
      const newClasses = structuredClone(prev || {});
      const cls = newClasses[currentClass];

      if (!cls) return prev;

      const subjects = semesters[cls.semester] || [];

      let tt = {};
      days.forEach(d => tt[d] = {});

      subjects.forEach(sub => {

        const isLab = sub.toLowerCase().includes("lab");
        let count = isLab ? 1 : 3;
        let tries = 0;

        while (count > 0 && tries < 500) {
          tries++;

          const d = days[Math.floor(Math.random() * days.length)];
          const p = Math.floor(Math.random() * 6) + 1;
          const fac = facultyList[Math.floor(Math.random() * facultyList.length)];

          if (isLab) {

            if (p > 4) continue;

            if (!tt[d][p] && !tt[d][p+1] && !tt[d][p+2]) {
              tt[d][p]   = { subject: sub, faculty: fac };
              tt[d][p+1] = { subject: sub, faculty: fac };
              tt[d][p+2] = { subject: sub, faculty: fac };
              count--;
            }

          } else {

            if (!tt[d][p]) {
              tt[d][p] = { subject: sub, faculty: fac };
              count--;
            }
          }
        }
      });

      cls.timetable = tt;
      return newClasses;
    });

    alert("Timetable Auto Generated");
  };

  /* ============ PDF ============ */
  const downloadPDF = () => {
    if (!currentClass) return;

    const cls = classes[currentClass];
    const tt = cls?.timetable || {};

    const doc = new jsPDF();
    doc.text(`Class: ${currentClass}`, 14, 15);
    doc.text(`Semester: ${cls?.semester || ""}`, 14, 22);
    doc.text(`Teacher: ${cls?.teacher || ""}`, 14, 29);
    doc.text(`CR: ${cls?.cr || ""}`, 14, 36);

    const body = days.map(d => [
      d,
      ...periods.map(p =>
        tt[d]?.[p]
          ? `${tt[d][p].subject}\n${tt[d][p].faculty}`
          : "-"
      )
    ]);

    autoTable(doc, {
      head: [["Day", ...periods.map(p => "P" + p)]],
      body,
      startY: 45,
      styles: { fontSize: 10 }
    });

    doc.save(`Timetable_${currentClass}.pdf`);
  };

  /* ============ TABLE ============ */
  const renderTable = () => {
    if (!currentClass) return null;

    const tt = classes[currentClass]?.timetable || {};

    return (
      <table className="stp-table">
        <thead>
          <tr>
            <th>Day</th>
            {periods.map(p => <th key={p}>P{p}</th>)}
          </tr>
        </thead>
        <tbody>
          {days.map(d => (
            <tr key={d}>
              <th>{d}</th>
              {periods.map(p => {
                const isSelected = selectedDay === d && selectedPeriod === p;
                return (
                  <td
                    key={p}
                    onClick={() => {
                      setSelectedDay(d);
                      setSelectedPeriod(p);
                    }}
                    className={
                      isSelected
                        ? "stp-cell-selected"
                        : tt[d]?.[p]
                        ? "stp-cell-filled"
                        : "stp-cell-empty"
                    }
                  >
                    {tt[d]?.[p]
                      ? <>
                          <b>{tt[d][p].subject}</b><br/>
                          <span>{tt[d][p].faculty}</span>
                        </>
                      : "-"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  /* ================= UI ================= */

  return (
    <div className="stp-root">

      {/* BACK TO ACADEMICS */}
      <button
        className="stp-btn"
        style={{ marginBottom: 16 }}
        onClick={() => navigate("/dashboard")}
      >
        ⬅ Back to Academics
      </button>

      <h2 className="stp-main-title">Smart Timetable Admin Panel</h2>

      {/* CREATE CLASS */}
      <div className="stp-panel">
        <h3 className="stp-section-title">Create Class</h3>

        <div className="stp-form-grid">
          <div className="stp-field">
            <label>Semester</label>
            <select
              className="stp-select"
              value={semester}
              onChange={e => setSemester(e.target.value)}
            >
              <option value="">Select Semester</option>
              {Object.keys(semesters || {}).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="stp-field">
            <label>Class Name</label>
            <input
              className="stp-input"
              value={className}
              onChange={e => setClassName(e.target.value)}
            />
          </div>

          <div className="stp-field">
            <label>Class Teacher</label>
            <input
              className="stp-input"
              value={classTeacher}
              onChange={e => setClassTeacher(e.target.value)}
            />
          </div>

          <div className="stp-field">
            <label>CR Name</label>
            <input
              className="stp-input"
              value={crName}
              onChange={e => setCrName(e.target.value)}
            />
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button className="stp-btn" onClick={createClass}>➕ Create Class</button>
        </div>
      </div>

      {/* SELECT CLASS */}
      <div className="stp-panel">
        <h3 className="stp-section-title">Select Class</h3>
        <select
          className="stp-select"
          value={currentClass}
          onChange={e => setCurrentClass(e.target.value)}
        >
          <option value="">-- Select Class --</option>
          {Object.keys(classes || {}).map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* ADMIN PANEL */}
      {currentClass && (
        <div className="stp-panel">
          <h3 className="stp-section-title">Admin Allocate</h3>

          <select
            className="stp-select"
            value={selectedDay}
            onChange={e => setSelectedDay(e.target.value)}
          >
            {days.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <select
            className="stp-select"
            value={selectedPeriod}
            onChange={e => setSelectedPeriod(Number(e.target.value))}
          >
            {periods.map(p => <option key={p} value={p}>P{p}</option>)}
          </select>

          <select
            className="stp-select"
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
          >
            <option value="">Select Subject</option>
            {(semesters[classes[currentClass]?.semester] || []).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            className="stp-select"
            value={selectedFaculty}
            onChange={e => setSelectedFaculty(e.target.value)}
          >
            <option value="">Select Faculty</option>
            {(facultyList || []).map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>

          <br/><br/>

          <button className="stp-btn" onClick={assignPeriod}>Assign</button>
          <button className="stp-btn" onClick={autoGenerate}>Auto Generate</button>
          <button className="stp-btn" onClick={downloadPDF}>Export PDF</button>

          {renderTable()}
        </div>
      )}

    </div>
  );
}


