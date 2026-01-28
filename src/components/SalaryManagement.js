import React, { useState, useMemo } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ================= EMPLOYEE DATA ================= */
const employeesDB = [
  { id: "EMP001", name: "Dr. Suresh Rao", dept: "CSE", role: "Professor", base: 90000 },
  { id: "EMP002", name: "Dr. Anitha Sharma", dept: "ECE", role: "Associate Prof", base: 78000 },
  { id: "EMP003", name: "Mr. Ramesh Kumar", dept: "Admin", role: "Clerk", base: 32000 },
  { id: "EMP004", name: "Mrs. Kavitha Reddy", dept: "Finance", role: "Accountant", base: 45000 },
  { id: "EMP005", name: "Dr. Naveen Gupta", dept: "CSE", role: "Professor", base: 88000 },

  { id: "EMP006", name: "Dr. Sunitha Iyer", dept: "EEE", role: "Professor", base: 86000 },
  { id: "EMP007", name: "Prof. Mahesh Naidu", dept: "MECH", role: "Associate Prof", base: 72000 },
  { id: "EMP008", name: "Dr. Priya Verma", dept: "CIVIL", role: "Professor", base: 84000 },
  { id: "EMP009", name: "Dr. Kiran Patel", dept: "CSE", role: "Associate Prof", base: 76000 },
  { id: "EMP010", name: "Prof. Lakshmi Devi", dept: "ECE", role: "Assistant Prof", base: 62000 },

  { id: "EMP011", name: "Dr. Arjun Singh", dept: "EEE", role: "Professor", base: 89000 },
  { id: "EMP012", name: "Dr. Meena Kapoor", dept: "MBA", role: "Professor", base: 83000 },
  { id: "EMP013", name: "Mr. Ravi Teja", dept: "Admin", role: "Office Staff", base: 28000 },
  { id: "EMP014", name: "Mrs. Anusha Reddy", dept: "Finance", role: "Clerk", base: 30000 },
  { id: "EMP015", name: "Dr. Nikhil Jain", dept: "CSE", role: "Assistant Prof", base: 65000 },

  { id: "EMP016", name: "Dr. Pooja Singh", dept: "ECE", role: "Assistant Prof", base: 64000 },
  { id: "EMP017", name: "Prof. Harsha Vardhan", dept: "MECH", role: "Professor", base: 87000 },
  { id: "EMP018", name: "Dr. Sneha Kulkarni", dept: "CIVIL", role: "Associate Prof", base: 74000 },
  { id: "EMP019", name: "Mr. Sandeep Kumar", dept: "Library", role: "Librarian", base: 38000 },
  { id: "EMP020", name: "Mrs. Deepika Rao", dept: "Exam", role: "Office Staff", base: 35000 },

  { id: "EMP021", name: "Dr. Vikas Malhotra", dept: "MBA", role: "Associate Prof", base: 79000 },
  { id: "EMP022", name: "Prof. Karthik Subramaniam", dept: "EEE", role: "Assistant Prof", base: 66000 },
  { id: "EMP023", name: "Dr. Swathi Reddy", dept: "CSE", role: "Associate Prof", base: 77000 },
  { id: "EMP024", name: "Mr. Prakash", dept: "Accounts", role: "Accountant", base: 42000 },
  { id: "EMP025", name: "Mrs. Geetha", dept: "Admin", role: "Superintendent", base: 52000 },

  { id: "EMP026", name: "Dr. Rahul Mehta", dept: "ECE", role: "Professor", base: 88000 },
  { id: "EMP027", name: "Dr. Vinay Kumar", dept: "CSE", role: "Professor", base: 91000 },
  { id: "EMP028", name: "Prof. Srilatha", dept: "CIVIL", role: "Assistant Prof", base: 63000 },
  { id: "EMP029", name: "Mr. Srinivas", dept: "Stores", role: "Store Keeper", base: 30000 },
  { id: "EMP030", name: "Mrs. Bhavya", dept: "HR", role: "HR Executive", base: 48000 },
];


/* ================= MAIN COMPONENT ================= */
export default function SalaryManagement(){

  const employees = employeesDB;
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const [allowance, setAllowance] = useState(0);
  const [deduction, setDeduction] = useState(0);

  /* ========== FILTER ========== */
  const filtered = useMemo(() => {
    return employees.filter(e =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.id.toLowerCase().includes(search.toLowerCase()) ||
      e.dept.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, employees]);

  /* ========== CALC SALARY ========== */
  const salarySlip = useMemo(() => {
    if(!selected) return null;

    const base = selected.base;
    const hra = base * 0.2;
    const da = base * 0.1;
    const pf = base * 0.12;
    const tax = base * 0.08;

    const gross = base + hra + da + Number(allowance);
    const totalDed = pf + tax + Number(deduction);
    const net = gross - totalDed;

    return { base, hra, da, pf, tax, gross, totalDed, net };
  }, [selected, allowance, deduction]);

  /* ========== PDF ========== */
  const downloadPayslip = () => {
    if(!selected || !salarySlip) return;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("VISTAR NETRA UNIVERSITY", 105, 15, { align:"center" });
    doc.setFontSize(14);
    doc.text("SALARY PAYSLIP", 105, 25, { align:"center" });
    doc.line(10, 30, 200, 30);

    doc.setFontSize(12);
    doc.text(`Employee ID: ${selected.id}`, 14, 40);
    doc.text(`Name: ${selected.name}`, 14, 48);
    doc.text(`Department: ${selected.dept}`, 14, 56);
    doc.text(`Role: ${selected.role}`, 14, 64);

    autoTable(doc, {
      startY: 75,
      head: [["Component", "Amount"]],
      body: [
        ["Basic Salary", salarySlip.base],
        ["HRA (20%)", salarySlip.hra],
        ["DA (10%)", salarySlip.da],
        ["Extra Allowance", allowance],
        ["Gross Salary", salarySlip.gross],
        ["PF (12%)", salarySlip.pf],
        ["Tax (8%)", salarySlip.tax],
        ["Other Deductions", deduction],
        ["Total Deductions", salarySlip.totalDed],
        ["Net Salary", salarySlip.net],
      ],
    });

    doc.text("Accounts Officer", 140, 270);
    doc.text("Signature", 165, 276);

    doc.save(`Payslip_${selected.id}.pdf`);
  };

  /* ================= UI ================= */
  return (
    <div style={root}>

      <h2 style={title}>💰 Salary Management System</h2>
      <p style={sub}>Finance & Accounts Department Dashboard</p>

      <div style={layout}>

        {/* LEFT PANEL */}
        <div style={leftPanel}>
          <input
            placeholder="Search employee..."
            value={search}
            onChange={e=>setSearch(e.target.value)}
            style={searchBox}
          />

          <div style={{ marginTop:20 ,fontSize: 58,}}>
            {filtered.map(e => (
              <div
                key={e.id}
                style={{
                  ...empCard,
                  borderColor: selected?.id === e.id ? "#38bdf8" : "#1e293b"
                }}
                onClick={() => {
                  setSelected(e);
                  setAllowance(0);
                  setDeduction(0);
                }}
              >
               <h3 className="empName">{e.name}</h3>
<p className="empMeta">{e.id} • {e.dept}</p>
<p className="empRole">{e.role}</p>

              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={rightPanel}>
          {!selected && <h2 style={{ fontSize: 58, fontWeight: 800 }}>
  Select an employee to manage salary
</h2>}


          {selected && salarySlip && (
            <>
              <h2 style={{ color:"#38bdf8", fontSize: 58,}}>{selected.name}</h2>

              <div style={grid}>

                <Info label="Basic" value={salarySlip.base} />
                <Info label="HRA (20%)" value={salarySlip.hra} />
                <Info label="DA (10%)" value={salarySlip.da} />
                <Info label="Gross Salary" value={salarySlip.gross} />

                <div>
                  <label>Extra Allowance</label>
                  <input type="number" value={allowance} onChange={e=>setAllowance(e.target.value)} style={inp}/>
                </div>

                <div>
                  <label>Other Deductions</label>
                  <input type="number" value={deduction} onChange={e=>setDeduction(e.target.value)} style={inp}/>
                </div>

                <Info label="PF (12%)" value={salarySlip.pf} />
                <Info label="Tax (8%)" value={salarySlip.tax} />
                <Info label="Total Deductions" value={salarySlip.totalDed} />
                <Info label="NET SALARY" value={salarySlip.net} highlight />
              </div>

              <button style={btn} onClick={downloadPayslip}>
                📄 Download Payslip
              </button>
            </>
          )}
        </div>

      </div>

    </div>
  );
}

/* ================= SMALL COMPONENT ================= */
function Info({ label, value, highlight }){
  return (
    <div style={{
      padding:16,
      borderRadius:12,
      border:"2px solid #1e293b",
      background: highlight ? "linear-gradient(90deg,#22c55e,#4ade80)" : "#020617",
      color: highlight ? "#020617" : "white",
      fontWeight: highlight ? 900 : 600
    }}>
      <div style={{ color: highlight ? "#020617" : "#94a3b8" }}>{label}</div>
      <div style={{ fontSize:42 }}>₹ {value}</div>
    </div>
  );
}

/* ================= STYLES ================= */
const root = {
  minHeight:"100vh",
  padding:40,
  background:"radial-gradient(circle at top, #020617, #000)",
  color:"white"
};

const title = { fontSize:62, fontWeight:900, color:"#38bdf8",fontSize:80 };
const sub = { color:"#94a3b8", marginBottom:30, fontSize:80 };

const layout = { display:"grid", gridTemplateColumns:"580px 1fr", gap:30,fontSize:50 };

const leftPanel = {
  border:"2px solid #1e293b",
  borderRadius:20,
  padding:20,
  fontSize:60,
  background:"#020617",
  height:"80vh",
  overflow:"auto"
};

const rightPanel = {
  border:"2px solid #1e293b",
  borderRadius:20,
  padding:30,
   fontSize:60,
  background:"#020617"
};

const searchBox = {
  width:"200%",
  padding:14,
  borderRadius:12,
  border:"2px solid #1e293b",
  background:"#0b1020",
  color:"white",
  fontSize:68
};

const empCard = {
  border:"2px solid #1e293b",
  borderRadius:14,
  padding:14,
  fontSize:60,
  color:"#1e293b",
  marginBottom:12,
  cursor:"pointer",
  transition:".2s"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(560px, 1fr))",
  gap: 50,
  marginTop: 40
};
const btn = { marginTop:30, padding:"16px 36px", fontSize:52, borderRadius:14, border:"none", cursor:"pointer", fontWeight:900, background:"linear-gradient(90deg,#38bdf8,#22d3ee)", color:"#020617", boxShadow:"0 0 40px rgba(56,189,248,.4)" };
const inp = {
  width:"100%",
  padding:12,
  borderRadius:10,
  border:"2px solid #1e293b",
  background:"#0b1020",
  color:"white",
  fontSize:30
};
const empNameStyle = {
  fontSize: 54,
  fontWeight: 800,
  color: "#e5e7eb",
  marginBottom: 6
};

const empMetaStyle = {
  fontSize: 42,
  fontWeight: 600,
  color: "#38bdf8",
  marginBottom: 4
};

const empRoleStyle = {
  fontSize: 40,
  fontWeight: 500,
  color: "#94a3b8"
};
