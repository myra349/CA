import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function FacultyWorkloadManager() {
  const navigate = useNavigate();

  /* ================= DATABASE ================= */
  const [faculties, setFaculties] = useState([
    {
      id: 1,
      name: "Dr. Ramesh",
      dept: "CSE",
      subjects: [
        { name: "AI", type: "Theory", hours: 4 },
        { name: "DBMS", type: "Theory", hours: 3 },
        { name: "AI Lab", type: "Lab", hours: 4 }
      ]
    },
    {
      id: 2,
      name: "Dr. Suresh",
      dept: "ECE",
      subjects: [
        { name: "Signals", type: "Theory", hours: 3 },
        { name: "Networks", type: "Theory", hours: 3 }
      ]
    },
    {
      id: 3,
      name: "Dr. Priya",
      dept: "CSE",
      subjects: [
        { name: "DS", type: "Theory", hours: 5 },
        { name: "DS Lab", type: "Lab", hours: 4 },
        { name: "ML", type: "Theory", hours: 4 }
      ]
    }
  ]);

  /* ================= UTILS ================= */
  const totalHours = (f) =>
    f.subjects.reduce((s, x) => s + Number(x.hours), 0);

  const getStatus = (hours) => {
    if (hours < 8) return "Underload";
    if (hours > 14) return "Overload";
    return "Balanced";
  };

  /* ================= ADD SUBJECT (OVERLOAD BLOCK ENABLED) ================= */
  const addSubject = (fid) => {
    const name = prompt("Subject name?");
    const type = prompt("Type? (Theory/Lab)");
    const hours = Number(prompt("Hours per week?"));

    if (!name || !type || !hours) return;

    setFaculties((prev) =>
      prev.map((f) => {
        if (f.id !== fid) return f;

        const currentTotal = totalHours(f);
        const newTotal = currentTotal + hours;

        // ❌ BLOCK IF OVERLOAD
        if (newTotal > 14) {
          alert(
            "❌ Cannot add subject!\n\n" +
              "This faculty will become OVERLOADED.\n\n" +
              "Current Load: " + currentTotal + " hrs\n" +
              "Trying to Add: " + hours + " hrs\n" +
              "Max Allowed: 14 hrs/week"
          );
          return f; // no change
        }

        // ✅ SAFE ADD
        return {
          ...f,
          subjects: [...f.subjects, { name, type, hours }]
        };
      })
    );
  };

  /* ================= REMOVE SUBJECT ================= */
  const removeSubject = (fid, idx) => {
    setFaculties((prev) =>
      prev.map((f) =>
        f.id === fid
          ? {
              ...f,
              subjects: f.subjects.filter((_, i) => i !== idx)
            }
          : f
      )
    );
  };

  /* ================= DASHBOARD STATS ================= */
  const stats = useMemo(() => {
    let over = 0,
      under = 0,
      bal = 0;

    faculties.forEach((f) => {
      const s = getStatus(totalHours(f));
      if (s === "Overload") over++;
      if (s === "Underload") under++;
      if (s === "Balanced") bal++;
    });

    return { over, under, bal };
  }, [faculties]);

  /* ================= UI ================= */
  return (
    <div style={styles.root}>
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate("/admin")}
        style={{
          marginBottom: 20,
          padding: "12px 22px",
          borderRadius: 12,
          border: "none",
          cursor: "pointer",
          fontWeight: 800,
          background: "linear-gradient(90deg,#38bdf8,#22d3ee)"
        }}
      >
        ⬅ Back to Dashboard
      </button>

      <h1 style={styles.title}>Faculty Workload Manager</h1>

      {/* DASHBOARD */}
      <div style={styles.statsGrid}>
        <div style={{ ...styles.statCard, borderColor: "#ef4444" }}>
          🔴 Overload: {stats.over}
        </div>
        <div style={{ ...styles.statCard, borderColor: "#eab308" }}>
          🟡 Underload: {stats.under}
        </div>
        <div style={{ ...styles.statCard, borderColor: "#22c55e" }}>
          🟢 Balanced: {stats.bal}
        </div>
      </div>

      {/* FACULTY LIST */}
      {faculties.map((f) => {
        const hours = totalHours(f);
        const status = getStatus(hours);

        return (
          <div key={f.id} style={styles.facultyCard}>
            <h2>
              {f.name} ({f.dept})
            </h2>
            <p>
              Total Load: <b>{hours} hrs/week</b> —{" "}
              <span style={statusStyle[status]}>{status}</span>
            </p>

            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Type</th>
                  <th>Hours</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {f.subjects.map((s, i) => (
                  <tr key={i}>
                    <td>{s.name}</td>
                    <td>{s.type}</td>
                    <td>{s.hours}</td>
                    <td>
                      <button
                        style={styles.delBtn}
                        onClick={() => removeSubject(f.id, i)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button style={styles.addBtn} onClick={() => addSubject(f.id)}>
              ➕ Add Subject
            </button>
          </div>
        );
      })}
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  root: {
    minHeight: "100vh",
    padding: 30,
    background: "radial-gradient(circle at top, #020617, #000)",
    color: "#e5e7eb",
    fontFamily: "Poppins, sans-serif"
  },
  title: {
    textAlign: "center",
    fontSize: 48,
    fontWeight: 900,
    marginBottom: 20,
    background: "linear-gradient(90deg,#38bdf8,#22d3ee,#a5f3fc)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
    gap: 20,
    marginBottom: 30
  },
  statCard: {
    padding: 20,
    borderRadius: 16,
    background: "#020617",
    border: "2px solid",
    textAlign: "center",
    fontSize: 22,
    fontWeight: 800
  },
  facultyCard: {
    marginBottom: 30,
    padding: 20,
    borderRadius: 18,
    border: "2px solid #38bdf8",
    background: "#020617",
    boxShadow: "0 0 25px rgba(56,189,248,.2)"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: 10
  },
  delBtn: {
    padding: "6px 10px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    background: "#ef4444",
    fontWeight: 700
  },
  addBtn: {
    marginTop: 10,
    padding: "14px 24px",
    borderRadius: 14,
    border: "none",
    cursor: "pointer",
    fontWeight: 800,
    background: "linear-gradient(90deg,#38bdf8,#22d3ee)",
    boxShadow: "0 0 20px rgba(56,189,248,.5)"
  }
};

const statusStyle = {
  Overload: { color: "#ef4444", fontWeight: 900 },
  Underload: { color: "#eab308", fontWeight: 900 },
  Balanced: { color: "#22c55e", fontWeight: 900 }
};
