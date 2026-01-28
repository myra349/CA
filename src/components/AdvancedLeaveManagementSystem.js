import React, { useState, useMemo } from "react";

export default function AdvancedLeaveManagementSystem() {
  /* ================= ROLE SWITCH (DEMO) ================= */
  const [role, setRole] = useState("faculty"); // "faculty" or "admin"

  /* ================= DATABASE ================= */
  const [faculties, setFaculties] = useState([
    {
      id: 1,
      name: "Dr. Ramesh",
      department: "CSE",
      balance: { CL: 5, SL: 8, EL: 10, OD: 3 },
      leaves: [
        {
          id: 101,
          from: "2026-01-10",
          to: "2026-01-12",
          days: 3,
          type: "CL",
          reason: "Fever",
          status: "Approved"
        }
      ]
    },
    {
      id: 2,
      name: "Dr. Suresh",
      department: "ECE",
      balance: { CL: 8, SL: 10, EL: 12, OD: 2 },
      leaves: []
    }
  ]);

  // assume logged in faculty
  const faculty = faculties[0];

  /* ================= APPLY FORM ================= */
  const [form, setForm] = useState({
    from: "",
    to: "",
    type: "CL",
    reason: ""
  });

  const calcDays = (from, to) => {
    const d1 = new Date(from);
    const d2 = new Date(to);
    return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24)) + 1;
  };

  const applyLeave = () => {
    if (!form.from || !form.to || !form.reason) {
      alert("Fill all fields");
      return;
    }

    const days = calcDays(form.from, form.to);
    if (days <= 0) {
      alert("Invalid dates");
      return;
    }

    if (days > faculty.balance[form.type]) {
      alert("❌ Not enough leave balance");
      return;
    }

    if (days >= 3) {
      alert("⚠️ Long leave detected (>=3 days)");
    }

    const newLeave = {
      id: Date.now(),
      ...form,
      days,
      status: "Pending"
    };

    setFaculties(
      faculties.map((f) =>
        f.id === faculty.id
          ? { ...f, leaves: [...f.leaves, newLeave] }
          : f
      )
    );

    setForm({ from: "", to: "", type: "CL", reason: "" });
  };

  /* ================= ADMIN ACTION ================= */
  const updateStatus = (fid, lid, status) => {
    setFaculties(
      faculties.map((f) => {
        if (f.id !== fid) return f;

        return {
          ...f,
          balance:
            status === "Approved"
              ? {
                  ...f.balance,
                  [f.leaves.find((l) => l.id === lid).type]:
                    f.balance[f.leaves.find((l) => l.id === lid).type] -
                    f.leaves.find((l) => l.id === lid).days
                }
              : f.balance,
          leaves: f.leaves.map((l) =>
            l.id === lid ? { ...l, status } : l
          )
        };
      })
    );
  };

  /* ================= ANALYTICS ================= */
  const stats = useMemo(() => {
    let total = 0,
      pending = 0,
      approved = 0,
      rejected = 0;

    faculties.forEach((f) =>
      f.leaves.forEach((l) => {
        total++;
        if (l.status === "Pending") pending++;
        if (l.status === "Approved") approved++;
        if (l.status === "Rejected") rejected++;
      })
    );

    return { total, pending, approved, rejected };
  }, [faculties]);

  /* ================= UI ================= */
  return (
    <div style={styles.root}>
      <h1 style={styles.title}>Advanced Leave Management System</h1>

      {/* ROLE SWITCH */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <button style={styles.switchBtn} onClick={() => setRole("faculty")}>
          Faculty View
        </button>
        <button style={styles.switchBtn} onClick={() => setRole("admin")}>
          Admin View
        </button>
      </div>

      {/* ================= FACULTY ================= */}
      {role === "faculty" && (
        <>
          <h2>
            👨‍🏫 {faculty.name} ({faculty.department})
          </h2>

          <div style={styles.balanceRow}>
            {Object.keys(faculty.balance).map((k) => (
              <div key={k} style={styles.balanceCard}>
                {k} Balance: {faculty.balance[k]}
              </div>
            ))}
          </div>

          <div style={styles.card}>
            <h3>Apply Leave</h3>
            <input
              style={styles.input}
              type="date"
              value={form.from}
              onChange={(e) => setForm({ ...form, from: e.target.value })}
            />
            <input
              style={styles.input}
              type="date"
              value={form.to}
              onChange={(e) => setForm({ ...form, to: e.target.value })}
            />
            <select
              style={styles.input}
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="CL">Casual Leave (CL)</option>
              <option value="SL">Sick Leave (SL)</option>
              <option value="EL">Earned Leave (EL)</option>
              <option value="OD">On Duty (OD)</option>
            </select>
            <textarea
              style={styles.input}
              placeholder="Reason"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
            />
            <button style={styles.applyBtn} onClick={applyLeave}>
              Apply Leave
            </button>
          </div>

          <h2 style={{ marginTop: 30 }}>My Leave History</h2>

          {faculty.leaves.map((l) => (
            <div key={l.id} style={styles.leaveRow}>
              {l.from} → {l.to} | {l.type} | {l.days} days | <b>{l.status}</b>
            </div>
          ))}
        </>
      )}

      {/* ================= ADMIN ================= */}
      {role === "admin" && (
        <>
          {/* DASHBOARD */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>Total: {stats.total}</div>
            <div style={styles.statCard}>Pending: {stats.pending}</div>
            <div style={styles.statCard}>Approved: {stats.approved}</div>
            <div style={styles.statCard}>Rejected: {stats.rejected}</div>
          </div>

          <h2>👨‍💼 Admin Approval Panel</h2>

          {faculties.map((f) => (
            <div key={f.id} style={styles.facultyCard}>
              <h3>
                {f.name} ({f.department})
              </h3>

              <p>
                Balance → CL:{f.balance.CL} | SL:{f.balance.SL} | EL:{f.balance.EL} | OD:{f.balance.OD}
              </p>

              {f.leaves.map((l) => (
                <div key={l.id} style={styles.leaveRowAdmin}>
                  <div>
                    {l.from} → {l.to} | {l.type} | {l.days} days | <b>{l.status}</b>
                  </div>

                  {l.status === "Pending" && (
                    <div>
                      <button
                        style={styles.approveBtn}
                        onClick={() => updateStatus(f.id, l.id, "Approved")}
                      >
                        Approve
                      </button>
                      <button
                        style={styles.rejectBtn}
                        onClick={() => updateStatus(f.id, l.id, "Rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  root: {
    minHeight: "200vh",
    padding: 40,
   fontSize: 48,
    background: "radial-gradient(circle at top, #020617, #000)",
    color: "#f7f8f9",
    fontFamily: "Poppins, sans-serif"
  },
  title: {
    textAlign: "center",
    fontSize: 68,
    fontWeight: 900,
    marginBottom: 20,
    background: "linear-gradient(90deg,#38bdf8,#22d3ee,#a5f3fc)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },
  switchBtn: {
    margin: 10,
    padding: "30px 60px",
    borderRadius: 30,
    border: "none",
    fontWeight: 700,
    gap:40 ,
    cursor: "pointer"
  },
  card: {
    maxWidth: 1920,
    
    padding: 20,
    borderRadius: 16,
    background: "#020617",
    boxShadow: "0 0 25px rgba(56,189,248,.25)"
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    border: "none",
    fontSize: 56
  },
  applyBtn: {
    width: "100%",
    padding: 14,
    fontWeight: 800,
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(90deg,#38bdf8,#22d3ee)"
  },
  balanceRow: {
    display: "flex",
    gap: 10,
    marginBottom: 20,
    flexWrap: "wrap"
  },
  balanceCard: {
    padding: "10px 16px",
    borderRadius: 12,
    background: "#020617",
    border: "1px solid #38bdf8"
  },
  leaveRow: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    border: "1px solid #38bdf8"
  },
  facultyCard: {
    marginTop: 30,
    padding: 20,
    borderRadius: 16,
    border: "2px solid #38bdf8"
  },
  leaveRowAdmin: {
    marginTop: 10,
    display: "flex",
    justifyContent: "space-between",
    gap: 30,
    padding: 10,
    borderRadius: 10,
    border: "1px solid #38bdf8"
  },
  approveBtn: {
    marginRight: 6,
    padding: "6px 12px",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    background: "#22c55e",
    fontWeight: 700
  },
  rejectBtn: {
    padding: "6px 12px",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    background: "#ef4444",
    fontWeight: 700
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
    gap: 20,
    marginBottom: 20
  },
  statCard: {
    padding: 20,
    borderRadius: 16,
    background: "#020617",
    border: "2px solid #38bdf8",
    textAlign: "center",
    fontSize: 42,
    fontWeight: 800
  }
};


