import React, { useState } from "react";


export default function AdminDashboard() {

  const stats = [
    { title: "Total Students", value: 3240, color: "blue" },
    { title: "Total Faculty", value: 186, color: "green" },
    { title: "Active Subjects", value: 48, color: "purple" },
    { title: "Notices Published", value: 12, color: "red" }
  ];

  // ====== DYNAMIC LISTS ======
  const [facultyList, setFacultyList] = useState(["Dr. Rao", "Dr. Sharma"]);
  const [studentList, setStudentList] = useState(["Akhil", "Sneha"]);
  const [subjectList, setSubjectList] = useState(["Maths", "DS", "OS"]);
  const [noticeList, setNoticeList] = useState([
    "Tomorrow is holiday",
    "Internal exams next week"
  ]);
  const [timetableLogs, setTimetableLogs] = useState([]);

  // ====== FUNCTIONS ======
  const addFaculty = () => {
    const name = prompt("Enter Faculty Name:");
    if (name && name.trim() !== "") {
      setFacultyList(prev => [...prev, name]);
    }
  };

  const addStudent = () => {
    const name = prompt("Enter Student Name:");
    if (name && name.trim() !== "") {
      setStudentList(prev => [...prev, name]);
    }
  };

  const addSubject = () => {
    const name = prompt("Enter Subject Name:");
    if (name && name.trim() !== "") {
      setSubjectList(prev => [...prev, name]);
    }
  };

  const publishNotice = () => {
    const text = prompt("Enter Notice Text:");
    if (text && text.trim() !== "") {
      setNoticeList(prev => [...prev, text]);
    }
  };

  const generateTimetable = () => {
    const log = "Timetable generated at " + new Date().toLocaleString();
    setTimetableLogs(prev => [...prev, log]);
    alert("Timetable generated successfully ✅");
  };

  return (
    <div className="admin-container">

      {/* HEADER */}
      <div className="admin-header">
        <h1>⚙️ Smart Admin Control Center</h1>
        <p>VistarNetra – Institutional Command Dashboard</p>
      </div>

      {/* STATS GRID */}
      <div className="admin-stats">
        {stats.map((s, i) => (
          <div key={i} className={`stat-card ${s.color}`}>
            <h4>{s.title}</h4>
            <span>{s.value}</span>
          </div>
        ))}
      </div>

      {/* MAIN GRID */}
      <div className="admin-main">

        {/* LEFT BIG PANEL */}
        <div className="admin-panel big">
          <h2>📊 System Overview</h2>
          <p
  style={{
    fontSize: "42px",        // 🔥 BIGGER TEXT
    fontWeight: "600",
    color: "#cbd5f5",
    textAlign: "left",
    marginTop: "10px",
    marginBottom: "30px",
    letterSpacing: "0.5px",
    opacity: 0.9,
  }}
>
  Central control for all institutional resources.
</p>

          <div className="admin-score">
            System Health Score: <span>96%</span>
          </div>

          <h3>📢 Notices</h3>
          <ul className="simple-list">
            {noticeList.map((n, i) => <li key={i}>{n}</li>)}
          </ul>

          
        </div>

        {/* RIGHT PANEL 1 - QUICK ACTIONS */}
        <div className="admin-panel quick-actions">
          <h3>⚡ Management Actions</h3>
          <button onClick={addFaculty}>➕ Add Faculty</button>
          <button onClick={addStudent}>➕ Add Student</button>
          <button onClick={addSubject}>➕ Create Subject</button>
          <button onClick={publishNotice}>📢 Publish Notice</button>
          
        </div>

        {/* RIGHT PANEL 2 - LISTS */}
        <div className="admin-panel">
          <h3>👨‍🏫 Faculty</h3>
          <ul className="simple-list">
            {facultyList.map((f, i) => <li key={i}>{f}</li>)}
          </ul>

          <h3>🎓 Students</h3>
          <ul className="simple-list">
            {studentList.map((s, i) => <li key={i}>{s}</li>)}
          </ul>

          <h3>📚 Subjects</h3>
          <ul className="simple-list">
            {subjectList.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>

      </div>
    </div>
  );
}


