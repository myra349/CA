import React, { useState, useMemo } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function BudgetAuditManagement(){

  /* ============ STATE ============ */
  const [departments, setDepartments] = useState({});
  const [selectedDept, setSelectedDept] = useState(null);

  const [newDept, setNewDept] = useState("");
  const [newBudget, setNewBudget] = useState("");

  const [expenseReason, setExpenseReason] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");

  /* ============ COMPUTED ============ */
  const totalSpent = useMemo(() => {
    if(!selectedDept) return 0;
    const list = departments[selectedDept]?.expenses || [];
    return list.reduce((a,b)=>a + b.amount, 0);
  }, [departments, selectedDept]);

  const remaining = selectedDept
    ? (departments[selectedDept]?.budget || 0) - totalSpent
    : 0;

  /* ============ ADD DEPARTMENT ============ */
  const addDepartment = () => {
    if(!newDept || !newBudget) return alert("Enter department & budget");

    setDepartments(prev => {
      if(prev[newDept]) return prev;
      return {
        ...prev,
        [newDept]: {
          budget: Number(newBudget),
          expenses: []
        }
      };
    });

    setNewDept("");
    setNewBudget("");
  };

  /* ============ ADD EXPENSE ============ */
  const addExpense = () => {
    if(!selectedDept || !expenseReason || !expenseAmount)
      return alert("Fill all expense details");

    setDepartments(prev => {
      const copy = structuredClone(prev);
      copy[selectedDept].expenses.push({
        reason: expenseReason,
        amount: Number(expenseAmount)
      });
      return copy;
    });

    setExpenseReason("");
    setExpenseAmount("");
  };

  /* ============ PDF ============ */
  const downloadAudit = () => {
    if(!selectedDept) return;

    const dept = departments[selectedDept];
    const list = dept.expenses;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("VISTAR NETRA UNIVERSITY", 105, 15, { align:"center" });
    doc.setFontSize(14);
    doc.text("BUDGET & AUDIT REPORT", 105, 25, { align:"center" });

    doc.setFontSize(12);
    doc.text(`Department: ${selectedDept}`, 14, 40);
    doc.text(`Total Budget: ₹ ${dept.budget}`, 14, 48);
    doc.text(`Total Spent: ₹ ${totalSpent}`, 14, 56);
    doc.text(`Remaining: ₹ ${remaining}`, 14, 64);

    autoTable(doc, {
      startY: 75,
      head: [["S.No", "Reason", "Amount"]],
      body: list.map((e,i)=>[i+1, e.reason, e.amount])
    });

    doc.save(`Audit_${selectedDept}.pdf`);
  };

  /* ============ UI ============ */
  return (
    <div style={root}>

      <h1 style={title}>📊 Budget & Audit Management</h1>
      <p style={sub}>Smart Campus Finance Control System</p>

      <div style={layout}>

        {/* LEFT PANEL */}
        <div style={leftPanel}>

          <h3>Add Department</h3>
          <input placeholder="Department Name" value={newDept} onChange={e=>setNewDept(e.target.value)} style={input}/>
          <input type="number" placeholder="Allocated Budget" value={newBudget} onChange={e=>setNewBudget(e.target.value)} style={input}/>
          <button style={btn} onClick={addDepartment}>➕ Add Department</button>

          <hr/>

          <h3>Departments</h3>
          {Object.keys(departments).length === 0 && <p>No departments added yet</p>}

          {Object.keys(departments).map(d => (
            <div
              key={d}
              style={{
                ...deptCard,
                borderColor: selectedDept === d ? "#38bdf8" : "#1e293b"
              }}
              onClick={()=>setSelectedDept(d)}
            >
              <b>{d}</b>
              <div>Budget: ₹ {departments[d].budget}</div>
            </div>
          ))}
        </div>

        {/* RIGHT PANEL */}
        <div style={rightPanel}>

          {!selectedDept && (
            <div style={emptyState}>
              <div style={{ fontSize:80 }}>🏦</div>
              <h2>Select a Department</h2>
              <p>Choose a department to manage budget & expenses</p>
            </div>
          )}

          {selectedDept && (
            <>
              <h2 style={{ color:"#38bdf8", fontSize:36 }}>{selectedDept} Department</h2>

              <div style={statsGrid}>
                <StatBox label="Total Budget" value={departments[selectedDept].budget} />
                <StatBox label="Total Spent" value={totalSpent} />
                <StatBox label="Remaining" value={remaining} highlight={remaining < 0} />
              </div>

              {remaining < 0 && (
                <p style={{ color:"#ef4444", fontWeight:800, fontSize:20 }}>
                  ⚠️ Over Budget! Spending exceeded allocated amount.
                </p>
              )}

              <hr/>

              <h3>Add Expense</h3>
              <input placeholder="Expense Reason" value={expenseReason} onChange={e=>setExpenseReason(e.target.value)} style={input}/>
              <input type="number" placeholder="Amount" value={expenseAmount} onChange={e=>setExpenseAmount(e.target.value)} style={input}/>
              <button style={btn} onClick={addExpense}>➕ Add Expense</button>

              <hr/>

              <h3>Expense List</h3>

              {(departments[selectedDept].expenses || []).length === 0 && (
                <p style={{ color:"#94a3b8" }}>No expenses added yet</p>
              )}

              {(departments[selectedDept].expenses || []).map((e,i)=>(
                <div key={i} style={expenseRow}>
                  {i+1}. {e.reason} — ₹ {e.amount}
                </div>
              ))}

              <button style={btn} onClick={downloadAudit}>📄 Download Audit Report</button>
            </>
          )}

        </div>

      </div>

    </div>
  );
}

/* ============ SMALL COMPONENT ============ */
function StatBox({ label, value, highlight }){
  return (
    <div style={{
      padding:20,
      borderRadius:14,
      border:"2px solid #1e293b",
      background: highlight ? "linear-gradient(90deg,#ef4444,#f87171)" : "#020617",
      color: highlight ? "#020617" : "white"
    }}>
      <div style={{ color:"#94a3b8" }}>{label}</div>
      <div style={{ fontSize:28, fontWeight:900 }}>₹ {value}</div>
    </div>
  );
}

/* ============ STYLES ============ */
const root = {
  minHeight:"100vh",
  padding:40,
  background:"radial-gradient(circle at top, #020617, #000)",
  color:"white"
};

const title = { fontSize:52, fontWeight:900, color:"#38bdf8" };
const sub = { color:"#94a3b8", marginBottom:30, fontSize:24 };

const layout = { display:"grid", gridTemplateColumns:"380px 1fr", gap:30 };

const leftPanel = {
  border:"2px solid #1e293b",
  borderRadius:20,
  padding:20,
  background:"#020617",
  height:"80vh",
  overflow:"auto"
};

const rightPanel = {
  border:"2px solid #1e293b",
  borderRadius:20,
  padding:30,
  background:"#020617"
};

const input = {
  width:"100%",
  padding:14,
  marginTop:12,
  borderRadius:10,
  border:"2px solid #1e293b",
  background:"#0b1020",
  color:"white",
  fontSize:20
};

const btn = {
  marginTop:16,
  padding:"14px 30px",
  fontSize:20,
  borderRadius:12,
  border:"none",
  fontWeight:800,
  cursor:"pointer",
  background:"linear-gradient(90deg,#38bdf8,#22d3ee)",
  color:"#020617"
};

const deptCard = {
  border:"2px solid #1e293b",
  borderRadius:12,
  padding:14,
  marginTop:12,
  cursor:"pointer"
};

const statsGrid = {
  display:"grid",
  gridTemplateColumns:"repeat(3,1fr)",
  gap:20,
  marginTop:20
};

const expenseRow = {
  padding:10,
  borderBottom:"1px solid #1e293b"
};

const emptyState = {
  height:"100%",
  display:"flex",
  flexDirection:"column",
  alignItems:"center",
  justifyContent:"center",
  textAlign:"center",
  color:"#94a3b8"
};

