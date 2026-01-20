import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ================== DATA ================== */

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const periods = [1, 2, 3, 4, 5, 6];

const facultyList = [
  "Dr. Suresh Rao","Dr. Anitha Sharma","Prof. Ramesh Kumar","Prof. Kavitha Reddy",
  "Dr. Naveen Gupta","Dr. Sunitha Iyer","Prof. Mahesh Naidu","Dr. Priya Verma",
  "Dr. Kiran Patel","Prof. Lakshmi Devi","Dr. Arjun Singh","Dr. Meena Kapoor",
  "Prof. Satish Chandra","Dr. Pooja Mishra","Dr. Ravi Teja","Prof. Deepika Nair",
  "Dr. Vinod Babu","Dr. Swathi Rao","Prof. Harish Kulkarni","Dr. Neha Agarwal",
  "Prof. Sandeep Jain","Dr. Bhavya Sri","Dr. Ajay Malhotra","Prof. Nithin Reddy",
  "Dr. Sneha Joshi","Prof. Rajesh Khanna","Dr. Aishwarya Das","Dr. Prakash Menon",
  "Prof. Srilatha","Dr. Venkatesh"
];

const semesters = {
  Sem1: ["Maths", "Physics", "C", "English", "Chemistry", "Lab1"],
  Sem2: ["DS", "OOP", "EVS", "Stats", "Python", "Lab2"],
  Sem3: ["OS", "DBMS", "CN", "Java", "SE", "Lab3"],
  Sem4: ["AI", "ML", "Web", "COA", "TOC", "Lab4"],
  Sem5: ["Cloud", "IOT", "NLP", "BigData", "Crypto", "Lab5"],
  Sem6: ["DL", "DSA", "Robotics", "ARVR", "Compiler", "Lab6"],
  Sem7: ["Project", "Elective1", "Elective2", "Elective3", "Seminar", "Internship"]
};

/* ================== COMPONENT ================== */

export default function SmartTimetable() {
  const [selectedSem, setSelectedSem] = useState("Sem1");
  const [subjectFaculty, setSubjectFaculty] = useState({});
  const [timetable, setTimetable] = useState({});

  /* ============ ASSIGN FACULTY ============ */
  const assignFaculty = (subject, faculty) => {
    setSubjectFaculty(prev => ({
      ...prev,
      [selectedSem]: {
        ...(prev[selectedSem] || {}),
        [subject]: faculty
      }
    }));
  };

  /* ============ GENERATE TIMETABLE ============ */
  const generateTimetable = () => {
    let tt = {};
    let facultyBusy = {};

    days.forEach(d => (tt[d] = {}));

    semesters[selectedSem].forEach(sub => {
      const fac = subjectFaculty[selectedSem]?.[sub];
      if (!fac) return;

      let placed = 0;
      while (placed < 4) {
        const d = days[Math.floor(Math.random() * days.length)];
        const p = periods[Math.floor(Math.random() * periods.length)];

        facultyBusy[fac] ??= {};
        facultyBusy[fac][d] ??= {};

        if (!tt[d][p] && !facultyBusy[fac][d][p]) {
          tt[d][p] = { subject: sub, faculty: fac };
          facultyBusy[fac][d][p] = true;
          placed++;
        }
      }
    });

    setTimetable(tt);
    alert("✅ Timetable Generated Successfully");
  };

  /* ============ PDF DOWNLOAD ============ */
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`Timetable - ${selectedSem}`, 14, 15);

    const body = days.map(d => [
      d,
      ...periods.map(p =>
        timetable[d]?.[p]
          ? `${timetable[d][p].subject}\n${timetable[d][p].faculty}`
          : "-"
      )
    ]);

    autoTable(doc, {
      head: [["Day", ...periods.map(p => "P" + p)]],
      body,
      startY: 25,
      styles: { fontSize: 9 }
    });

    doc.save(`Timetable_${selectedSem}.pdf`);
  };

  /* ============ TABLE ============ */
  const renderTable = () => {
    if (!Object.keys(timetable).length) {
      return <p style={{ marginTop: 20 }}>⚠️ Generate timetable first</p>;
    }

    return (
      <table border="1" cellPadding="10" style={{ marginTop: 30, width: "100%" }}>
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
              {periods.map(p => (
                <td key={p}>
                  {timetable[d][p] ? (
                    <>
                      <b>{timetable[d][p].subject}</b><br />
                      <small>{timetable[d][p].faculty}</small>
                    </>
                  ) : "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  /* ================== UI ================== */

  return (
    <div className="tt-root" style={{ padding: 40 }}>
      <h1>Smart Timetable Alignment Engine</h1>

      <h3>🎓 Select Semester</h3>
      <select value={selectedSem} onChange={e => setSelectedSem(e.target.value)}>
        {Object.keys(semesters).map(s => <option key={s}>{s}</option>)}
      </select>

      <h3 style={{ marginTop: 25 }}>👨‍🏫 Assign Faculty</h3>
      {semesters[selectedSem].map(sub => (
        <div key={sub} style={{ marginBottom: 12 }}>
          <strong style={{ width: 120, display: "inline-block" }}>{sub}</strong>
          <select
            value={subjectFaculty[selectedSem]?.[sub] || ""}
            onChange={e => assignFaculty(sub, e.target.value)}
          >
            <option value="">-- Select Faculty --</option>
            {facultyList.map(f => <option key={f}>{f}</option>)}
          </select>
        </div>
      ))}

      <br />
      <button onClick={generateTimetable}>⚡ Generate Timetable</button>
      <button onClick={downloadPDF} style={{ marginLeft: 20 }}>
        📄 Download PDF
      </button>

      {renderTable()}
    </div>
  );
}




